"""
Process 10 Shutterstock service images from Downloads:
center-crop to 3:4 portrait, resize to max 900px wide, optimize
JPEG quality 85, save to assets/images/ as service-*.jpg
(overwriting the existing Pexels placeholders).
"""
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Pillow is required: pip install Pillow")
    sys.exit(1)

DL = Path(r"C:\Users\brees\Downloads")
OUT = Path(r"C:\Users\brees\Claude Projects\Cement Creek\assets\images")

# (shutterstock_id, out_name, description)
JOBS = [
    (2500566053, "service-happy-visits.jpg",  "sick dog waiting at vet"),
    (2625252293, "service-wellness.jpg",      "cat with stethoscope"),
    (2756141423, "service-dentistry.jpg",     "vet checking labrador teeth"),
    (2702115105, "service-surgery.jpg",       "tabby cat in protective cone"),
    (1862494033, "service-diagnostics.jpg",   "x-ray of cat"),
    (2352097721, "service-laser.jpg",         "dog during laser therapy"),
    (2672073065, "service-urgent-care.jpg",   "kitten recovering at clinic"),
    (2727609453, "service-microchip.jpg",     "french bulldog being held"),
    (2350509509, "service-end-of-life.jpg",   "hand holding dog paw"),
    (2753867353, "service-pharmacy.jpg",      "pit bull receiving treat"),
]

TARGET_RATIO = 3 / 4   # portrait
TARGET_W = 900
QUALITY = 85

ok = 0
fail = 0
for sid, out_name, desc in JOBS:
    src = DL / f"shutterstock_{sid}.jpg"
    print(f"\n=== {out_name}  ({desc}) ===")
    if not src.exists():
        print(f"  MISSING: {src}")
        fail += 1
        continue

    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        w, h = im.size
        src_ratio = w / h
        print(f"  source {w}x{h} ({src.stat().st_size:,} bytes)")

        # Center-crop to TARGET_RATIO (3:4 portrait)
        if src_ratio > TARGET_RATIO:
            new_w = int(h * TARGET_RATIO)
            x0 = (w - new_w) // 2
            box = (x0, 0, x0 + new_w, h)
        else:
            new_h = int(w / TARGET_RATIO)
            y0 = (h - new_h) // 2
            box = (0, y0, w, y0 + new_h)
        im = im.crop(box)

        # Resize to TARGET_W
        if im.size[0] > TARGET_W:
            new_h = int(im.size[1] * (TARGET_W / im.size[0]))
            im = im.resize((TARGET_W, new_h), Image.LANCZOS)

        if im.mode != "RGB":
            im = im.convert("RGB")

        out_path = OUT / out_name
        im.save(out_path, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        print(f"  saved {out_path.name} {im.size} ({out_path.stat().st_size:,} bytes)")
        ok += 1

print(f"\n--- DONE: {ok} ok, {fail} failed ---")
