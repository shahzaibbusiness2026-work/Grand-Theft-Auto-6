"use client";
/** Canvas re-encoding strips source metadata and avoids a third-party upload. */
export async function compressPortfolioPhoto(
  file: File,
  avatar = false,
): Promise<string> {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 10_000_000
  )
    throw new Error("Choose a JPEG, PNG or WebP photo under 10 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    let side = avatar ? 240 : 960;
    const limit = avatar ? 30_000 : 90_000;
    for (let attempt = 0; attempt < 6; attempt++) {
      const ratio = Math.min(
        1,
        side / Math.max(image.naturalWidth, image.naturalHeight),
      );
      canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
      const context = canvas.getContext("2d");
      if (!context)
        throw new Error("Photo processing is unavailable in this browser.");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const result = canvas.toDataURL("image/jpeg", 0.75 - attempt * 0.08);
      if (result.length <= limit) return result;
      side = Math.round(side * 0.8);
    }
    throw new Error(
      "This photo could not fit the workspace limit. Choose a smaller image.",
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
