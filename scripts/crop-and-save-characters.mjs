import sharp from "sharp";
import path from "path";
import fs from "fs";

const inputPath = "C:/Users/HP/.gemini/antigravity/brain/1865355f-e74f-4a79-9c11-16863f3f9c92/.user_uploaded/media_1789886093454.jpg";
const outputDir = "c:/Users/HP/OneDrive/Desktop/grand Theft Auto 6/public/img";

const cols = [
  { left: 8, width: 233 },
  { left: 266, width: 234 },
  { left: 524, width: 234 },
  { left: 784, width: 234 },
];

const rows = [
  { top: 4, height: 300 },
  { top: 342, height: 300 },
];

const characterMap = [
  // Row 0
  { row: 0, col: 0, files: ["char-jason.jpg", "char-jason.png"], name: "Jason Duval" },
  { row: 0, col: 1, files: ["char-lucia.jpg", "char-lucia.png"], name: "Lucia Caminos" },
  { row: 0, col: 2, files: ["char-cal.jpg"], name: "Cal Hampton" },
  { row: 0, col: 3, files: ["char-bobbie.jpg", "char-boobie.jpg"], name: "Boobie Ike" },
  
  // Row 1
  { row: 1, col: 0, files: ["char-dre.jpg"], name: "Dre'Quan Priest" },
  { row: 1, col: 1, files: ["char-dimez.jpg", "char-roxy.jpg"], name: "Real Dimez - Bae-Luxe & Roxy" },
  { row: 1, col: 2, files: ["char-raul.jpg"], name: "Raul Bautista" },
  { row: 1, col: 3, files: ["char-cop.jpg", "char-heder.jpg"], name: "Brian Heder" },
];

async function extractAll() {
  for (const char of characterMap) {
    const colInfo = cols[char.col];
    const rowInfo = rows[char.row];

    const buffer = await sharp(inputPath)
      .extract({
        left: colInfo.left,
        top: rowInfo.top,
        width: colInfo.width,
        height: rowInfo.height,
      })
      // Resize 2.5x to ~585x750 for crisp high-density display
      .resize({
        width: Math.round(colInfo.width * 2.5),
        height: Math.round(rowInfo.height * 2.5),
        kernel: sharp.kernel.lanczos3,
      })
      .jpeg({ quality: 95 })
      .toBuffer();

    for (const filename of char.files) {
      const destPath = path.join(outputDir, filename);
      fs.writeFileSync(destPath, buffer);
      console.log(`Saved ${char.name} -> ${filename} (${Math.round(colInfo.width * 2.5)}x${Math.round(rowInfo.height * 2.5)})`);
    }
  }

  console.log("All character artworks successfully extracted and saved!");
}

extractAll().catch(console.error);
