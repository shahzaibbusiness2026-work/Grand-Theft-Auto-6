import sharp from "sharp";

const inputPath = "C:/Users/HP/.gemini/antigravity/brain/1865355f-e74f-4a79-9c11-16863f3f9c92/gta6_official_logo_1789887094026.jpg";
const outputPath = "c:/Users/HP/OneDrive/Desktop/grand Theft Auto 6/public/img/gta6-official-logo.png";

async function processLogo() {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  const isOuter = new Uint8Array(width * height);
  const queue = [];

  function isBackgroundPixel(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    const idx = y * width + x;
    if (isOuter[idx]) return false;

    const pIdx = idx * channels;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];

    // If it is black border, stop!
    if (r < 40 && g < 40 && b < 40) return false;

    // Checkerboard pixels are neutral gray/white where R,G,B are close to each other and bright:
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const isNeutral = (maxVal - minVal) < 15;

    return isNeutral && minVal > 150;
  }

  // Seed with border pixels
  for (let x = 0; x < width; x++) {
    if (isBackgroundPixel(x, 0)) { isOuter[0 * width + x] = 1; queue.push([x, 0]); }
    if (isBackgroundPixel(x, height - 1)) { isOuter[(height - 1) * width + x] = 1; queue.push([x, height - 1]); }
  }
  for (let y = 0; y < height; y++) {
    if (isBackgroundPixel(0, y)) { isOuter[y * width + 0] = 1; queue.push([0, y]); }
    if (isBackgroundPixel(width - 1, y)) { isOuter[y * width + width - 1] = 1; queue.push([width - 1, y]); }
  }

  // Also seed any enclosed checkerboard pockets between the letters and Roman numeral:
  // Let's scan for any neutral pixel surrounded by black strokes
  for (let y = 150; y < 450; y++) {
    for (let x = 600; x < 750; x++) {
      if (!isOuter[y * width + x] && isBackgroundPixel(x, y)) {
        // Double check it's checkerboard
        const pIdx = (y * width + x) * channels;
        const r = data[pIdx], g = data[pIdx+1], b = data[pIdx+2];
        // If it's gray (r ~ 204) or white (r ~ 255)
        if ((r > 195 && r < 215) || (r > 250)) {
          isOuter[y * width + x] = 1;
          queue.push([x, y]);
        }
      }
    }
  }

  // Flood fill
  while (queue.length > 0) {
    const [cx, cy] = queue.pop();
    const neighbors = [
      [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
    ];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!isOuter[nIdx] && isBackgroundPixel(nx, ny)) {
          isOuter[nIdx] = 1;
          queue.push([nx, ny]);
        }
      }
    }
  }

  // Create transparent buffer
  const outData = Buffer.from(data);
  for (let i = 0; i < width * height; i++) {
    if (isOuter[i]) {
      outData[i * channels + 3] = 0; // Transparent
    }
  }

  await sharp(outData, { raw: { width, height, channels } })
    .trim()
    .png()
    .toFile(outputPath);

  console.log(`Saved flawless transparent logo to ${outputPath}!`);
}

processLogo().catch(console.error);
