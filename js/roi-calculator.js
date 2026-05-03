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
                // Récupération des données basique
                const nameNode = document.getElementById('roi-name');
                const emailNode = document.getElementById('roi-email');
                const companyNode = document.getElementById('roi-company');
                const phoneNode = document.getElementById('roi-phone');
                const sectorNode = document.getElementById('roi-sector');
                const employeesNode = document.getElementById('roi-employees');
                const wageNode = document.getElementById('roi-wage');

                const name = nameNode ? nameNode.value.trim() : '';
                const email = emailNode ? emailNode.value.trim() : '';
                const company = companyNode ? companyNode.value.trim() : '';
                const phone = phoneNode ? phoneNode.value.trim() : '';
                const sector = sectorNode ? sectorNode.value : 'other';
                
                const checkboxes = document.querySelectorAll('input[name="roi-besoins"]:checked');
                const besoinsArray = Array.from(checkboxes).map(cb => cb.value);
                
                const employees = employeesNode ? parseInt(employeesNode.value, 10) : 5;
                const avg_wage = wageNode ? parseFloat(wageNode.value || 30) : 30;

                // Validation
                if(!name || !email || !company || !isValidEmail(email)) {
                    alert("Informations de contact invalides. Veuillez vérifier l'étape 1.");
                    goToStep(1);
                    return;
                }

                if(isNaN(employees) || employees < 1) {
                    alert("Veuillez indiquer un nombre valide d'employés.");
                    return;
                }

                const data = {
                    name, email, company, phone, sector,
                    besoins: besoinsArray.join(', '),
                    employees, avg_wage
                };

                console.log("Validation réussie. Passage à l'étape 3...");
                goToStep(3); // Affichage du loader "Calcul en cours..."

                // Calcul du ROI
                const efficiency = AI_EFFICIENCY[sector] || AI_EFFICIENCY.other;
                const wastedHoursPerWeek = 15; // Estimé à 15h de tâches répétitives / semaine / employé
                const weeksPerYear = 47; // Semaines travaillées

                const hoursSavedPerYear = Math.round(employees * wastedHoursPerWeek * weeksPerYear * efficiency);
                const loadedHourlyRate = avg_wage * LOADED_WAGE_FACTOR;
                const financialGain = Math.round(hoursSavedPerYear * loadedHourlyRate);

                data.hours_saved = hoursSavedPerYear;
                data.financial_gain = financialGain;
                console.log("ROI calculé:", { hoursSavedPerYear, financialGain });

                // Appel Webhook n8n
                try {
                    const WEBHOOK_URL = "https://n8n.dim1975.shop:5678/webhook/roi_lead_genneration";
                    console.log("Envoi au Webhook n8n...");
                    
                    await fetch(WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    console.log("Requête fetch terminée.");
                } catch (error) {
                    console.error("Erreur lors de l'envoi au webhook n8n:", error);
                }

                // Attente artificielle pour l'effet "WoWa"
                setTimeout(() => {
                    console.log("Affichage des résultats (étape 4)...");
                    if (valHours) valHours.textContent = new Intl.NumberFormat('fr-BE').format(hoursSavedPerYear);
                    if (valFinancial) valFinancial.textContent = new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(financialGain);
                    
                    const displayEmail = document.getElementById('display-email');
                    if (displayEmail) displayEmail.textContent = data.email;
                    
                    goToStep(4); // Affichage du résultat
                }, 2500);

            } catch (globalError) {
                console.error("Erreur inattendue dans le calculateur ROI:", globalError);
                alert("Une erreur inattendue est survenue lors du calcul. Veuillez réessayer.");
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
