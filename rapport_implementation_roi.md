# Rapport d'Implémentation : Calculateur de ROI "Humain & IA"

Ce document détaille la logique algorithmique, les variables et les formules mathématiques utilisées par le calculateur de Retour sur Investissement (ROI) présent sur le site web. Il sert de documentation de référence pour reproduire ces calculs dans des outils d'automatisation externes (comme n8n).

---

## 1. Variables d'Entrée (Inputs Utilisateur)

Ces données sont récupérées via le formulaire côté client (fichier `roi-calculator.js`) :

- **`employees`** (Entier) : Le nombre total d'employés dans l'entreprise.
- **`avg_wage`** (Décimal) : Le salaire ou taux horaire brut moyen en euros. Par défaut, si non renseigné, le système applique **30 €/heure**.
- **`sector`** (Chaîne) : Le secteur d'activité de l'entreprise. Valeurs possibles : `administrative`, `support`, `sales`, `other`.
- **`besoins`** (Chaîne) : Les objectifs sélectionnés par l'utilisateur (concaténés par des virgules).

## 2. Constantes et Postulats (Base de calcul)

L'algorithme s'appuie sur des références analytiques (type McKinsey / NotebookLM) pour établir ses postulats de départ :

- **`wastedHoursPerWeek`** = `15`
  *Postulat : On estime qu'un employé perd en moyenne 15 heures par semaine sur des tâches répétitives automatisables.*
- **`weeksPerYear`** = `47`
  *Postulat : On base le calcul sur 47 semaines travaillées par an.*
- **`LOADED_WAGE_FACTOR`** = `1.6`
  *Postulat : Multiplicateur de charges patronales. Pour avoir le coût réel entreprise, on multiplie le salaire brut par 1.6.*

## 3. Matrice d'Efficacité de l'IA

Chaque secteur d'activité se voit attribuer un "taux de récupération" (efficacité) des heures perdues grâce à l'implémentation de l'IA :

| Secteur d'activité | Clé technique | Efficacité (Taux) | Pourcentage d'automatisation |
| :--- | :--- | :--- | :--- |
| Administratif / Secrétariat | `administrative` | `0.60` | **60%** |
| Support Client / SAV | `support` | `0.45` | **45%** |
| Ventes / Commercial | `sales` | `0.35` | **35%** |
| Autre (Défaut) | `other` | `0.32` | **32%** |

## 4. Formules Mathématiques

La séquence algorithmique suit ces 3 étapes de calcul principales :

### A. Coût Horaire Réel
```text
Taux_Horaire_Charge = avg_wage * LOADED_WAGE_FACTOR
```
*(Exemple pour un taux brut de 30€ : 30 * 1.6 = 48 € / heure en coût entreprise)*

### B. Heures Économisées Annuelles
```text
Heures_Sauvegardees_Par_An = Arrondi(employees * wastedHoursPerWeek * weeksPerYear * Efficacité_Secteur)
```
*(Formule littérale : Nombre d'employés × 15h × 47 semaines × Taux d'automatisation du secteur)*

### C. Gain Financier Annuel
```text
Gain_Financier_Annuel = Arrondi(Heures_Sauvegardees_Par_An * Taux_Horaire_Charge)
```

## 5. Transmission au Webhook n8n

Les données sont ensuite packagées et envoyées au webhook n8n (`https://n8n.dim1975.shop/webhook/roi_lead_genneration`) au format JSON. Le payload exact envoyé est structuré de la manière suivante :

```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@entreprise.com",
  "company": "Entreprise SA",
  "phone": "0470000000",
  "sector": "administrative",
  "besoins": "Automatiser l'accueil, Analyse de documents",
  "employees": 10,
  "avg_wage": 30,
  "hours_saved": 4230,
  "financial_gain": 203040
}
```

> [!NOTE] 
> **À propos de la synchronisation** : Bien que le site calcule `hours_saved` et `financial_gain` et les envoie au webhook, il est **fortement recommandé** dans la génération d'un rapport PDF personnalisé via n8n de recalculer ces éléments de manière sécurisée (côté serveur n8n) à l'aide des formules ci-dessus pour éviter toute falsification de données côté client et pour intégrer de nouvelles variables dynamiques si besoin.
