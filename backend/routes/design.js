const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Pollinations.ai API endpoints
const POLLINATIONS_FREE_API = 'https://image.pollinations.ai/prompt';
const POLLINATIONS_AUTH_API = 'https://gen.pollinations.ai/image';
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
    
    // Use Pollinations.ai
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000);
    
    let imageUrl;
    
    // Try authenticated API first, fall back to free API
    if (POLLINATIONS_API_KEY) {
      // Use authenticated endpoint with API key
      const authUrl = `${POLLINATIONS_AUTH_API}/${encodedPrompt}?width=512&height=512&seed=${seed}&model=flux&key=${POLLINATIONS_API_KEY}`;
      console.log('Trying authenticated Pollinations API...');
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000); // 90s timeout for image generation
      
      try {
        const response = await fetch(authUrl, { signal: controller.signal });
        clearTimeout(timeout);
        
        console.log('Auth API response status:', response.status);
        
        if (response.ok) {
          // Convert to base64 data URL to avoid client needing auth
          const arrayBuffer = await response.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          const contentType = response.headers.get('content-type') || 'image/jpeg';
          imageUrl = `data:${contentType};base64,${base64}`;
          console.log('Successfully generated image with auth API');
        } else {
          // Fall back to free API URL (client will load directly)
          console.log('Auth API failed, falling back to free API URL');
          imageUrl = `${POLLINATIONS_FREE_API}/${encodedPrompt}?width=512&height=512&seed=${seed}&model=flux&nologo=true`;
        }
      } catch (fetchErr) {
        clearTimeout(timeout);
        console.log('Auth API error, falling back to free API URL:', fetchErr.message);
        imageUrl = `${POLLINATIONS_FREE_API}/${encodedPrompt}?width=512&height=512&seed=${seed}&model=flux&nologo=true`;
      }
    } else {
      // No API key - use free API URL directly
      console.log('No API key, using free API URL');
      imageUrl = `${POLLINATIONS_FREE_API}/${encodedPrompt}?width=512&height=512&seed=${seed}&model=flux&nologo=true`;
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
