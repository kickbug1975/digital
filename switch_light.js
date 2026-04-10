const fs = require('fs');
const path = require('path');

const indexPath = path.join('c:', 'Users', 'Dimitri', 'digital technology', 'index.html');
let content = fs.readFileSync(indexPath, 'utf-8');

// 1. Remove `class="dark"` from `<html>`
content = content.replace(/<html class="dark"/g, '<html');

// 2. Replace hardcoded whites with on-surface or on-surface-variant
content = content.replace(/text-white\/([0-9]+)/g, 'text-on-surface/$1');
content = content.replace(/text-white/g, 'text-on-surface');
content = content.replace(/bg-white\/([0-9]+)/g, 'bg-on-surface/$1');
content = content.replace(/border-white\/([0-9]+)/g, 'border-on-surface/$1');

// 3. Replace background `#070B14` and `#10141a`
content = content.replace(/bg-\[#070B14\]/g, 'bg-[#FDFBFF]');
content = content.replace(/bg-\[#10141a\]\/([0-9]+)/g, 'bg-surface/$1');

// 4. Update CSS for glass-panel
content = content.replace(/rgba\(49,\s*53,\s*60,\s*0\.4\)/g, 'rgba(255, 255, 255, 0.7)');
// Update text-glow-cyan to fit light theme maybe
// For light mode, a pure cyan glow might be too hard to read against white. Let's make it a subtle shadow or a primary color glow.
content = content.replace(/rgba\(0,\s*238,\s*252,\s*0\.4\)/g, 'rgba(0, 104, 116, 0.2)');

// 5. Enhance mix-blend-mode for the logo so it appears correctly on light backgrounds
content = content.replace(/mix-blend-screen/g, 'mix-blend-multiply');

// 6. Replace the colors block in tailwind config
const newColors = `colors: {
                  "primary": "#1A4288",
                  "on-primary": "#FFFFFF",
                  "primary-container": "#D6E3FF",
                  "on-primary-container": "#001B3E",
                  "secondary": "#006874",
                  "on-secondary": "#FFFFFF",
                  "secondary-container": "#97F0FF",
                  "on-secondary-container": "#001F24",
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

const colorRegex = /colors:\s*\{[\s\S]*?\},?\s*fontFamily:/;
if (colorRegex.test(content)) {
    content = content.replace(colorRegex, newColors + ',\n                fontFamily:');
} else {
    console.log("Regex for color block didn't match perfectly. Looking for raw match.");
}

fs.writeFileSync(indexPath, content);
console.log('Switched to Light Mode successfully.');
