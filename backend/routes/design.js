const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const API_BASE_URL = 'https://t2i.mcpcore.xyz';
const API_ENDPOINT = '/generate'; // Direct endpoint, not /api/free/generate

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
    
    // Call the AI API
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        model: 'turbo', // Fast model
        orientation: 'square'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error('AI service unavailable');
    }

    // Parse JSON response (new API format)
    const data = await response.json();
    
    if (!data.success || !data.imageUrl) {
      console.error('AI API returned no image:', data);
      return res.status(500).json({ error: data.error || 'Failed to generate image' });
    }

    const imageUrl = data.imageUrl;

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

// GET /api/design/models - Get available AI models
router.get('/models', async (req, res) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/free/models`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

module.exports = router;
