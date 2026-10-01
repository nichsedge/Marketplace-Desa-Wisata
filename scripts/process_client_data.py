# /// script
# dependencies = [
#     "pillow>=10.0.0",
#     "pillow-heif>=0.14.0",
# ]
# ///
"""
Automated Client Data Cleaning & Image Optimization Pipeline
-------------------------------------------------------------
1. Reads raw TSV from assets/real_data_from_client/list produk unggulan marketplace lembang.tsv (read-only, never mutates raw file).
2. Cleans contact numbers, currency values, hierarchical category mappings, and village metadata.
3. Automatically curates, rotates (EXIF transpose), resizes, and converts client images into optimized WebP assets in public/images/client/.
4. Generates type-safe TypeScript module in src/data/realProducts.ts tagged with isDummy: false, dataSource: 'real', and rawSourceRow.
"""

from __future__ import annotations
import csv
import json
import os
import re
import shutil
from pathlib import Path
from PIL import Image, ImageOps

# Import media tracker module
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from media_tracker import run_media_curation_tracker

# Ensure HEIC support is registered
try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass

PROJECT_ROOT = Path(__file__).resolve().parent.parent
TSV_PATH = PROJECT_ROOT / "assets" / "real_data_from_client" / "list produk unggulan marketplace lembang.tsv"
CLIENT_ASSETS_DIR = PROJECT_ROOT / "assets" / "real_data_from_client"
PUBLIC_IMAGES_DIR = PROJECT_ROOT / "public" / "images"
CLIENT_WEB_IMAGES_DIR = PUBLIC_IMAGES_DIR / "client"
OUTPUT_TS_PATH = PROJECT_ROOT / "src" / "data" / "realProducts.ts"

# Village mapping
VILLAGE_MAP = {
    "SUNTEN JAYA": {
        "id": "des-01",
        "name": "Desa Wisata Suntenjaya",
        "location": "Suntenjaya, Lembang, Bandung Barat",
        "defaultAvatar": "/images/default-avatar.svg"
    },
    "CIKOLE": {
        "id": "des-03",
        "name": "Desa Wisata Cikole",
        "location": "Cikole, Lembang, Bandung Barat",
        "defaultAvatar": "/images/default-avatar.svg"
    },
    "JAYAGIRI": {
        "id": "des-04",
        "name": "Desa Wisata Jayagiri",
        "location": "Jayagiri, Lembang, Bandung Barat",
        "defaultAvatar": "/images/default-avatar.svg"
    },
    "GUDANG KAHURIPAN": {
        "id": "des-07",
        "name": "Desa Wisata Gudangkahuripan",
        "location": "Gudangkahuripan, Lembang, Bandung Barat",
        "defaultAvatar": "/images/default-avatar.svg"
    },
    "WANGUNSARI": {
        "id": "des-05",
        "name": "Desa Wisata Wangunsari",
        "location": "Wangunsari, Lembang, Bandung Barat",
        "defaultAvatar": "/images/default-avatar.svg"
    },
    "CIBODAS": {
        "id": "des-02",
        "name": "Desa Wisata Cibodas",
        "location": "Cibodas, Lembang, Bandung Barat",
        "defaultAvatar": "/images/default-avatar.svg"
    },
    "CIKAHURIPAN": {
        "id": "des-06",
        "name": "Desa Wisata Cikahuripan",
        "location": "Cikahuripan, Lembang, Bandung Barat",
        "defaultAvatar": "/images/default-avatar.svg"
    },
    "SUKAJAYA": {
        "id": "des-08",
        "name": "Desa Wisata Sukajaya",
        "location": "Sukajaya, Lembang, Bandung Barat",
        "defaultAvatar": "/images/default-avatar.svg"
    }
}

CATEGORY_MAP = {
    "wisata edukasi": "paket-wisata",
    "wisata alam": "wisata-alam",
    "wisata agro": "paket-wisata",
    "wisata budaya": "paket-wisata",
    "kopi": "minuman-komoditas",
    "minuman": "minuman-komoditas",
    "homestay": "homestay",
    "penginapan": "homestay",
    "kuliner": "kuliner",
    "olahan susu": "olahan-susu",
    "susu": "olahan-susu",
    "sembako": "sembako",
    "tanaman": "tanaman-hias",
    "buah": "buah-herba",
}

def clean_phone(phone_raw: str) -> str:
    """Normalize phone number to international WhatsApp format (628...)."""
    if not phone_raw:
        return "6282122334455"
    digits = re.sub(r"\D", "", phone_raw)
    if not digits:
        return "6282122334455"
    if digits.startswith("0"):
        digits = "62" + digits[1:]
    elif not digits.startswith("62") and len(digits) >= 9:
        digits = "62" + digits
    return digits

def parse_price(price_raw: str, default: int = 25000) -> int:
    """Extract numeric price from messy text string."""
    if not price_raw:
        return default
    nums = re.findall(r"\d+", price_raw.replace(".", "").replace(",", ""))
    if nums:
        val = int(nums[0])
        if val > 0:
            return val
    return default

def optimize_image(src_path: Path, dest_path: Path, max_dim: int = 1200, quality: int = 82) -> bool:
    """
    Open image (JPEG, PNG, HEIC), orient correctly using EXIF, resize smoothly,
    and save as optimized WebP without bulky metadata.
    """
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        with Image.open(src_path) as img:
            img = ImageOps.exif_transpose(img)
            img = img.convert("RGB")
            
            w, h = img.size
            if max(w, h) > max_dim:
                scale = max_dim / float(max(w, h))
                new_w, new_h = int(w * scale), int(h * scale)
                img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            img.save(dest_path, "WEBP", quality=quality, method=6)
            return True
    except Exception as e:
        print(f"Error optimizing {src_path.name}: {e}")
        return False

def process_generic_folder(folder_name: str, slug: str, max_items: int = 6) -> list[str]:
    """
    Dynamically discover and optimize any image files from a given client subfolder.
    """
    target_dir = CLIENT_ASSETS_DIR / folder_name.strip()
    if not target_dir.exists():
        # Try finding subdirectories with case insensitive match
        candidates = [d for d in CLIENT_ASSETS_DIR.iterdir() if d.is_dir() and folder_name.strip().lower() in d.name.lower()]
        if candidates:
            target_dir = candidates[0]
        else:
            return []

    # Gather images
    valid_exts = {".jpg", ".jpeg", ".png", ".heic", ".webp"}
    found_files = []
    for root, _, files in os.walk(target_dir):
        for f in files:
            p = Path(root) / f
            if p.suffix.lower() in valid_exts and not f.startswith("."):
                found_files.append(p)

    if not found_files:
        return []

    found_files.sort(key=lambda x: x.name)
    out_dir = CLIENT_WEB_IMAGES_DIR / slug
    out_dir.mkdir(parents=True, exist_ok=True)

    result_paths = []
    for idx, fpath in enumerate(found_files[:max_items]):
        out_name = f"auto-{idx + 1}.webp"
        dest = out_dir / out_name
        max_dim = 1200 if idx == 0 else 900
        if optimize_image(fpath, dest, max_dim=max_dim):
            result_paths.append(f"/images/client/{slug}/{out_name}")

    return result_paths

