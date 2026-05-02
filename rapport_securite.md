# Rapport d'Analyse et de Sécurisation : humain-ai.be

Suite à l'analyse demandée via le **Mozilla Observatory**, voici le rapport des vulnérabilités identifiées et des correctifs mis en place pour augmenter considérablement le score de sécurité de la page web.

## 1. Contexte et Objectif

Le score de base d'un site non optimisé sur Mozilla Observatory se situe généralement autour de **F**. Ce score est dû à l'absence de directives serveur strictes visant à protéger les visiteurs contre diverses attaques (XSS, Clickjacking, MIME-Sniffing, etc.).
L'objectif de cette intervention a été de combler ces lacunes en injectant des "HTTP Security Headers" standards et robustes.

## 2. Problématiques Soulevées par Mozilla Observatory

Lorsqu'aucun en-tête n'est défini, Observatory pénalise lourdement le domaine pour les éléments suivants :
- **Absence de Content-Security-Policy (CSP)** : Permet potentiellement l'exécution de scripts malveillants injectés.
- **Absence de HTTP Strict Transport Security (HSTS)** : Ne garantit pas que les futures connexions se feront obligatoirement en HTTPS.
- **Absence de X-Frame-Options** : Laisse le site vulnérable au *Clickjacking* (intégration frauduleuse dans un site tiers via iframe).
- **Absence de X-Content-Type-Options** : Le navigateur peut être trompé sur la nature réelle d'un fichier téléchargé.

## 3. Implémentation des Correctifs (Fichier `.htaccess`)

Pour résoudre l'ensemble de ces points et atteindre un score allant de **B+ à A+** (selon la sévérité du CSP), j'ai créé à la racine de votre projet un fichier **`.htaccess`**. Ce fichier est automatiquement lu par les serveurs Apache (couramment utilisés chez OVH) et applique les en-têtes suivants de manière transparente :

### Détail des En-têtes Ajoutés :

1. **Strict-Transport-Security (HSTS)** : `max-age=31536000; includeSubDomains; preload`
   - *Effet* : Force les navigateurs à n'utiliser que des connexions chiffrées (HTTPS) pendant 1 an.
2. **X-Content-Type-Options** : `nosniff`
   - *Effet* : Interdit au navigateur d'interpréter un fichier différemment de son type MIME déclaré. Bloque les attaques par déduction de contenu.
3. **X-Frame-Options** : `SAMEORIGIN`
   - *Effet* : Bloque le *Clickjacking*. Votre site ne pourra être affiché dans une balise `<frame>` ou `<iframe>` que par des pages de votre propre domaine.
4. **Referrer-Policy** : `strict-origin-when-cross-origin`
   - *Effet* : Protège la vie privée de vos visiteurs. Lorsqu'un utilisateur clique sur un lien externe, le site de destination ne recevra pas l'URL complète de votre site en tant que référent, seulement le nom de domaine.
5. **Content-Security-Policy (CSP)** : `default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'; upgrade-insecure-requests`
   - *Effet* : Déclare les sources approuvées pour charger le contenu (images, scripts, styles). La directive actuelle autorise les éléments locaux et les services HTTPS légitimes, tout en permettant les scripts *inline* ou *eval* très souvent requis par des outils d'automatisation (ex: formulaires n8n) ou des polices externes (Google Fonts). De plus, elle transforme automatiquement toute requête HTTP vers une image ou un script en HTTPS.
6. **Permissions-Policy** : `geolocation=(), microphone=(), camera=(), payment=()`
   - *Effet* : Indique explicitement que votre site ne demandera jamais l'accès à la géolocalisation, au micro ou à la caméra de l'utilisateur, ce qui réduit la surface d'attaque.

*En supplément*, une règle a été ajoutée pour **forcer la redirection du trafic HTTP vers HTTPS**.

## 4. Prochaines Étapes pour le Déploiement

1. Les modifications (le fichier `.htaccess` et ce rapport) ont été ajoutées et poussées sur le dépôt GitHub.
2. Lors de la synchronisation de ces fichiers avec votre hébergement web (ex: via FTP sur OVH ou un déploiement continu), le fichier `.htaccess` prendra effet immédiatement.
3. **Action Requise :**
   - Une fois les fichiers en ligne, vous pouvez relancer le test sur l'URL de Mozilla Observatory : [Mozilla Observatory pour humain-ai.be](https://observatory.mozilla.org/analyze/humain-ai.be)
   - *Remarque* : Pensez à cliquer sur "Force a Rescan" (Forcer une nouvelle analyse) si le site affiche l'ancien rapport en cache.

---
*L'IA comprend votre métier, l'humain la sécurise.*
