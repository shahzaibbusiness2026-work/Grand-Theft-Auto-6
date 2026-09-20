import sharp from "sharp";

const inputPath = "C:/Users/HP/.gemini/antigravity/brain/1865355f-e74f-4a79-9c11-16863f3f9c92/.user_uploaded/media_1789886093454.jpg";

async function cropLogos() {
  // Jason card top-left: x: 8, y: 4
  await sharp(inputPath)
    .extract({ left: 12, top: 8, width: 105, height: 75 })
    .toFile("public/img/logo-crop-jason.jpg");

  // Lucia card top-left: x: 266, y: 4
  await sharp(inputPath)
    .extract({ left: 270, top: 8, width: 105, height: 75 })
    .toFile("public/img/logo-crop-lucia.jpg");

  // Cal card top-left: x: 524, y: 4
  await sharp(inputPath)
    .extract({ left: 528, top: 8, width: 105, height: 75 })
    .toFile("public/img/logo-crop-cal.jpg");

  // Boobie Ike card top-left: x: 784, y: 4
  await sharp(inputPath)
    .extract({ left: 788, top: 8, width: 105, height: 75 })
    .toFile("public/img/logo-crop-boobie.jpg");

  // Brian Heder card top-left: x: 784, y: 342
  await sharp(inputPath)
    .extract({ left: 788, top: 346, width: 105, height: 75 })
    .toFile("public/img/logo-crop-brian.jpg");

  console.log("All logo crops generated!");
}

cropLogos().catch(console.error);
