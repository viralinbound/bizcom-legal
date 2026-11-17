"""
Process high-quality replacement photos (assets/source/<name>.webp, 1254px) into the site sizes.
Native 1254px detail -> Lanczos resize + gentle sharpening only (no AI upscaling needed).
Usage: python tools/process_new_photos.py [name ...]
"""
import sys
from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "assets" / "source", ROOT / "assets" / "img"
WIDTHS = [2560, 1920, 1280, 800]

for name in (sys.argv[1:] or [p.stem for p in SRC.glob("*.webp")]):
    f = next(x for x in (SRC / f"{name}.webp", SRC / f"{name}.png") if x.exists())
    im = Image.open(f).convert("RGB")
    for w in WIDTHS:
        r = im.resize((w, w), Image.LANCZOS)
        up = w / im.width
        r = r.filter(ImageFilter.UnsharpMask(radius=0.8 * max(up, 1), percent=55 if up > 1 else 30, threshold=2))
        r.save(OUT / f"{name}-{w}.jpg", "JPEG", quality=86, optimize=True, progressive=True, subsampling=0)
    print(name, "done", flush=True)
