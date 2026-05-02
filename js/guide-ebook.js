// guide-ebook.js — Reveal animations + E-book lead form for guide-ia-pme-2026.html
// CSP-compliant external script (extracted from inline <script>)

// Reveal animations
const reveals = document.querySelectorAll('.reveal');
function checkReveals() {
    const winHeight = window.innerHeight;
    reveals.forEach(reveal => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < winHeight - 50) {
            reveal.classList.add('active');
        }
    });
}
window.addEventListener('scroll', checkReveals);
checkReveals(); // Init

// E-book form submission
const ebookForm = document.getElementById('ebook-form');
const ebookSuccess = document.getElementById('ebook-success');

if (ebookForm) {
    ebookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = ebookForm.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">sync</span> Envoi...';

        const formData = {
            prenom: document.getElementById('prenom').value.trim(),
            email: document.getElementById('email').value.trim(),
            telephone: document.getElementById('telephone').value.trim(),
            societe: document.getElementById('societe').value.trim()
        };

        fetch('https://n8n.dim1975.shop/webhook/ebook-leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                ebookSuccess.classList.remove('hidden');
                ebookForm.style.opacity = '0';
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert("Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.");
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
        });
    });
}
