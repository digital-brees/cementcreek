"""
Download 16 Pexels images, center-crop to the right aspect ratio
for each spot (square for tab panels, 3:4 portrait for service
cards), resize to a sensible max, and save as optimized JPEGs.
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
OUT_DIR.mkdir(parents=True, exist_ok=True)

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/131.0.0.0 Safari/537.36"
    )
}

def pexels_url(photo_id, w=1600):
    return (
        f"https://images.pexels.com/photos/{photo_id}/"
        f"pexels-photo-{photo_id}.jpeg?auto=compress&cs=tinysrgb&w={w}"
    )

def fetch_and_process(photo_id, out_name, target_ratio, max_w):
    print(f"\n=== {out_name}  (Pexels {photo_id}) ===")
    url = pexels_url(photo_id, w=max(max_w, 1600))
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            raw = r.read()
    except Exception as e:
        print(f"  ERROR downloading: {e}")
        return False
    print(f"  downloaded {len(raw):,} bytes")

    try:
        with Image.open(BytesIO(raw)) as im:
            im = ImageOps.exif_transpose(im)
            w, h = im.size
            src_ratio = w / h

            # Center-crop to target aspect ratio
            if src_ratio > target_ratio:
                new_w = int(h * target_ratio)
                x0 = (w - new_w) // 2
                box = (x0, 0, x0 + new_w, h)
            else:
                new_h = int(w / target_ratio)
                y0 = (h - new_h) // 2
                box = (0, y0, w, y0 + new_h)
            im = im.crop(box)

            # Resize down to max_w (preserve aspect)
            if im.size[0] > max_w:
                new_h = int(im.size[1] * (max_w / im.size[0]))
                im = im.resize((max_w, new_h), Image.LANCZOS)

            if im.mode != "RGB":
                im = im.convert("RGB")

            path = OUT_DIR / out_name
            im.save(path, "JPEG", quality=85, optimize=True, progressive=True)
            print(f"  saved: {path.name}  {im.size}  ({path.stat().st_size:,} bytes)")
            return True
    except Exception as e:
        print(f"  ERROR processing: {e}")
        return False


# Tab panels — square 1:1, max 1200px
TAB_PANELS = [
    (8498533,  "tab-approach.jpg"),    # woman + dog heartfelt
    (9291130,  "tab-care.jpg"),        # golden retriever being petted
    (12401261, "tab-handling.jpg"),    # black dog relaxing
    (30389394, "tab-cats.jpg"),        # serene ginger cat sleeping
    (994174,   "tab-visits.jpg"),      # playful corgi looking up
    (6766212,  "tab-goodbyes.jpg"),    # dachshund resting peacefully
]

# Service cards — portrait 3:4, max 900px wide
SERVICES = [
    (7643253,  "service-happy-visits.jpg"),  # golden puppy in field
    (23995714, "service-wellness.jpg"),      # german shepherd happy
    (662417,   "service-dentistry.jpg"),     # golden tongue out
    (19217009, "service-surgery.jpg"),       # surgical tools
    (7088525,  "service-diagnostics.jpg"),   # ultrasound printouts
    (15576306, "service-laser.jpg"),         # husky in blanket
    (14393470, "service-urgent-care.jpg"),   # dog close-up indoors
    (6646466,  "service-microchip.jpg"),     # kitten in hands
    (16377487, "service-end-of-life.jpg"),   # old dog peaceful
    (14744699, "service-pharmacy.jpg"),      # pill bottle capsules
]

ok = 0
fail = 0

for pid, name in TAB_PANELS:
    if fetch_and_process(pid, name, target_ratio=1.0, max_w=1200):
        ok += 1
    else:
        fail += 1

for pid, name in SERVICES:
    if fetch_and_process(pid, name, target_ratio=3/4, max_w=900):
        ok += 1
    else:
        fail += 1

print(f"\n--- DONE: {ok} ok, {fail} failed ---")
