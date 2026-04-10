const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'Users', 'Dimitri', 'digital technology', 'css', 'style.css');
let content = fs.readFileSync(cssPath, 'utf-8');

// Replace Root variables
content = content.replace(/--bg-dark:\s*#070B14;/g, '--bg-dark: #FDFBFF;');
content = content.replace(/--bg-darker:\s*#04060A;/g, '--bg-darker: #F7F6FA;');
content = content.replace(/--bg-card:\s*rgba\(16,\s*24,\s*39,\s*0\.4\);/g, '--bg-card: rgba(255, 255, 255, 0.7);');
content = content.replace(/--bg-card-hover:\s*rgba\(16,\s*24,\s*39,\s*0\.7\);/g, '--bg-card-hover: rgba(255, 255, 255, 0.9);');
content = content.replace(/--text-main:\s*#f3f4f6;/g, '--text-main: #1A1C1E;');
content = content.replace(/--text-muted:\s*#9ca3af;/g, '--text-muted: #44474E;');
content = content.replace(/--accent-cyan:\s*#00f0ff;/g, '--accent-cyan: #006874;');
content = content.replace(/--accent-cyan-hover:\s*#00d4e3;/g, '--accent-cyan-hover: #004f58;');
content = content.replace(/--accent-cyan-glow:\s*rgba\(0,\s*240,\s*255,\s*0\.4\);/g, '--accent-cyan-glow: rgba(0, 104, 116, 0.2);');
content = content.replace(/--accent-purple:\s*#8b5cf6;/g, '--accent-purple: #5c3b99;');
content = content.replace(/--border-glass:\s*rgba\(255,\s*255,\s*255,\s*0\.08\);/g, '--border-glass: rgba(0, 0, 0, 0.08);');
content = content.replace(/--border-glass-strong:\s*rgba\(255,\s*255,\s*255,\s*0\.15\);/g, '--border-glass-strong: rgba(0, 0, 0, 0.15);');

// Replace specific background blocks
content = content.replace(/background:\s*rgba\(7,\s*11,\s*20,\s*0\.85\);/g, 'background: rgba(253, 251, 255, 0.85);');
content = content.replace(/background:\s*rgba\(0,\s*0,\s*0,\s*0\.2\);/g, 'background: rgba(255, 255, 255, 0.7);');
content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.7\)\s*100%\)/g, 'background: rgba(0, 0, 0, 0.7) 100%)');
content = content.replace(/background:\s*#1a2333;/g, 'background: #e7e8ee;');
content = content.replace(/color:\s*#fff;/g, 'color: var(--text-main);');

fs.writeFileSync(cssPath, content);
console.log('Switched style.css to Light Mode successfully.');
