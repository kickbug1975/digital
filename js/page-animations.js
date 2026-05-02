// page-animations.js — Reveal on scroll + Header shrink effect
// Shared across all secondary pages (CSP-compliant, no inline scripts)
document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            const revealPoint = 100;

            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
                reveal.style.opacity = '1';
                reveal.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial styling
    reveals.forEach(reveal => {
        if (!reveal.classList.contains('active')) {
            reveal.style.opacity = '0';
            reveal.style.transform = 'translateY(30px)';
            reveal.style.transition = 'all 0.8s ease-out';
        }
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('py-2');
                header.classList.remove('py-4');
            } else {
                header.classList.add('py-4');
                header.classList.remove('py-2');
            }
        });
    }
});
