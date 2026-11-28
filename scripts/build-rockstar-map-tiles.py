"""Build the Leonida reference tiles from Rockstar's printable JPEG."""

from hashlib import sha256
from io import BytesIO
import argparse
import json
from pathlib import Path

from PIL import Image, ImageCms


SOURCE_URL = "https://media-rockstargames-com.akamaized.net/VI/downloads/artwork_wallpapers/Leonida_Map_Poster_Printable.zip"
SOURCE_SHA256 = "7ef9038e6e5ba00d7186dd96bf94d725e139d01d2f3469635ec2c2d8954ceaa2"
TILE_SIZE = 256
PRINT_TRIM = 200
OUTPUT_DIR = Path(__file__).resolve().parents[1] / "public/maps/rockstar-official"


def make_canvas(map_image, side):
    width = round(side * map_image.width / map_image.height)
    left = (side - width) // 2
    water = map_image.getpixel((0, 100))
    canvas = Image.new("RGB", (side, side), water)
    canvas.paste(map_image.resize((width, side), Image.Resampling.LANCZOS), (left, 0))
    return canvas, left, width


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("printable_jpeg", type=Path)
    args = parser.parse_args()
    source_bytes = args.printable_jpeg.read_bytes()
    if sha256(source_bytes).hexdigest() != SOURCE_SHA256:
        raise SystemExit("The JPEG does not match the reviewed Rockstar print file.")

    with Image.open(BytesIO(source_bytes)) as source:
        source_size = list(source.size)
        trimmed = source.crop((
            PRINT_TRIM, PRINT_TRIM,
            source.width - PRINT_TRIM, source.height - PRINT_TRIM,
        ))
        map_image = ImageCms.profileToProfile(
            trimmed, ImageCms.ImageCmsProfile(BytesIO(source.info["icc_profile"])),
            ImageCms.createProfile("sRGB"), outputMode="RGB",
        )

    overview, _, _ = make_canvas(map_image, 1536)
    overview.save(OUTPUT_DIR / "overview.webp", quality=88, method=6)

    ranges = {}
    for level in range(4):
        tile_count = 4 * 2 ** level
        canvas, left, width = make_canvas(map_image, tile_count * TILE_SIZE)
        x_first = left // TILE_SIZE
        x_last = (left + width - 1) // TILE_SIZE
        ranges[level] = [x_first, 0, x_last, tile_count - 1]
        level_dir = OUTPUT_DIR / "tiles" / str(level)
        level_dir.mkdir(parents=True, exist_ok=True)
        for y in range(tile_count):
            for x in range(x_first, x_last + 1):
                left_px, top_px = x * TILE_SIZE, y * TILE_SIZE
                tile = canvas.crop((left_px, top_px, left_px + TILE_SIZE, top_px + TILE_SIZE))
                tile.save(level_dir / f"{level},{y},{x}.jpg", quality=84, optimize=True)

    manifest = {
        "source": SOURCE_URL,
        "credit": "Rockstar Games",
        "sourceSha256": SOURCE_SHA256,
        "sourceSize": source_size,
        "nativeHeight": map_image.height,
        "tileSize": TILE_SIZE,
        "ranges": ranges,
        "processing": "Trimmed the white print margin, converted the embedded print profile to sRGB, and fitted the map in a square without changing aspect ratio.",
    }
    (OUTPUT_DIR / "source.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