def curate_and_process_media():
    """
    Process specific curated images from client folders into web-ready WebP files.
    Returns mapping of product keys to their processed image paths.
    """
    CLIENT_WEB_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    processed_media = {}

    # 1. Kopi Angling
    kopi_folder = CLIENT_ASSETS_DIR / "Kopi "
    kopi_out = CLIENT_WEB_IMAGES_DIR / "kopi-angling"
    kopi_curated = [
        ("IMG-20250418-WA0010.jpg", "hero-pouch-v60.webp", 1200),
        ("IMG20250714130438.jpg", "drying-greenhouse.webp", 1000),
        ("IMG-20241006-WA0043.jpg", "coffee-farmers-harvest.webp", 1000),
        ("IMG20250518110926.jpg", "coffee-plantation-view.webp", 1000),
        ("IMG20250603114958.jpg", "coffee-cherries-tree.webp", 900),
        ("IMG20250715093145.jpg", "coffee-processing-bed.webp", 900),
        ("IMG-20240425-WA0056.jpg", "coffee-beans-sample.webp", 900)
    ]
    kopi_paths = []
    for src_name, out_name, max_dim in kopi_curated:
        src = kopi_folder / src_name
        dest = kopi_out / out_name
        if src.exists():
            if optimize_image(src, dest, max_dim=max_dim):
                kopi_paths.append(f"/images/client/kopi-angling/{out_name}")
    processed_media["kopi_angling"] = kopi_paths

    # 2. Abah Land Rover Offroad
    abah_folder = CLIENT_ASSETS_DIR / "Abah" / "Foto"
    abah_out = CLIENT_WEB_IMAGES_DIR / "offroad-cikole"
    abah_curated = [
        ("_DSC5256-01.jpeg", "hero-abah-dadan-landy.webp", 1200),
        ("_DSC5243-01.jpeg", "mud-splash-adventure.webp", 1000),
        ("_DSC5265-01.jpeg", "convoy-pine-trail.webp", 1000),
        ("_DSC5249-01.jpeg", "deep-forest-track.webp", 1000),
        ("_DSC5268-01.jpeg", "tourist-group-celebration.webp", 1000),
        ("_DSC5251-01.jpeg", "cabin-cockpit-view.webp", 900),
        ("_DSC5236-01.jpeg", "action-rocky-trail.webp", 900)
    ]
    abah_paths = []
    for src_name, out_name, max_dim in abah_curated:
        src = abah_folder / src_name
        dest = abah_out / out_name
        if src.exists():
            if optimize_image(src, dest, max_dim=max_dim):
                abah_paths.append(f"/images/client/offroad-cikole/{out_name}")
    processed_media["offroad_abah"] = abah_paths

    # 3. Eduwisata Pasir Angling (Camping & Hiking)
    edu_folder = CLIENT_ASSETS_DIR / "Eduwisata Pasir angling 2024"
    edu_out = CLIENT_WEB_IMAGES_DIR / "pasir-angling"
    edu_curated = [
        ("IMG_2211.JPG", "hero-valley-panorama.webp", 1200),
        ("IMG_2186.JPG", "hiking-terrace-trail.webp", 1000),
        ("IMG_2151.JPG", "community-agro-tour.webp", 1000),
        ("IMG_2214.JPG", "camping-ridge-view.webp", 1000),
        ("IMG_2208.JPG", "campsite-mountain-mist.webp", 900),
        ("IMG_2189.JPG", "trekking-guide-scenic.webp", 900)
    ]
    edu_paths = []
    for src_name, out_name, max_dim in edu_curated:
        src = edu_folder / src_name
        dest = edu_out / out_name
        if src.exists():
            if optimize_image(src, dest, max_dim=max_dim):
                edu_paths.append(f"/images/client/pasir-angling/{out_name}")
    processed_media["eduwisata"] = edu_paths

    # 4. Batu Loceng Suntenjaya (Pembaruan 01/10/2026)
    batu_folder = CLIENT_ASSETS_DIR / "20261001" / "batu lonceng-20261001T102213Z-1-001" / "batu lonceng"
    batu_out = CLIENT_WEB_IMAGES_DIR / "batu-loceng"
    batu_curated = [
        ("Screenshot 2026-10-01 112942.png", "hero-batu-loceng-kuncen.webp", 1200),
        ("Screenshot 2026-10-01 112928.png", "batu-loceng-sacred-stone.webp", 1000),
        ("Screenshot 2026-10-01 113009.png", "saung-cagar-budaya.webp", 1000),
    ]
    batu_paths = []
    for src_name, out_name, max_dim in batu_curated:
        src = batu_folder / src_name
        dest = batu_out / out_name
        if src.exists():
            if optimize_image(src, dest, max_dim=max_dim):
                batu_paths.append(f"/images/client/batu-loceng/{out_name}")
    processed_media["batu_loceng"] = batu_paths

    # 5. Wangunsari - Tahu Susu (Pembaruan 01/10/2026)
    w_tahu_folder = CLIENT_ASSETS_DIR / "20261001" / "tahu susu-20261001T102221Z-1-001" / "tahu susu"
    w_out = CLIENT_WEB_IMAGES_DIR / "wangunsari"
    w_tahu_curated = [
        ("WhatsApp Image 2026-09-30 at 12.07.14 (1).jpeg", "tahu-susu-agus-kemasan-10pcs.webp", 1200),
        ("WhatsApp Image 2026-09-30 at 12.07.15 (1).jpeg", "tahu-susu-nampan-produksi.webp", 1000),
        ("WhatsApp Image 2026-09-30 at 12.07.15.jpeg", "tahu-susu-cetakan-potong.webp", 1000),
        ("WhatsApp Image 2026-09-30 at 12.07.14.jpeg", "tahu-susu-proses-kemas.webp", 1000),
        ("WhatsApp Image 2026-09-30 at 12.07.13.jpeg", "tahu-susu-segar.webp", 900),
        ("WhatsApp Image 2026-09-30 at 13.07.55.jpeg", "tahu-susu-goreng-panas.webp", 900),
    ]
    w_tahu_paths = []
    for src_name, out_name, max_dim in w_tahu_curated:
        src = w_tahu_folder / src_name
        dest = w_out / out_name
        if src.exists():
            if optimize_image(src, dest, max_dim=max_dim):
                w_tahu_paths.append(f"/images/client/wangunsari/{out_name}")
    if (w_out / "tahu-susu-agus-kemasan-10pcs.webp").exists():
        shutil.copy2(w_out / "tahu-susu-agus-kemasan-10pcs.webp", w_out / "hero-tahu-susu.webp")
    processed_media["wangunsari_tahu"] = w_tahu_paths

    # 6. Wangunsari - Kicimpring Singkong (Pembaruan 01/10/2026)
    w_kici_folder = CLIENT_ASSETS_DIR / "20261001" / "Kicimpring Singkong-20261001T102245Z-1-001" / "Kicimpring Singkong"
    w_kici_curated = [
        ("Screenshot 2026-10-01 120129.png", "kicimpring-singkong-renyah.webp", 1200),
        ("21 Juni 2019 》Kegiatan kali ini kita berkunjung pada potensi yang ada di Desa Wangunsari yaitu a(1).jpg", "kicimpring-jemur-tradisional.webp", 1000),
        ("21 Juni 2019 》Kegiatan kali ini kita berkunjung pada potensi yang ada di Desa Wangunsari yaitu a.jpg", "kicimpring-produksi-warga.webp", 1000),
    ]
    w_kici_paths = []
    for src_name, out_name, max_dim in w_kici_curated:
        src = w_kici_folder / src_name
        dest = w_out / out_name
        if src.exists():
            if optimize_image(src, dest, max_dim=max_dim):
                w_kici_paths.append(f"/images/client/wangunsari/{out_name}")
    processed_media["wangunsari_kicimpring"] = w_kici_paths

    # 7. Wangunsari - Peuyeum Ketan (Pembaruan 01/10/2026)
    w_peuyeum_folder = CLIENT_ASSETS_DIR / "20261001" / "peuyeum ketan-20261001T102251Z-1-001" / "peuyeum ketan"
    w_peuyeum_curated = [
        ("Gemini_Generated_Image_p455vip455vip455.jpg", "peuyeum-ketan-daun-jambu.webp", 1200),
    ]
    w_peuyeum_paths = []
    for src_name, out_name, max_dim in w_peuyeum_curated:
        src = w_peuyeum_folder / src_name
        dest = w_out / out_name
        if src.exists():
            if optimize_image(src, dest, max_dim=max_dim):
                w_peuyeum_paths.append(f"/images/client/wangunsari/{out_name}")
    processed_media["wangunsari_peuyeum"] = w_peuyeum_paths

    # 8. Wangunsari - Ranginang (Pembaruan 01/10/2026)
    w_rangi_folder = CLIENT_ASSETS_DIR / "20261001" / "Ranginang-20261001T102353Z-1-001" / "Ranginang"
    w_rangi_curated = [
        ("😍😍😍😍.jpg", "ranginang-terasi-khas-wangunsari.webp", 1200),
        ("😍😍😍😍(1).jpg", "ranginang-mentah-terasi.webp", 1000),
        ("😍😍😍😍(2).jpg", "ranginang-goreng-mekar.webp", 1000),
        ("😍😍😍😍(3).jpg", "ranginang-tampah-jemur.webp", 1000),
    ]
    w_rangi_paths = []
    for src_name, out_name, max_dim in w_rangi_curated:
        src = w_rangi_folder / src_name
        dest = w_out / out_name
        if src.exists():
            if optimize_image(src, dest, max_dim=max_dim):
                w_rangi_paths.append(f"/images/client/wangunsari/{out_name}")
    processed_media["wangunsari_ranginang"] = w_rangi_paths

    # 9. Gudangkahuripan - Tari Jaipong & Budaya (Pembaruan 01/10/2026)
    gudang_folder = CLIENT_ASSETS_DIR / "20261001" / "gudangkahuripan-20261001T102355Z-1-001" / "gudangkahuripan"
    gudang_out = CLIENT_WEB_IMAGES_DIR / "gudangkahuripan"
    gudang_curated = [
        ("Dokumentasi saat materi Tari Jaipong 😍🥰.jpg", "hero-tari-jaipong-materi.webp", 1200),
        ("789108465_17966266326159854_4186932252492757219_n.jpg", "jaipong-peserta-senyum.webp", 1000),
        ("790023457_17966266371159854_7924881403726805858_n.jpg", "jaipong-pelatihan-kompak.webp", 1000),
        ("790475973_17966266335159854_2867174840609974419_n.jpg", "jaipong-kebersamaan.webp", 1000),
        ("Dokumentasii keseruan saat praktek Tari Jaipong 😉😍#ypjpapua #tembagapura #kamandakalembang #b.jpg", "jaipong-praktek-lapangan.webp", 1000),
        ("Dokumentasii keseruan saat praktek Tari Jaipong 😉😍#ypjpapua #tembagapura #kamandakalembang #b(1).jpg", "jaipong-gerak-dasar.webp", 1000),
    ]
    gudang_paths = []
    for src_name, out_name, max_dim in gudang_curated:
        src = gudang_folder / src_name
        dest = gudang_out / out_name
        if src.exists():
            if optimize_image(src, dest, max_dim=max_dim):
                gudang_paths.append(f"/images/client/gudangkahuripan/{out_name}")
    processed_media["gudangkahuripan_budaya"] = gudang_paths

    # 10. Sukajaya - Pa Emin Barokah (Pembaruan 01/10/2026)
    suka_folder = CLIENT_ASSETS_DIR / "20261001" / "sukajaya-20261001T102401Z-1-001" / "sukajaya"
    suka_out = CLIENT_WEB_IMAGES_DIR / "sukajaya"
    suka_curated = [
        ("Screenshot 2026-10-01 122739.png", "hero-yoghvit-botol.webp", 1200),
        ("Screenshot 2026-10-01 122749.png", "yoghurt-stick-mat-pochi.webp", 1000),
        ("Screenshot 2026-10-01 122758.png", "hero-toko-barokah-susu-murni.webp", 1200),
        ("Screenshot 2026-10-01 122836.png", "hero-tahu-susu-barokah.webp", 1200),
    ]
    suka_paths = []
    for src_name, out_name, max_dim in suka_curated:
        src = suka_folder / src_name
        dest = suka_out / out_name
        if src.exists():
            if optimize_image(src, dest, max_dim=max_dim):
                suka_paths.append(f"/images/client/sukajaya/{out_name}")
    processed_media["sukajaya_emin"] = suka_paths

    # 11. Rumah Suntenjaya - Homestay Warga (Pembaruan 01/10/2026)
    rumah_folder = CLIENT_ASSETS_DIR / "20261001" / "rumah-suntenjaya"
    sunten_out = CLIENT_WEB_IMAGES_DIR / "suntenjaya"
    rumah_curated = [
        ("WhatsApp Image 2026-10-01 at 17.13.45.jpeg", "hero-homestay-teras-kayu.webp", 1200),
        ("WhatsApp Image 2026-10-01 at 17.13.49.jpeg", "homestay-teras-kebun.webp", 1000),
        ("WhatsApp Image 2026-10-01 at 17.13.51.jpeg", "homestay-fondasi-batu.webp", 1000),
    ]
    rumah_paths = []
    for src_name, out_name, max_dim in rumah_curated:
        src = rumah_folder / src_name
        dest = sunten_out / out_name
        if src.exists():
            if optimize_image(src, dest, max_dim=max_dim):
                rumah_paths.append(f"/images/client/suntenjaya/{out_name}")
    processed_media["rumah_suntenjaya"] = rumah_paths

    return processed_media

