import sharp from "sharp";

async function inspect() {
  // Let's check media_1789883500283.jpg
  // Where was the logo in that image?
  const meta = await sharp("C:/Users/HP/.gemini/antigravity/brain/1865355f-e74f-4a79-9c11-16863f3f9c92/.user_uploaded/media_1789883500283.jpg").metadata();
  console.log("Hero reference image:", meta.width, meta.height);
}

inspect().catch(console.error);
