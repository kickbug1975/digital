/**
 * Digital Technology - Humain & IA
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {



    /* =========================================================================
       1. SCROLL REVEAL ANIMATIONS
       ========================================================================= */
    const revealElements = document.querySelectorAll('.reveal');

    // Advanced observer options
    const revealOptions = {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it comes fully into view
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add class to trigger CSS transition
                entry.target.classList.add('active');
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        // Only observe if element isn't already visible on initial load
        revealObserver.observe(el);
    });

    /* =========================================================================
       2. SMOOTH SCROLLING FOR NAVIGATION LINKS
       ========================================================================= */
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const header = document.querySelector('.header');

    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Determine header height for correct offset
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Custom offset for visual breathing room
                const additionalOffset = 20; 
                
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - additionalOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    /* =========================================================================
       3. FORM VALIDATION & MOCK SUBMISSION
       ========================================================================= */
    const auditForm = document.getElementById('audit-form');
    const formSuccessMessage = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    if (auditForm) {
        auditForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual page reload

            // Basic HTML5 validation check
            if (!auditForm.checkValidity()) {
                // If invalid, the browser will likely show its own tooltips
                return;
            }

            // Simulate UX loading state
            const originalText = submitBtn.textContent;
            
            // Loading UI
            submitBtn.innerHTML = `
                <span style="opacity:0">Envoi en cours...</span>
                <span style="position:absolute; left:50%; top:50%; transform:translate(-50%, -50%); display:flex; align-items:center;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;">
                        <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.071 4.92896L16.2426 7.75739M7.75736 16.2426L4.92893 19.071M19.071 19.0711L16.2426 16.2427M7.75736 7.75738L4.92893 4.92895" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    &nbsp;Envoi en cours...
                </span>
            `;
            submitBtn.disabled = true;
            submitBtn.style.pointerEvents = 'none';

            // Custom keyframes for the spinner injected temporarily
            if(!document.getElementById('spinner-style')) {
                const style = document.createElement('style');
                style.id = 'spinner-style';
                style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
                document.head.appendChild(style);
            }

            // Fake API Call Delay (Mocking network request)
            setTimeout(() => {
                // Success Handling UI Revert
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.pointerEvents = 'auto';
                
                // Clear the form
                auditForm.reset();
                
                // Show success message
                formSuccessMessage.classList.remove('hidden');

                // Auto-hide success message after 6 seconds
                setTimeout(() => {
                    formSuccessMessage.classList.add('hidden');
                }, 6000);

            }, 1800);
        });
    }

    /* =========================================================================
       4. HEADER SCROLL EFFECT (BLUR INTENSITY)
       ========================================================================= */
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(253, 251, 255, 0.95)';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.08)';
        } else {
            header.style.background = 'rgba(253, 251, 255, 0.85)';
            header.style.boxShadow = 'none';
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init on load
});
