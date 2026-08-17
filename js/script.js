// --- 1. Hero Parallax ---
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

// --- 2. Interactive Cybereye Cursor (Desktop Only) ---
const cursorPupil = document.getElementById('cursor-pupil');
const cursorOutline = document.getElementById('cursor-eye-outline');

// Detect if device supports hover (desktop)
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsHover && cursorPupil && cursorOutline) {
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
            // Snap outline to mouse on first move so it doesn't fly across the screen
            outlineX = mouseX;
            outlineY = mouseY;
            firstMove = false;
        }
        
        // Pupil follows mouse exactly
        cursorPupil.style.transform = `translate3d(${mouseX - 20}px, ${mouseY - 20}px, 0)`;
    });

    function animateCursor() {
        // Outline trails behind smoothly
        outlineX += (mouseX - outlineX) * 0.2;
        outlineY += (mouseY - outlineY) * 0.2;
        cursorOutline.style.transform = `translate3d(${outlineX - 20}px, ${outlineY - 20}px, 0)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hide cursor when leaving the window
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

    // Hover effects for interactive elements (Expands eye, shrinks pupil)
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, input, select, textarea, summary, .glass-card, .faq-item, .trust-card, .review-card, .carousel-nav, .carousel-dot, .legal-toggle')) {
            cursorOutline.querySelector('svg').style.transform = 'scale(1.4)';
            cursorPupil.querySelector('svg').style.transform = 'scale(0.7)';
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, input, select, textarea, summary, .glass-card, .faq-item, .trust-card, .review-card, .carousel-nav, .carousel-dot, .legal-toggle')) {
            cursorOutline.querySelector('svg').style.transform = 'scale(1)';
            cursorPupil.querySelector('svg').style.transform = 'scale(1)';
        }
    });
} else if (cursorPupil && cursorOutline) {
    // Hide cursor elements on mobile
    cursorPupil.style.display = 'none';
    cursorOutline.style.display = 'none';
}

// --- 3. Mobile Menu Toggle ---
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark'); // Change to X icon
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars'); // Change back to bars
        }
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-xmark');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });
}

// --- 4. Legal Dropdown Toggle ---
const legalToggle = document.querySelector('.legal-toggle');
const legalDropdown = document.querySelector('.mobile-legal-dropdown');

if (legalToggle && legalDropdown) {
    legalToggle.addEventListener('click', () => {
        legalDropdown.classList.toggle('active');
    });
}

// --- 5. Carousel Functionality ---
function initCarousel(wrapperSelector, trackSelector, dotsSelector) {
    const wrapper = document.querySelector(wrapperSelector);
    const track = document.querySelector(trackSelector);
    const dotsContainer = document.querySelector(dotsSelector);
    
    if (!wrapper || !track) return;
    
    const slides = Array.from(track.children);
    const slideCount = slides.length / 2; // Div by 2 because of duplicate set
    let currentIndex = 0;
    
    // Create dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => scrollToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Navigation buttons
    const prevBtn = wrapper.querySelector('.carousel-nav.prev');
    const nextBtn = wrapper.querySelector('.carousel-nav.next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const scrollAmount = wrapper.clientWidth * 0.8;
            wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const scrollAmount = wrapper.clientWidth * 0.8;
            wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }
    
    function scrollToSlide(index) {
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;
        
        const slideWidth = slides[0].offsetWidth + 24; // 24px for gap
        const scrollPosition = slideWidth * index;
        wrapper.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
    
    // Update active dot based on scroll position
    let scrollTimeout;
    wrapper.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const slideWidth = slides[0].offsetWidth + 24;
            const newIndex = Math.round(wrapper.scrollLeft / slideWidth);
            
            if (newIndex !== currentIndex && newIndex < slideCount) {
                currentIndex = newIndex;
                if (dotsContainer) {
                    const dots = dotsContainer.querySelectorAll('.carousel-dot');
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === currentIndex);
                    });
                }
            }
        }, 100);
    });
    
    // Touch/swipe functionality for mobile
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    
    wrapper.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
        wrapper.style.scrollBehavior = 'auto';
    });
    
    wrapper.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 2;
        wrapper.scrollLeft = scrollLeft - walk;
    });
    
    wrapper.addEventListener('touchend', () => {
        isDragging = false;
        wrapper.style.scrollBehavior = 'smooth';
    });
    
    // Mouse drag functionality for desktop
    wrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
        wrapper.style.scrollBehavior = 'auto';
        wrapper.style.cursor = 'grabbing';
    });
    
    wrapper.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 2;
        wrapper.scrollLeft = scrollLeft - walk;
    });
    
    wrapper.addEventListener('mouseup', () => {
        isDragging = false;
        wrapper.style.scrollBehavior = 'smooth';
        wrapper.style.cursor = '';
    });
    
    wrapper.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            wrapper.style.scrollBehavior = 'smooth';
            wrapper.style.cursor = '';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const slideWidth = slides[0].offsetWidth + 24;
        const scrollPosition = slideWidth * currentIndex;
        wrapper.scrollTo({ left: scrollPosition, behavior: 'auto' });
    });
}

// Initialize carousels
initCarousel('.trust-carousel-wrapper', '.trust-carousel-track', '.trust-dots');
initCarousel('.review-carousel-wrapper', '.review-carousel-track', '.review-dots');

// --- 6. FAQ Accordion (Only one open at a time) ---
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', function() {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.hasAttribute('open')) {
                otherItem.removeAttribute('open');
            }
        });
    });
});

// --- 7. Window Resize Handler ---
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && mobileMenu) {
            mobileMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
        
        // Close legal dropdown on resize to desktop
        if (window.innerWidth > 768 && legalDropdown) {
            legalDropdown.classList.remove('active');
        }
        
        // Recalculate cursor visibility
        const newSupportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (newSupportsHover !== supportsHover && cursorPupil && cursorOutline) {
            if (newSupportsHover) {
                cursorPupil.style.display = '';
                cursorOutline.style.display = '';
            } else {
                cursorPupil.style.display = 'none';
                cursorOutline.style.display = 'none';
            }
        }
    }, 250);
});