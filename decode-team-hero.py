"""
Decode the base64 from the Drive MCP tool result file, crop to a
wide cinematic ratio (~21:9 / 1920x820) for the team page hero,
optimize, and save as assets/images/team-page-hero.jpg.
"""
import base64
import json
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Pillow is required: pip install Pillow")
    sys.exit(1)

JSON_PATH = Path(r"C:\Users\brees\.claude\projects\C--Users-brees\f9337a8b-c773-4373-9b46-113e63b2d703\tool-results\mcp-claude_ai_Google_Drive-download_file_content-1779312864418.txt")
OUT = Path(r"C:\Users\brees\Claude Projects\Cement Creek\assets\images\team-page-hero.jpg")

TARGET_W = 1920
TARGET_H = 820   # ~2.34 aspect — wide cinematic banner
QUALITY = 85

with open(JSON_PATH, "r", encoding="utf-8") as f:
    payload = json.load(f)
raw = base64.b64decode(payload["content"])
print(f"decoded {len(raw):,} bytes")

from io import BytesIO
with Image.open(BytesIO(raw)) as im:
    im = ImageOps.exif_transpose(im)
    w, h = im.size
    print(f"original {w}x{h}")

    target_ratio = TARGET_W / TARGET_H
    src_ratio = w / h
    if src_ratio > target_ratio:
        new_w = int(h * target_ratio)
        x0 = (w - new_w) // 2
        box = (x0, 0, x0 + new_w, h)
    else:
        new_h = int(w / target_ratio)
        y0 = (h - new_h) // 2
        box = (0, y0, w, y0 + new_h)
    im = im.crop(box)
    print(f"cropped to {im.size}")

    if im.size[0] > TARGET_W:
        im = im.resize((TARGET_W, TARGET_H), Image.LANCZOS)
        print(f"resized to {im.size}")

    if im.mode != "RGB":
        im = im.convert("RGB")

    im.save(OUT, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    print(f"saved {OUT.name} ({OUT.stat().st_size:,} bytes)")
