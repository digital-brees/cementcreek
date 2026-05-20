"""
Download the googleusercontent image, center-crop it to a wide
cinematic aspect (21:9), and save as assets/images/closer-bg.jpg
optimized for web use as a section background.
"""
import sys
import urllib.request
from io import BytesIO
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Pillow is required: pip install Pillow")
    sys.exit(1)

URL = (
    "https://lh3.googleusercontent.com/sitesv/"
    "AA5AbUA9IP48B_l3Y4lTK7j7gNECH6wADezA64HGvq-N6Bc1TmEDc2cjjQjwXRw_"
    "EGERMljydE0nyWIuP1WgjV99H0Ta7G7YjUXApnZ0M0zC9akluhGeoUGrWK_9h49"
    "zgfvQ4ckwETNTRk1My-PAPxKv55VNq0mFSKtkP6losEwv3JQV2Q8tTKmWqLTWEI8"
    "=w16383"  # original size param
)

OUT_DIR = Path(r"C:\Users\brees\Claude Projects\Cement Creek\assets\images")
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_PATH = OUT_DIR / "closer-bg.jpg"

# Closer section background — want a wide cinematic crop.
TARGET_W = 1920
TARGET_H = 820       # 1920 / 820 ≈ 2.34 (between 21:9 and 16:7)
QUALITY = 85

print(f"downloading {URL[:80]}...")
req = urllib.request.Request(
    URL,
    headers={
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/131.0.0.0 Safari/537.36"
        ),
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://sites.google.com/",
    },
)
with urllib.request.urlopen(req) as resp:
    raw = resp.read()
print(f"downloaded {len(raw):,} bytes")

with Image.open(BytesIO(raw)) as im:
    im = ImageOps.exif_transpose(im)
    w, h = im.size
    print(f"original size: {w}x{h}")

    # Center crop to target aspect ratio
    target_ratio = TARGET_W / TARGET_H
    src_ratio = w / h

    if src_ratio > target_ratio:
        # source too wide — crop sides
        new_w = int(h * target_ratio)
        x0 = (w - new_w) // 2
        crop_box = (x0, 0, x0 + new_w, h)
    else:
        # source too tall — crop top/bottom
        new_h = int(w / target_ratio)
        y0 = (h - new_h) // 2
        crop_box = (0, y0, w, y0 + new_h)

    cropped = im.crop(crop_box)
    print(f"cropped to: {cropped.size}")

    # Resize down to target
    if cropped.size[0] > TARGET_W:
        cropped = cropped.resize((TARGET_W, TARGET_H), Image.LANCZOS)
        print(f"resized to: {cropped.size}")

    if cropped.mode != "RGB":
        cropped = cropped.convert("RGB")

    cropped.save(OUT_PATH, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    print(f"saved: {OUT_PATH} ({OUT_PATH.stat().st_size:,} bytes)")
