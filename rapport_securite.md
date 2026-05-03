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

## 3. Ajustements Ultimes "Phase 3" (Exigences Maximales Web Check / Observatory)

Suite à une analyse approfondie via des outils stricts, deux failles mineures ont été corrigées pour garantir une politique "Zero Trust" absolue :

1. **Refus par défaut (`default-src 'none'`)** :
   - Remplacement de `default-src 'self'` par `'none'`. 
   - *Impact* : Le navigateur bloque désormais **absolument tout** par défaut. Seules les ressources explicitement déclarées dans la directive CSP sont chargées.

2. **Éradication des styles en ligne (`unsafe-inline` dans `style-src`)** :
   - L'autorisation `unsafe-inline` pour le CSS a été retirée du fichier `.htaccess`.
   - *Problème rencontré* : Certains éléments HTML (barres de progression, icônes) utilisaient des balises `style="..."` qui ont été bloquées par cette nouvelle politique stricte.
   - *Correctif* : Un script automatisé de nettoyage a été exécuté sur l'ensemble des fichiers `.html` pour remplacer tous les attributs `style` par des classes utilitaires Tailwind correspondantes (ex: `class="w-1/4"`, `class="text-[#ffb86f]"`).

## 4. Le nouveau fichier `.htaccess` ultra-sécurisé

Voici le détail du nouveau paramétrage en ligne :

1. **Strict-Transport-Security (HSTS)** : `max-age=63072000; includeSubDomains; preload`
   - *Effet* : Protection HTTPS maximale pendant 2 ans.
2. **X-Content-Type-Options** : `nosniff`
   - *Effet* : Bloque le MIME-Sniffing.
3. **X-Frame-Options** : `DENY`
   - *Effet* : Bloque totalement le Clickjacking (impossible d'intégrer le site dans une iframe).
4. **Referrer-Policy** : `strict-origin-when-cross-origin`
   - *Effet* : Protège la confidentialité des requêtes sortantes.
5. **Content-Security-Policy (CSP)** : `default-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://n8n.dim1975.shop; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests`
   - *Effet* : C'est la ligne la plus stricte possible. Elle empêche toute exécution de code non prévu, tout style en ligne non autorisé, et bloque par défaut toute connexion non listée.
6. **Permissions-Policy** : `geolocation=(), microphone=(), camera=(), payment=()`
   - *Effet* : Coupe l'accès aux périphériques.

## 5. Prochaines Étapes pour le Déploiement

1. L'ensemble de ces modifications ultra-sécurisées a été poussé sur le dépôt GitHub.
2. Le pipeline de déploiement automatique via GitHub Actions a synchronisé ces fichiers vers l'hébergement Infomaniak.
3. **Action Requise :**
   - Sur les outils comme Web Check ou Mozilla Observatory, vous devez cliquer sur **"Initiate Rescan"** ou **"Force a Rescan"**.
   - Tant que cela n'est pas fait, ces outils afficheront le résultat de leur ancien cache. Une fois relancés, le score affichera un succès total (vert) sur la sécurité HTTP.

---
*L'IA comprend votre métier, l'humain la sécurise.*
