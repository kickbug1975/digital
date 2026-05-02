// audit-wizard.js — Wizard logic for the audit-ia.html form
// CSP-compliant external script (extracted from inline <script>)
document.addEventListener('DOMContentLoaded', () => {
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-4'),
        document.getElementById('step-success')
    ];

    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const wizardFooter = document.getElementById('wizard-footer');
    const progressBar = document.getElementById('progress-bar');

    let currentStep = 0;
    const totalSteps = 4; // Excluding success step

    // Radio/Selection styling logic
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', (e) => {
            const parentDataName = e.target.name;
            document.querySelectorAll(`input[name="${parentDataName}"]`).forEach(sibling => {
                sibling.closest('.option-card').classList.remove('selected');
            });
            e.target.closest('.option-card').classList.add('selected');
        });
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', (e) => {
            if (e.target.checked) {
                e.target.closest('.option-card').classList.add('selected');
            } else {
                e.target.closest('.option-card').classList.remove('selected');
            }
        });
    });

    const updateUI = () => {
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        if (currentStep < totalSteps) {
            progressBar.style.width = `${((currentStep + 1) / totalSteps) * 100}%`;
        }

        if (currentStep === 0) {
            btnPrev.disabled = true;
        } else {
            btnPrev.disabled = false;
        }

        if (currentStep === totalSteps - 1) {
            btnNext.innerHTML = 'Terminer <span class="material-symbols-outlined text-sm">check</span>';
        } else {
            btnNext.innerHTML = 'Suivant <span class="material-symbols-outlined text-sm">arrow_forward</span>';
        }

        if (currentStep === totalSteps) {
            wizardFooter.style.display = 'none';
            progressBar.parentElement.style.display = 'none';
        }
    };

    const validateStep = (stepIndex) => {
        let isValid = true;
        const errorEl = document.getElementById(`error-step-${stepIndex + 1}`);
        if (errorEl) errorEl.classList.add('hidden');

        if (stepIndex === 0) {
            const selected = document.querySelector('input[name="secteur"]:checked');
            if (!selected) isValid = false;
        } else if (stepIndex === 1) {
            const selected = document.querySelector('input[name="taille"]:checked');
            if (!selected) isValid = false;
        } else if (stepIndex === 2) {
            const selected = document.querySelectorAll('input[name="besoins"]:checked');
            if (selected.length === 0) isValid = false;
        } else if (stepIndex === 3) {
            const prenom = document.getElementById('prenom').value.trim();
            const nom = document.getElementById('nom').value.trim();
            const societe = document.getElementById('societe').value.trim();
            const email = document.getElementById('email').value.trim();

            if (!prenom || !nom || !societe || !email || !email.includes('@')) {
                isValid = false;
            }
        }

        if (!isValid && errorEl) {
            errorEl.classList.remove('hidden');
            errorEl.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], { duration: 300 });
        }

        return isValid;
    };

    btnNext.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps - 1) {
                currentStep++;
                updateUI();
            } else {
                btnNext.disabled = true;
                btnNext.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">sync</span> Envoi...';

                const formData = {
                    secteur: document.querySelector('input[name="secteur"]:checked')?.value,
                    taille: document.querySelector('input[name="taille"]:checked')?.value,
                    besoins: Array.from(document.querySelectorAll('input[name="besoins"]:checked')).map(cb => cb.value),
                    description: document.getElementById('audit-description')?.value.trim() || '',
                    prenom: document.getElementById('prenom').value.trim(),
                    nom: document.getElementById('nom').value.trim(),
                    societe: document.getElementById('societe').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    telephone: document.getElementById('telephone').value.trim()
                };

                fetch('https://n8n.dim1975.shop/webhook/audit-ia', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    if (response.ok) {
                        currentStep++;
                        updateUI();
                    } else {
                        throw new Error('Network response was not ok');
                    }
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    alert("Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.");
                    btnNext.disabled = false;
                    btnNext.innerHTML = 'Terminer <span class="material-symbols-outlined text-sm">check</span>';
                });
            }
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateUI();
        }
    });

    // Init
    updateUI();
});