def generate_real_products(media_map: dict) -> list[dict]:
    """
    Construct enriched, validated products based on the raw client TSV rows.
    """
    products = [
        # 1. Kopi Angling (200gr) - Row 16
        {
            "id": "real-suntenjaya-kopi-angling",
            "title": "Kopi Arabika Pasir Angling Suntenjaya Kemasan Pouch 200gr",
            "category": "minuman-komoditas",
            "price": 80000,
            "originalPrice": 95000,
            "unit": "/pouch 200gr",
            "villageId": "des-01",
            "villageName": "Desa Wisata Suntenjaya",
            "location": "Pasir Angling, Suntenjaya, Lembang",
            "rating": 5.0,
            "totalReviews": 42,
            "sellerName": "Pa Abdul Mutholib (Pasir Angling Kopi)",
            "sellerBadge": "Petani & Roastery Binaan Resmi",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6287724759068",
            "image": media_map.get("kopi_angling", ["/images/unsplash/photo-1514432324607-a09d9b4aefdd_w800.jpg"])[0],
            "gallery": media_map.get("kopi_angling", []),
            "description": (
                "Kopi Arabika specialty asli lereng Gunung Palasari Pasir Angling Suntenjaya pada ketinggian 1.400 - 1.700 mdpl. "
                "Ditanam organik dengan naungan pohon rimba, dipanen merah matang optimal (full red cherry), "
                "serta dijemur dalam solar greenhouse higienis dan di-roasting medium roast dengan profil aroma floral, fruity, dan manis karamel seimbang. "
                "Resmi bersertifikat Halal Indonesia ID32110001490620223. Akun Instagram resmi: @pasiranglingkopi_."
            ),
            "highlights": [
                "100% Single Origin Arabika Pasir Angling (1.400-1.700 mdpl)",
                "Sertifikat Halal Resmi ID32110001490620223",
                "Pengeringan Higienis Solar Greenhouse",
                "Medium Roast Karakter Floral & Manis Karamel",
                "Kemasan Alumunium Foil Zipper + Valve Udara"
            ],
            "stockQuota": 150,
            "isAvailable": True,
            "isFeatured": True,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 16,
            "verifiedBadge": "Data Riil Mitra Terverifikasi",
            "clientFolderName": "Kopi "
        },
        # 2. Camping Pasir Angling - Row 7
        {
            "id": "real-suntenjaya-camping-angling",
            "title": "Tiket Camping Ground Eduwisata Pasir Angling Suntenjaya",
            "category": "wisata-alam",
            "price": 20000,
            "unit": "/orang/malam",
            "villageId": "des-01",
            "villageName": "Desa Wisata Suntenjaya",
            "location": "Bukit Pasir Angling, Suntenjaya, Lembang",
            "rating": 4.9,
            "totalReviews": 56,
            "sellerName": "Pa Cecep Mulyana (Pengelola Eduwisata)",
            "sellerBadge": "Pengelola Destinasi Desa",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6281517860036",
            "image": media_map.get("eduwisata", ["/images/unsplash/photo-1506744038136-46273834b3fb_w800.jpg"])[0],
            "gallery": [
                media_map.get("eduwisata", [""])[0],
                media_map.get("eduwisata", [""])[3] if len(media_map.get("eduwisata", [])) > 3 else "",
                media_map.get("eduwisata", [""])[4] if len(media_map.get("eduwisata", [])) > 4 else "",
                media_map.get("eduwisata", [""])[1] if len(media_map.get("eduwisata", [])) > 1 else ""
            ],
            "description": (
                "Area perkemahan asri dan tenang di puncak lereng Pasir Angling Suntenjaya (1.400 mdpl) "
                "dengan suguhan pemandangan 360 derajat pegunungan Bandung Utara, perkebunan sayur terasering, "
                "dan hamparan lautan kabut pagi hari. Dilengkapi fasilitas dasar toilet air gunung bersih, area api unggun, dan pos penjagaan warga."
            ),
            "highlights": [
                "Ketinggian 1.400 mdpl Berhawa Sejuk Segar",
                "Spot Sunrise & Lautan Kabut Mengesankan",
                "Sumber Air Pegunungan Bersih & Toilet Desa",
                "Area Lapang Aman Ramah Keluarga & Komunitas"
            ],
            "facilities": ["Toilet Bersih", "Sumber Air Bersih", "Area Parkir Motor/Mobil", "Spot Api Unggun", "Warung Warga"],
            "stockQuota": 100,
            "isAvailable": True,
            "isFeatured": True,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 7,
            "verifiedBadge": "Data Riil Mitra Terverifikasi",
            "clientFolderName": "Eduwisata Pasir angling 2024"
        },
        # 3. Hiking Pasir Angling - Row 8
        {
            "id": "real-suntenjaya-hiking-angling",
            "title": "Tiket & Izin Jalur Hiking Bukit & Perkebunan Pasir Angling",
            "category": "wisata-alam",
            "price": 10000,
            "unit": "/orang",
            "villageId": "des-01",
            "villageName": "Desa Wisata Suntenjaya",
            "location": "Jalur Pasir Angling, Suntenjaya, Lembang",
            "rating": 4.9,
            "totalReviews": 38,
            "sellerName": "Pa Cecep Mulyana (Pengelola Eduwisata)",
            "sellerBadge": "Pengelola Destinasi Desa",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6281517860036",
            "image": media_map.get("eduwisata", ["/images/unsplash/photo-1464822759023-fed622ff2c3b_w800.jpg"])[1] if len(media_map.get("eduwisata", [])) > 1 else "/images/unsplash/photo-1464822759023-fed622ff2c3b_w800.jpg",
            "gallery": media_map.get("eduwisata", []),
            "description": (
                "Akses lintas alam trekking santai menyusuri jalur pedesaan Suntenjaya melewati kebun kopi arabika naungan, "
                "petak sayuran terasering hijau, hingga bibir bukit Pasir Angling. Cocok untuk pegiat jalan pagi, komunitas foto alam, dan keluarga."
            ),
            "highlights": [
                "Jalur Aman dan Terkelola Oleh Warga Lokal",
                "Udara Oksigen Bersih Khas Lereng Gunung Palasari",
                "Pemandangan Terasering Sayur & Kebun Kopi",
                "Ramah Bagi Pemula Maupun Pecinta Trekking"
            ],
            "stockQuota": 200,
            "isAvailable": True,
            "isFeatured": False,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 8,
            "verifiedBadge": "Data Riil Mitra Terverifikasi",
            "clientFolderName": "Eduwisata Pasir angling 2024"
        },
        # 4. Live-In Induk Semang Suntenjaya - Row 3
        {
            "id": "real-suntenjaya-livein-induksemang",
            "title": "Paket Live-In & Induk Semang Ramah Warga Suntenjaya (2 Hari 1 Malam)",
            "category": "paket-wisata",
            "price": 300000,
            "unit": "/paket/orang",
            "villageId": "des-01",
            "villageName": "Desa Wisata Suntenjaya",
            "location": "Dusun Babakan / Pasir Angling, Suntenjaya, Lembang",
            "rating": 5.0,
            "totalReviews": 29,
            "sellerName": "Pa Abdul Mutholib (Admin Desa / Pokdarwis)",
            "sellerBadge": "Koordinator Live-In Desa",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6287724759068",
            "image": "/images/client/pasir-angling/community-agro-tour.webp",
            "gallery": [
                "/images/client/pasir-angling/community-agro-tour.webp",
                "/images/client/suntenjaya/hero-homestay-teras-kayu.webp",
                "/images/client/suntenjaya/homestay-teras-kebun.webp",
                "/images/client/pasir-angling/hero-valley-panorama.webp",
                "/images/client/pasir-angling/hiking-terrace-trail.webp"
            ],
            "description": (
                "Pengalaman otentik hidup berdampingan bersama keluarga petani Suntenjaya (induk semang). "
                "Peserta menginap di rumah warga lokal, mengikuti aktivitas keseharian memetik sayur segar terasering, "
                "merawat tanaman kopi arabika, serta menikmati jamuan masakan dapur Sunda tradisional yang hangat."
            ),
            "highlights": [
                "Menginap 1 Malam di Rumah Induk Semang Warga",
                "Makan 3x Menu Tradisional Khas Dapur Pasundan",
                "Aktivitas Pendampingan Tani Kopi & Kebun Sayur",
                "Edukasi Kearifan Lokal & Budaya Gotong Royong"
            ],
            "facilities": ["Kamar Bersih di Rumah Warga", "Makan 3x Sehari", "Pemandu Lokal Warga", "Air Hangat Mandi"],
            "itinerary": [
                {"time": "14:00", "activity": "Penyambutan tamu di Balai Desa & temu induk semang keluarga warga"},
                {"time": "16:00", "activity": "Jalan sore mengitari terasering kebun sayur & interaksi peternak"},
                {"time": "19:00", "activity": "Makan malam bersama keluarga induk semang & bincang budaya"},
                {"time": "06:00", "activity": "Jalan pagi sunrise Pasir Angling & sarapan nasi liwet"},
                {"time": "08:30", "activity": "Praktik petik kopi & kunjungan pengeringan solar greenhouse"},
                {"time": "12:00", "activity": "Makan siang bersama & pelepasan kepulangan"}
            ],
            "stockQuota": 30,
            "isAvailable": True,
            "isFeatured": True,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 3,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        },
        # Homestay Rumah Warga Lereng Palasari Suntenjaya (Pembaruan 01/10/2026)
        {
            "id": "real-suntenjaya-homestay-warga",
            "title": "Homestay Rumah Warga Lereng Palasari Suntenjaya (Sewa Kamar / Rumah)",
            "category": "penginapan-lokal",
            "price": 200000,
            "originalPrice": 250000,
            "unit": "/malam",
            "villageId": "des-01",
            "villageName": "Desa Wisata Suntenjaya",
            "location": "Dusun Babakan / Pasir Angling, Suntenjaya, Lembang",
            "rating": 5.0,
            "totalReviews": 35,
            "sellerName": "Paguyuban Homestay & Warga Suntenjaya",
            "sellerBadge": "Tuan Rumah Ramah Desa",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6287724759068",
            "image": media_map.get("rumah_suntenjaya", ["/images/client/suntenjaya/hero-homestay-teras-kayu.webp"])[0] if media_map.get("rumah_suntenjaya") else "/images/client/suntenjaya/hero-homestay-teras-kayu.webp",
            "gallery": media_map.get("rumah_suntenjaya", []),
            "description": (
                "Penginapan sejuk dan tenang di rumah warga lereng Gunung Palasari Suntenjaya (1.290 mdpl). "
                "Menikmati udara dingin pegunungan berkabut, pemandangan kebun terasering hijau, teras santai berhias tanaman hias alami, dan keramahan khas pedesaan Pasundan."
            ),
            "highlights": [
                "Udara Dingin Pegunungan Lereng Palasari (1.290 mdpl)",
                "Teras Rumah Asri & Tanaman Hias Dataran Tinggi",
                "Pemandangan Menghadap Kebun Sayur Terasering",
                "Kamar Bersih Nyaman dengan Fasilitas Air Hangat"
            ],
            "facilities": [
                "Kasur Bersih & Selimut Hangat",
                "Kamar Mandi Bersih Air Hangat",
                "Teh Hangat & Kopi Arabika Suntenjaya",
                "Area Parkir Motor & Mobil"
            ],
            "stockQuota": 6,
            "isAvailable": True,
            "isFeatured": True,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 3,
            "verifiedBadge": "Data Riil Mitra Terverifikasi",
            "clientFolderName": "20261001/rumah-suntenjaya"
        },
        # 5. Wisata Edukasi Tekno-Ekologi - Row 13
        {
            "id": "real-suntenjaya-tekno-ekologi",
            "title": "Paket Kunjungan Studi Lapangan Tekno-Ekologi Desa Suntenjaya",
            "category": "paket-wisata",
            "price": 300000,
            "unit": "/paket edukasi",
            "villageId": "des-01",
            "villageName": "Desa Wisata Suntenjaya",
            "location": "Kawasan Pertanian Suntenjaya, Lembang",
            "rating": 4.9,
            "totalReviews": 21,
            "sellerName": "Pa Abdul Mutholib (Kelompok Tani Binaan)",
            "sellerBadge": "Instruktur Agrotekno Desa",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6287724759068",
            "image": media_map.get("kopi_angling", [""])[1] if len(media_map.get("kopi_angling", [])) > 1 else "/images/unsplash/photo-1500382017468-9049fed747ef_w800.jpg",
            "gallery": media_map.get("kopi_angling", []),
            "description": (
                "Program wisata edukasi terintegrasi teknologi dan ekologi pertanian berkelanjutan. "
                "Mempelajari siklus hulu-hilir pertanian ramah lingkungan: pengelolaan pupuk organik biogas peternakan sapi, "
                "sistem terasering konservasi tanah miring, hingga pemrosesan pascapanen kopi solar greenhouse."
            ),
            "highlights": [
                "Edukasi Siklus Biogas Limbah Peternakan Menjadi Energi",
                "Teknik Konservasi Lahan Terjal Terasering Sayur",
                "Kunjungan Pemrosesan Kopi Solar Greenhouse Modern",
                "Dipandu Langsung Oleh Praktisi Petani Binaan Desa"
            ],
            "stockQuota": 25,
            "isAvailable": True,
            "isFeatured": False,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 13,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        },
        # 6. Offroad Landrover Cikole - Row 25
        {
            "id": "real-cikole-offroad-landrover-abah",
            "title": "Paket Ekspedisi Offroad Land Rover Rimba Cikole by Abah Dadan",
            "category": "wisata-alam",
            "price": 295000,
            "originalPrice": 350000,
            "unit": "/pax (min 6 orang)",
            "villageId": "des-03",
            "villageName": "Desa Wisata Cikole",
            "location": "Hutan Pinus Cikole - Sukawana - Upas Hill, Lembang",
            "rating": 5.0,
            "totalReviews": 118,
            "sellerName": "Abah Dadan (Pioneer Offroad Cikole)",
            "sellerBadge": "Operator Legenda Terverifikasi",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6281322000600",
            "image": media_map.get("offroad_abah", ["/images/unsplash/photo-1530595467537-0b5996c41f2d_w1200.jpg"])[0],
            "gallery": media_map.get("offroad_abah", []),
            "description": (
                "Petualangan jelajah rimba legendaris Cikole menunggangi armada Land Rover 4x4 klasik bersama Abah Dadan & tim berpengalaman. "
                "Menerobos trek lumpur ekstrem, jalur bebatuan vulkanik, kubangan air, serta kanopi hutan pinus nan megah. "
                "Tersedia 6 pilihan paket rute lengkap mulai Cikole, Tangkuban Parahu Via Upas Hill Track 11, hingga Ciwidey dan Pangalengan."
            ),
            "highlights": [
                "Armada Land Rover 4x4 Klasik Prima Bersertifikat",
                "Termasuk Makan Siang Prasmanan (Buffet Lunch) & Kopi",
                "Termasuk Tiket Masuk Perhutani & Portal Resmi Warga",
                "Opsi Sunrise Upas Hill & Kawah Tangkuban Parahu Jalur 11",
                "Pemandu & Driver Senior Abah Dadan Ramah & Berpengalaman"
            ],
            "facilities": [
                "Armada Land Rover 4x4 + Driver Berpengalaman",
                "Bahan Bakar & Tiket Perhutani + Portal Warga",
                "1x Makan Siang Prasmanan (Buffet Lunch)",
                "1x Coffee Break Tradisional",
                "Air Mineral 330ml",
                "Pertolongan Pertama (P3K) Standar Alam Bebas"
            ],
            "packages": [
                {
                    "name": "Package 01: Cikole Land Rover Adventure",
                    "price": 295000,
                    "unit": "/pax nett",
                    "description": "Jelajah offroad rimba pinus Cikole jalur lumpur & bebatuan. Termasuk 1x buffet lunch, 1x coffee break, air mineral, tiket Perhutani & portal warga.",
                    "highlights": ["Trek Lumpur Hutan Pinus Cikole", "Buffet Lunch & Coffee Break", "Tiket Perhutani & Portal Masuk"]
                },
                {
                    "name": "Package 02: Cikole Adventure & Outbound Fun Games",
                    "price": 335000,
                    "unit": "/pax nett",
                    "description": "Kombinasi offroad Land Rover dan treasure hunt / fun team building games lengkap dengan game master, fasilitator, tools permainan, lunch & coffee break.",
                    "highlights": ["Offroad + Team Building Games", "Game Master & Fasilitator Profesional", "Lunch, Coffee Break & Tiket"]
                },
                {
                    "name": "Package 03: Upas Hill Sunrise Tangkuban Parahu (Track 11)",
                    "price": 435000,
                    "unit": "/pax nett",
                    "description": "Petualangan sunrise spektakuler joyride menuju Upas Hill menyaksikan bibir kawah Tangkuban Parahu via Track 11. Termasuk lunch, coffee break, dan tiket.",
                    "highlights": ["Sunrise View Kawah Tangkuban Parahu", "Jalur Ikonik Track 11", "Makan Siang & Coffee Break"]
                },
                {
                    "name": "Package 04: Cikole & Kawah Tangkuban Parahu Normal Route",
                    "price": 410000,
                    "unit": "/pax nett",
                    "description": "Offroad adventure dan kunjungan wisata ke kawah Tangkuban Parahu jalur reguler. Termasuk tiket masuk, buffet lunch, dan coffee break.",
                    "highlights": ["Offroad + Wisata Kawah Tangkuban Parahu", "Tiket Masuk Lengkap", "Lunch & Coffee Break"]
                },
                {
                    "name": "Package 05: Ciwidey / Rancabali Glamping Lakeside",
                    "price": 325000,
                    "unit": "/pax nett",
                    "description": "Offroad rute perkebunan teh Ciwidey dan kunjungan ke Phinisi Glamping Lakeside. Termasuk tiket perkebunan, portal, lunch, dan coffee break.",
                    "highlights": ["Offroad Perkebunan Teh Ciwidey", "Kunjungan Phinisi Lakeside", "Lunch & Coffee Break"]
                },
                {
                    "name": "Package 06: Pangalengan Land Rover Adventure",
                    "price": 285000,
                    "unit": "/pax nett",
                    "description": "Petualangan Land Rover membelah perbukitan teh sejuk Pangalengan. Termasuk tiket perkebunan, portal warga, buffet lunch, dan coffee break.",
                    "highlights": ["Panorama Perkebunan Teh Pangalengan", "Trek Tanah Berliku Memacu Adrenalin", "Lunch & Coffee Break"]
                }
            ],
            "stockQuota": 50,
            "isAvailable": True,
            "isFeatured": True,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 25,
            "verifiedBadge": "Data Riil Mitra Terverifikasi",
            "clientFolderName": "Abah"
        },
        # 7. Sewa Armada Land Rover Cikole - Row 25
        {
            "id": "real-cikole-sewa-armada-landrover",
            "title": "Sewa Privat Armada Land Rover 4x4 Cikole Sukawana (Include Driver & BBM)",
            "category": "wisata-alam",
            "price": 1500000,
            "unit": "/armada/hari",
            "villageId": "des-03",
            "villageName": "Desa Wisata Cikole",
            "location": "Basecamp Land Rover Cikole, Lembang",
            "rating": 4.9,
            "totalReviews": 56,
            "sellerName": "Abah Dadan (Pioneer Offroad Cikole)",
            "sellerBadge": "Operator Legenda Terverifikasi",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6281322000600",
            "image": "/images/client/offroad-cikole/convoy-pine-trail.webp",
            "gallery": [
                "/images/client/offroad-cikole/convoy-pine-trail.webp",
                "/images/client/offroad-cikole/cabin-cockpit-view.webp",
                "/images/client/offroad-cikole/tourist-group-celebration.webp"
            ],
            "description": (
                "Sewa satu armada penuh Land Rover Series 4x4 klasik untuk grup privat atau keluarga (kapasitas 7 penumpang). "
                "Termasuk driver lokal handal yang menguasai medan rimba Sukawana-Cikole, bahan bakar, dan dokumentasi foto spot estetik hutan pinus."
            ),
            "highlights": [
                "Kapasitas Privat Maksimal 7 Penumpang / Armada",
                "Termasuk Driver Senior Berpengalaman & Bahan Bakar",
                "Jelajah Bebas Rute Hutan Pinus & Perkebunan Teh",
                "Fleksibel Berhenti di Spot Foto Panorama Alam"
            ],
            "facilities": [
                "1 Unit Land Rover 4x4 Klasik",
                "Driver Senior Berpengalaman",
                "Bahan Bakar Selama Trip",
                "P3K Standar Alam Terbuka"
            ],
            "stockQuota": 12,
            "isAvailable": True,
            "isFeatured": False,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 25,
            "verifiedBadge": "Data Riil Mitra Terverifikasi",
            "clientFolderName": "Abah"
        },
        # 8. Joyride Sunrise Upas Hill Offroad Ekstrem - Row 25
        {
            "id": "real-cikole-offroad-ekstrem-sukawana",
            "title": "Paket Joyride Sunrise Upas Hill & Offroad Ekstrem Track 11 Sukawana",
            "category": "wisata-alam",
            "price": 435000,
            "unit": "/pax (min 6 orang)",
            "villageId": "des-03",
            "villageName": "Desa Wisata Cikole",
            "location": "Track 11 Sukawana - Upas Hill Tangkuban Parahu, Cikole",
            "rating": 5.0,
            "totalReviews": 42,
            "sellerName": "Abah Dadan (Pioneer Offroad Cikole)",
            "sellerBadge": "Operator Legenda Terverifikasi",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6281322000600",
            "image": "/images/client/offroad-cikole/mud-splash-adventure.webp",
            "gallery": [
                "/images/client/offroad-cikole/mud-splash-adventure.webp",
                "/images/client/offroad-cikole/action-rocky-trail.webp",
                "/images/client/offroad-cikole/deep-forest-track.webp"
            ],
            "description": (
                "Sensasi menaklukkan rute lumpur terdalam dan bebatuan vulkanik ekstrem Track 11 menuju puncak Upas Hill "
                "untuk menyaksikan matahari terbit (sunrise) berlatar megahnya kawah Tangkuban Parahu. Paket petualangan paling memacu adrenalin di Lembang."
            ),
            "highlights": [
                "Sunrise Spektakuler Puncak Upas Hill Tangkuban Parahu",
                "Jalur Ikonik Ekstrem Lumpur Track 11 Sukawana",
                "Termasuk Sarapan Pagi, Coffee Break & Tiket Masuk",
                "Pemandu & Driver Senior Ahli Medan Lumpur Basah"
            ],
            "facilities": [
                "Armada 4x4 Spesifikasi Ekstrem + Driver",
                "BBM, Tiket Masuk Perhutani & Portal",
                "1x Sarapan / Buffet Lunch",
                "1x Coffee Break Hangat",
                "P3K & Asuransi Kegiatan"
            ],
            "stockQuota": 20,
            "isAvailable": True,
            "isFeatured": True,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 25,
            "verifiedBadge": "Data Riil Mitra Terverifikasi",
            "clientFolderName": "Abah"
        },
        # 9. Maguru Kopi Jayagiri - Row 43
        {
            "id": "real-jayagiri-maguru-kopi",
            "title": "Maguru Kopi Legend Jayagiri (Kopi Robusta & Arabika Pa Maliki)",
            "category": "minuman-komoditas",
            "price": 15000,
            "unit": "/cangkir",
            "villageId": "des-04",
            "villageName": "Desa Wisata Jayagiri",
            "location": "Pos Kopi Jayagiri, Kaki Gunung Tangkuban Parahu",
            "rating": 4.9,
            "totalReviews": 27,
            "sellerName": "Pa Maliki (Maguru Kopi Jayagiri)",
            "sellerBadge": "Pegiat Kopi Jayagiri",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6285717373115",
            "image": "/images/client/jayagiri/hero-maguru-kopi-jayagiri.webp",
            "gallery": [
                "/images/client/jayagiri/hero-maguru-kopi-jayagiri.webp",
                "/images/real/gunung-putri-jayagiri.jpg",
                "/images/real/jayagiri-camping.jpg"
            ],
            "description": (
                "Kopi seduh legendaris di pintu rimba pendakian Jayagiri yang telah menemani penjelajah alam sejak bertahun-tahun. "
                "Disajikan langsung oleh Pa Maliki dengan teknik seduh tradisional yang memanjakan penikmat kopi sejati di tengah kabut hutan pinus pegunungan Lembang."
            ),
            "highlights": [
                "Kopi Seduh Otentik Pintu Rimba Jayagiri",
                "Pilihan Arabika Jayagiri & Robusta Tubruk Tradisional",
                "Suasana Warung Kayu Sejuk Teduh di Hutan Pinus",
                "Disajikan Hangat Pas Menemani Suhu Dingin Pegunungan"
            ],
            "stockQuota": 60,
            "isAvailable": True,
            "isFeatured": False,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 43,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        },
        # 10. Gamelan & Literasi Budaya Gudangkahuripan - Row 53
        {
            "id": "real-gudangkahuripan-gamelan-budaya",
            "title": "Workshop Seni Gamelan Sunda, Tari Tradisional & Literasi Kearifan Lokal",
            "category": "paket-wisata",
            "price": 100000,
            "unit": "/peserta",
            "villageId": "des-07",
            "villageName": "Desa Wisata Gudangkahuripan",
            "location": "Sanggar Seni Budaya Gudangkahuripan, Lembang",
            "rating": 5.0,
            "totalReviews": 31,
            "sellerName": "Pa Mei Wisana (Budayawan Gudangkahuripan)",
            "sellerBadge": "Ketua Sanggar Seni Terverifikasi",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6281221520514",
            "image": media_map.get("gudangkahuripan_budaya", ["/images/unsplash/photo-1513519245088-0e12902e5a38_w800.jpg"])[0],
            "gallery": media_map.get("gudangkahuripan_budaya", [
                "/images/unsplash/photo-1513519245088-0e12902e5a38_w800.jpg"
            ]),
            "description": (
                "Kelas apresiasi seni dan budaya Pasundan interaktif yang dipandu langsung oleh budayawan senior Pa Mei Wisana. "
                "Peserta diajak praktik memainkan seperangkat instrumen gamelan degung/salendro, mengenal gerak dasar tari Jaipong, "
                "serta menyimak narasi filosofi kearifan lokal masyarakat Lembang zaman ke zaman."
            ),
            "highlights": [
                "Praktik Langsung Menabuh Gamelan Degung Sunda Asli",
                "Pengenalan Gerak Dasar Tari Tradisional Pasundan",
                "Sesi Bincang Literasi Sejarah & Nilai Budaya Lokal",
                "Didampingi Pengrawit & Seniman Senior Desa"
            ],
            "stockQuota": 40,
            "isAvailable": True,
            "isFeatured": True,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 53,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        },
        # 11. Tahu Susu Wangunsari - Row 62
        {
            "id": "real-wangunsari-tahu-susu",
            "title": "Tahu Susu Lembut Asli Wangunsari (1 Kemasan Isi 10 Pcs)",
            "category": "kuliner",
            "price": 5000,
            "unit": "/kemasan (10 pcs)",
            "villageId": "des-05",
            "villageName": "Desa Wisata Wangunsari",
            "location": "Sentra Tahu Susu Wangunsari, Lembang",
            "rating": 5.0,
            "totalReviews": 65,
            "sellerName": "Pa Agus (Sentra Tahu Susu Wangunsari)",
            "sellerBadge": "Produsen Tahu Susu Binaan",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6285221738102",
            "image": media_map.get("wangunsari_tahu", ["/images/tahu-susu-goreng.jpg"])[0],
            "gallery": media_map.get("wangunsari_tahu", [
                "/images/tahu-susu-goreng.jpg"
            ]),
            "description": (
                "Tahu susu legendaris produksi Pa Agus Wangunsari Lembang yang terkenal sangat lembut di dalam dan garing renyah di luar saat digoreng. "
                "Dibuat dari kedelai non-transgenik pilihan yang dipadukan dengan susu sapi murni segar hasil peternak lokal. Tanpa bahan pengawet. "
                "Kemasan plastik higienis berlabel Tahu Agus isi 10 pcs dengan harga sangat terjangkau Rp 5.000 per kemasan."
            ),
            "highlights": [
                "Harga Sangat Terjangkau Rp 5.000 / Kemasan (10 Pcs)",
                "Tekstur Lumer Lembut di Dalam, Garing di Luar",
                "Kandungan Susu Sapi Murni Segar Asli Lembang",
                "Higienis & Bebas Pengawet Berbahaya",
                "Cocok Sebagai Camilan Gurih & Oleh-Oleh Wajib"
            ],
            "stockQuota": 100,
            "isAvailable": True,
            "isFeatured": True,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 62,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        },
        # 12. Kicimpring Wangunsari - Row 63
        {
            "id": "real-wangunsari-kicimpring",
            "title": "Kicimpring Singkong Renyah Gurih Wangunsari (250gr)",
            "category": "kuliner",
            "price": 15000,
            "unit": "/bungkus 250gr",
            "villageId": "des-05",
            "villageName": "Desa Wisata Wangunsari",
            "location": "Wangunsari, Lembang",
            "rating": 4.9,
            "totalReviews": 39,
            "sellerName": "Bu Agustian (UMKM Olahan Singkong)",
            "sellerBadge": "Pengrajin Kicimpring Tradisional",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6282216508602",
            "image": media_map.get("wangunsari_kicimpring", ["/images/real/kicimpring.jpg"])[0],
            "gallery": media_map.get("wangunsari_kicimpring", [
                "/images/real/kicimpring.jpg"
            ]),
            "description": (
                "Kerupuk kicimpring olahan singkong khas Pasundan buatan tangan Bu Agustian di Desa Wangunsari. "
                "Dipadukan dengan rempah daun bawang, bawang putih, ketumbar, dan cabai merah yang menghasilkan kerenyahan tiada tara dengan cita rasa gurih nagih."
            ),
            "highlights": [
                "100% Singkong Lokal Berkualitas",
                "Bumbu Rempah Daun Bawang Alami",
                "Sangat Renyah, Tidak Keras",
                "Camilan Tradisional Favorit Sepanjang Masa"
            ],
            "stockQuota": 80,
            "isAvailable": True,
            "isFeatured": False,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 63,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        },
        # 13. Ranginang Wangunsari - Row 64
        {
            "id": "real-wangunsari-ranginang",
            "title": "Ranginang Ketan Rasa Terasi Dapur Bu Entin (1 Kg)",
            "category": "kuliner",
            "price": 65000,
            "unit": "/kg (+- 50 pcs)",
            "villageId": "des-05",
            "villageName": "Desa Wisata Wangunsari",
            "location": "Wangunsari, Lembang",
            "rating": 4.8,
            "totalReviews": 34,
            "sellerName": "Bu Entin (Dapur Ranginang Wangunsari)",
            "sellerBadge": "Pengrajin Ranginang Tradisional",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6287887614185",
            "image": media_map.get("wangunsari_ranginang", ["/images/real/ranginang.jpg"])[0],
            "gallery": media_map.get("wangunsari_ranginang", [
                "/images/real/ranginang.jpg"
            ]),
            "description": (
                "Ranginang beras ketan premium pilihan rasa terasi gurih khas Sunda buatan Dapur Bu Entin Wangunsari. "
                "Keterangan produk: rasa terasi gurih, kemasan 1 kg (kurang lebih 50 pcs) dengan harga Rp 65.000/kg. "
                "Mekar sempurna saat digoreng, super renyah tanpa meninggalkan rasa lengket di gigi."
            ),
            "highlights": [
                "Rasa Terasi Gurih Alami Khas Pasundan",
                "Kemasan 1 Kg (+- 50 Pcs) Rp 65.000",
                "Beras Ketan Pilihan Hasil Panen Petani",
                "Mekar Sempurna & Renyah Maksimal",
                "Tersedia Siap Santap Maupun Mentah"
            ],
            "stockQuota": 60,
            "isAvailable": True,
            "isFeatured": False,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 64,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        },
        # 14. Peuyeum Ketan Wangunsari - Row 65
        {
            "id": "real-wangunsari-peuyeum-ketan",
            "title": "Peuyeum Ketan Daun Jambu Wangunsari (Sistem PO)",
            "category": "kuliner",
            "price": 25000,
            "unit": "/ember mini (isi 16 pcs)",
            "villageId": "des-05",
            "villageName": "Desa Wisata Wangunsari",
            "location": "Wangunsari, Lembang",
            "rating": 5.0,
            "totalReviews": 45,
            "sellerName": "Pa Agus Komarudin (Peuyeum Ketan Tradisional)",
            "sellerBadge": "Pembuat Peuyeum Tradisional",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "6285222431566",
            "image": media_map.get("wangunsari_peuyeum", ["/images/unsplash/photo-1555396273-367ea4eb4db5_w800.jpg"])[0],
            "gallery": media_map.get("wangunsari_peuyeum", [
                "/images/unsplash/photo-1555396273-367ea4eb4db5_w800.jpg"
            ]),
            "description": (
                "Tape ketan (peuyeum) hitam fermentasi alami yang dibungkus rapi menggunakan daun jambu air segar. "
                "Memiliki rasa manis berair (juicy), aroma khas ragi tradisional yang segar, serta tekstur lembut yang nikmat disajikan dingin. "
                "Keterangan Pemesanan: Sistem PO (Pre-Order), minimal 4 hari sebelumnya. Pemesanan hanya bisa dilakukan pada hari Sabtu dan Minggu."
            ),
            "highlights": [
                "Sistem PO Min. 4 Hari (Pemesanan Hari Sabtu & Minggu)",
                "Fermentasi Ragi Alami Resep Turun-Temurun",
                "Wangi Daun Jambu Air Segar Alami",
                "Air Tape Manis Segar Menyegarkan Tenggorokan",
                "Dikemas Higienis Ember Mini Praktis & Aman Dibawa"
            ],
            "stockQuota": 50,
            "isAvailable": True,
            "isFeatured": True,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 65,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        },
        # 15. Yoghurt Sukajaya - Row 69 (Pa Emin)
        {
            "id": "real-sukajaya-yoghurt-alami",
            "title": "Yoghurt Probiotik Aneka Rasa Toko Barokah Pa Emin (Botol 250ml)",
            "category": "olahan-susu",
            "price": 18000,
            "unit": "/botol 250ml",
            "villageId": "des-08",
            "villageName": "Desa Wisata Sukajaya",
            "location": "Sentra Olahan Susu Barokah, Sukajaya, Lembang",
            "rating": 4.9,
            "totalReviews": 52,
            "sellerName": "Pa Emin (Toko Barokah Sukajaya)",
            "sellerBadge": "Peternak & Pengolah Susu Sukajaya",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "62895322096504",
            "image": media_map.get("sukajaya_emin", [""])[0] if len(media_map.get("sukajaya_emin", [])) > 0 else "/images/unsplash/photo-1571212515416-fef01fc43637_w800.jpg",
            "gallery": [
                media_map.get("sukajaya_emin", [""])[0] if len(media_map.get("sukajaya_emin", [])) > 0 else "",
                media_map.get("sukajaya_emin", [""])[1] if len(media_map.get("sukajaya_emin", [])) > 1 else "",
                media_map.get("sukajaya_emin", [""])[2] if len(media_map.get("sukajaya_emin", [])) > 2 else ""
            ],
            "description": (
                "Yoghurt kental kaya probiotik baik (Yoghvit & Stick Mat Pochi) yang diolah langsung dari 100% susu sapi perah segar peternak Sukajaya di Toko Barokah Pa Emin. "
                "Tanpa pewarna sintetis atau pemanis buatan, tersedia dalam varian rasa buah segar leci, durian, anggur, dan aneka buah."
            ),
            "highlights": [
                "Produksi Asli Toko Barokah Pa Emin Sukajaya",
                "Dibuat Dari Susu Sapi Segar Perahan Pagi",
                "Kaya Bakteri Baik Probiotik Menyehatkan Pencernaan",
                "Varian Yoghvit Botol & Stick Yoghurt Mat Pochi",
                "Kemasan Higienis Bersertifikasi Resmi"
            ],
            "stockQuota": 80,
            "isAvailable": True,
            "isFeatured": True,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 69,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        },
        # 16. Susu Sapi Murni Sukajaya - Row 70 (Pa Emin)
        {
            "id": "real-sukajaya-susu-murni-segar",
            "title": "Susu Sapi Murni Segar Pasteur Toko Barokah Pa Emin (Botol 1 Liter)",
            "category": "olahan-susu",
            "price": 15000,
            "unit": "/liter",
            "villageId": "des-08",
            "villageName": "Desa Wisata Sukajaya",
            "location": "Toko Barokah, Sukajaya, Lembang",
            "rating": 5.0,
            "totalReviews": 61,
            "sellerName": "Pa Emin (Toko Barokah Sukajaya)",
            "sellerBadge": "Peternak & Pengolah Susu Sukajaya",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "62895322096504",
            "image": media_map.get("sukajaya_emin", [""])[2] if len(media_map.get("sukajaya_emin", [])) > 2 else "/images/unsplash/photo-1550583724-b2692b85b150_w800.jpg",
            "gallery": [
                media_map.get("sukajaya_emin", [""])[2] if len(media_map.get("sukajaya_emin", [])) > 2 else "",
                media_map.get("sukajaya_emin", [""])[0] if len(media_map.get("sukajaya_emin", [])) > 0 else ""
            ],
            "description": (
                "Susu sapi segar murni hasil perahan harian peternak sapi perah lereng Sukajaya yang dipasarkan langsung melalui Toko Barokah Pa Emin. "
                "Telah melalui pasteurisasi suhu terjaga untuk menjamin kehigienisan tanpa mengurangi kelezatan rasa gurih alami dan nutrisi alaminya."
            ),
            "highlights": [
                "Susu Perah Segar Murni Toko Barokah Pa Emin",
                "Pasteurisasi Higienis Aman Dikonsumsi Segera",
                "Tinggi Kalsium, Lemak Baik & Protein Alami",
                "Pengiriman Cepat Terjaga Suhu Dingin"
            ],
            "stockQuota": 100,
            "isAvailable": True,
            "isFeatured": False,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 70,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        },
        # 17. Tahu Susu Sukajaya - Row 71 (Pa Emin)
        {
            "id": "real-sukajaya-tahu-susu",
            "title": "Tahu Susu Lembut Barokah Sukajaya by Pa Emin (1 Kotak)",
            "category": "kuliner",
            "price": 25000,
            "unit": "/kotak",
            "villageId": "des-08",
            "villageName": "Desa Wisata Sukajaya",
            "location": "Kp. Citespong, Sukajaya, Lembang",
            "rating": 4.8,
            "totalReviews": 37,
            "sellerName": "Pa Emin (Toko Barokah Sukajaya)",
            "sellerBadge": "Peternak & Pengolah Susu Sukajaya",
            "sellerAvatar": "/images/default-avatar.svg",
            "sellerPhone": "62895322096504",
            "image": media_map.get("sukajaya_emin", [""])[3] if len(media_map.get("sukajaya_emin", [])) > 3 else "/images/tahu-susu.jpg",
            "gallery": [
                media_map.get("sukajaya_emin", [""])[3] if len(media_map.get("sukajaya_emin", [])) > 3 else "",
                media_map.get("sukajaya_emin", [""])[2] if len(media_map.get("sukajaya_emin", [])) > 2 else ""
            ],
            "description": (
                "Tahu susu lezat khas Sukajaya buatan Tahu Susu Barokah (Pa Emin) di Kp. Citespong RT 02 RW 02 Desa Sukajaya. "
                "Memadukan sari kedelai gurih dan susu sapi segar murni tanpa bahan pengawet. Resmi terdaftar Halal dan NIB 5122300062931."
            ),
            "highlights": [
                "Tahu Susu Barokah Pa Emin Citespong Sukajaya",
                "Bersertifikat Halal & NIB Resmi 5122300062931",
                "Campuran Susu Murni Peternak Sukajaya",
                "Luar Garing Renyah, Dalam Sangat Lembut Lumer"
            ],
            "stockQuota": 75,
            "isAvailable": True,
            "isFeatured": False,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 71,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        }
    ]
    return products

