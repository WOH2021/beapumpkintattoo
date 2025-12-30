/* =============================================
   BeaPumpkin Tattoo - Main JavaScript
   ============================================= */

// ===== API Configuration =====
const API_BASE_URL = 'https://api.beapumpkintattoo.com/api';

// ===== API Helper Functions =====
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// DOM Elements
const preloader = document.getElementById('preloader');

// ===== Security: HTML Escape Utility =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('back-to-top');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const faqItems = document.querySelectorAll('.faq-item');
const testimonialSlider = document.getElementById('testimonials-slider');
const prevBtn = document.getElementById('prev-testimonial');
const nextBtn = document.getElementById('next-testimonial');
const sliderDots = document.getElementById('slider-dots');
const generateDesignBtn = document.getElementById('generate-design');
const bookingForm = document.getElementById('booking-form');
const modal = document.getElementById('portfolio-modal');

// ===== Preloader =====
window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 1000);
});

// ===== Navbar Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    if (currentScroll > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    lastScroll = currentScroll;
});

// ===== Mobile Navigation Toggle =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Back to Top =====
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Portfolio Filter =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// ===== Portfolio Modal =====
const portfolioImages = document.querySelectorAll('.portfolio-item .action-btn:first-child');
const modalClose = modal.querySelector('.modal-close');
const modalOverlay = modal.querySelector('.modal-overlay');

portfolioImages.forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.portfolio-item');
        const title = item.querySelector('.portfolio-info h4').textContent;
        const category = item.querySelector('.portfolio-category').textContent;
        
        modal.querySelector('.modal-info h3').textContent = title;
        modal.querySelector('.modal-category').textContent = category;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ===== FAQ Accordion =====
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(i => i.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== Testimonials Slider =====
let currentSlide = 0;
const testimonialCards = testimonialSlider.querySelectorAll('.testimonial-card');
const totalSlides = testimonialCards.length;
let autoSlideInterval;

// Create dots
const createDots = () => {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        sliderDots.appendChild(dot);
    }
};

const updateDots = () => {
    const dots = sliderDots.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
};

const goToSlide = (index) => {
    currentSlide = index;
    const cardWidth = testimonialCards[0].offsetWidth + 24; // Including gap
    testimonialSlider.scrollTo({
        left: cardWidth * currentSlide,
        behavior: 'smooth'
    });
    updateDots();
    resetAutoSlide();
};

const nextSlide = () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
};

const prevSlide = () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
};

const startAutoSlide = () => {
    autoSlideInterval = setInterval(nextSlide, 5000);
};

const resetAutoSlide = () => {
    clearInterval(autoSlideInterval);
    startAutoSlide();
};

createDots();
startAutoSlide();

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Pause auto-slide on hover
testimonialSlider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

testimonialSlider.addEventListener('mouseleave', () => {
    startAutoSlide();
});

// ===== Stats Counter Animation =====
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const animateStats = () => {
    if (statsAnimated) return;
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
    
    statsAnimated = true;
};

// Intersection Observer for stats animation
const heroSection = document.querySelector('.hero');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(animateStats, 500);
        }
    });
}, { threshold: 0.5 });

statsObserver.observe(heroSection);

// ===== Design Tool Functionality =====
const tattooDescription = document.getElementById('tattoo-description');
const animeStyle = document.getElementById('anime-style');
const tattooStyle = document.getElementById('tattoo-style');
const placement = document.getElementById('placement');
const size = document.getElementById('size');
const previewCanvas = document.getElementById('preview-canvas');
const estTime = document.getElementById('est-time');
const estPrice = document.getElementById('est-price');

const sizeToTime = {
    'tiny': '30 min - 1 hour',
    'small': '1 - 2 hours',
    'medium': '2 - 4 hours',
    'large': '4 - 8 hours',
    'extra-large': 'Multiple sessions'
};

const sizeToPrice = {
    'tiny': '$100 - $150',
    'small': '$150 - $300',
    'medium': '$300 - $600',
    'large': '$600 - $1200',
    'extra-large': '$1200+'
};

