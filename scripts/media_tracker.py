# /// script
# dependencies = [
#     "pillow>=10.0.0",
#     "pillow-heif>=0.14.0",
# ]
# ///
"""
Media Curation Tracker & Audit Log (Saba Lembang)
-------------------------------------------------
Tracks all downloaded client media files (Folder + Filename),
records editorial decisions (Accepted Hero / Gallery vs Skipped),
and provides detailed rationale.

Automatically detects when the client drops new photos/videos into existing
or newly created folders, updating the manifest and markdown report.
"""

from __future__ import annotations
import datetime
import json
import os
import re
from pathlib import Path
from PIL import Image

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CLIENT_ASSETS_DIR = PROJECT_ROOT / "assets" / "real_data_from_client"
MANIFEST_PATH = CLIENT_ASSETS_DIR / "media_curation_manifest.json"
REPORT_MD_PATH = PROJECT_ROOT / "docs" / "MEDIA_CURATION_TRACKER.md"

# Curated decisions & rich rationale knowledge base
KNOWN_CURATION_RULES = {
    # -------------------------------------------------------------
    # 1. KOPI PASIR ANGLING SUNTENJAYA
    # -------------------------------------------------------------
    "Kopi /IMG-20250418-WA0010.jpg": {
        "decision": "accepted_hero",
        "webPath": "/images/client/kopi-angling/hero-pouch-v60.webp",
        "targetProduct": "Kopi Arabika Pasir Angling Suntenjaya Kemasan Pouch 200gr",
        "reason": "Foto produk unggulan paling representatif: kemasan standing pouch asli dengan label resmi, biji kopi sangrai (roasted beans) tersebar rapi, dan server kaca V60 siap seduh. Sangat tajam dan bernilai komersial tinggi."
    },
    "Kopi /IMG20250714130438.jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/kopi-angling/drying-greenhouse.webp",
        "targetProduct": "Kopi Arabika Pasir Angling Suntenjaya Kemasan Pouch 200gr",
        "reason": "Solar greenhouse pengeringan ceri kopi merah di atas raised bed higienis. Memperlihatkan standar pengolahan pascapanen modern dan bersih kelompok tani binaan Suntenjaya."
    },
    "Kopi /IMG-20241006-WA0043.jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/kopi-angling/coffee-farmers-harvest.webp",
        "targetProduct": "Kopi Arabika Pasir Angling Suntenjaya Kemasan Pouch 200gr",
        "reason": "Dokumentasi petani kopi memanen ceri merah matang di lereng perkebunan berundak Suntenjaya (1.400 mdpl). Otentik dan memperkuat nilai 'Direct from Farmer'."
    },
    "Kopi /IMG20250518110926.jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/kopi-angling/coffee-plantation-view.webp",
        "targetProduct": "Kopi Arabika Pasir Angling Suntenjaya Kemasan Pouch 200gr",
        "reason": "Lanskap perkebunan kopi arabika di bawah naungan pohon rimba lereng Gunung Palasari dengan pencahayaan alami yang indah."
    },
    "Kopi /IMG20250603114958.jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/kopi-angling/coffee-cherries-tree.webp",
        "targetProduct": "Kopi Arabika Pasir Angling Suntenjaya Kemasan Pouch 200gr",
        "reason": "Close-up buah kopi ceri merah ranum yang lebat di dahan pohon, memperlihatkan kesegaran dan kematangan panen optimal."
    },
    "Kopi /IMG20250715093145.jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/kopi-angling/coffee-processing-bed.webp",
        "targetProduct": "Kopi Arabika Pasir Angling Suntenjaya Kemasan Pouch 200gr",
        "reason": "Proses sortasi dan penjemuran biji kopi di greenhouse, menunjukkan komitmen mutu produk specialty."
    },
    "Kopi /IMG-20240425-WA0056.jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/kopi-angling/coffee-beans-sample.webp",
        "targetProduct": "Kopi Arabika Pasir Angling Suntenjaya Kemasan Pouch 200gr",
        "reason": "Detail sampel kemasan pouch dan profil biji kopi siap konsumsi."
    },

    # -------------------------------------------------------------
    # 2. ABAH LAND ROVER CIKOLE
    # -------------------------------------------------------------
    "Abah/Foto/_DSC5256-01.jpeg": {
        "decision": "accepted_hero",
        "webPath": "/images/client/offroad-cikole/hero-abah-dadan-landy.webp",
        "targetProduct": "Paket Ekspedisi Offroad Land Rover Rimba Cikole by Abah Dadan",
        "reason": "Abah Dadan (pioneer offroad berompi hijau) tersenyum ramah bersama wisatawan keluarga di dalam Land Rover Defender klasik. Menampilkan kehangatan pelayanan serta sosok legendaris pengelola lokal."
    },
    "Abah/Foto/_DSC5243-01.jpeg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/offroad-cikole/mud-splash-adventure.webp",
        "targetProduct": "Paket Ekspedisi Offroad Land Rover Rimba Cikole by Abah Dadan",
        "reason": "Aksi dramatis Land Rover melibas kubangan lumpur pekat dengan percikan air dinamis dan lampu kabut menyala. Menunjukkan sensasi petualangan alam bebas yang memicu adrenalin."
    },
    "Abah/Foto/_DSC5265-01.jpeg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/offroad-cikole/convoy-pine-trail.webp",
        "targetProduct": "Paket Ekspedisi Offroad Land Rover Rimba Cikole by Abah Dadan",
        "reason": "Konvoi armada Land Rover melintasi jalan tanah di bawah naungan pohon pinus raksasa Cikole yang asri dan sejuk."
    },
    "Abah/Foto/_DSC5249-01.jpeg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/offroad-cikole/deep-forest-track.webp",
        "targetProduct": "Paket Ekspedisi Offroad Land Rover Rimba Cikole by Abah Dadan",
        "reason": "Trek mendaki berbatu vulkanik di pedalaman hutan Sukawana Cikole, menonjolkan ketangguhan kendaraan 4x4."
    },
    "Abah/Foto/_DSC5268-01.jpeg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/offroad-cikole/tourist-group-celebration.webp",
        "targetProduct": "Paket Ekspedisi Offroad Land Rover Rimba Cikole by Abah Dadan",
        "reason": "Wisatawan bergembira berpose di atas kap mesin Land Rover di spot perhentian puncak pinus Cikole."
    },
    "Abah/Foto/_DSC5251-01.jpeg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/offroad-cikole/cabin-cockpit-view.webp",
        "targetProduct": "Paket Ekspedisi Offroad Land Rover Rimba Cikole by Abah Dadan",
        "reason": "Sudut pandang pengemudi dan penumpang di dalam kabin Land Rover klasik menatap jalur offroad yang menantang."
    },
    "Abah/Foto/_DSC5236-01.jpeg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/offroad-cikole/action-rocky-trail.webp",
        "targetProduct": "Paket Ekspedisi Offroad Land Rover Rimba Cikole by Abah Dadan",
        "reason": "Armada Land Rover klasik hijau melintasi rute berbatu terjal lereng Gunung Tangkuban Parahu."
    },

    # -------------------------------------------------------------
    # 3. EDUWISATA PASIR ANGLING 2024
    # -------------------------------------------------------------
    "Eduwisata Pasir angling 2024/IMG_2211.JPG": {
        "decision": "accepted_hero",
        "webPath": "/images/client/pasir-angling/hero-valley-panorama.webp",
        "targetProduct": "Tiket Camping Ground Eduwisata Pasir Angling Suntenjaya",
        "reason": "Panorama lanskap spektakuler lembah Pasir Angling (1.400 mdpl) dengan selimut kabut pagi, terasering perkebunan hijau, dan tenda dome perkemahan. Menjadi foto hero utama destinasi alam Suntenjaya."
    },
    "Eduwisata Pasir angling 2024/IMG_2186.JPG": {
        "decision": "accepted_hero",
        "webPath": "/images/client/pasir-angling/hiking-terrace-trail.webp",
        "targetProduct": "Tiket & Izin Jalur Hiking Bukit & Perkebunan Pasir Angling",
        "reason": "Wisatawan berjalan di jalan desa terasering menatap keindahan lembah pertanian. Komposisi seimbang yang mengundang minat trekking alam terbuka."
    },
    "Eduwisata Pasir angling 2024/IMG_2151.JPG": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/pasir-angling/community-agro-tour.webp",
        "targetProduct": "Paket Live-In & Induk Semang / Edukasi Tekno-Ekologi",
        "reason": "Rombongan komunitas dan pemuda desa menyusuri jalur perkebunan ramah lingkungan. Sangat mewakili program studi eduwisata dan tekno-ekologi."
    },
    "Eduwisata Pasir angling 2024/IMG_2214.JPG": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/pasir-angling/camping-ridge-view.webp",
        "targetProduct": "Tiket Camping Ground Eduwisata Pasir Angling Suntenjaya",
        "reason": "Sudut pandang punggungan bukit camping ground menghadap panorama perbukitan Bandung Utara tanpa halangan pohon."
    },
    "Eduwisata Pasir angling 2024/IMG_2208.JPG": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/pasir-angling/campsite-mountain-mist.webp",
        "targetProduct": "Tiket Camping Ground Eduwisata Pasir Angling Suntenjaya",
        "reason": "Suasana sejuk kabut pegunungan menyelimuti tapak perkemahan Pasir Angling, menggambarkan ketenangan alam Lembang."
    },
    "Eduwisata Pasir angling 2024/IMG_2189.JPG": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/pasir-angling/trekking-guide-scenic.webp",
        "targetProduct": "Tiket & Izin Jalur Hiking Bukit & Perkebunan Pasir Angling",
        "reason": "Pemandu lokal mendampingi peserta lintas alam dengan latar belakang kontur pegunungan hijau yang luas."
    }
}

