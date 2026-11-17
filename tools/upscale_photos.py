"""
Full-HD photo upscaling for the Bizcom Legal site.

Uses EDSR (Enhanced Deep Super-Resolution, x4) through OpenCV's dnn_superres module.
EDSR is a reconstruction model: it sharpens and rebuilds edges/fine detail from the real
pixels instead of hallucinating new textures (unlike GAN upscalers / generative AI), so
faces, skin and fabrics keep looking like the original photograph.

Pipeline per photo (640x640 source):
  1. gentle JPEG-artefact clean-up (non-local means, very low strength)
  2. EDSR x4  -> 2560x2560
  3. very light unsharp mask for crisp edges at display size
  4. export 2560 / 1920 (Full HD) / 1280 / 800 px progressive JPEGs -> assets/img/

Setup (once):
  pip install opencv-contrib-python-headless
  model: tools/models/EDSR_x4.pb  (https://github.com/Saafke/EDSR_Tensorflow, models/EDSR_x4.pb)

Usage:  python tools/upscale_photos.py [name ...]
"""
import sys, time
from pathlib import Path
import cv2

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "assets", ROOT / "assets" / "img"
MODEL = ROOT / "tools" / "models" / "EDSR_x4.pb"
PHOTOS = ["commercial-law", "property-law", "family-law", "litigation", "wills-estates"]
WIDTHS = [2560, 1920, 1280, 800]
OUT.mkdir(exist_ok=True)

sr = cv2.dnn_superres.DnnSuperResImpl_create()
sr.readModel(str(MODEL))
sr.setModel("edsr", 4)


def process(name: str) -> None:
    t = time.time()
    src = ROOT / "assets" / "source" / f"{name}.png"
    img = cv2.imread(str(src if src.exists() else SRC / f"{name}.png"), cv2.IMREAD_COLOR)
    img = cv2.fastNlMeansDenoisingColored(img, None, 2, 2, 5, 15)          # remove JPEG blocking only
    big = sr.upsample(img)                                                   # 2560 x 2560
    blur = cv2.GaussianBlur(big, (0, 0), 1.2)
    big = cv2.addWeighted(big, 1.25, blur, -0.25, 0)                         # light unsharp mask
    for w in WIDTHS:
        im = big if w == big.shape[1] else cv2.resize(big, (w, w), interpolation=cv2.INTER_AREA)
        cv2.imwrite(str(OUT / f"{name}-{w}.jpg"), im,
                    [cv2.IMWRITE_JPEG_QUALITY, 86, cv2.IMWRITE_JPEG_PROGRESSIVE, 1, cv2.IMWRITE_JPEG_OPTIMIZE, 1])
    print(f"{name}: done in {time.time() - t:.0f}s -> " + ", ".join(f"{w}px" for w in WIDTHS), flush=True)


if __name__ == "__main__":
    for n in (sys.argv[1:] or PHOTOS):
        process(n)