const generateDesignConcept = () => {
    const description = tattooDescription.value.trim();
    const selectedAnimeStyle = animeStyle.value;
    const selectedTattooStyle = tattooStyle.value;
    const selectedPlacement = placement.value;
    const selectedSize = size.value;
    const selectedColor = document.querySelector('input[name="color"]:checked');
    
    if (!description) {
        showNotification('Please describe your tattoo idea!', 'error');
        tattooDescription.focus();
        return;
    }
    
    // Show loading state
    previewCanvas.innerHTML = `
        <div class="preview-loading">
            <div class="loading-spinner"></div>
            <h4>Generating Your Design Concept...</h4>
            <p>Our AI is creating a unique visualization</p>
        </div>
    `;
    
    // Add loading spinner styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .preview-loading {
            text-align: center;
            padding: 40px;
        }
        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 3px solid rgba(255, 107, 157, 0.2);
            border-top-color: #ff6b9d;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Simulate AI generation (in production, this would call an actual API)
    setTimeout(() => {
        const designConcepts = [
            '🎨 Dynamic action pose with flowing energy effects',
            '✨ Detailed character portrait with symbolic elements',
            '🌸 Scenic composition with Japanese aesthetics',
            '🔥 Bold lines with dramatic shading',
            '💫 Whimsical design with magical elements'
        ];
        
        const randomConcept = designConcepts[Math.floor(Math.random() * designConcepts.length)];
        
        previewCanvas.innerHTML = `
            <div class="generated-preview">
                <div class="preview-image-container">
                    <div class="preview-placeholder-art">
                        <div class="art-icon">🎨</div>
                        <div class="art-pattern"></div>
                    </div>
                </div>
                <div class="preview-details">
                    <h4>Design Concept Generated!</h4>
                    <p><strong>Concept:</strong> ${escapeHtml(randomConcept)}</p>
                    <p><strong>Description:</strong> ${escapeHtml(description.substring(0, 100))}${description.length > 100 ? '...' : ''}</p>
                    <div class="concept-tags">
                        ${selectedAnimeStyle ? `<span class="concept-tag">${escapeHtml(selectedAnimeStyle)}</span>` : ''}
                        ${selectedTattooStyle ? `<span class="concept-tag">${escapeHtml(selectedTattooStyle)}</span>` : ''}
                        ${selectedPlacement ? `<span class="concept-tag">${escapeHtml(selectedPlacement)}</span>` : ''}
                    </div>
                    <p class="preview-note">💡 Book a consultation to receive custom sketches based on this concept!</p>
                </div>
            </div>
        `;
        
        // Add generated preview styles
        const previewStyle = document.createElement('style');
        previewStyle.textContent = `
            .generated-preview {
                text-align: center;
                padding: 30px;
            }
            .preview-image-container {
                width: 200px;
                height: 200px;
                margin: 0 auto 20px;
                background: linear-gradient(135deg, #1a1a2e 0%, #252542 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid rgba(255, 107, 157, 0.3);
                position: relative;
                overflow: hidden;
            }
            .preview-placeholder-art {
                text-align: center;
            }
            .art-icon {
                font-size: 4rem;
                animation: pulse 2s ease-in-out infinite;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            .preview-details h4 {
                color: #ff6b9d;
                margin-bottom: 12px;
            }
            .preview-details p {
                color: #b4b4c4;
                margin-bottom: 8px;
                font-size: 0.9rem;
            }
            .concept-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                justify-content: center;
                margin: 16px 0;
            }
            .concept-tag {
                background: rgba(255, 107, 157, 0.1);
                color: #ff6b9d;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                text-transform: capitalize;
            }
            .preview-note {
                background: rgba(6, 214, 160, 0.1);
                color: #06d6a0 !important;
                padding: 12px;
                border-radius: 8px;
                margin-top: 16px;
            }
        `;
        document.head.appendChild(previewStyle);
        
        // Update estimates
        if (selectedSize) {
            estTime.textContent = sizeToTime[selectedSize];
            estPrice.textContent = sizeToPrice[selectedSize];
        }
        
        showNotification('Design concept generated! Book a consultation for custom sketches.', 'success');
    }, 2500);
};

generateDesignBtn.addEventListener('click', generateDesignConcept);

// Update estimates when size changes
size.addEventListener('change', () => {
    const selectedSize = size.value;
    if (selectedSize) {
        estTime.textContent = sizeToTime[selectedSize];
        estPrice.textContent = sizeToPrice[selectedSize];
    }
});