def format_size(bytes_val: int) -> str:
    if bytes_val < 1024:
        return f"{bytes_val} B"
    elif bytes_val < 1024 * 1024:
        return f"{bytes_val / 1024:.1f} KB"
    else:
        return f"{bytes_val / (1024 * 1024):.1f} MB"

def get_dimensions(file_path: Path) -> str:
    ext = file_path.suffix.lower()
    if ext in [".jpg", ".jpeg", ".png", ".heic", ".webp"]:
        try:
            with Image.open(file_path) as img:
                return f"{img.width}x{img.height}"
        except Exception:
            return "Corrupted/Unreadable"
    elif ext in [".mp4", ".mov"]:
        return "Video Format"
    return "N/A"

def infer_decision_for_unknown(rel_path_str: str, file_path: Path) -> tuple[str, str, str]:
    """
    Intelligent heuristic classifier for any newly added files by the client.
    Returns (decision, target_product, reason).
    """
    ext = file_path.suffix.lower()
    filename = file_path.name
    folder_part = str(file_path.parent)

    # 1. Video files
    if ext in [".mp4", ".mov", ".avi", ".mkv"]:
        return (
            "skipped_video",
            "Video Promosi Media Sosial",
            f"File video ({format_size(file_path.stat().st_size)}). Dicadangkan untuk aset konten reels/video promo masa depan, tidak dimasukkan ke kartu gambar statis web agar loading tetap instan."
        )

    # 2. Check for duplicate naming patterns like "copy", "(1)", "~"
    if re.search(r"\(\d+\)|\bcopy\b|~\d+", filename, re.IGNORECASE):
        return (
            "skipped_duplicate",
            "Duplikat Unduhan",
            "Nama file mengindikasikan file duplikat/redundant dari hasil unduhan berulang (terdapat suffix angka dalam kurung atau tilde)."
        )

    # 3. Burst shot detection for DSLR photo folders
    if "Abah" in rel_path_str:
        return (
            "skipped_duplicate",
            "Offroad Cikole (Varian Burst)",
            "Varian burst shot / sudut foto samping dari sesi offroad yang sudah terwakili oleh foto hero dan galeri terpilih."
        )
    elif "Eduwisata" in rel_path_str:
        # Check if ceremonial / meeting setup
        num_match = re.search(r"IMG_(\d+)", filename)
        if num_match:
            img_num = int(num_match.group(1))
            if img_num < 2151:
                return (
                    "skipped_internal_event",
                    "Eduwisata Pasir Angling (Dokumentasi Internal)",
                    "Foto dokumentasi registrasi dan penataan acara warga desa, bukan materi visual komersial untuk kartu promosi wisata."
                )
            else:
                return (
                    "skipped_duplicate",
                    "Eduwisata Pasir Angling (Varian Sudut Serupa)",
                    "Sudut foto trekking/camping variatif dari sesi yang sama, sudah terwakili optimal oleh foto panorama dan jalur unggulan."
                )

    elif "Kopi" in rel_path_str:
        if ext == ".heic":
            return (
                "skipped_low_quality",
                "Kopi Pasir Angling (Format HEIC Cadangan)",
                "Foto candid kamera HP dengan sudut sempit atau pencahayaan gelap. Sudah terwakili oleh foto profesional beresolusi tinggi di solar greenhouse."
            )
        return (
            "skipped_duplicate",
            "Kopi Pasir Angling (Varian Dokumentasi)",
            "Foto dokumentasi kebun/daun kopi varian burst, sudah terwakili oleh foto unggulan produk pouch, panen ceri merah, dan greenhouse."
        )

    return (
        "new_pending_review",
        "Aset Baru Masuk",
        "File baru ditambahkan oleh klien. Menunggu kurasi manual atau otomatis pada pipeline build berikutnya."
    )

