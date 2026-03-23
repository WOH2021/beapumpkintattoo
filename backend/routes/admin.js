/**
 * Admin API Routes
 * Protected routes for managing content
 */

const express = require('express');
const { verifyAdminAuth } = require('../middleware/auth');
const { supabase } = require('../db');

const router = express.Router();

// All admin routes require authentication
router.use(verifyAdminAuth);

// ============================================================
// BLOG POSTS
// ============================================================

// Get all blog posts
router.get('/blog', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single blog post
router.get('/blog/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Post not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create blog post
router.post('/blog', async (req, res) => {
  try {
    const { title, slug, content, excerpt, category, featured_image, read_time, is_published, published_at } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Missing required fields: title, slug, content' });
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        title,
        slug,
        content,
        excerpt: excerpt || null,
        category: category || null,
        featured_image: featured_image || null,
        read_time: read_time || null,
        is_published: is_published || false,
        published_at: published_at || null,
        author_id: req.user.id,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update blog post
router.put('/blog/:id', async (req, res) => {
  try {
    const updateData = req.body;
    delete updateData.id; // Prevent ID modification

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Post not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete blog post
router.delete('/blog/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// PORTFOLIO ITEMS
// ============================================================

// Get all portfolio items
router.get('/portfolio', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('display_order');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create portfolio item
router.post('/portfolio', async (req, res) => {
  try {
    const { title, description, category, image_url, thumbnail_url, style, duration, size, is_featured } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ error: 'Missing required fields: title, image_url' });
    }

    const { data, error } = await supabase
      .from('portfolio_items')
      .insert([{
        title,
        description: description || null,
        category: category || null,
        image_url,
        thumbnail_url: thumbnail_url || null,
        style: style || null,
        duration: duration || null,
        size: size || null,
        is_featured: is_featured || false,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update portfolio item
router.put('/portfolio/:id', async (req, res) => {
  try {
    const updateData = req.body;
    delete updateData.id;

    const { data, error } = await supabase
      .from('portfolio_items')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Item not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete portfolio item
router.delete('/portfolio/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// TESTIMONIALS
// ============================================================

// Get all testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update testimonial (approve/reject)
router.put('/testimonials/:id', async (req, res) => {
  try {
    const { is_approved, display_order } = req.body;
    const updateData = {};
    
    if (is_approved !== undefined) updateData.is_approved = is_approved;
    if (display_order !== undefined) updateData.display_order = display_order;

    const { data, error } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete testimonial
router.delete('/testimonials/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// BOOKINGS
// ============================================================

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.put('/bookings/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Missing required field: status' });
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status, notes: notes || null })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Booking not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// CONTACT SUBMISSIONS
// ============================================================

// Get all contact submissions
router.get('/contact', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark contact as read
router.put('/contact/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ is_read: true })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Message not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete contact submission
router.delete('/contact/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// NEWSLETTER
// ============================================================

// Get newsletter subscribers
router.get('/newsletter', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unsubscribe email
router.put('/newsletter/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: false })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Subscriber not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
