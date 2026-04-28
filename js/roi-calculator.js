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

    // Navigation Step 1 -> Step 2
    if(btnNext1) {
        btnNext1.addEventListener('click', () => {
            // Validation simple
            const name = document.getElementById('roi-name').value;
            const email = document.getElementById('roi-email').value;
            const company = document.getElementById('roi-company').value;
            if(!name || !email || !company) {
                alert("Veuillez remplir votre nom, email et société.");
                return;
            }
            goToStep(2);
        });
    }

    // Submit Form -> Step 3 (Calcul et Webhook)
    if(formROI) {
        formROI.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Récupération des données
            const checkboxes = document.querySelectorAll('input[name="roi-besoins"]:checked');
            const besoinsArray = Array.from(checkboxes).map(cb => cb.value);

            const data = {
                name: document.getElementById('roi-name').value,
                email: document.getElementById('roi-email').value,
                company: document.getElementById('roi-company').value,
                phone: document.getElementById('roi-phone').value || '',
                sector: document.getElementById('roi-sector').value,
                besoins: besoinsArray.join(', '),
                employees: parseInt(document.getElementById('roi-employees').value, 10),
                avg_wage: parseFloat(document.getElementById('roi-wage').value || 30) // Par défaut 30€
            };

            if(isNaN(data.employees) || data.employees < 1) {
                alert("Veuillez indiquer un nombre valide d'employés.");
                return;
            }

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

            // Appel Webhook n8n
            try {
                // Remplacer par l'URL exacte du Webhook de production si nécessaire 
                const WEBHOOK_URL = "https://n8n.dim1975.shop/webhook/roi_lead_genneration";
                
                await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } catch (error) {
                console.error("Erreur lors de l'envoi au webhook n8n:", error);
                // On continue silencieusement pour afficher le résultat à l'utilisateur
            }

            // Attente artificielle pour l'effet "WoWa"
            setTimeout(() => {
                // Formatage des nombres
                valHours.textContent = new Intl.NumberFormat('fr-BE').format(hoursSavedPerYear);
                valFinancial.textContent = new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(financialGain);
                
                const displayEmail = document.getElementById('display-email');
                if (displayEmail) displayEmail.textContent = data.email;
                
                goToStep(4); // Affichage du résultat
            }, 2500);
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
