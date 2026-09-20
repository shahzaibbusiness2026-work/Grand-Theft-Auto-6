import sharp from "sharp";
import fs from "fs";

async function findLogo() {
  // In media_1789886093454.jpg, Jason Duval card is from x: 8 to 240, y: 4 to 303.
  // The logo in Jason Duval's card is in the top-left:
  // roughly x: 12 to 100, y: 8 to 55.
  const jasonLogo = await sharp("C:/Users/HP/.gemini/antigravity/brain/1865355f-e74f-4a79-9c11-16863f3f9c92/.user_uploaded/media_1789886093454.jpg")
    .extract({ left: 12, top: 8, width: 90, height: 45 })
    .toBuffer();
  fs.writeFileSync("public/img/test-logo-jason.jpg", jasonLogo);

  // Let's also check media_1789883500283.jpg top-left area
  const heroTopLeft = await sharp("C:/Users/HP/.gemini/antigravity/brain/1865355f-e74f-4a79-9c11-16863f3f9c92/.user_uploaded/media_1789883500283.jpg")
    .extract({ left: 30, top: 40, width: 350, height: 250 })
    .toBuffer();
  fs.writeFileSync("public/img/test-hero-crop.jpg", heroTopLeft);

  console.log("Crops saved for inspection!");
}

findLogo().catch(console.error);