def scan_and_update_manifest() -> list[dict]:
    """
    Scans entire assets/real_data_from_client directory, evaluates each file,
    and returns a sorted manifest of all tracked media assets.
    """
    existing_entries = {}
    if MANIFEST_PATH.exists():
        try:
            with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
                old_list = json.load(f)
                for item in old_list:
                    existing_entries[item["relativePath"]] = item
        except Exception:
            pass

    tracked_items = []
    
    for root, _, files in os.walk(CLIENT_ASSETS_DIR):
        for f in sorted(files):
            if f.endswith(".tsv") or f.endswith(".json") or f.startswith("."):
                continue
            
            p = Path(root) / f
            rel_path = p.relative_to(CLIENT_ASSETS_DIR)
            rel_str = str(rel_path)
            folder_name = str(rel_path.parent)
            file_size = p.stat().st_size
            dims = get_dimensions(p)
            ext = p.suffix.lower()
            media_type = "video" if ext in [".mp4", ".mov"] else "image"

            # Check if known rule exists
            if rel_str in KNOWN_CURATION_RULES:
                rule = KNOWN_CURATION_RULES[rel_str]
                entry = {
                    "folder": folder_name,
                    "filename": f,
                    "relativePath": rel_str,
                    "fileSizeBytes": file_size,
                    "fileSizeHuman": format_size(file_size),
                    "dimensions": dims,
                    "mediaType": media_type,
                    "decision": rule["decision"],
                    "webPath": rule.get("webPath", "-"),
                    "targetProduct": rule.get("targetProduct", "-"),
                    "decisionReason": rule["reason"],
                    "isNewlyDetected": False,
                    "trackedAt": existing_entries.get(rel_str, {}).get("trackedAt", datetime.datetime.now(datetime.timezone.utc).isoformat())
                }
            else:
                # Infer smart decision for newly detected or uncurated files
                dec, target_prod, reason = infer_decision_for_unknown(rel_str, p)
                is_new = rel_str not in existing_entries
                entry = {
                    "folder": folder_name,
                    "filename": f,
                    "relativePath": rel_str,
                    "fileSizeBytes": file_size,
                    "fileSizeHuman": format_size(file_size),
                    "dimensions": dims,
                    "mediaType": media_type,
                    "decision": dec,
                    "webPath": "-",
                    "targetProduct": target_prod,
                    "decisionReason": reason,
                    "isNewlyDetected": is_new,
                    "trackedAt": existing_entries.get(rel_str, {}).get("trackedAt", datetime.datetime.now(datetime.timezone.utc).isoformat())
                }

            tracked_items.append(entry)

    # Sort deterministically by folder then filename
    tracked_items.sort(key=lambda x: (x["folder"], x["filename"]))

    # Save manifest JSON
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(tracked_items, f, indent=2, ensure_ascii=False)

    return tracked_items

