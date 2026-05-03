# Rapport d'Analyse et de Sécurisation : humain-ai.be

Suite à l'analyse demandée via le **Mozilla Observatory**, voici le rapport des vulnérabilités identifiées et des correctifs mis en place pour augmenter considérablement le score de sécurité de la page web.

## 1. Contexte et Objectif

Le score de base d'un site non optimisé sur Mozilla Observatory se situe généralement autour de **F**. Lors d'une première itération, un score de **60/100 (C)** a été obtenu.
Ce score intermédiaire s'explique par la politique très stricte de Mozilla concernant l'exécution de scripts (`script-src`). Si la politique CSP autorise les scripts en ligne (`'unsafe-inline'`), Mozilla Observatory pénalise lourdement le score, car cela laisse la porte ouverte aux attaques XSS (Cross-Site Scripting).

L'objectif de cette "Phase 2" a été de durcir au maximum la Content-Security-Policy (CSP) pour viser la note **A ou A+**.

## 2. Ajustements "Zero Trust" (Phase 2) pour atteindre A+

Pour débloquer les paliers supérieurs de sécurité, nous avons éliminé toutes les failles de type "inline" et sécurisé les appels externes :

1. **Suppression de `'unsafe-inline'` et `'unsafe-eval'` dans le CSP (scripts)** :
   - Le fichier `.htaccess` a été mis à jour avec un `script-src 'self'`.
   - Cela signifie qu'**aucun script ne peut être exécuté s'il n'est pas dans un fichier `.js` hébergé sur votre serveur**.

2. **Refactorisation du code HTML (`index.html`)** :
   - Un attribut JavaScript risqué (`onclick="location.reload()"`) était présent directement dans le code HTML. 
   - Il a été retiré et remplacé par un ID propre (`id="btn-reload"`). L'événement de clic est désormais géré proprement et de manière sécurisée dans le fichier `js/roi-calculator.js`.

3. **Sécurisation du Webhook (CORS et HTTPS)** :
   - L'appel vers l'API n8n dans `roi-calculator.js` a été explicitement forcé en `https://n8n.dim1975.shop...` au lieu d'une URL relative qui aurait pu être bloquée par le navigateur sous la nouvelle politique stricte.
   - Ce domaine a été ajouté à la liste blanche `connect-src` de la nouvelle CSP.

## 3. Le nouveau fichier `.htaccess` ultra-sécurisé

Voici le détail du nouveau paramétrage en ligne :

1. **Strict-Transport-Security (HSTS)** : `max-age=31536000; includeSubDomains; preload`
   - *Effet* : Protection HTTPS maximale pendant 1 an (bonus de points).
2. **X-Content-Type-Options** : `nosniff`
   - *Effet* : Bloque le MIME-Sniffing.
3. **X-Frame-Options** : `SAMEORIGIN`
   - *Effet* : Bloque le Clickjacking.
4. **Referrer-Policy** : `strict-origin-when-cross-origin`
   - *Effet* : Protège la confidentialité des requêtes sortantes.
5. **Content-Security-Policy (CSP)** : `default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://n8n.dim1975.shop; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests`
   - *Effet* : C'est cette ligne qui fait la différence. Elle empêche toute exécution de code non prévu, n'autorisant que vos propres scripts.
6. **Permissions-Policy** : `geolocation=(), microphone=(), camera=(), payment=()`
   - *Effet* : Coupe l'accès aux périphériques.

## 4. Prochaines Étapes pour le Déploiement

1. L'ensemble de ces modifications ultra-sécurisées (le nouveau `.htaccess`, `index.html` et `js/roi-calculator.js`) ont été poussées sur votre dépôt GitHub.
2. Synchronisez ces nouveaux fichiers sur votre hébergement (OVH).
3. **Action Requise :**
   - Retournez sur [Mozilla Observatory pour humain-ai.be](https://observatory.mozilla.org/analyze/humain-ai.be)
   - Cliquez impérativement sur **"Force a Rescan"** (Forcer une nouvelle analyse).
   - Le score devrait maintenant s'envoler vers les sommets.

---
*L'IA comprend votre métier, l'humain la sécurise.*
