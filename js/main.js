/**
 * KITA Edu Center - Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuButton = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (menuButton && navMenu) {
        menuButton.addEventListener('click', () => {
            // Toggle the 'is-active' class on the button for animation
            menuButton.classList.toggle('is-active');
            // Toggle the 'is-active' class on the menu to show/hide
            navMenu.classList.toggle('is-active');

            // Toggle ARIA attribute for accessibility
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);

            // Optional: Prevent body scroll when mobile menu is open
            document.body.style.overflow = navMenu.classList.contains('is-active') ? 'hidden' : '';
        });

        // Close mobile menu if a link is clicked
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('is-active')) {
                    menuButton.classList.remove('is-active');
                    navMenu.classList.remove('is-active');
                    menuButton.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = ''; // Restore scroll
                }
            });
        });
    }

    // --- Active Navigation Link Highlighting ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        // Handle index.html explicitly
        if (linkPath === currentPath || (currentPath === 'index.html' && linkPath === '')) {
             // Check if the link is exactly the current page or if it's the home link on the homepage
             if (link.getAttribute('href') === currentPath || (currentPath === 'index.html' && link.getAttribute('href') === 'index.html')) {
                   link.classList.add('active');
             }
        }
         // Special case for blog posts (highlight the main Blog link)
         if (window.location.pathname.includes('/blog_posts/') && link.getAttribute('href') === 'blog.html') {
             link.classList.add('active');
         }
    });

    // --- Footer Current Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Simple Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // If the element is intersecting (visible)
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: Stop observing once it's visible to prevent re-animation
                    // observer.unobserve(entry.target);
                }
                // Optional: Reset animation if element scrolls out of view
                // else {
                //     entry.target.classList.remove('is-visible');
                // }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
            // rootMargin: '0px 0px -50px 0px' // Optional: Adjust trigger point
        });

        // Observe each animated element
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Contact Form Handling (Example - Requires Backend/Service) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default browser submission

            formStatus.textContent = 'Sending...';
            formStatus.className = 'form-status'; // Reset class

            const formData = new FormData(contactForm);
            const formAction = contactForm.getAttribute('action'); // Get endpoint URL

            // **IMPORTANT**: Replace 'YOUR_FORM_ENDPOINT' in the HTML action attribute
            // with your actual backend endpoint or service URL (like Formspree).
            if (!formAction || formAction === 'YOUR_FORM_ENDPOINT') {
                 formStatus.textContent = 'Error: Form endpoint not configured.';
                 formStatus.classList.add('error');
                 console.error("Form action attribute is not set correctly in contact.html");
                 return;
            }


            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important for services like Formspree
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully! We will get back to you soon.';
                    formStatus.classList.add('success');
                    contactForm.reset(); // Clear the form
                } else {
                    // Try to get error message from response if possible
                    const data = await response.json().catch(() => ({})); // Catch if response isn't JSON
                    const errorMessage = data.error || `Error: ${response.statusText} (${response.status})`;
                    formStatus.textContent = `Failed to send message. ${errorMessage}`;
                    formStatus.classList.add('error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                formStatus.textContent = 'An error occurred while sending the message. Please try again later.';
                formStatus.classList.add('error');
            }
        });
    }

}); // End DOMContentLoaded
