const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".webp": "image/webp", ".avif": "image/avif",
  ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
};

/** Check declared type AND bytes; renaming an SVG/HTML file must not publish it. */
export function mediaUploadType(name: string, declaredType: string, bytes: Uint8Array): string | null {
  const extension = name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] || "";
  const type = TYPES[extension];
  if (!type || declaredType.toLowerCase() !== type) return null;
  const ascii = (start: number, length: number) => String.fromCharCode(...bytes.slice(start, start + length));
  const signature = (...expected: number[]) => expected.every((value, index) => bytes[index] === value);
  switch (type) {
    case "image/jpeg": return signature(0xff, 0xd8, 0xff) ? type : null;
    case "image/png": return signature(137, 80, 78, 71, 13, 10, 26, 10) ? type : null;
    case "image/gif": return /^(GIF87a|GIF89a)$/.test(ascii(0, 6)) ? type : null;
    case "image/webp": return ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP" ? type : null;
    case "video/webm": return signature(0x1a, 0x45, 0xdf, 0xa3) ? type : null;
    default: {
      if (bytes.length < 16 || ascii(4, 4) !== "ftyp") return null;
      const brands = [ascii(8, 4)];
      for (let offset = 16; offset + 4 <= bytes.length; offset += 4) brands.push(ascii(offset, 4));
      if (type === "image/avif") return brands.some(brand => brand === "avif" || brand === "avis") ? type : null;
      if (type === "video/quicktime") return brands.includes("qt  ") ? type : null;
      return brands.some(brand => /^(isom|iso[2-9]|mp4[12]|avc1|M4V |MSNV|dash)$/.test(brand)) ? type : null;
    }
  }
}
