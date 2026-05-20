"""
One-shot script: decode the base64 from the Drive MCP tool result
files, write them as JPEGs into assets/images/, then optimize
(max 1600px wide, JPEG quality 85, strip metadata).
"""
import base64
import json
import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Pillow is required: pip install Pillow")
    sys.exit(1)

JOBS = [
    {
        "json_path": r"C:\Users\brees\.claude\projects\C--Users-brees\f9337a8b-c773-4373-9b46-113e63b2d703\tool-results\mcp-claude_ai_Google_Drive-download_file_content-1779299575296.txt",
        "out_name": "founders-portrait.jpg",
    },
    {
        "json_path": r"C:\Users\brees\.claude\projects\C--Users-brees\f9337a8b-c773-4373-9b46-113e63b2d703\tool-results\mcp-claude_ai_Google_Drive-download_file_content-1779299581255.txt",
        "out_name": "team-photo.jpg",
    },
]

OUT_DIR = Path(r"C:\Users\brees\Claude Projects\Cement Creek\assets\images")
OUT_DIR.mkdir(parents=True, exist_ok=True)

MAX_W = 1600
QUALITY = 85

for job in JOBS:
    print(f"\n=== {job['out_name']} ===")
    with open(job["json_path"], "r", encoding="utf-8") as f:
        payload = json.load(f)

    b64 = payload["content"]
    raw = base64.b64decode(b64)

    tmp_path = OUT_DIR / ("_tmp_" + job["out_name"])
    with open(tmp_path, "wb") as out:
        out.write(raw)

    # Open + optimize via Pillow
    with Image.open(tmp_path) as im:
        im = ImageOps.exif_transpose(im)  # respect EXIF rotation
        w, h = im.size
        print(f"original: {w}x{h}, {len(raw):,} bytes")

        if w > MAX_W:
            new_h = int(h * (MAX_W / w))
            im = im.resize((MAX_W, new_h), Image.LANCZOS)
            print(f"resized to: {MAX_W}x{new_h}")

        if im.mode != "RGB":
            im = im.convert("RGB")

        final_path = OUT_DIR / job["out_name"]
        im.save(final_path, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        print(f"saved: {final_path} ({final_path.stat().st_size:,} bytes)")

    tmp_path.unlink(missing_ok=True)

print("\nDone.")
