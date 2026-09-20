import sharp from "sharp";
import fs from "fs";

async function makeTransparentLogo() {
  // Let's inspect logo-crop-cal.jpg and logo-crop-jason.jpg
  // In logo-crop-cal.jpg, the background is dark.
  // In logo-crop-jason.jpg, the background is bright blue sky (R: ~60-120, G: ~120-170, B: ~180-230).
  // The logo itself:
  // "grand theft auto" is pure white (R: >230, G: >230, B: >230)
  // The black border is very dark (R: <50, G: <50, B: <50)
  // "VI" has high saturation / distinct pink/blue/orange gradient:
  // Top of VI: blue/lavender (R: ~100-150, G: ~120-160, B: ~220-255)
  // Middle of VI: magenta/pink (R: ~210-255, G: ~60-120, B: ~180-230)
  // Bottom of VI: coral/orange (R: ~240-255, G: ~120-160, B: ~80-120)
  //
  // Let's create an upscale 4x version of logo-crop-jason.jpg,
  // and let's isolate the logo with a flood-fill or edge detection mask from the outer blue sky.
  
  const { data, info } = await sharp("public/img/logo-crop-jason.jpg")
    .resize({ width: 420, height: 300, kernel: sharp.kernel.lanczos3 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log("Upscaled logo dimensions:", width, height, channels);

  // Flood fill from outer edges (0,0), (width-1, 0), etc. to mark sky pixels
  const isSky = new Uint8Array(width * height);
  const queue = [];

  function checkPixel(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    const idx = y * width + x;
    if (isSky[idx]) return false;

    const pIdx = idx * channels;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];

    // The sky in jason's crop is blue: b > r + 30 and b > g
    // Or if it's not the logo (logo has black border where r<50,g<50,b<50 or white text or VI)
    // If it's blue sky:
    const isBlueSky = (b > r + 25) && (b > 110) && (r < 180);
    return isBlueSky;
  }

  // Seed with border pixels
  for (let x = 0; x < width; x++) {
    if (checkPixel(x, 0)) { isSky[0 * width + x] = 1; queue.push([x, 0]); }
    if (checkPixel(x, height - 1)) { isSky[(height - 1) * width + x] = 1; queue.push([x, height - 1]); }
  }
  for (let y = 0; y < height; y++) {
    if (checkPixel(0, y)) { isSky[y * width + 0] = 1; queue.push([0, y]); }
    if (checkPixel(width - 1, y)) { isSky[y * width + width - 1] = 1; queue.push([width - 1, y]); }
  }

  // BFS
  while (queue.length > 0) {
    const [cx, cy] = queue.pop();
    const neighbors = [
      [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
    ];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!isSky[nIdx] && checkPixel(nx, ny)) {
          isSky[nIdx] = 1;
          queue.push([nx, ny]);
        }
      }
    }
  }

  // Now create transparent image: if isSky, alpha = 0; else alpha = 255
  const outData = Buffer.from(data);
  for (let i = 0; i < width * height; i++) {
    if (isSky[i]) {
      outData[i * channels + 3] = 0;
    }
  }

  await sharp(outData, { raw: { width, height, channels } })
    .png()
    .toFile("public/img/gta6-logo-transparent.png");

  console.log("Saved gta6-logo-transparent.png!");
}

makeTransparentLogo().catch(console.error);
