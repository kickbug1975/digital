import fs from 'fs';
import path from 'path';

const dir = process.cwd();

const filesToProcess = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.css'));
filesToProcess.push(path.join('css', 'tailwind.css'));
filesToProcess.push('input.css');

for (const file of filesToProcess) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace .png, .jpg, .jpeg with .webp where the path starts with asset/ or /asset/ or contains asset
  // A simple regex: (asset\/[^"'\s]+)\.(png|jpg|jpeg)
  // We'll replace it globally
  const regex = /([^"'\s(]+\.(png|jpg|jpeg))/gi;
  
  content = content.replace(regex, (match, p1, p2) => {
    // Check if the file actually exists in the asset folder
    const basename = path.basename(match);
    const basenameWithoutExt = path.parse(basename).name;
    const webpFilename = basenameWithoutExt + '.webp';
    const webpPath = path.join(dir, 'asset', webpFilename);
    
    if (fs.existsSync(webpPath)) {
      return match.substring(0, match.length - p2.length) + 'webp';
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