// ===== Booking Form Handling =====
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    if (!data.name || !data.email || !data['tattoo-type'] || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = bookingForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Map form fields to API expected fields
        const bookingData = {
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            preferred_date: data['preferred-date'] || null,
            appointment_type: data['tattoo-type'],
            anime_reference: data['anime-reference'] || null,
            message: data.message,
            reference_images: []
        };
        
        await apiRequest('/booking', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #06d6a0 0%, #00b894 100%)';
        
        showNotification('Thank you! Your consultation request has been sent. We\'ll contact you within 24-48 hours.', 'success');
        
        // Reset form after delay
        setTimeout(() => {
            bookingForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    } catch (error) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showNotification(error.message || 'Failed to send request. Please try again.', 'error');
    }
});

// ===== File Upload Preview =====
const fileUploadArea = document.getElementById('file-upload-area');
const fileInput = document.getElementById('reference-images');

fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = '#ff6b9d';
    fileUploadArea.style.background = 'rgba(255, 107, 157, 0.1)';
});

fileUploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = 'rgba(255, 107, 157, 0.3)';
    fileUploadArea.style.background = '';
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = 'rgba(255, 107, 157, 0.3)';
    fileUploadArea.style.background = '';
    
    const files = e.dataTransfer.files;
    handleFiles(files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length > 0) {
        fileUploadArea.innerHTML = `
            <i class="fas fa-check-circle" style="color: #06d6a0;"></i>
            <p>${validFiles.length} image(s) selected</p>
            <small>Click to change selection</small>
        `;
        showNotification(`${validFiles.length} reference image(s) added!`, 'success');
    }
};

// ===== Notification System =====
const showNotification = (message, type = 'info') => {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${escapeHtml(message)}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Add notification styles dynamically
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                max-width: 400px;
                background: #1a1a2e;
                border-radius: 12px;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
                z-index: 3000;
                animation: slideIn 0.3s ease;
                border: 1px solid rgba(255, 107, 157, 0.2);
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .notification-success i { color: #06d6a0; }
            .notification-error i { color: #ff6b6b; }
            .notification-info i { color: #7c3aed; }
            .notification-close {
                background: none;
                border: none;
                color: #6b6b7b;
                cursor: pointer;
                padding: 4px;
            }
            .notification-close:hover {
                color: #fff;
            }
            .notification.hiding {
                animation: slideOut 0.3s ease forwards;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('hiding');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('hiding');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
};

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.portfolio-item, .idea-card, .blog-card, .info-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    animateOnScroll.observe(el);
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ===== Heart/Save Button Functionality =====
const heartBtns = document.querySelectorAll('.action-btn[title="Save"]');
heartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('liked');
        
        if (btn.classList.contains('liked')) {
            btn.style.background = '#ff6b9d';
            btn.style.color = '#fff';
            showNotification('Design saved to favorites!', 'success');
        } else {
            btn.style.background = '';
            btn.style.color = '';
            showNotification('Design removed from favorites.', 'info');
        }
    });
});

// ===== Console Easter Egg =====
console.log(`
%c🎃 BeaPumpkin Tattoo 🎃
%cWelcome, fellow code explorer!
Looking for anime tattoo inspiration? You're in the right place!

Made with ❤️ and lots of anime references.
`, 'font-size: 24px; font-weight: bold; color: #ff6b9d;', 'font-size: 12px; color: #7c3aed;');

// ===== Load Testimonials from API =====
async function loadTestimonials() {
    try {
        const testimonials = await apiRequest('/testimonials');
        
        if (testimonials && testimonials.length > 0) {
            const slider = document.getElementById('testimonials-slider');
            slider.innerHTML = ''; // Clear existing testimonials
            
            testimonials.forEach(testimonial => {
                const card = createTestimonialCard(testimonial);
                slider.appendChild(card);
            });
            
            // Reinitialize slider dots
            reinitializeSlider();
        }
    } catch (error) {
        console.log('Using default testimonials (API unavailable)');
    }
}

