// --- 1. Hero Parallax (unchanged) ---
const heroMockup = document.getElementById('hero-mockup');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            if (heroMockup) {
                heroMockup.style.transform = `translateY(${-scrollY * 0.1}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// --- 2. Interactive Cybereye Cursor (YOUR ORIGINAL — UNCHANGED) ---
const cursorPupil = document.getElementById('cursor-pupil');
const cursorOutline = document.getElementById('cursor-eye-outline');

if (cursorPupil && cursorOutline) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;
    let firstMove = true;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (firstMove) {
            cursorPupil.style.opacity = '1';
            cursorOutline.style.opacity = '1';
            outlineX = mouseX;
            outlineY = mouseY;
            firstMove = false;
        }
        
        cursorPupil.style.transform = `translate3d(${mouseX - 20}px, ${mouseY - 20}px, 0)`;
    });

    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.2;
        outlineY += (mouseY - outlineY) * 0.2;
        cursorOutline.style.transform = `translate3d(${outlineX - 20}px, ${outlineY - 20}px, 0)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mouseleave', () => {
        cursorPupil.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        if (!firstMove) {
            cursorPupil.style.opacity = '1';
            cursorOutline.style.opacity = '1';
        }
    });

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, input, select, textarea, summary, .glass-card, .faq-item, .trust-card, .review-card')) {
            const outlineSvg = cursorOutline.querySelector('svg');
            const pupilSvg = cursorPupil.querySelector('svg');
            if (outlineSvg) outlineSvg.style.transform = 'scale(1.4)';
            if (pupilSvg) pupilSvg.style.transform = 'scale(0.7)';
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, input, select, textarea, summary, .glass-card, .faq-item, .trust-card, .review-card')) {
            const outlineSvg = cursorOutline.querySelector('svg');
            const pupilSvg = cursorPupil.querySelector('svg');
            if (outlineSvg) outlineSvg.style.transform = 'scale(1)';
            if (pupilSvg) pupilSvg.style.transform = 'scale(1)';
        }
    });
}

// --- 3. Mobile Menu Toggle (unchanged) ---
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
    const toggleMenu = () => {
        const isOpen = mobileMenu.classList.toggle('nav-active');
        hamburger.setAttribute('aria-expanded', isOpen);
        const icon = hamburger.querySelector('i');
        if (isOpen) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    };

    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('nav-active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.querySelector('i').classList.remove('fa-xmark');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });
}

// --- 4. Intersection Observer for Scroll Animations (unchanged) ---
const animElements = document.querySelectorAll('[data-animate]');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animElements.forEach(el => observer.observe(el));
} else {
    animElements.forEach(el => el.classList.add('is-visible'));
}

// --- 5. Contact Form Handler (FIXED: validation + sanitization) ---
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const messageInput = document.getElementById('message');
        const businessInput = document.getElementById('business');
        const locationInput = document.getElementById('location');
        const statusSelect = document.getElementById('status');

        let errors = [];

        // Validate name
        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
            errors.push('Name is required (minimum 2 characters)');
            nameInput.style.borderColor = '#ff4d4d';
        } else {
            nameInput.style.borderColor = '#33e0f0';
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            errors.push('Please enter a valid email address');
            emailInput.style.borderColor = '#ff4d4d';
        } else {
            emailInput.style.borderColor = '#33e0f0';
        }

        // Validate phone (optional but must be valid if provided)
        if (phoneInput.value.trim()) {
            const phoneRegex = /^[\+\d\s\-\(\)]{7,20}$/;
            if (!phoneRegex.test(phoneInput.value.trim())) {
                errors.push('Please enter a valid phone number');
                phoneInput.style.borderColor = '#ff4d4d';
            } else {
                phoneInput.style.borderColor = '#33e0f0';
            }
        }

        if (errors.length > 0) {
            alert('Please fix the following:\n\n• ' + errors.join('\n• '));
            return;
        }

        // Sanitize message (remove script tags and HTML)
        let sanitizedMessage = '';
        if (messageInput.value.trim()) {
            sanitizedMessage = messageInput.value.trim()
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<[^>]*>/g, '');
        }

        const formData = {
            name: nameInput.value.trim(),
            business: businessInput.value.trim(),
            location: locationInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            status: statusSelect.value,
            message: sanitizedMessage
        };

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Submission failed');

            alert('✅ Submission received! Mr. Lander will be in touch shortly.');
            contactForm.reset();

            // Reset border colors
            document.querySelectorAll('#contact-form input, #contact-form textarea, #contact-form select')
                .forEach(el => el.style.borderColor = '');

        } catch (error) {
            console.error('Form submission error:', error);
            alert('❌ There was an issue sending your message. Please try again later.');
        }
    });

    // Real-time validation feedback (remove error borders on typing)
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.style.borderColor = '#33e0f0';
            }
        });
    });
}

// --- 6. Infinite Interactive Carousels (FIXED: better touch handling) ---
function setupInteractiveCarousel(wrapperId, speed) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    const track = wrapper.querySelector('.carousel-track');
    if (!track) return;

    let scrollPos = 0;
    let isHovered = false;
    let singleSetWidth = 0;
    let startX = 0;
    let isDragging = false;
    let animationId = null;

    function updateWidth() {
        singleSetWidth = track.scrollWidth / 2;
    }

    window.addEventListener('resize', updateWidth);
    setTimeout(updateWidth, 100);

    wrapper.addEventListener('mouseenter', () => { isHovered = true; });
    wrapper.addEventListener('mouseleave', () => { isHovered = false; });

    // Desktop wheel scroll
    wrapper.addEventListener('wheel', (e) => {
        if (!isHovered) return;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            scrollPos += e.deltaX * 0.8;
        }
    }, { passive: false });

    // Touch drag (better for tablets)
    wrapper.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        // Pause animation while dragging
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diffX = startX - currentX;
        scrollPos += diffX * 1.2;
        startX = currentX;
        if (e.cancelable) {
            e.preventDefault();
        }
        // Update position during drag
        if (scrollPos >= singleSetWidth) {
            scrollPos -= singleSetWidth;
        } else if (scrollPos < 0) {
            scrollPos += singleSetWidth;
        }
        track.style.transform = `translate3d(${-scrollPos}px, 0, 0)`;
    }, { passive: false });

    const endDrag = () => {
        isDragging = false;
        // Resume animation
        if (!animationId) {
            animate();
        }
    };

    window.addEventListener('touchend', endDrag);
    window.addEventListener('touchcancel', endDrag);

    function animate() {
        if (!isHovered && !isDragging) {
            scrollPos += speed;
        }

        if (scrollPos >= singleSetWidth) {
            scrollPos -= singleSetWidth;
        } else if (scrollPos < 0) {
            scrollPos += singleSetWidth;
        }

        track.style.transform = `translate3d(${-scrollPos}px, 0, 0)`;
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

setupInteractiveCarousel('trustCarousel', 1.0);
setupInteractiveCarousel('reviewCarousel', -0.8);