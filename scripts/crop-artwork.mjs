import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, '../public/img/hero-vice-skyline.jpg');
const outputPath = path.join(__dirname, '../public/img/hero-artwork-right.jpg');

async function main() {
  const metadata = await sharp(inputPath).metadata();
  console.log('Image dimensions:', metadata.width, 'x', metadata.height);

  // In the reference image:
  // Width: metadata.width
  // Height: metadata.height
  // The right side artwork begins around 42% width to 100% width
  // The bottom feature bar begins around 85% height
  // Let's extract the artwork area:
  const left = Math.round(metadata.width * 0.468);
  const top = 0;
  const width = metadata.width - left;
  const height = Math.round(metadata.height * 0.845);

  await sharp(inputPath)
    .extract({ left, top, width, height })
    .toFile(outputPath);

  console.log('Successfully cropped artwork to:', outputPath, width, 'x', height);
}

main().catch(console.error);
