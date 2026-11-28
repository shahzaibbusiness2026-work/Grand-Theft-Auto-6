"""Keep the Yanis basemap and remove the trailer stills and side panel from the actual files."""

import json
from pathlib import Path

from PIL import Image, ImageColor

ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((ROOT / "src/lib/community-map-assets.json").read_text())
OUTPUT = (ROOT / "public" / CONFIG["directory"].lstrip("/")).resolve()
TILE_SIZE = CONFIG["tileSize"]
OCEAN = ImageColor.getrgb(CONFIG["oceanColor"])


def visible_width(level: int, x: int) -> int:
    canvas_size = TILE_SIZE * 4 * 2 ** level
    return min(TILE_SIZE, max(0, int(canvas_size * CONFIG["artworkRight"]) - x * TILE_SIZE))


def scrub_tile(path: Path, level: int, x: int) -> None:
    width = visible_width(level, x)
    if width == TILE_SIZE:
        return
    if width == 0:
        path.unlink()
        return
    with Image.open(path) as source:
        tile = source.convert("RGB")
    tile.paste(OCEAN, (width, 0, TILE_SIZE, TILE_SIZE))
    tile.save(path, quality=94, optimize=True, subsampling=0)


def render_overview() -> None:
    canvas = Image.new("RGB", (4096, 4096), OCEAN)
    for tile_path in sorted((OUTPUT / "tiles/2").glob("2,*,*.jpg")):
        _, y, x = map(int, tile_path.stem.split(","))
        with Image.open(tile_path) as tile:
            canvas.paste(tile, (x * TILE_SIZE, y * TILE_SIZE))
    canvas.resize((1536, 1536), Image.Resampling.LANCZOS).save(
        OUTPUT / "overview.webp", quality=84, method=6,
    )


def update_manifest() -> None:
    path = OUTPUT / "source.json"
    manifest = json.loads(path.read_text(encoding="utf-8"))
    manifest["cleanArtworkVersion"] = CONFIG["artworkVersion"]
    manifest["changes"] = (
        "Yanis v18 map tiles at zoom levels 0–5. Removed the side panel, "
        "including trailer and screenshot thumbnails, from the served artwork "
        "and regenerated the overview. Positions are community estimates."
    )
    path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    if not OUTPUT.is_relative_to((ROOT / "public/maps").resolve()):
        raise SystemExit("The artwork directory must be inside this repository's public/maps.")
    for tile_path in (OUTPUT / "tiles").glob("*/*.jpg"):
        if not tile_path.resolve().is_relative_to(OUTPUT):
            raise SystemExit("Unexpected tile path outside the artwork directory.")
        level, _, x = map(int, tile_path.stem.split(","))
        if str(level) != tile_path.parent.name:
            raise SystemExit(f"Tile level does not match {tile_path.name}")
        scrub_tile(tile_path, level, x)
    render_overview()
    update_manifest()
