import sharp from "sharp";

async function run() {
  const { data, info } = await sharp("public/img/logo-crop-cal.jpg")
    .resize({ width: 500, height: 360, kernel: sharp.kernel.lanczos3 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  
  // The background in Cal's crop is dark.
  // The outer boundary of the logo is surrounded by a black stroke (R: <35, G: <35, B: <35).
  // Outside that stroke is the dark background (R: ~20-40, G: ~20-40, B: ~25-45).
  // If we flood-fill from the 4 image borders, stopping when we hit the logo's inner bright content
  // OR we can make any pixel outside the logo transparent.
  
  // Let's check brightness of borders:
  const isOuter = new Uint8Array(width * height);
  const queue = [];

  function isBackground(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    const idx = y * width + x;
    if (isOuter[idx]) return false;

    const pIdx = idx * channels;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];

    // Outside background is dark (max(r,g,b) < 65)
    return Math.max(r, g, b) < 60;
  }

  for (let x = 0; x < width; x++) {
    if (isBackground(x, 0)) { isOuter[0 * width + x] = 1; queue.push([x, 0]); }
    if (isBackground(x, height - 1)) { isOuter[(height - 1) * width + x] = 1; queue.push([x, height - 1]); }
  }
  for (let y = 0; y < height; y++) {
    if (isBackground(0, y)) { isOuter[y * width + 0] = 1; queue.push([0, y]); }
    if (isBackground(width - 1, y)) { isOuter[y * width + width - 1] = 1; queue.push([width - 1, y]); }
  }

  while (queue.length > 0) {
    const [cx, cy] = queue.pop();
    const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!isOuter[nIdx] && isBackground(nx, ny)) {
          isOuter[nIdx] = 1;
          queue.push([nx, ny]);
        }
      }
    }
  }

  const outData = Buffer.from(data);
  for (let i = 0; i < width * height; i++) {
    if (isOuter[i]) {
      outData[i * channels + 3] = 0;
    }
  }

  await sharp(outData, { raw: { width, height, channels } })
    .trim()
    .png()
    .toFile("public/img/gta6-official-logo.png");

  console.log("Saved public/img/gta6-official-logo.png!");
}

run().catch(console.error);