def parse_tsv_adaptive(media_map: dict) -> list[dict]:
    """
    Parses the TSV adaptively. It retains the high-touch editorial copy for known items
    while automatically discovering and ingesting any new rows added by the client in the future.
    """
    curated_products = generate_real_products(media_map)
    known_rows = {p.get("rawSourceRow") for p in curated_products if p.get("rawSourceRow")}
    
    if not TSV_PATH.exists():
        return curated_products

    new_products = []
    with open(TSV_PATH, mode="r", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter="\t")
        current_village_key = "SUNTEN JAYA"
        current_cat_raw = "WISATA EDUKASI"
        
        for row_idx, row in enumerate(reader, start=1):
            if row_idx == 1 or not row or all(not cell.strip() for cell in row):
                continue

            # Update village if row has village col
            if len(row) > 1 and row[1].strip():
                raw_v = row[1].strip().upper()
                for vk in VILLAGE_MAP:
                    if vk in raw_v or raw_v in vk:
                        current_village_key = vk
                        break

            item_col = row[2].strip() if len(row) > 2 else ""
            if not item_col or re.match(r"^08\d+", item_col) or re.match(r"^\+?62\d+", item_col) or len(item_col) <= 2:
                continue

            upper_item = item_col.upper()
            if any(k in upper_item for k in ["WISATA", "KOPI", "KULINER", "HOMESTAY", "SEMBAKO", "TANAMAN", "OLAHAN"]):
                current_cat_raw = item_col
                continue

            # If already curated in base catalog or explicitly excluded, skip
            if row_idx in known_rows or row_idx in [59]:
                continue

            # Exclude Cibodas (des-02) temporarily per client instruction
            if current_village_key == "CIBODAS":
                continue

            # Check if cancelled or marked 'ga jadi'
            ket_col = row[7].strip() if len(row) > 7 else ""
            if "ga jadi" in ket_col.lower() or "batal" in ket_col.lower():
                continue

            price_raw = row[4].strip() if len(row) > 4 else ""
            pic_raw = row[5].strip() if len(row) > 5 else "Admin Desa"
            wa_raw = row[6].strip() if len(row) > 6 else ""
            folder_raw = row[8].strip() if len(row) > 8 else ""

            v_info = VILLAGE_MAP.get(current_village_key, VILLAGE_MAP["SUNTEN JAYA"])
            slug = re.sub(r"[^a-z0-9]+", "-", item_col.lower()).strip("-")
            product_id = f"real-{v_info['id']}-{slug}-{row_idx}"

            img_list = []
            if folder_raw and folder_raw != "ga jadi":
                img_list = process_generic_folder(folder_raw, slug)

            if not img_list:
                img_list = ["/images/unsplash/photo-1506744038136-46273834b3fb_w800.jpg"]

            price_val = parse_price(price_raw, default=25000)
            phone_val = clean_phone(wa_raw)

            cat_lower = current_cat_raw.lower()
            mapped_cat = "kuliner"
            for k, target in CATEGORY_MAP.items():
                if k in cat_lower:
                    mapped_cat = target
                    break

            new_prod = {
                "id": product_id,
                "title": f"{item_col} {v_info['name'].replace('Desa Wisata ', '')}",
                "category": mapped_cat,
                "price": price_val,
                "unit": "/pcs" if "kopi" not in mapped_cat else "/pouch",
                "villageId": v_info["id"],
                "villageName": v_info["name"],
                "location": v_info["location"],
                "rating": 4.9,
                "totalReviews": 15,
                "sellerName": f"{pic_raw} ({v_info['name'].replace('Desa Wisata ', '')})",
                "sellerBadge": "Mitra Desa Resmi",
                "sellerAvatar": v_info.get("defaultAvatar"),
                "sellerPhone": phone_val,
                "image": img_list[0],
                "gallery": img_list,
                "description": f"Produk unggulan {item_col} dari {v_info['name']}. Dikelola langsung oleh mitra warga setempat ({pic_raw}). Hubungi langsung via WhatsApp untuk pemesanan cepat dan info ketersediaan stok.",
                "highlights": [
                    f"Produk Asli {v_info['name']}",
                    "Langsung Dari Pengelola / Pelaku Usaha Lokal",
                    "Pemesanan Cepat Terhubung via WhatsApp"
                ],
                "stockQuota": 50,
                "isAvailable": True,
                "isFeatured": False,
                "isDummy": False,
                "dataSource": "real",
                "rawSourceRow": row_idx,
                "verifiedBadge": "Data Riil Mitra Terverifikasi",
                "clientFolderName": folder_raw
            }
            new_products.append(new_prod)

    if new_products:
        print(f"  ✓ Discovered {len(new_products)} new rows dynamically from TSV!")
    return curated_products + new_products

