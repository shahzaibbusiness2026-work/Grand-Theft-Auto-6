import sharp from "sharp";

const inputPath = "C:/Users/HP/.gemini/antigravity/brain/1865355f-e74f-4a79-9c11-16863f3f9c92/.user_uploaded/media_1789886093454.jpg";

async function analyze() {
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Dimensions: ${width}x${height}, channels: ${channels}`);

  // Let's sample horizontal and vertical slices to detect whitespace / dividers
  // Find background color around (0, 0)
  const r0 = data[0], g0 = data[1], b0 = data[2];
  console.log(`Top-left pixel color: rgb(${r0}, ${g0}, ${b0})`);

  // Check columns along y = 150
  const ySample = 150;
  const colNonWhite = [];
  for (let x = 0; x < width; x++) {
    const idx = (ySample * width + x) * channels;
    const isWhite = data[idx] > 240 && data[idx+1] > 240 && data[idx+2] > 240;
    colNonWhite.push(isWhite ? 0 : 1);
  }

  // Find contiguous segments of non-white
  let segmentsX = [];
  let inSeg = false;
  let startX = 0;
  for (let x = 0; x < width; x++) {
    if (colNonWhite[x] && !inSeg) {
      inSeg = true;
      startX = x;
    } else if (!colNonWhite[x] && inSeg) {
      inSeg = false;
      segmentsX.push({ start: startX, end: x - 1, width: x - startX });
    }
  }
  if (inSeg) segmentsX.push({ start: startX, end: width - 1, width: width - startX });
  console.log("X segments:", segmentsX);

  // Check rows along x = 120 (middle of first column)
  const xSample = segmentsX[0] ? Math.floor((segmentsX[0].start + segmentsX[0].end) / 2) : 120;
  const rowNonWhite = [];
  for (let y = 0; y < height; y++) {
    const idx = (y * width + xSample) * channels;
    const isWhite = data[idx] > 240 && data[idx+1] > 240 && data[idx+2] > 240;
    rowNonWhite.push(isWhite ? 0 : 1);
  }

  let segmentsY = [];
  let inSegY = false;
  let startY = 0;
  for (let y = 0; y < height; y++) {
    if (rowNonWhite[y] && !inSegY) {
      inSegY = true;
      startY = y;
    } else if (!rowNonWhite[y] && inSegY) {
      inSegY = false;
      segmentsY.push({ start: startY, end: y - 1, height: y - startY });
    }
  }
  if (inSegY) segmentsY.push({ start: startY, end: height - 1, height: height - startY });
  console.log("Y segments:", segmentsY);
}

analyze().catch(console.error);
