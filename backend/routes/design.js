const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Pollinations.ai API - correct endpoint with auth support
const POLLINATIONS_API = 'https://gen.pollinations.ai/image';
const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY;

// Validation middleware
const designValidation = [
  body('description').trim().notEmpty().withMessage('Description is required').escape(),
  body('animeStyle').optional().trim().escape(),
  body('tattooStyle').optional().trim().escape(),
  body('placement').optional().trim().escape(),
  body('size').optional().trim().escape(),
  body('colorPreference').optional().trim().escape(),
];

// Build optimized prompt for anime tattoo generation
function buildTattooPrompt(params) {
  const { description, animeStyle, tattooStyle, placement, size, colorPreference } = params;
  
  let prompt = `Anime tattoo design: ${description}`;
  
  if (animeStyle) {
    const styleMap = {
      'shonen': 'dynamic action shonen anime style',
      'shoujo': 'soft romantic shoujo anime style',
      'chibi': 'cute chibi kawaii style',
      'ghibli': 'Studio Ghibli watercolor style',
      'realistic': 'realistic detailed anime style',
      'minimalist': 'clean minimalist anime lineart'
    };
    prompt += `, ${styleMap[animeStyle] || animeStyle}`;
  }
  
  if (tattooStyle) {
    const tattooMap = {
      'traditional': 'bold traditional tattoo style',
      'neo-traditional': 'neo-traditional tattoo with vibrant colors',
      'watercolor': 'watercolor tattoo with soft color bleeds',
      'blackwork': 'blackwork tattoo with solid blacks',
      'linework': 'fine linework tattoo style',
      'dotwork': 'dotwork stippling tattoo technique'
    };
    prompt += `, ${tattooMap[tattooStyle] || tattooStyle}`;
  }
  
  if (colorPreference === 'black-grey') {
    prompt += ', black and grey ink only, no color';
  } else if (colorPreference === 'color') {
    prompt += ', vibrant full color';
  }
  
  // Add tattoo-specific quality terms
  prompt += ', tattoo flash art, clean lines, high contrast, white background, professional tattoo design';
  
  return prompt;
}

// Size and price estimates
const sizeEstimates = {
  'tiny': { time: '30 min - 1 hour', price: '50€ - 80€' },
  'small': { time: '1 - 2 hours', price: '80€ - 150€' },
  'medium': { time: '2 - 4 hours', price: '150€ - 300€' },
  'large': { time: '4 - 8 hours', price: '300€ - 600€' },
  'extra-large': { time: 'Multiple sessions', price: '600€+' }
};

// POST /api/design/generate - Generate design concept with AI
router.post('/generate', designValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { description, animeStyle, tattooStyle, placement, size, colorPreference } = req.body;
    
    // Build the prompt
    const prompt = buildTattooPrompt({ description, animeStyle, tattooStyle, placement, size, colorPreference });
    
    console.log('Generating design with prompt:', prompt);
    
    // Use Pollinations.ai with API key for no rate limits
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `${POLLINATIONS_API}/${encodedPrompt}?width=512&height=512&seed=${seed}&model=flux&nologo=true`;
    
    let imageUrl;
    
    // Fetch image with API key and convert to base64 to avoid client rate limits
    if (POLLINATIONS_API_KEY) {
      console.log('Using authenticated Pollinations API');
      const response = await fetch(pollinationsUrl, {
        headers: {
          'Authorization': `Bearer ${POLLINATIONS_API_KEY}`
        }
      });
      
      if (!response.ok) {
        console.error('Pollinations API error:', response.status);
        throw new Error('Image generation failed');
      }
      
      // Convert to base64 data URL
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      imageUrl = `data:${contentType};base64,${base64}`;
    } else {
      // Fallback to direct URL (may hit rate limits)
      imageUrl = pollinationsUrl;
    }
    
    // Get estimates
    const estimates = sizeEstimates[size] || sizeEstimates['medium'];

    res.json({
      success: true,
      concept: {
        prompt: prompt,
        imageUrl: imageUrl,
        animeStyle: animeStyle || 'custom',
        tattooStyle: tattooStyle || 'custom',
        placement: placement || 'not specified',
        size: size || 'medium',
        colorPreference: colorPreference || 'color',
        estimatedTime: estimates.time,
        estimatedPrice: estimates.price
      }
    });

  } catch (err) {
    console.error('Design generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate design. Please try again.' });
  }
});

// GET /api/design/styles - Get available styles info
router.get('/styles', (req, res) => {
  res.json({
    animeStyles: ['shonen', 'shoujo', 'chibi', 'ghibli', 'realistic', 'minimalist'],
    tattooStyles: ['traditional', 'neo-traditional', 'watercolor', 'blackwork', 'linework', 'dotwork'],
    colorOptions: ['color', 'black-grey'],
    sizes: Object.keys(sizeEstimates)
  });
});

module.exports = router;
