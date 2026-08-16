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

// --- 2. Interactive Cybereye Cursor ---
const cursorPupil = document.getElementById('cursor-pupil');
const cursorOutline = document.getElementById('cursor-eye-outline');

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
    if (e.target.closest('a, button, input, select, textarea, summary, .glass-card, .faq-item, .trust-card, .review-card')) {
        cursorOutline.querySelector('svg').style.transform = 'scale(1.4)';
        cursorPupil.querySelector('svg').style.transform = 'scale(0.7)';
    }
});
document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, input, select, textarea, summary, .glass-card, .faq-item, .trust-card, .review-card')) {
        cursorOutline.querySelector('svg').style.transform = 'scale(1)';
        cursorPupil.querySelector('svg').style.transform = 'scale(1)';
    }
});

// --- 3. Mobile Menu Toggle ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('nav-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark'); // Change to X icon
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars'); // Change back to bars
        }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.querySelector('i').classList.remove('fa-xmark');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });
}