function createTestimonialCard(testimonial) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    
    // Generate star rating
    const stars = '★'.repeat(testimonial.rating || 5) + '☆'.repeat(5 - (testimonial.rating || 5));
    const starIcons = Array(testimonial.rating || 5).fill('<i class="fas fa-star"></i>').join('');
    
    // Get initials for avatar
    const initials = testimonial.client_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    
    card.innerHTML = `
        <div class="testimonial-rating">
            ${starIcons}
        </div>
        <p class="testimonial-text">"${testimonial.review}"</p>
        <div class="testimonial-author">
            <div class="author-avatar">
                ${testimonial.avatar_url 
                    ? `<img src="${testimonial.avatar_url}" alt="${testimonial.client_name}">` 
                    : `<span>${initials}</span>`}
            </div>
            <div class="author-info">
                <h4>${testimonial.client_name}</h4>
                <span>${testimonial.tattoo_type || 'Anime Tattoo'}</span>
            </div>
        </div>
    `;
    
    return card;
}

function reinitializeSlider() {
    // Get new cards
    const cards = testimonialSlider.querySelectorAll('.testimonial-card');
    const total = cards.length;
    
    // Clear and recreate dots
    sliderDots.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentSlide = i;
            const cardWidth = cards[0].offsetWidth + 24;
            testimonialSlider.scrollTo({
                left: cardWidth * currentSlide,
                behavior: 'smooth'
            });
            sliderDots.querySelectorAll('.slider-dot').forEach((d, idx) => {
                d.classList.toggle('active', idx === currentSlide);
            });
        });
        sliderDots.appendChild(dot);
    }
    
    // Reset to first slide
    currentSlide = 0;
    testimonialSlider.scrollTo({ left: 0, behavior: 'auto' });
}

// ===== Load Portfolio from API =====
async function loadPortfolio() {
    try {
        const portfolioItems = await apiRequest('/portfolio');
        
        if (portfolioItems && portfolioItems.length > 0) {
            const grid = document.getElementById('portfolio-grid');
            grid.innerHTML = ''; // Clear existing items
            
            portfolioItems.forEach(item => {
                const portfolioItem = createPortfolioItem(item);
                grid.appendChild(portfolioItem);
            });
            
            // Reinitialize filter buttons
            reinitializePortfolioFilters();
        }
    } catch (error) {
        console.log('Using default portfolio (API unavailable)');
    }
}

function createPortfolioItem(item) {
    const div = document.createElement('div');
    div.className = 'portfolio-item';
    div.setAttribute('data-category', (item.category || 'anime').toLowerCase().replace(/\s+/g, '-'));
    
    div.innerHTML = `
        <div class="portfolio-image">
            ${item.image_url 
                ? `<img src="${item.image_url}" alt="${item.title}" loading="lazy">` 
                : `<div class="image-placeholder"><i class="fas fa-image"></i></div>`}
            <div class="portfolio-overlay">
                <div class="overlay-content">
                    <h3>${item.title}</h3>
                    <p>${item.description || ''}</p>
                    <div class="overlay-actions">
                        <button class="action-btn" title="View Details" data-id="${item.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn" title="Save"><i class="fas fa-heart"></i></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="portfolio-info">
            <span class="portfolio-category">${item.category || 'Anime'}</span>
            <h4>${item.title}</h4>
        </div>
    `;
    
    // Add click handler for modal
    div.addEventListener('click', () => openPortfolioModal(item));
    
    return div;
}

function openPortfolioModal(item) {
    const modal = document.getElementById('portfolio-modal');
    if (!modal) return;
    
    modal.querySelector('.modal-info h3').textContent = item.title;
    modal.querySelector('.modal-category').textContent = item.category || 'Anime';
    modal.querySelector('.modal-description').textContent = item.description || 'A beautiful anime-inspired tattoo design.';
    
    const details = modal.querySelector('.modal-details');
    if (details) {
        details.innerHTML = `
            <span><i class="fas fa-clock"></i> Duration: ${item.duration || 'Varies'}</span>
            <span><i class="fas fa-ruler"></i> Size: ${item.size || 'Custom'}</span>
        `;
    }
    
    const modalImage = modal.querySelector('.modal-image');
    if (item.image_url) {
        modalImage.innerHTML = `<img src="${item.image_url}" alt="${item.title}">`;
    }
    
    modal.classList.add('active');
}

function reinitializePortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.classList.add('animate');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('animate');
                }
            });
        });
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Set initial body overflow
    document.body.style.overflow = 'hidden';
    
    // Load data from API (will use fallbacks if API unavailable)
    loadTestimonials();
    loadPortfolio();
});
