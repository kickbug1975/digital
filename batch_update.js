const fs = require('fs');
const path = require('path');

const filesToProcess = [
    'index.html',
    'ia-pour-avocat.html',
    'politique-confidentialite.html',
    'mentions-legales.html'
];
const dir = path.join('c:', 'Users', 'Dimitri', 'digital technology');

const newColors = `colors: {
                  "primary": "#1A4288",
                  "on-primary": "#FFFFFF",
                  "primary-container": "#D6E3FF",
                  "on-primary-container": "#001B3E",
                  "secondary": "#1A4288",
                  "on-secondary": "#FFFFFF",
                  "secondary-container": "#1A4288",
                  "on-secondary-container": "#FFFFFF",
                  "tertiary": "#775730",
                  "on-tertiary": "#FFFFFF",
                  "tertiary-container": "#FFDCBE",
                  "on-tertiary-container": "#2A1700",
                  "error": "#BA1A1A",
                  "on-error": "#FFFFFF",
                  "error-container": "#FFDAD6",
                  "on-error-container": "#410002",
                  "background": "#FDFBFF",
                  "on-background": "#1A1C1E",
                  "surface": "#FDFBFF",
                  "on-surface": "#1A1C1E",
                  "surface-variant": "#E0E2EC",
                  "on-surface-variant": "#44474E",
                  "outline": "#74777F",
                  "outline-variant": "#C4C6D0",
                  "surface-container-lowest": "#FFFFFF",
                  "surface-container-low": "#F7F6FA",
                  "surface-container": "#F1F0F4",
                  "surface-container-high": "#EBEAEF",
                  "surface-container-highest": "#E6E4E9",
                  "inverse-surface": "#2F3033",
                  "inverse-on-surface": "#F1F0F4",
                  "inverse-primary": "#A8C8FF"
                }`;

filesToProcess.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
        console.log('Skipping ' + file + ' - not found');
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');

    content = content.replace(/<html class="dark"/g, '<html');
    content = content.replace(/bg-\[#070B14\]/g, 'bg-[#FDFBFF]');
    content = content.replace(/bg-\[#10141a\]\/([0-9]+)/g, 'bg-surface/$1');
    content = content.replace(/bg-\[#10141a\]/g, 'bg-surface-container-lowest');

    content = content.replace(/text-white\/([0-9]+)/g, 'text-on-surface/$1');
    content = content.replace(/class="([^"]*)text-white([^"]*)"/g, 'class="$1text-on-surface$2"');
    content = content.replace(/text-white/g, 'text-on-surface');
    content = content.replace(/bg-white\/([0-9]+)/g, 'bg-on-surface/$1');
    content = content.replace(/border-white\/([0-9]+)/g, 'border-on-surface/$1');
    
    content = content.replace(/rgba\(49,\s*53,\s*60,\s*0\.4\)/g, 'rgba(255, 255, 255, 0.7)');
    
    const colorRegex = /colors:\s*\{[\s\S]*?\},?\s*fontFamily:/;
    if (colorRegex.test(content)) {
        content = content.replace(colorRegex, newColors + ',\n                fontFamily:');
    }

    content = content.replace(/text-\[#00eefc\]/g, 'text-primary');
    content = content.replace(/bg-\[#00f0ff\]/g, 'bg-primary');
    content = content.replace(/text-secondary-container/g, 'text-primary');
    content = content.replace(/bg-secondary-container/g, 'bg-primary');
    content = content.replace(/border-secondary-container/g, 'border-primary');
    
    content = content.replace(/text-\[#afc6ff\]/g, 'text-primary');
    content = content.replace(/hover:text-\[#ffb86f\]/g, 'hover:text-tertiary-container');
    
    content = content.replace(/rgba\(0,\s*238,\s*252,\s*0\.4\)/g, 'rgba(26, 66, 136, 0.2)');
    content = content.replace(/text-glow-cyan/g, 'text-glow-primary');

    content = content.replace(/selection:bg-secondary-container/g, 'selection:bg-primary-container');
    content = content.replace(/selection:text-on-secondary-container/g, 'selection:text-on-primary-container');
    
    content = content.replace(/bg-primary([^>]*?)text-on-surface/g, 'bg-primary$1text-on-primary');
    content = content.replace(/mix-blend-screen/g, 'mix-blend-multiply');

    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
});

const cssPath = path.join(dir, 'css', 'style.css');
if (fs.existsSync(cssPath)) {
    let cssContent = fs.readFileSync(cssPath, 'utf-8');
    
    cssContent = cssContent.replace(/--accent-cyan:\s*#006874;/g, '--accent-cyan: #1A4288;');
    cssContent = cssContent.replace(/--accent-cyan-hover:\s*#004f58;/g, '--accent-cyan-hover: #123066;');
    cssContent = cssContent.replace(/--accent-cyan-glow:\s*rgba\(0,\s*104,\s*116,\s*0\.2\);/g, '--accent-cyan-glow: rgba(26, 66, 136, 0.2);');
    cssContent = cssContent.replace(/\.text-glow-cyan/g, '.text-glow-primary');
    cssContent = cssContent.replace(/rgba\(0,\s*104,\s*116,\s*0\.2\)/g, 'rgba(26, 66, 136, 0.2)');
    
    fs.writeFileSync(cssPath, cssContent);
    console.log('Updated css/style.css with primary dark blue variables');
}