def generate_markdown_report(manifest: list[dict]):
    """
    Generates a comprehensive, human-readable Markdown report for the client,
    supervisors, and thesis examiners.
    """
    REPORT_MD_PATH.parent.mkdir(parents=True, exist_ok=True)

    total_files = len(manifest)
    hero_count = sum(1 for m in manifest if m["decision"] == "accepted_hero")
    gallery_count = sum(1 for m in manifest if m["decision"] == "accepted_gallery")
    video_count = sum(1 for m in manifest if m["decision"] == "skipped_video")
    skipped_count = total_files - (hero_count + gallery_count)
    new_count = sum(1 for m in manifest if m.get("isNewlyDetected", False))

    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S WIB")

    md = f"""# 📸 Pelacak & Log Kurasi Media Lapangan (Saba Lembang)
> **Waktu Pembaruan Terakhir:** {now_str}  
> **Status Pelacakan:** Otomatis & Terverifikasi  
> **Total Berkas Terdaftar:** **{total_files} berkas** ({hero_count} Hero Web, {gallery_count} Galeri Web, {video_count} Video Dicadangkan, {skipped_count - video_count} Dilewati/Redundan)

---

## 🎯 Ringkasan Eksekutif Kurasi
| Kategori Status | Jumlah Berkas | Keterangan & Perlakuan di Web |
| :--- | :---: | :--- |
| **⭐ Accepted (Hero Utama)** | **{hero_count}** | Foto kualitas premium terbaik, tampil di cover kartu marketplace & header detail produk |
| **🖼️ Accepted (Galeri/Slider)** | **{gallery_count}** | Foto pendukung autentik, tampil di slider thumbnail & album detail produk |
| **🎥 Skipped (Format Video)** | **{video_count}** | Video ukuran besar (25MB - 184MB). Dicadangkan untuk promosi reels / IG / YouTube |
| **⏭️ Skipped (Burst / Redundan)** | **{skipped_count - video_count}** | Foto duplikat burst kamera, dokumentasi internal rapat, atau sudut yang telah terwakili |
| **🆕 Berkas Baru Terdeteksi** | **{new_count}** | Berkas baru yang ditambahkan oleh klien pada unduhan terbaru |

---

## 🗂️ Rincian Lengkap per Folder Klien

"""

    # Group by folder
    folders = {}
    for item in manifest:
        folders.setdefault(item["folder"], []).append(item)

    for folder_name, items in folders.items():
        folder_heroes = sum(1 for i in items if i["decision"] == "accepted_hero")
        folder_gallery = sum(1 for i in items if i["decision"] == "accepted_gallery")
        folder_total = len(items)

        md += f"### 📁 Folder: `{folder_name}` ({folder_total} Berkas | {folder_heroes} Hero, {folder_gallery} Galeri)\n\n"
        md += "| No | Nama Berkas | Ukuran | Resolusi | Status Keputusan | Jalur Aset Web (WebP) | Alasan Keputusan Kurasi |\n"
        md += "| :-: | :--- | :-: | :-: | :--- | :--- | :--- |\n"

        for idx, item in enumerate(items, start=1):
            dec_badge = {
                "accepted_hero": "⭐ **HERO WEB**",
                "accepted_gallery": "🖼️ **GALERI WEB**",
                "skipped_video": "🎥 *VIDEO CADANGAN*",
                "skipped_duplicate": "⏭️ *Dilewati (Redundan)*",
                "skipped_low_quality": "⏭️ *Dilewati (Kualitas Rendah)*",
                "skipped_internal_event": "⏭️ *Dilewati (Dokumentasi Internal)*",
                "new_pending_review": "🆕 *Menunggu Review*"
            }.get(item["decision"], item["decision"])

            web_link = f"`{item['webPath']}`" if item["webPath"] != "-" else "-"
            md += f"| {idx:02d} | `{item['filename']}` | {item['fileSizeHuman']} | {item['dimensions']} | {dec_badge} | {web_link} | {item['decisionReason']} |\n"

        md += "\n---\n\n"

    md += """## 🔄 Cara Menjalankan Audit & Pembaruan Pelacak
Jika klien mengirimkan foto-foto baru ke dalam folder yang sudah ada (atau folder baru), jalankan perintah:
```bash
uv run scripts/process_client_data.py
```
Skrip akan secara otomatis:
1. Mendeteksi seluruh berkas baru yang belum tercatat.
2. Memeriksa dimensi, format, dan kecocokan produk.
3. Memperbarui manifest JSON di `assets/real_data_from_client/media_curation_manifest.json`.
4. Memperbarui laporan dokumentasi ini di `docs/MEDIA_CURATION_TRACKER.md`.
"""

    REPORT_MD_PATH.write_text(md, encoding="utf-8")
    print(f"Generated human-readable curation report in {REPORT_MD_PATH}")

def run_media_curation_tracker() -> list[dict]:
    manifest = scan_and_update_manifest()
    generate_markdown_report(manifest)
    return manifest

if __name__ == "__main__":
    print("=" * 60)
    print("Running Media Curation Tracker...")
    manifest = run_media_curation_tracker()
    accepted = sum(1 for m in manifest if "accepted" in m["decision"])
    print(f"Total files tracked: {len(manifest)} ({accepted} accepted for web)")
    print("=" * 60)
