// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileNavToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
});

// Initialize navigation items with delay
document.querySelectorAll('.nav-links li').forEach((item, index) => {
    item.style.setProperty('--item-index', index);
});

// Enhanced Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add animation to the main element
            entry.target.classList.add('animate');
            
            // Animate child elements with delay
            const cards = entry.target.querySelectorAll('.destination-card, .package-card, .stat-item');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate');
                }, 150 * index);
            });
        }
    });
}, observerOptions);

// Observe all sections and their children
document.querySelectorAll('section, .destination-card, .package-card, .stat-item').forEach(element => {
    observer.observe(element);
});

// Enhanced navbar scroll effect
const nav = document.querySelector('nav');
let lastScroll = 0;
let scrollTimer = null;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class when page is scrolled
    if (currentScroll > 50) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
    
    // Hide/show navbar based on scroll direction
    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down - hide navbar
        nav.classList.add('nav-hidden');
    } else {
        // Scrolling up - show navbar
        nav.classList.remove('nav-hidden');
    }
    
    lastScroll = currentScroll;
    
    // Clear the existing timer
    if (scrollTimer !== null) {
        clearTimeout(scrollTimer);
    }
    
    // Set a new timer
    scrollTimer = setTimeout(() => {
        // Show navbar after user stops scrolling
        nav.classList.remove('nav-hidden');
    }, 150);
});

// Mobile Navigation
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navLinks = document.querySelector('.nav-links');

mobileNavToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('active');
    navLinks.classList.toggle('active');
    
    // Animate hamburger to X
    mobileNavToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'auto' : 'hidden';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileNavToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Smooth form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitButton = contactForm.querySelector('button');
        submitButton.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            submitButton.style.transform = 'scale(1)';
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        }, 200);
    });
}

// Enhanced booking button interaction
document.querySelectorAll('.book-now').forEach(button => {
    button.addEventListener('click', () => {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            alert('Thank you for your interest! Our team will contact you shortly to complete your booking.');
        }, 200);
    });
});

// Add smooth parallax effect to hero section
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scroll = window.pageYOffset;
    if (hero) {
        hero.style.backgroundPositionY = `${scroll * 0.5}px`;
    }
});

// Update current time
function updateCurrentTime() {
    const currentTimeElement = document.getElementById('current-time');
    if (!currentTimeElement) return;

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // Get timezone offset in hours and minutes
    const offset = -now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
    const offsetMinutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
    const offsetSign = offset >= 0 ? '+' : '-';
    
    const timeString = `Current Time: ${hours}:${minutes}:${seconds} (GMT${offsetSign}${offsetHours}:${offsetMinutes})`;
    currentTimeElement.textContent = timeString;
}

// Contact Form Handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get the form data
    const formData = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        to_email: 'mrmanishkr7911@gmail.com'
    };

    // Show loading state
    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Send the email using EmailJS
    emailjs.send('service_id', 'template_id', formData) // Replace with your EmailJS service ID and template ID
        .then(function() {
            // Show success message
            document.getElementById('successMessage').style.display = 'block';
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';

            // Save to localStorage
            const submission = {
                ...formData,
                timestamp: new Date().toISOString()
            };
            const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
            submissions.push(submission);
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

            // Hide success message after 5 seconds
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'none';
            }, 5000);
        }, function(error) {
            console.error('Email sending failed:', error);
            alert('Failed to send message. Please try again later.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        });
});

// Newsletter Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Store in localStorage
            const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
                
                // Clear input and show success message
                emailInput.value = '';
                const button = newsletterForm.querySelector('button');
                const originalHTML = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.background = '#27ae60';
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.background = '';
                }, 2000);
            }
        });
    }
});

// Video Slider
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide-item');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    let isAnimating = false;
    let autoplayInterval;

    function updateSlides(newIndex) {
        if (isAnimating) return;
        isAnimating = true;

        // Update main slides
        slides[currentSlide].classList.remove('active');
        slides[newIndex].classList.add('active');

        // Update thumbnails
        thumbnails[currentSlide].classList.remove('active');
        thumbnails[newIndex].classList.add('active');

        // Pause/play videos
        const currentVideo = slides[currentSlide].querySelector('video');
        const newVideo = slides[newIndex].querySelector('video');
        
        // Fade out current video
        currentVideo.style.transition = 'opacity 0.5s';
        currentVideo.style.opacity = 0;
        setTimeout(() => {
            currentVideo.pause();
            currentVideo.style.opacity = 1;
        }, 500);

        // Start new video with a slight delay
        setTimeout(() => {
            newVideo.currentTime = 0;
            newVideo.play();
        }, 200);

        // Update thumbnail videos
        const currentThumbVideo = thumbnails[currentSlide].querySelector('video');
        const newThumbVideo = thumbnails[newIndex].querySelector('video');
        currentThumbVideo.currentTime = 0;
        newThumbVideo.currentTime = 0;

        currentSlide = newIndex;

        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 1200);
    }

    function nextSlide() {
        const newIndex = (currentSlide + 1) % slides.length;
        updateSlides(newIndex);
    }

    function prevSlide() {
        const newIndex = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides(newIndex);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 5000); // Changed to 5 seconds for better pacing
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    // Event Listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoplay();
    });

    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            if (currentSlide !== index) {
                updateSlides(index);
                startAutoplay();
            }
        });
    });

    // Pause autoplay on hover
    const sliderSection = document.querySelector('.slider-section');
    sliderSection.addEventListener('mouseenter', stopAutoplay);
    sliderSection.addEventListener('mouseleave', startAutoplay);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            startAutoplay();
        }
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    sliderSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    sliderSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            startAutoplay();
        }
    }

    // Initialize thumbnails
    thumbnails.forEach(thumbnail => {
        const video = thumbnail.querySelector('video');
        video.currentTime = 1;
    });

    // Start autoplay
    startAutoplay();
});
