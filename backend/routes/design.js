const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const API_BASE_URL = 'https://t2i.mcpcore.xyz';

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
  'tiny': { time: '30 min - 1 hour', price: '$100 - $150' },
  'small': { time: '1 - 2 hours', price: '$150 - $300' },
  'medium': { time: '2 - 4 hours', price: '$300 - $600' },
  'large': { time: '4 - 8 hours', price: '$600 - $1200' },
  'extra-large': { time: 'Multiple sessions', price: '$1200+' }
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
    
    // Call the free AI API
    const response = await fetch(`${API_BASE_URL}/api/free/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        model: 'turbo' // Fast model
      })
    });

    if (!response.ok) {
      throw new Error('AI service unavailable');
    }

    // Parse SSE stream to get the final image URL
    const text = await response.text();
    const lines = text.split('\n');
    let imageUrl = null;
    let errorMessage = null;

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.status === 'complete' && data.imageUrl) {
            imageUrl = data.imageUrl;
          } else if (data.status === 'error') {
            errorMessage = data.message;
          }
        } catch (e) {
          // Skip non-JSON lines
        }
      }
    }

    if (errorMessage) {
      return res.status(500).json({ error: errorMessage });
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'Failed to generate image' });
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
