"""
Download Kara and Shawna's individual portraits from Google Sites,
optimize, and save to assets/images/.
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

OUT_DIR = Path(r"C:\Users\brees\Claude Projects\Cement Creek\assets\images")

JOBS = [
    (
        "https://lh3.googleusercontent.com/sitesv/AA5AbUAlOD9cYHLXfdBccN1ocd3Cq48tsaidiehnxvZXEJNxOK_lJljDdInlQNSrdjV8Hc9yoMtTMnnM30o88hwUdDGcV4MzAqCLngyQBdJw9O5GUe2YRXXYNTMOOYvhWeomr2krPEkzg1GTMgRv49Gzc5JIo3wgr4ql7G2BITRvPZVtET3oOFmF26FBfL39PaNAp71tORDw-KrFC-O7T3GgqLViyX7XOuytbI_h=w1280",
        "founder-kara.jpg",
        1200,
    ),
    (
        "https://lh3.googleusercontent.com/sitesv/AA5AbUCtBgz_l9CV2MagpsoP3aiDbj5F_qEup7z8ukxinY33GqU9Ugq2OoIzbFXNkxzyVVF2VezpPRsry7IUjbKFVr8IJdVNWZHRqDyHrqMT3FZe3pCKl4Jp4JowOI1NYvjvh0ALgiRqzdkzJy_RSrr_2AGZ0OWKhfYeuQrPY8ikYhWNS6oKw3V7lsWaTzbpA3GhXWtWKPCzeRtpn0t-DFOtQFnFjHMHjqdcWQAe=w1280",
        "founder-shawna.jpg",
        1200,
    ),
]

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/131.0.0.0 Safari/537.36"
    ),
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    "Referer": "https://sites.google.com/",
}

for url, out_name, max_w in JOBS:
    print(f"\n=== {out_name} ===")
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            raw = r.read()
    except Exception as e:
        print(f"  ERROR: {e}")
        continue
    print(f"  downloaded {len(raw):,} bytes")

    with Image.open(BytesIO(raw)) as im:
        im = ImageOps.exif_transpose(im)
        w, h = im.size
        print(f"  original {w}x{h}")
        if w > max_w:
            new_h = int(h * (max_w / w))
            im = im.resize((max_w, new_h), Image.LANCZOS)
            print(f"  resized to {max_w}x{new_h}")
        if im.mode != "RGB":
            im = im.convert("RGB")
        path = OUT_DIR / out_name
        im.save(path, "JPEG", quality=85, optimize=True, progressive=True)
        print(f"  saved {path.name} ({path.stat().st_size:,} bytes)")

print("\nDone.")
