/* ===== STICKY HEADER ===== */
const header = document.querySelector('header');
if (header) {
    window.addEventListener('scroll', function() {
        header.classList.toggle('sticky', window.scrollY > 0);
    });
}

/* ===== SCROLL REVEAL ===== */
if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({ distance: '25px', duration: 250, reset: true });
    sr.reveal('.home-text', { delay: 190, origin: 'bottom' });
    sr.reveal('.about,.services,.portfolio,.contact', { delay: 200, origin: 'bottom' });
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ===== ACTIVE LINK HIGHLIGHTING ===== */
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

if (sections.length && navLinks.length) {
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(function(section) {
            if (pageYOffset >= section.offsetTop - 100) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && (href.slice(1) === current || href === 'Index.html#' + current)) {
                link.classList.add('active');
            }
        });
    });
}

/* ===== HAMBURGER MENU ===== */
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const menuNavLinks = document.querySelectorAll('.navbar li a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        menuNavLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') &&
                !hamburger.contains(e.target) &&
                !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
});

/* ===== CONTACT FORM ===== */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm') || document.getElementById('form');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const formMessage = document.getElementById('formMessage');
    const messageText = document.getElementById('messageText');
    if (!submitBtn) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (response.ok && data.success !== false) {
                if (formMessage && messageText) {
                    messageText.textContent = "Message sent! I'll get back to you soon.";
                    formMessage.className = 'form-message success';
                    formMessage.classList.remove('hidden');
                    setTimeout(function() { formMessage.classList.add('hidden'); }, 6000);
                } else {
                    alert('Message sent successfully!');
                }
                form.reset();
            } else {
                throw new Error(data.message || 'Failed');
            }
        } catch (error) {
            if (formMessage && messageText) {
                messageText.textContent = 'Something went wrong. Please try again.';
                formMessage.className = 'form-message error';
                formMessage.classList.remove('hidden');
                setTimeout(function() { formMessage.classList.add('hidden'); }, 8000);
            } else {
                alert('Something went wrong. Please try again.');
            }
        } finally {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    });
});

/* ===== LIGHTBOX ===== */
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightboxContent');
    if (!lightbox || !lightboxContent) return;

    document.querySelectorAll('.gallery-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                lightboxContent.innerHTML = '';
                lightboxContent.appendChild(img.cloneNode(true));
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    const lightboxClose = document.querySelector('.lightbox-close');
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightboxContent');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (lightboxContent) lightboxContent.innerHTML = '';
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===== SCROLL PROGRESS BAR ===== */
(function() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
    }, { passive: true });
})();