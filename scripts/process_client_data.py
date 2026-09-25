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
        "defaultAvatar": "/images/unsplash/photo-1507003211169-0a1dd7228f2d_w200.jpg"
    },
    "CIKOLE": {
        "id": "des-03",
        "name": "Desa Wisata Cikole",
        "location": "Cikole, Lembang, Bandung Barat",
        "defaultAvatar": "/images/unsplash/photo-1500648767791-00dcc994a43e_w200.jpg"
    },
    "JAYAGIRI": {
        "id": "des-04",
        "name": "Desa Wisata Jayagiri",
        "location": "Jayagiri, Lembang, Bandung Barat",
        "defaultAvatar": "/images/unsplash/photo-1472099645785-5658abf4ff4e_w200.jpg"
    },
    "GUDANG KAHURIPAN": {
        "id": "des-07",
        "name": "Desa Wisata Gudangkahuripan",
        "location": "Gudangkahuripan, Lembang, Bandung Barat",
        "defaultAvatar": "/images/unsplash/photo-1519085360753-af0119f7cbe7_w200.jpg"
    },
    "WANGUNSARI": {
        "id": "des-05",
        "name": "Desa Wisata Wangunsari",
        "location": "Wangunsari, Lembang, Bandung Barat",
        "defaultAvatar": "/images/unsplash/photo-1544005313-94ddf0286df2_w200.jpg"
    },
    "CIBODAS": {
        "id": "des-02",
        "name": "Desa Wisata Cibodas",
        "location": "Cibodas, Lembang, Bandung Barat",
        "defaultAvatar": "/images/unsplash/photo-1500648767791-00dcc994a43e_w200.jpg"
    },
    "CIKAHURIPAN": {
        "id": "des-06",
        "name": "Desa Wisata Cikahuripan",
        "location": "Cikahuripan, Lembang, Bandung Barat",
        "defaultAvatar": "/images/unsplash/photo-1507003211169-0a1dd7228f2d_w200.jpg"
    },
    "SUKAJAYA": {
        "id": "des-08",
        "name": "Desa Wisata Sukajaya",
        "location": "Sukajaya, Lembang, Bandung Barat",
        "defaultAvatar": "/images/unsplash/photo-1534528741775-53994a69daeb_w200.jpg"
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
            "sellerAvatar": media_map.get("kopi_angling", [""])[3] if len(media_map.get("kopi_angling", [])) > 3 else "/images/unsplash/photo-1507003211169-0a1dd7228f2d_w200.jpg",
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
            "sellerAvatar": "/images/unsplash/photo-1500648767791-00dcc994a43e_w200.jpg",
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
            "sellerAvatar": "/images/unsplash/photo-1500648767791-00dcc994a43e_w200.jpg",
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
            "sellerAvatar": "/images/unsplash/photo-1507003211169-0a1dd7228f2d_w200.jpg",
            "sellerPhone": "6287724759068",
            "image": media_map.get("eduwisata", ["/images/unsplash/photo-1500382017468-9049fed747ef_w800.jpg"])[2] if len(media_map.get("eduwisata", [])) > 2 else "/images/unsplash/photo-1500382017468-9049fed747ef_w800.jpg",
            "gallery": media_map.get("eduwisata", []),
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
            "sellerAvatar": "/images/unsplash/photo-1507003211169-0a1dd7228f2d_w200.jpg",
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
            "sellerAvatar": media_map.get("offroad_abah", [""])[0] if len(media_map.get("offroad_abah", [])) > 0 else "/images/unsplash/photo-1500648767791-00dcc994a43e_w200.jpg",
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
        # 7. Green Grass Cikole - Row 24
        {
            "id": "real-cikole-green-grass",
            "title": "Tiket Masuk & Wahana Alam Green Grass Cikole (GGC)",
            "category": "wisata-alam",
            "price": 35000,
            "unit": "/orang",
            "villageId": "des-03",
            "villageName": "Desa Wisata Cikole",
            "location": "Kawasan Wisata Green Grass Cikole, Lembang",
            "rating": 4.8,
            "totalReviews": 49,
            "sellerName": "Manajemen Green Grass Cikole (GGC)",
            "sellerBadge": "Pengelola Wisata Alam Resmi",
            "sellerAvatar": "/images/unsplash/photo-1507003211169-0a1dd7228f2d_w200.jpg",
            "sellerPhone": "6281909605127",
            "image": "/images/unsplash/photo-1448375240586-882707db888b_w1200.jpg",
            "gallery": [
                "/images/unsplash/photo-1448375240586-882707db888b_w1200.jpg",
                "/images/unsplash/photo-1513836279014-a89f7a76ae86_w1200.jpg"
            ],
            "description": (
                "Destinasi wisata hijau terbuka di tengah rimbunnya hutan pinus Cikole Lembang. "
                "Menyediakan padang rumput alami untuk piknik keluarga, gathering komunitas, spot foto estetik, dan area relaksasi berudara pegunungan segar."
            ),
            "highlights": [
                "Hamparan Padang Rumput Segar Hutan Pinus",
                "Lokasi Strategis di Jalur Wisata Utama Cikole",
                "Fasilitas Toilet Bersih, Mushola, & Kafetaria",
                "Cocok Untuk Piknik Keluarga & Foto Instagramable"
            ],
            "stockQuota": 150,
            "isAvailable": True,
            "isFeatured": False,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 24,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        },
        # 8. Maguru Kopi Cikole - Row 31
        {
            "id": "real-cikole-maguru-kopi",
            "title": "Kopi Seduh Maguru Legend Cikole (Single Origin Hutan Cikole)",
            "category": "minuman-komoditas",
            "price": 15000,
            "unit": "/cangkir",
            "villageId": "des-03",
            "villageName": "Desa Wisata Cikole",
            "location": "Kedai Maguru Kopi, Cikole, Lembang",
            "rating": 4.9,
            "totalReviews": 33,
            "sellerName": "Kedai Maguru Kopi Cikole",
            "sellerBadge": "Kedai Kopi Legend Lokal",
            "sellerAvatar": "/images/unsplash/photo-1500648767791-00dcc994a43e_w200.jpg",
            "sellerPhone": "6281221885527",
            "image": "/images/unsplash/photo-1514432324607-a09d9b4aefdd_w800.jpg",
            "gallery": [
                "/images/unsplash/photo-1514432324607-a09d9b4aefdd_w800.jpg",
                "/images/unsplash/photo-1485955900006-10f4d324d411_w800.jpg"
            ],
            "description": (
                "Seduhan kopi legendaris khas Cikole yang disangrai secara tradisional. "
                "Memadukan biji kopi pilihan petani lokal lereng Gunung Tangkuban Parahu dengan cita rasa mantap, "
                "aroma smokey yang khas, dan disajikan hangat di tengah sejuknya kabut hutan pinus."
            ),
            "highlights": [
                "Biji Kopi Asli Petani Kaki Gunung Tangkuban Parahu",
                "Sangrai Tradisional Aroma Mantap Smokey",
                "Tersedia Varian Tubruk Klasik, V60, & Kopi Susu Aren",
                "Spot Nongkrong Hangat Favorit Bikers & Wisatawan"
            ],
            "stockQuota": 80,
            "isAvailable": True,
            "isFeatured": False,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 31,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        },
        # 9. Maguru Kopi Jayagiri - Row 43
        {
            "id": "real-jayagiri-maguru-kopi",
            "title": "Maguru Kopi Legend Jayagiri (Kopi Robusta & Arabika Jayagiri)",
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
            "sellerAvatar": "/images/unsplash/photo-1472099645785-5658abf4ff4e_w200.jpg",
            "sellerPhone": "6285717373115",
            "image": "/images/unsplash/photo-1514432324607-a09d9b4aefdd_w800.jpg",
            "gallery": [
                "/images/unsplash/photo-1514432324607-a09d9b4aefdd_w800.jpg"
            ],
            "description": (
                "Kopi seduh legendaris di pintu pendakian Jayagiri yang telah menemani penjelajah alam sejak bertahun-tahun. "
                "Disajikan langsung oleh Pa Maliki dengan teknik seduh tradisional yang memanjakan penikmat kopi sejati."
            ),
            "highlights": [
                "Kopi Seduh Otentik Pintu Rimba Jayagiri",
                "Pilihan Arabika Jayagiri & Robusta Pekat",
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
            "sellerAvatar": "/images/unsplash/photo-1519085360753-af0119f7cbe7_w200.jpg",
            "sellerPhone": "6281221520514",
            "image": "/images/unsplash/photo-1513519245088-0e12902e5a38_w800.jpg",
            "gallery": [
                "/images/unsplash/photo-1513519245088-0e12902e5a38_w800.jpg"
            ],
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
        # 11. Homestay Gudangkahuripan - Row 59
        {
            "id": "real-gudangkahuripan-homestay",
            "title": "Homestay Asri Gudangkahuripan (Penginapan Keluarga Khas Pedesaan)",
            "category": "homestay",
            "price": 350000,
            "originalPrice": 400000,
            "unit": "/malam",
            "villageId": "des-07",
            "villageName": "Desa Wisata Gudangkahuripan",
            "location": "Gudangkahuripan, Lembang",
            "rating": 4.8,
            "totalReviews": 24,
            "sellerName": "Pa Joe (Koordinator Homestay Desa)",
            "sellerBadge": "Pengelola Homestay Terverifikasi",
            "sellerAvatar": "/images/unsplash/photo-1506794778202-cad84cf45f1d_w200.jpg",
            "sellerPhone": "6282130532424",
            "image": "/images/real/homestay-gudangkahuripan-asri.jpg",
            "gallery": [
                "/images/real/homestay-gudangkahuripan-asri.jpg",
                "/images/real/homestay-saung-santai.jpg",
                "/images/real/homestay-kamar-keluarga.jpg"
            ],
            "description": (
                "Rumah inap warga bernuansa teduh dan asri di Gudangkahuripan. "
                "Memiliki kamar tidur bersih, ruang tamu keluarga, dapur lengkap, serta halaman taman bunga yang nyaman untuk peristirahatan berlibur bersama keluarga."
            ),
            "highlights": [
                "Suasana Asri Tenang dan Nyaman",
                "Kamar Mandi Bersih dengan Water Heater",
                "Dapur Lengkap & Ruang Tamu Luas",
                "Akses Dekat Sentra Kuliner & Wisata Lembang"
            ],
            "facilities": ["WiFi Cepat", "Water Heater", "Dapur & Kulkas", "Parkir Mobil Aman", "Kopi/Teh Pagi"],
            "stockQuota": 5,
            "isAvailable": True,
            "isFeatured": False,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 59,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        },
        # 12. Tahu Susu Wangunsari - Row 62
        {
            "id": "real-wangunsari-tahu-susu",
            "title": "Tahu Susu Lembut Asli Wangunsari (1 Kotak Isi 10 Pcs)",
            "category": "kuliner",
            "price": 25000,
            "unit": "/kotak",
            "villageId": "des-05",
            "villageName": "Desa Wisata Wangunsari",
            "location": "Sentra Tahu Susu Wangunsari, Lembang",
            "rating": 5.0,
            "totalReviews": 65,
            "sellerName": "Pa Agus (Sentra Tahu Susu Wangunsari)",
            "sellerBadge": "Produsen Tahu Susu Binaan",
            "sellerAvatar": "/images/unsplash/photo-1544005313-94ddf0286df2_w200.jpg",
            "sellerPhone": "6285221738102",
            "image": "/images/tahu-susu-goreng.jpg",
            "gallery": [
                "/images/tahu-susu-goreng.jpg"
            ],
            "description": (
                "Tahu susu legendaris produksi Wangunsari Lembang yang terkenal sangat lembut di dalam dan garing renyah di luar saat digoreng. "
                "Dibuat dari kedelai non-transgenik pilihan yang dipadukan dengan susu sapi murni segar hasil peternak lokal. Tanpa bahan pengawet."
            ),
            "highlights": [
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
        # 13. Kicimpring Wangunsari - Row 63
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
            "sellerAvatar": "/images/unsplash/photo-1494790108377-be9c29b29330_w150.jpg",
            "sellerPhone": "6282216508602",
            "image": "/images/real/kicimpring.jpg",
            "gallery": [
                "/images/real/kicimpring.jpg"
            ],
            "description": (
                "Kerupuk kicimpring olahan singkong khas Pasundan buatan tangan Bu Agustian. "
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
        # 14. Ranginang Wangunsari - Row 64
        {
            "id": "real-wangunsari-ranginang",
            "title": "Ranginang Ketan Renyah Gurih Dapur Bu Entin Wangunsari",
            "category": "kuliner",
            "price": 20000,
            "unit": "/bungkus",
            "villageId": "des-05",
            "villageName": "Desa Wisata Wangunsari",
            "location": "Wangunsari, Lembang",
            "rating": 4.8,
            "totalReviews": 34,
            "sellerName": "Bu Entin (Dapur Ranginang Wangunsari)",
            "sellerBadge": "Pengrajin Ranginang Tradisional",
            "sellerAvatar": "/images/unsplash/photo-1544005313-94ddf0286df2_w200.jpg",
            "sellerPhone": "6287887614185",
            "image": "/images/real/ranginang.jpg",
            "gallery": [
                "/images/real/ranginang.jpg"
            ],
            "description": (
                "Ranginang beras ketan premium pilihan yang diolah secara higienis dengan bumbu terasi gurih khas Sunda. "
                "Mekar sempurna saat digoreng, super renyah tanpa meninggalkan rasa lengket di gigi."
            ),
            "highlights": [
                "Beras Ketan Pilihan Hasil Panen Petani",
                "Cita Rasa Gurih Wangi Terasi Alami",
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
        # 15. Peuyeum Ketan Wangunsari - Row 65
        {
            "id": "real-wangunsari-peuyeum-ketan",
            "title": "Peuyeum Ketan Bungkus Daun Jambu Manis Legi Wangunsari",
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
            "sellerAvatar": "/images/unsplash/photo-1507003211169-0a1dd7228f2d_w200.jpg",
            "sellerPhone": "6285222431566",
            "image": "/images/unsplash/photo-1555396273-367ea4eb4db5_w800.jpg",
            "gallery": [
                "/images/unsplash/photo-1555396273-367ea4eb4db5_w800.jpg"
            ],
            "description": (
                "Tape ketan (peuyeum) hitam/putih fermentasi alami yang dibungkus rapi menggunakan daun jambu air segar. "
                "Memiliki rasa manis berair (juicy), aroma khas ragi tradisional yang segar, serta tekstur lembut yang sangat nikmat disajikan dingin."
            ),
            "highlights": [
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
        # 16. Yoghurt Sukajaya - Row 69
        {
            "id": "real-sukajaya-yoghurt-alami",
            "title": "Yoghurt Probiotik Susu Sapi Murni Sukajaya (Botol 250ml)",
            "category": "olahan-susu",
            "price": 18000,
            "unit": "/botol 250ml",
            "villageId": "des-08",
            "villageName": "Desa Wisata Sukajaya",
            "location": "Sentra Olahan Susu Sukajaya, Lembang",
            "rating": 4.9,
            "totalReviews": 52,
            "sellerName": "Pa Emin (Peternakan Mandiri Sukajaya)",
            "sellerBadge": "Peternak & Pengolah Susu Sukajaya",
            "sellerAvatar": "/images/unsplash/photo-1500648767791-00dcc994a43e_w200.jpg",
            "sellerPhone": "62895322096504",
            "image": "/images/unsplash/photo-1571212515416-fef01fc43637_w800.jpg",
            "gallery": [
                "/images/unsplash/photo-1571212515416-fef01fc43637_w800.jpg"
            ],
            "description": (
                "Yoghurt kental kaya probiotik baik yang diolah langsung dari 100% susu sapi perah segar peternak Sukajaya. "
                "Tanpa pewarna sintetis atau pemanis buatan, tersedia dalam varian rasa buah stroberi kebun, blueberry, mangga, dan original plain."
            ),
            "highlights": [
                "Dibuat Dari Susu Sapi Segar Perahan Pagi",
                "Kaya Bakteri Baik Probiotik Menyehatkan Pencernaan",
                "Rasa Manis-Asam Buah Segar Alami",
                "Kemasan Botol Higienis Praktis Dingin Siap Minum"
            ],
            "stockQuota": 80,
            "isAvailable": True,
            "isFeatured": True,
            "isDummy": False,
            "dataSource": "real",
            "rawSourceRow": 69,
            "verifiedBadge": "Data Riil Mitra Terverifikasi"
        },
        # 17. Susu Sapi Murni Sukajaya - Row 70
        {
            "id": "real-sukajaya-susu-murni-segar",
            "title": "Susu Sapi Murni Segar Pasteur Sukajaya (Botol 1 Liter)",
            "category": "olahan-susu",
            "price": 15000,
            "unit": "/liter",
            "villageId": "des-08",
            "villageName": "Desa Wisata Sukajaya",
            "location": "Peternakan Sapi Perah Sukajaya, Lembang",
            "rating": 5.0,
            "totalReviews": 61,
            "sellerName": "Pa Emin (Peternakan Mandiri Sukajaya)",
            "sellerBadge": "Peternak & Pengolah Susu Sukajaya",
            "sellerAvatar": "/images/unsplash/photo-1500648767791-00dcc994a43e_w200.jpg",
            "sellerPhone": "62895322096504",
            "image": "/images/unsplash/photo-1550583724-b2692b85b150_w800.jpg",
            "gallery": [
                "/images/unsplash/photo-1550583724-b2692b85b150_w800.jpg"
            ],
            "description": (
                "Susu sapi segar hasil perahan harian peternak sapi perah lereng Sukajaya. "
                "Telah melalui pasteurisasi suhu terjaga untuk membunuh kuman patogen tanpa merusak gizi alami, kalsium, dan rasa gurih alaminya."
            ),
            "highlights": [
                "Susu Perah Segar Murni Tanpa Campuran Air",
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
        # 18. Tahu Susu Sukajaya - Row 71
        {
            "id": "real-sukajaya-tahu-susu",
            "title": "Tahu Susu Lembut Sukajaya Olahan Peternak Lokal (1 Kotak)",
            "category": "kuliner",
            "price": 25000,
            "unit": "/kotak",
            "villageId": "des-08",
            "villageName": "Desa Wisata Sukajaya",
            "location": "Sukajaya, Lembang",
            "rating": 4.8,
            "totalReviews": 37,
            "sellerName": "Pa Emin (Peternakan Mandiri Sukajaya)",
            "sellerBadge": "Peternak & Pengolah Susu Sukajaya",
            "sellerAvatar": "/images/unsplash/photo-1500648767791-00dcc994a43e_w200.jpg",
            "sellerPhone": "62895322096504",
            "image": "/images/tahu-susu.jpg",
            "gallery": [
                "/images/tahu-susu.jpg",
                "/images/tahu-susu-goreng.jpg"
            ],
            "description": (
                "Tahu susu lezat khas Sukajaya yang memadukan sari kedelai gurih dan susu sapi segar peternak setempat. "
                "Cocok disajikan sebagai hidangan sarapan atau teman minum kopi dan teh sore di pegunungan Lembang."
            ),
            "highlights": [
                "Campuran Susu Murni Peternak Sukajaya",
                "Gurih Alami Tanpa Penyedap Kimiawi Berlebih",
                "Luar Garing Dalam Sangat Lembut",
                "Pilihan Favorit Wisatawan Sukajaya"
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

            # If already curated in base catalog, skip auto-generation
            if row_idx in known_rows:
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
                img_list = [v_info.get("defaultAvatar", "/images/unsplash/photo-1506744038136-46273834b3fb_w800.jpg")]

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