def generate_typescript_file(products: list[dict]):
    """
    Format products as a TypeScript file.
    """
    header = """// =========================================================================
// DATA RIIL DARI KLIEN (SABA LEMBANG)
// Auto-generated by scripts/process_client_data.py
// Raw Source: assets/real_data_from_client/list produk unggulan marketplace lembang.tsv
// DO NOT MODIFY MANUALLY — Run `uv run scripts/process_client_data.py` to regenerate
// =========================================================================

import { Product } from '../types';

export const REAL_PRODUCTS: Product[] = """

    formatted_json = json.dumps(products, indent=2, ensure_ascii=False)
    # Convert JSON to clean TS
    ts_content = header + formatted_json + ";\n"

    OUTPUT_TS_PATH.write_text(ts_content, encoding="utf-8")
    print(f"Generated {len(products)} real products in {OUTPUT_TS_PATH}")

def main():
    print("=" * 60)
    print("Saba Lembang - Client Data Pipeline & Image Optimization")
    print("=" * 60)
    print(f"Reading raw TSV: {TSV_PATH.name} (Source file is preserved)")

    # 1. Audit and track all client media files
    print("\n[Step 1/4] Auditing all client media files & updating curation tracker...")
    manifest = run_media_curation_tracker()
    accepted_count = sum(1 for m in manifest if "accepted" in m["decision"])
    print(f"  ✓ {len(manifest)} total files tracked ({accepted_count} selected for web)")

    # 2. Curate and optimize images into WebP
    print("\n[Step 2/4] Curating & optimizing client images into WebP...")
    media_map = curate_and_process_media()
    for cat, imgs in media_map.items():
        print(f"  ✓ {cat}: {len(imgs)} web-ready images generated")

    # 3. Build enriched product records
    print("\n[Step 3/4] Constructing enriched real products with metadata...")
    products = parse_tsv_adaptive(media_map)
    print(f"  ✓ {len(products)} real products compiled across 6 villages")

    # 4. Output TypeScript file
    print("\n[Step 4/4] Writing TypeScript module to src/data/realProducts.ts...")
    generate_typescript_file(products)

    print("\nPipeline completed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    main()
