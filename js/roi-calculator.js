document.addEventListener('DOMContentLoaded', () => {
    const roiCalculator = document.getElementById('roi-calculator');
    if (!roiCalculator) return;

    // Constantes d'IA issues de la recherche (NotebookLM / McKinsey)
    const AI_EFFICIENCY = {
        administrative: 0.60, // 60% d'automatisation
        support: 0.45,        // 45%
        sales: 0.35,          // 35%
        other: 0.32           // 32% par défaut
    };
    const LOADED_WAGE_FACTOR = 1.6; // Charges

    // Éléments du DOM
    const steps = document.querySelectorAll('.roi-step');
    const btnNext1 = document.getElementById('btn-next-1');
    const formROI = document.getElementById('form-roi');
    const resultContainer = document.getElementById('roi-result-container');
    const valHours = document.getElementById('val-hours');
    const valFinancial = document.getElementById('val-financial');

    let isSubmitting = false;

    // Fonctions de sécurité et de validation
    const sanitizeHTML = (str) => {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Navigation Step 1 -> Step 2
    if(btnNext1) {
        btnNext1.addEventListener('click', () => {
            // Validation simple
            const name = document.getElementById('roi-name').value.trim();
            const email = document.getElementById('roi-email').value.trim();
            const company = document.getElementById('roi-company').value.trim();
            
            if(!name || !email || !company) {
                alert("Veuillez remplir votre nom, email et société.");
                return;
            }
            if(!isValidEmail(email)) {
                alert("Veuillez entrer une adresse e-mail valide.");
                return;
            }
            
            goToStep(2);
        });
    }

    // Submit Form -> Step 3 (Calcul et Webhook)
    const btnCalc = document.getElementById('btn-calc');
    if(btnCalc) {
        btnCalc.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log("Bouton btn-calc cliqué !");
            
            try {
                if (isSubmitting) {
                    console.log("Déjà en cours de soumission...");
                    return;
                }
                isSubmitting = true;

                // Récupération et nettoyage des données (Sécurité: Sanitization)
                console.log("Récupération des données...");
                const checkboxes = document.querySelectorAll('input[name="roi-besoins"]:checked');
                const besoinsArray = Array.from(checkboxes).map(cb => sanitizeHTML(cb.value));

                const data = {
                    name: sanitizeHTML(document.getElementById('roi-name').value.trim()),
                    email: sanitizeHTML(document.getElementById('roi-email').value.trim()),
                    company: sanitizeHTML(document.getElementById('roi-company').value.trim()),
                    phone: sanitizeHTML(document.getElementById('roi-phone').value.trim()),
                    sector: sanitizeHTML(document.getElementById('roi-sector').value),
                    besoins: besoinsArray.join(', '),
                    employees: parseInt(document.getElementById('roi-employees').value, 10),
                    avg_wage: parseFloat(document.getElementById('roi-wage').value || 30) // Par défaut 30€
                };
                console.log("Données récupérées:", data);

                // Double validation côté soumission
                if(!data.name || !data.email || !data.company || !isValidEmail(data.email)) {
                    alert("Informations de contact invalides. Veuillez vérifier l'étape 1.");
                    goToStep(1);
                    isSubmitting = false;
                    return;
                }

                if(isNaN(data.employees) || data.employees < 1) {
                    alert("Veuillez indiquer un nombre valide d'employés.");
                    isSubmitting = false;
                    return;
                }

                console.log("Validation réussie. Passage à l'étape 3...");
                goToStep(3); // Affichage du loader "Calcul en cours..."

                // Calcul du ROI
                const efficiency = AI_EFFICIENCY[data.sector] || AI_EFFICIENCY.other;
                const wastedHoursPerWeek = 15; // Estimé à 15h de tâches répétitives / semaine / employé
                const weeksPerYear = 47; // Semaines travaillées

                const hoursSavedPerYear = Math.round(data.employees * wastedHoursPerWeek * weeksPerYear * efficiency);
                const loadedHourlyRate = data.avg_wage * LOADED_WAGE_FACTOR;
                const financialGain = Math.round(hoursSavedPerYear * loadedHourlyRate);

                data.hours_saved = hoursSavedPerYear;
                data.financial_gain = financialGain;
                console.log("ROI calculé:", { hoursSavedPerYear, financialGain });

                // Appel Webhook n8n
                try {
                    const WEBHOOK_URL = "https://n8n.dim1975.shop/webhook/roi_lead_genneration";
                    console.log("Envoi au Webhook n8n...");
                    
                    // Use URLSearchParams to send as form data
                    const formData = new URLSearchParams();
                    for (const [key, value] of Object.entries(data)) {
                        formData.append(key, value);
                    }
                    
                    await fetch(WEBHOOK_URL, {
                        method: 'POST',
                        mode: 'no-cors', // IMPORTANT: Permet l'envoi même si n8n ne renvoie pas les bons headers CORS
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: formData.toString()
                    });
                    console.log("Requête fetch terminée (no-cors mode ne permet pas de lire le status, mais l'envoi a eu lieu).");
                } catch (error) {
                    console.error("Erreur lors de l'envoi au webhook n8n:", error);
                }

                // Attente artificielle pour l'effet "WoWa"
                setTimeout(() => {
                    console.log("Affichage des résultats (étape 4)...");
                    // Formatage des nombres
                    if (valHours) valHours.textContent = new Intl.NumberFormat('fr-BE').format(hoursSavedPerYear);
                    if (valFinancial) valFinancial.textContent = new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(financialGain);
                    
                    const displayEmail = document.getElementById('display-email');
                    if (displayEmail) displayEmail.textContent = data.email;
                    
                    goToStep(4); // Affichage du résultat
                    isSubmitting = false;
                }, 2500);

            } catch (globalError) {
                console.error("Erreur inattendue dans le calculateur ROI:", globalError);
                alert("Une erreur inattendue est survenue lors du calcul. Veuillez réessayer.");
                isSubmitting = false; // Réinitialiser pour permettre un autre essai
            }
        });
    }

    // Recommencer
    const btnRestart = document.getElementById('btn-restart');
    if(btnRestart) {
        btnRestart.addEventListener('click', () => {
            formROI.reset();
            goToStep(1);
        });
    }

    // Bouton OK, Merci (Reload)
    const btnReload = document.getElementById('btn-reload');
    if (btnReload) {
        btnReload.addEventListener('click', () => {
            location.reload();
        });
    }

    function goToStep(stepNum) {
        steps.forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(`roi-step-${stepNum}`);
        if(target) {
            target.classList.remove('hidden');
            // Animation d'apparition
            target.style.opacity = '0';
            target.style.transform = 'translateY(10px)';
            setTimeout(() => {
                target.style.transition = 'all 0.5s ease-out';
                target.style.opacity = '1';
                target.style.transform = 'translateY(0)';
            }, 50);
        }
    }
});
