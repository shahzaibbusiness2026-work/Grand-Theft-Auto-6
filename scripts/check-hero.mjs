import sharp from "sharp";

async function checkHero() {
  // Let's examine media_1789883500283.jpg
  // In the approved hero image reference, what was on the left?
  // In turn 6: "first change the design of hero section with this" -> user uploaded media_1789883081079.jpg
  // In turn 7: "i want exactly same deisgn not as a background image"
  // In turn 8: "why are you not understanding it i said i want exactly the same design as in the image i want same hero section" -> user uploaded media_1789883500283.jpg
  // In turn 9: "make image hd its blurr"
  
  // Let's inspect media_1789883500283.jpg
  // In media_1789883500283.jpg, what is on the left?
  // Let's sample a grid of crops from media_1789883500283.jpg:
  // left: 20 to 450, top: 20 to 350
  const crop = await sharp("C:/Users/HP/.gemini/antigravity/brain/1865355f-e74f-4a79-9c11-16863f3f9c92/.user_uploaded/media_1789883500283.jpg")
    .extract({ left: 20, top: 20, width: 400, height: 350 })
    .toFile("public/img/hero-reference-left.jpg");
  console.log("Saved hero-reference-left.jpg");
}

checkHero().catch(console.error);
