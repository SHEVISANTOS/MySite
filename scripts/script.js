/* ==========================================================================
   PORTFOLIO ENGINE - SHEVI SANTOS
   Interactive Animations, Custom Cursor, Particle Canvas, & Core Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initMobileNav();
    initCustomCursor();
    initParticleCanvas();
    initIntersectionObserver();
    initContactForm();
    initLightbox();
    initBackToTop();
});

/* ===== 1. SCROLL PROGRESS BAR ===== */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (scrolled / totalHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

/* ===== 2. STICKY HEADER & MOBILE NAVIGATION ===== */
function initMobileNav() {
    const header = document.querySelector('header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.navbar li a');

    // Sticky Nav on Scroll
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('sticky', window.scrollY > 50);
        }, { passive: true });
    }

    // Toggle menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.contains('active');
            hamburger.classList.toggle('active', !isOpen);
            navMenu.classList.toggle('active', !isOpen);
            document.body.classList.toggle('menu-open', !isOpen);
            hamburger.setAttribute('aria-expanded', !isOpen);
        });

        // Close on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !hamburger.contains(e.target) && 
                !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', () => {
            let currentSection = '';
            const scrollPos = window.scrollY + 120;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && (href.slice(1) === currentSection || href.includes('#' + currentSection))) {
                    link.classList.add('active');
                }
            });
        }, { passive: true });
    }
}

/* ===== 3. CUSTOM INTERACTIVE CURSOR ===== */
function initCustomCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    
    if (!dot || !outline) return;

    // Hide custom cursor on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        dot.style.display = 'none';
        outline.style.display = 'none';
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
        
        // Unhide elements once mouse moves first time
        dot.style.opacity = '1';
        outline.style.opacity = '1';
    });

    // Lerp animation for smooth outline movement
    function animateOutline() {
        const ease = 0.15; // interpolation value
        outlineX += (mouseX - outlineX) * ease;
        outlineY += (mouseY - outlineY) * ease;

        outline.style.left = `${outlineX}px`;
        outline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateOutline);
    }
    requestAnimationFrame(animateOutline);

    // Hover scales
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .gallery-item, .tool-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.style.width = '55px';
            outline.style.height = '55px';
            outline.style.borderColor = 'rgba(212, 175, 55, 0.8)';
            outline.style.backgroundColor = 'rgba(212, 175, 55, 0.08)';
            dot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        el.addEventListener('mouseleave', () => {
            outline.style.width = '36px';
            outline.style.height = '36px';
            outline.style.borderColor = 'var(--gold-primary)';
            outline.style.backgroundColor = 'transparent';
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
    
    // Hide when leaving viewport
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        outline.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        outline.style.opacity = '1';
    });
}

/* ===== 4. HIGH-PERFORMANCE INTERACTIVE CANVAS PARTICLES ===== */
function initParticleCanvas() {
    const canvas = document.getElementById('canvas-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationId;
    let isCanvasVisible = true;

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse position tracker
    let mouse = { x: null, y: null, radius: 120 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle template
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Draw individual particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Update particle positions
        update() {
            // Screen boundaries check
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Mouse interact (push effect)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                        this.x += 2;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 2;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                        this.y += 2;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 2;
                    }
                }
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    // Initialize particles array
    function init() {
        particlesArray = [];
        const numberOfParticles = Math.min((canvas.width * canvas.height) / 14000, 80);
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 0.8;
            let x = Math.random() * (canvas.width - size * 2) + size * 2;
            let y = Math.random() * (canvas.height - size * 2) + size * 2;
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            
            // Subtle gold shades
            const goldShades = ['rgba(191, 149, 63, 0.25)', 'rgba(252, 246, 186, 0.15)', 'rgba(170, 119, 28, 0.2)'];
            let color = goldShades[Math.floor(Math.random() * goldShades.length)];

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Draw connecting lines
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 130) {
                    opacityValue = 1 - (distance / 130);
                    ctx.strokeStyle = `rgba(212, 175, 55, ${opacityValue * 0.08})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        if (!isCanvasVisible) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        animationId = requestAnimationFrame(animate);
    }

    // Page performance optimization (pause render when not visible in view)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isCanvasVisible = entry.isIntersecting;
            if (isCanvasVisible) {
                animate();
            } else {
                cancelAnimationFrame(animationId);
            }
        });
    }, { threshold: 0.05 });

    observer.observe(canvas.parentElement);
    init();
}

/* ===== 5. NATIVE INTERSECTION OBSERVER (REVEAL ANIMATIONS) ===== */
function initIntersectionObserver() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Keep observing or stop depending on design choice (here we stop to make it run once)
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px' // triggers slightly before scrolling fully into view
    });

    reveals.forEach(element => {
        revealObserver.observe(element);
    });
}

/* ===== 6. AJAX CONTACT FORM INTEGRATION ===== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const formMessage = document.getElementById('formMessage');
    const messageText = document.getElementById('messageText');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!submitBtn) return;
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Inquiry...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (response.ok && data.success) {
                if (formMessage && messageText) {
                    messageText.textContent = "Your message was transmitted successfully! I will reach out soon.";
                    formMessage.className = 'form-message success';
                    formMessage.classList.remove('hidden');
                    // Hide message after 8 seconds
                    setTimeout(() => formMessage.classList.add('hidden'), 8000);
                } else {
                    alert('Message sent successfully!');
                }
                form.reset();
            } else {
                throw new Error(data.message || 'Transmission failed.');
            }
        } catch (error) {
            console.error('Contact Form Error:', error);
            if (formMessage && messageText) {
                messageText.textContent = error.message || 'Something went wrong. Please check connection and try again.';
                formMessage.className = 'form-message error';
                formMessage.classList.remove('hidden');
                setTimeout(() => formMessage.classList.add('hidden'), 10000);
            } else {
                alert('Something went wrong. Please try again.');
            }
        } finally {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    });
}

/* ===== 7. IMAGE LIGHTBOX COMPONENT ===== */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightboxContent');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!lightbox || !lightboxContent) return;

    // Open Lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                lightboxContent.innerHTML = '';
                const clonedImg = img.cloneNode(true);
                // Remove lazy loading from lightbox image for instant display
                clonedImg.removeAttribute('loading');
                lightboxContent.appendChild(clonedImg);
                
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                lightbox.focus();
            }
        });
        
        // Accessibility - Keyboard open
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                item.click();
            }
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (lightboxContent) lightboxContent.innerHTML = '';
        }, 300); // Wait for transit fade-out
    };

    // Close on X click
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxClose.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') closeLightbox();
        });
    }

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/* ===== 8. BACK TO TOP SYSTEM ===== */
function initBackToTop() {
    const topBtn = document.getElementById('backToTop');
    if (!topBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            topBtn.classList.add('active');
        } else {
            topBtn.classList.remove('active');
        }
    }, { passive: true });

    topBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}