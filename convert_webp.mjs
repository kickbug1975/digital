import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const assetDir = path.join(process.cwd(), 'asset');

async function convertToWebP() {
  const files = fs.readdirSync(assetDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      const inputPath = path.join(assetDir, file);
      const outputFilename = path.basename(file, ext) + '.webp';
      const outputPath = path.join(assetDir, outputFilename);

      if (!fs.existsSync(outputPath)) {
        console.log(`Converting ${file} to ${outputFilename}...`);
        try {
          await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(outputPath);
          console.log(`Successfully converted ${file}`);
        } catch (err) {
          console.error(`Error converting ${file}:`, err);
        }
      } else {
        console.log(`${outputFilename} already exists. Skipping.`);
      }
    }
  }
}

convertToWebP().then(() => console.log('Done!'));
