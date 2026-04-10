const fs = require('fs');
const path = require('path');

const files = [
  'template-industrie.html',
  'qui-sommes-nous.html',
  'politique-confidentialite.html',
  'mentions-legales.html',
  'index.html',
  'ia-pour-rh.html',
  'ia-pour-avocat.html',
  'ia-pour-comptable.html',
  'ia-accueil-telephonique.html',
  'guide-ia-pme-2026.html',
  'audit-ia.html'
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file}, not found.`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove CDN script
  content = content.replace(/<script src="https:\/\/cdn\.tailwindcss\.com\?plugins=forms,container-queries"><\/script>\n?\s*/g, '');
  
  // Remove inline config
  content = content.replace(/<script id="tailwind-config">[\s\S]*?<\/script>\n?\s*/g, '');
  
  // Add stylesheet link right before <link rel="stylesheet" href="css/style.css"> 
  // or at the end of head if not found
  if (content.includes('<link rel="stylesheet" href="css/style.css">')) {
     if (!content.includes('<link rel="stylesheet" href="css/tailwind.css">')) {
        content = content.replace(
            '<link rel="stylesheet" href="css/style.css">',
            '<link rel="stylesheet" href="css/tailwind.css">\n    <link rel="stylesheet" href="css/style.css">'
        );
     }
  } else if (content.includes('</head>')) {
     if (!content.includes('<link rel="stylesheet" href="css/tailwind.css">')) {
        content = content.replace('</head>', '    <link rel="stylesheet" href="css/tailwind.css">\n</head>');
     }
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${file}`);
}
