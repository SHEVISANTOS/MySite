const header = document.querySelector("header");

window.addEventListener ("scroll", function() {
	header.classList.toggle ("sticky", window.scrollY >0);
});

let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
	menu.classList.toggle('bx-x');
	navbar.classList.toggle('active');
};

window.onscroll = () => {
	menu.classList.remove('bx-x');
	navbar.classList.remove('active');
};

const sr = ScrollReveal ({
	distance: '25px',
	duration: 250,
	reset: true
})

sr.reveal('.home-text',{delay:190, origin:'bottom'})

sr.reveal('.about,.services,.portfolio,.contact',{delay:200, origin:'bottom'})

/* ===== CONTACT FORM WITH MESSAGE FEEDBACK ===== */
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const formMessage = document.getElementById('form-message');
    const messageText = document.getElementById('message-text');
    const submitBtn = contactForm?.querySelector('button[type="submit"]');
    
    if (!contactForm) return;
    
    // Show message function
    function showMessage(text, type = 'success', duration = 5000) {
        // Set message content and style
        messageText.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.classList.remove('hidden');
        
        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                hideMessage();
            }, duration);
        }
    }
    
    // Hide message function
    window.hideMessage = function() {
        formMessage.classList.add('hidden');
    }
    
    // Form submit handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable button & show loading
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... ✨';
        submitBtn.disabled = true;
        
        try {
            // Collect form data
            const formData = new FormData(this);
            
            // 🎯 OPTION 1: FormSubmit.co (No signup)
            const response = await fetch('https://formsubmit.co/ajax/shevijeremiah@gmail.com', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            const result = await response.json();
            
            if (result.success) {
                // ✅ Show success message
                showMessage('🎉 Message sent successfully! I\'ll get back to you soon.', 'success', 6000);
                contactForm.reset();
            } else {
                throw new Error('FormSubmit error');
            }
            
            /* 
            // 🎯 OPTION 2: EmailJS (Uncomment if using EmailJS)
            await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                origin: window.location.href
            });
            showMessage('🎉 Message sent successfully! I\'ll get back to you soon.', 'success', 6000);
            contactForm.reset();
            */
            
        } catch (error) {
            console.error('Form error:', error);
            // ❌ Show error message
            showMessage('❌ Oops! Something went wrong. Please try again or email me directly.', 'error', 8000);
        } finally {
            // Restore button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
    
    // Optional: Close message when clicking outside
    document.addEventListener('click', function(e) {
        if (!formMessage.contains(e.target) && !contactForm.contains(e.target)) {
            hideMessage();
        }
    });
});

/* ===== SMOOTH SCROLL FOR NAV LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ===== ACTIVE LINK HIGHLIGHTING ===== */
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Lightbox Functionality
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.close-lightbox');
    const showAllBtn = document.querySelector('.show-all-btn');
    
    // Open lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const alt = img.getAttribute('alt');
            
            lightboxImg.src = img.src;
            lightboxCaption.textContent = alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    closeBtn.addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Show All button
    showAllBtn.addEventListener('click', function() {
        // You can redirect to a full gallery page or expand the grid
        alert('Show all photos and videos - Add your gallery page link here!');
        // window.location.href = '/gallery.html';
    });
});

const form = document.getElementById('form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("access_key", "ac10c802-27ae-4685-89ff-0f7ef514c887");

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinksMenu = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinksMenu.classList.toggle('active');
    });
}

// script.js - Navigation Toggle Functionality

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.navbar li a');

    // Toggle menu when hamburger is clicked
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu if clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && hamburger && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target) && 
            navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
});

 // Lightbox functionality
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');
        const lightboxContent = document.getElementById('lightboxContent');

        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    const imgClone = img.cloneNode(true);
                    lightboxContent.innerHTML = '';
                    lightboxContent.appendChild(imgClone);
                    lightbox.classList.add('active');
                }
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            lightboxContent.innerHTML = '';
        }

        // Close lightbox on outside click
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Scroll to top
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });

        // Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    
    // Get elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.navbar li a');
    
    // Debug: Check if elements exist
    console.log('Hamburger:', hamburger);
    console.log('Nav Menu:', navMenu);
    
    // Toggle menu function
    function toggleMenu() {
        if (hamburger && navMenu) {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Debug
            console.log('Menu toggled!');
            console.log('Hamburger active:', hamburger.classList.contains('active'));
            console.log('Nav Menu active:', navMenu.classList.contains('active'));
        } else {
            console.error('Hamburger or Nav Menu not found!');
        }
    }
    
    // Add click event to hamburger
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger clicked!');
            toggleMenu();
        });
    } else {
        console.error('Hamburger button not found in DOM!');
    }
    
    // Close menu when clicking a link
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                console.log('Menu closed - link clicked');
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (hamburger && navMenu && 
            !hamburger.contains(e.target) && 
            !navMenu.contains(e.target) && 
            navMenu.classList.contains('active')) {
            
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            console.log('Menu closed - clicked outside');
        }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            if (hamburger) hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            console.log('Menu closed - Escape key');
        }
    });
    
});
