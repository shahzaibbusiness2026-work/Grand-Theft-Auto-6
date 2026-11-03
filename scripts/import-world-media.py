"""Prepare reviewed Rockstar frames. Requires Pillow; use --ffmpeg for uncached frames."""
import argparse
import hashlib
import json
import shutil
import subprocess
import urllib.request
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ROWS = [
    ("/gta-6-world/animals-wildlife", "gta-6-alligator-pool-trailer-1", 1, 43, "An alligator beside a backyard swimming pool in GTA 6 Trailer 1.", "A trailer sighting does not establish animal interaction mechanics."),
    ("/gta-6-world/birds", "gta-6-flamingos-wetland-birds-trailer-1", 1, 21, "Flamingos fly and wade among other birds in a Leonida wetland in GTA 6 Trailer 1.", "Only visible birds are identified; no complete species list is inferred."),
    ("/gta-6-world/nature-environment", "gta-6-leonida-wetlands-sunset-trailer-1", 1, 20, "Birds fly above the sunlit Leonida wetlands in GTA 6 Trailer 1.", "The scene does not establish final map boundaries."),
    ("/gta-6-world/weather-climate", "gta-6-vice-city-beach-sunny-weather-trailer-1", 1, 23, "Beachgoers beneath a blue sky on Vice City beach in GTA 6 Trailer 1.", "Visible sunshine is not evidence of a particular weather simulation."),
    ("/radio", "gta-6-music-dj-nightclub-trailer-1", 1, 35, "A DJ performs above a nightclub dance floor in GTA 6 Trailer 1.", "This music scene does not identify an in-game radio station or its playlist."),
    ("/gta-6-world/in-game-brands-ads", "gta-6-store-signs-brands-trailer-1", 1, 70, "Shop signs and product displays behind Jason and Lucia in GTA 6 Trailer 1.", "Visible branding does not establish purchasable products or shop functions."),
    ("/gta-6-world/social-media-apps", "gta-6-social-media-car-clip-trailer-1", 1, 45, "An in-world social-media clip with an account name and comments in GTA 6 Trailer 1.", "A trailer overlay is not proof that its app is player-operable."),
    ("/gta-6-world/tv-shows-media", "gta-6-television-news-broadcast-trailer-1", 1, 65, "A television news broadcast with a mugshot and lower-third caption in GTA 6 Trailer 1.", "This visible broadcast does not establish a full television schedule."),
    ("/gta-6-world/restaurants-food", "gta-6-jason-lucia-bar-drinks-trailer-2", 2, 80, "Jason and Lucia sit at a bar with drinks in GTA 6 Trailer 2.", "A scene in a bar does not confirm a player-controlled dining mechanic."),
    ("/gta-6-world/hotels-motels", "gta-6-vice-city-buildings-palms-trailer-1", 1, 19, "High-rise buildings and palm trees in Vice City in GTA 6 Trailer 1.", "City architecture provides context; no building is identified here as a usable hotel."),
    ("/properties", "gta-6-jason-house-porch-trailer-2", 2, 20, "Jason stands outside a wooden house in GTA 6 Trailer 2.", "The scene does not establish property ownership or a purchasable safehouse."),
    ("/locations", "gta-6-nightclub-dj-dancefloor-trailer-1", 1, 35, "A DJ and crowded nightclub dance floor in GTA 6 Trailer 1.", "This is a visible nightlife scene, not a verified business feature list."),
    ("/gta-6-world/gangs-factions", "gta-6-characters-table-trailer-2", 2, 110, "Two characters stand by a table in a dim room in GTA 6 Trailer 2.", "The scene alone does not identify faction names or membership."),
    ("/gta-6-world/clothing-customization", "gta-6-lucia-outfit-bar-trailer-2", 2, 94, "Lucia dances in a bar wearing a casual outfit in GTA 6 Trailer 2.", "An outfit shown in a scene is not proof that players can select it."),
    ("/activities", "gta-6-lucia-boxing-trailer-2", 2, 115, "Lucia boxes with a partner in GTA 6 Trailer 2.", "A boxing scene does not by itself confirm a playable boxing minigame."),
    ("/easter-eggs", "gta-6-living-room-tv-details-trailer-2", 2, 130, "A living-room television, bottles and background details in GTA 6 Trailer 2.", "Background details are visible observations, not confirmed hidden missions."),
    ("catalog-vehicles", "gta-6-highway-vehicle-scene-trailer-2", 2, 35, "Traffic and roadside signs seen from a vehicle in GTA 6 Trailer 2.", "Related trailer scene; an exact image of this catalog model is not verified."),
    ("catalog-weapons", "gta-6-handgun-robbery-scene-trailer-1", 1, 70, "Jason and Lucia hold handguns during a shop robbery in GTA 6 Trailer 1.", "Related trailer scene; an exact image of this catalog model is not verified."),
]
PHOTOS = [
    ("/gta-6-world/mammals", "gta-6-deer-mammals-mount-kalaga-official", "Mount_Kalaga_National_Park_05.0_~vto-o2zxok.jpg", "Mount Kalaga National Park 05", "Deer gather beside a woodland stream in Rockstar's official GTA 6 Mount Kalaga screenshot.", "Visible deer do not establish hunting, tracking or taming mechanics."),
    ("/gta-6-world/marine-life", "gta-6-sea-turtle-fish-leonida-keys-official", "Leonida_Keys_04.0hce1rw1s8pd9.jpg", "Leonida Keys 04", "A sea turtle and fish swim beside a diver and a wreck in Rockstar's official GTA 6 screenshot.", "Visible sea life does not establish the full species list or interaction systems."),
]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--ffmpeg", default=shutil.which("ffmpeg"))
    parser.add_argument("--cache", type=Path, default=ROOT / "tmp/trailer-review")
    args = parser.parse_args()
    args.cache.mkdir(parents=True, exist_ok=True)
    destination = ROOT / "public/img/world-evidence"
    destination.mkdir(parents=True, exist_ok=True)
    records = {}

    def save(key, name, local, alt, note, source, source_url, kind, seconds=None):
        image = Image.open(local).convert("RGB")
        image = ImageOps.contain(image, (1280, 720), Image.Resampling.LANCZOS)
        target = destination / (name + ".webp")
        image.save(target, format="WEBP", quality=80, method=6)
        records[key] = {"src": "/img/world-evidence/" + target.name,
                        "alt": alt, "note": note, "width": image.width, "height": image.height,
                        "source": source, "sourceUrl": source_url, "kind": kind,
                        "credit": "Rockstar Games", "reviewedAt": "2026-11-03",
                        "sha256": hashlib.sha256(target.read_bytes()).hexdigest()}
        if seconds is not None: records[key]["seconds"] = seconds

    for key, name, trailer, seconds, alt, note in ROWS:
        local = args.cache / f"t{trailer}-{seconds:03}.jpg"
        source_url = f"https://media-rockstargames-com.akamaized.net/VI/downloads/videos/GTAVI_Trailer_{trailer}/GTAVI_Trailer_{trailer}.mp4"
        if not local.exists():
            if not args.ffmpeg: raise SystemExit("Provide --ffmpeg to extract uncached official frames.")
            subprocess.run([args.ffmpeg, "-hide_banner", "-loglevel", "error", "-ss", str(seconds),
                            "-i", source_url, "-frames:v", "1", "-vf", "scale=1280:-2",
                            "-threads", "2", "-q:v", "3", "-y", str(local)], check=True, timeout=90)
        save(key, name, local, alt, note, f"Trailer {trailer}",
             f"https://www.rockstargames.com/VI/trailer-{trailer}", "trailer", seconds)
        records[key]["originalUrl"] = source_url
    for key, name, filename, source, alt, note in PHOTOS:
        local = args.cache / filename
        url = "https://www.rockstargames.com/VI/_next/static/media/" + filename
        if not local.exists():
            local.write_bytes(urllib.request.urlopen(url, timeout=30).read())
        save(key, name, local, alt, note, source,
             "https://www.rockstargames.com/VI/media/screenshots", "screenshot")
        records[key]["originalUrl"] = url
    content = json.dumps(records, ensure_ascii=False, indent=2) + "\n"
    (ROOT / "src/lib/world-media-data.json").write_text(content, encoding="utf-8")
    (destination / "sources.json").write_text(content, encoding="utf-8")
    print(f"Prepared {len(records)} reviewed assets ({sum(p.stat().st_size for p in destination.glob('*.webp')):,} bytes).")


if __name__ == "__main__": main()
