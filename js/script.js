document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MOBILE MENU TOGGLE =====
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburgerToggle && mobileMenu) {
        hamburgerToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            const icon = hamburgerToggle.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                const icon = hamburgerToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
    
    // ===== LEGAL DROPDOWN TOGGLE =====
    const legalToggle = document.querySelector('.legal-toggle');
    const legalDropdown = document.querySelector('.mobile-legal-dropdown');
    
    if (legalToggle && legalDropdown) {
        legalToggle.addEventListener('click', function() {
            legalDropdown.classList.toggle('active');
        });
    }
    
    // ===== CUSTOM CURSOR (DESKTOP ONLY) =====
    const cursorPupil = document.getElementById('cursor-pupil');
    const cursorEyeOutline = document.getElementById('cursor-eye-outline');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    if (!isMobile && cursorPupil && cursorEyeOutline) {
        let mouseX = 0, mouseY = 0;
        let pupilX = 0, pupilY = 0;
        let outlineX = 0, outlineY = 0;
        
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animateCursor() {
            // Pupil follows mouse directly
            pupilX += (mouseX - pupilX) * 0.2;
            pupilY += (mouseY - pupilY) * 0.2;
            cursorPupil.style.left = pupilX + 'px';
            cursorPupil.style.top = pupilY + 'px';
            
            // Outline follows with more lag
            outlineX += (mouseX - outlineX) * 0.1;
            outlineY += (mouseY - outlineY) * 0.1;
            cursorEyeOutline.style.left = outlineX + 'px';
            cursorEyeOutline.style.top = outlineY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        
        animateCursor();
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', function() {
            cursorPupil.style.opacity = '0';
            cursorEyeOutline.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', function() {
            cursorPupil.style.opacity = '1';
            cursorEyeOutline.style.opacity = '0.6';
        });
        
        // Enlarge cursor on hoverable elements
        const hoverElements = document.querySelectorAll('a, button, .faq-question, input, select, textarea');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', function() {
                cursorPupil.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorEyeOutline.style.transform = 'translate(-50%, -50%) scale(0.8)';
            });
            el.addEventListener('mouseleave', function() {
                cursorPupil.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorEyeOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    } else if (cursorPupil && cursorEyeOutline) {
        // Hide cursor elements on mobile
        cursorPupil.style.display = 'none';
        cursorEyeOutline.style.display = 'none';
    }
    
    // ===== CAROUSEL FUNCTIONALITY =====
    function initCarousel(wrapperSelector, trackSelector, dotsSelector, direction = 'left') {
        const wrapper = document.querySelector(wrapperSelector);
        const track = document.querySelector(trackSelector);
        const dotsContainer = document.querySelector(dotsSelector);
        
        if (!wrapper || !track) return;
        
        const slides = Array.from(track.children);
        const slideCount = slides.length / 2; // Div by 2 because of duplicate set
        let currentIndex = 0;
        let isDragging = false;
        let startPosX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let autoScrollInterval;
        
        // Create dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < slideCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }
        
        // Navigation buttons
        const prevBtn = wrapper.querySelector('.carousel-nav.prev');
        const nextBtn = wrapper.querySelector('.carousel-nav.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (direction === 'left') {
                    goToSlide(currentIndex - 1);
                } else {
                    goToSlide(currentIndex + 1);
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (direction === 'left') {
                    goToSlide(currentIndex + 1);
                } else {
                    goToSlide(currentIndex - 1);
                }
            });
        }
        
        function goToSlide(index) {
            if (index < 0) index = slideCount - 1;
            if (index >= slideCount) index = 0;
            
            currentIndex = index;
            const slideWidth = slides[0].offsetWidth + 24; // 24px for margin
            currentTranslate = -slideWidth * currentIndex;
            
            track.style.transition = 'transform 0.5s ease';
            track.style.transform = `translateX(${currentTranslate}px)`;
            
            // Pause auto-scroll
            track.classList.add('paused');
            
            // Update dots
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.carousel-dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }
            
            // Resume auto-scroll after delay
            clearTimeout(autoScrollInterval);
            autoScrollInterval = setTimeout(() => {
                track.classList.remove('paused');
            }, 3000);
        }
        
        // Touch/swipe functionality
        function touchStart(e) {
            isDragging = true;
            startPosX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            prevTranslate = currentTranslate;
            track.classList.add('paused');
            track.style.transition = 'none';
        }
        
        function touchMove(e) {
            if (!isDragging) return;
            const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const diff = currentX - startPosX;
            currentTranslate = prevTranslate + diff;
            track.style.transform = `translateX(${currentTranslate}px)`;
        }
        
        function touchEnd() {
            if (!isDragging) return;
            isDragging = false;
            
            const slideWidth = slides[0].offsetWidth + 24;
            const moved = currentTranslate - prevTranslate;
            
            // Determine if swipe was significant enough
            if (Math.abs(moved) > slideWidth / 3) {
                if (moved < 0) {
                    goToSlide(currentIndex + 1);
                } else {
                    goToSlide(currentIndex - 1);
                }
            } else {
                goToSlide(currentIndex);
            }
            
            // Resume auto-scroll after delay
            clearTimeout(autoScrollInterval);
            autoScrollInterval = setTimeout(() => {
                track.classList.remove('paused');
            }, 3000);
        }
        
        // Touch events
        track.addEventListener('touchstart', touchStart, { passive: true });
        track.addEventListener('touchmove', touchMove, { passive: true });
        track.addEventListener('touchend', touchEnd);
        
        // Mouse events
        track.addEventListener('mousedown', touchStart);
        track.addEventListener('mousemove', touchMove);
        track.addEventListener('mouseup', touchEnd);
        track.addEventListener('mouseleave', touchEnd);
        
        // Pause on hover
        wrapper.addEventListener('mouseenter', () => {
            track.classList.add('paused');
        });
        
        wrapper.addEventListener('mouseleave', () => {
            clearTimeout(autoScrollInterval);
            autoScrollInterval = setTimeout(() => {
                track.classList.remove('paused');
            }, 1000);
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const slideWidth = slides[0].offsetWidth + 24;
            currentTranslate = -slideWidth * currentIndex;
            track.style.transition = 'none';
            track.style.transform = `translateX(${currentTranslate}px)`;
        });
    }
    
    // Initialize carousels
    initCarousel('.trust-carousel-wrapper', '.trust-carousel-track', '.trust-dots', 'left');
    initCarousel('.review-carousel-wrapper', '.review-carousel-track', '.review-dots', 'right');
    
    // ===== FAQ ACCORDION =====
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
    
    // ===== PARALLAX BACKGROUND =====
    const parallaxBg = document.getElementById('parallax-bg');
    if (parallaxBg && !isMobile) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            parallaxBg.style.transform = `translateY(${scrollY * 0.3}px)`;
        });
    }
    
    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== ACTIVE NAV LINK HIGHLIGHTING =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
    
    function highlightNavLink() {
        const scrollY = window.scrollY;
        const navHeight = document.querySelector('nav').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${sectionId}`) {
                        link.style.color = 'var(--cyan-glow)';
                    } else {
                        link.style.color = '';
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // ===== FORM SUBMISSION =====
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', formObject);
            
            // Show success message
            const formMessage = document.createElement('div');
            formMessage.style.cssText = `
                background: rgba(51, 224, 240, 0.1);
                border: 1px solid var(--cyan-glow);
                color: var(--cyan-glow);
                padding: 1rem;
                border-radius: 4px;
                margin-top: 1rem;
                text-align: center;
            `;
            formMessage.textContent = 'Submission received! Mr. Lander will be in touch.';
            
            contactForm.appendChild(formMessage);
            contactForm.reset();
            
            // Remove message after 5 seconds
            setTimeout(() => {
                formMessage.remove();
            }, 5000);
        });
    }
    
    // ===== WINDOW RESIZE HANDLER =====
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && mobileMenu) {
                mobileMenu.classList.remove('active');
                const icon = hamburgerToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            // Recalculate cursor visibility
            const newIsMobile = window.innerWidth <= 768;
            if (newIsMobile !== isMobile && cursorPupil && cursorEyeOutline) {
                if (newIsMobile) {
                    cursorPupil.style.display = 'none';
                    cursorEyeOutline.style.display = 'none';
                } else {
                    cursorPupil.style.display = '';
                    cursorEyeOutline.style.display = '';
                }
            }
        }, 250);
    });
    
    // ===== INITIALIZE =====
    highlightNavLink();
});