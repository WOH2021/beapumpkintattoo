/**
 * Simple Admin API Routes
 * Password-protected endpoints for managing content
 * Bypasses RLS using Supabase service role
 */

const express = require('express');
const Joi = require('joi');
const { verifyAdminPassword } = require('../middleware/simple-auth');
const { supabase } = require('../db');

const router = express.Router();

// ============================================================
// VALIDATION SCHEMAS
// ============================================================

const blogPostSchema = Joi.object({
  title: Joi.string().max(200).required().trim(),
  content: Joi.string().max(50000).required().trim(),
  excerpt: Joi.string().max(500).allow(null, '').trim(),
  featured_image: Joi.string().uri().allow(null, ''),
  author: Joi.string().max(100).allow(null, '').default('Admin').trim(),
  status: Joi.string().valid('published', 'draft', 'archived').default('published'),
}).strict();

const portfolioSchema = Joi.object({
  title: Joi.string().max(200).required().trim(),
  description: Joi.string().max(1000).allow(null, '').trim(),
  image_url: Joi.string().uri().required(),
  display_order: Joi.number().integer().min(0).default(0),
  category: Joi.string().max(100).allow(null, '').trim(),
}).strict();

const testimonialSchema = Joi.object({
  author_name: Joi.string().max(100).required().trim(),
  text: Joi.string().max(1000).required().trim(),
  rating: Joi.number().integer().min(1).max(5).required(),
  status: Joi.string().valid('pending', 'approved', 'rejected').default('pending'),
}).strict();

// Validation middleware
function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      });
    }

    req.body = value;
    next();
  };
}

// ============================================================
// BLOG POSTS
// ============================================================

/**
 * Get all blog posts
 */
router.get('/blog', verifyAdminPassword, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create blog post
 */
router.post('/blog', verifyAdminPassword, validateRequest(blogPostSchema), async (req, res) => {
  try {
    const { title, content, excerpt, featured_image, author, status } = req.body;

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        content,
        excerpt: excerpt || '',
        featured_image: featured_image || null,
        author: author || 'Admin',
        status: status || 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update blog post
 */
router.put('/blog/:id', verifyAdminPassword, validateRequest(blogPostSchema.fork(['title', 'content'], schema => schema.optional())), async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...req.body,
        updated_at: new Date().toISOString(),
      })
        featured_image,
        author,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Post not found' });
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete blog post
 */
router.delete('/blog/:id', verifyAdminPassword, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// PORTFOLIO ITEMS
// ============================================================

/**
 * Get all portfolio items
 */
router.get('/portfolio', verifyAdminPassword, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('display_order');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create portfolio item
 */
router.post('/portfolio', verifyAdminPassword, async (req, res) => {
  try {
    const { title, description, image_url, display_order, category } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ error: 'Title and image_url required' });
    }

    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({
        title,
        description: description || '',
        image_url,
        display_order: display_order || 999,
        category: category || 'Tattoo',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update portfolio item
 */
router.put('/portfolio/:id', verifyAdminPassword, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, display_order, category } = req.body;

    const { data, error } = await supabase
      .from('portfolio_items')
      .update({
        title,
        description,
        image_url,
        display_order,
        category,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Portfolio item not found' });
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete portfolio item
 */
router.delete('/portfolio/:id', verifyAdminPassword, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Portfolio item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// TESTIMONIALS
// ============================================================

/**
 * Get all testimonials
 */
router.get('/testimonials', verifyAdminPassword, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update testimonial approval
 */
router.patch('/testimonials/:id', verifyAdminPassword, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    const { data, error } = await supabase
      .from('testimonials')
      .update({ is_approved })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Testimonial not found' });
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete testimonial
 */
router.delete('/testimonials/:id', verifyAdminPassword, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
