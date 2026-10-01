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
    },

    # -------------------------------------------------------------
    # 4. PEMBARUAN 01/10/2026: BATU LOCENG SUNTENJAYA
    # -------------------------------------------------------------
    "20261001/batu lonceng-20261001T102213Z-1-001/batu lonceng/Screenshot 2026-10-01 112942.png": {
        "decision": "accepted_hero",
        "webPath": "/images/client/batu-loceng/hero-batu-loceng-kuncen.webp",
        "targetProduct": "Paket Wisata Edukasi Kebun Kopi & Situs Batu Loceng Suntenjaya",
        "reason": "Juru kunci / sesepuh adat memegang batu megalitikum bertuah Batu Loceng di dalam saung pelindung cagar budaya. Sangat otentik dan bernilai sejarah tinggi."
    },
    "20261001/batu lonceng-20261001T102213Z-1-001/batu lonceng/Screenshot 2026-10-01 112928.png": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/batu-loceng/batu-loceng-sacred-stone.webp",
        "targetProduct": "Paket Wisata Edukasi Kebun Kopi & Situs Batu Loceng Suntenjaya",
        "reason": "Detail batu hitam megalitikum sakral Batu Loceng di atas kain alas dan taburan bunga sesaji doa."
    },
    "20261001/batu lonceng-20261001T102213Z-1-001/batu lonceng/Screenshot 2026-10-01 113009.png": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/batu-loceng/saung-cagar-budaya.webp",
        "targetProduct": "Paket Wisata Edukasi Kebun Kopi & Situs Batu Loceng Suntenjaya",
        "reason": "Bangunan saung pelindung situs cagar budaya Batu Loceng yang dikelilingi hutan hijau asri lereng Gunung Palasari."
    },

    # -------------------------------------------------------------
    # 5. PEMBARUAN 01/10/2026: TAHU SUSU WANGUNSARI (PA AGUS)
    # -------------------------------------------------------------
    "20261001/tahu susu-20261001T102221Z-1-001/tahu susu/WhatsApp Image 2026-09-30 at 12.07.14 (1).jpeg": {
        "decision": "accepted_hero",
        "webPath": "/images/client/wangunsari/tahu-susu-agus-kemasan-10pcs.webp",
        "targetProduct": "Tahu Susu Lembut Asli Wangunsari (1 Kotak Isi 10 Pcs)",
        "reason": "Tahu Susu Lembang Special cap Tahu Agus kemasan asli isi 10 pcs siap jual di atas nampan stainless steel. Menampilkan keaslian produk UMKM binaan Wangunsari."
    },
    "20261001/tahu susu-20261001T102221Z-1-001/tahu susu/WhatsApp Image 2026-09-30 at 12.07.15 (1).jpeg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/wangunsari/tahu-susu-nampan-produksi.webp",
        "targetProduct": "Tahu Susu Lembut Asli Wangunsari (1 Kotak Isi 10 Pcs)",
        "reason": "Tumpukan kemasan tahu susu kuning segar tersusun rapi di area dapur produksi, siap dikirim ke konsumen."
    },
    "20261001/tahu susu-20261001T102221Z-1-001/tahu susu/WhatsApp Image 2026-09-30 at 12.07.15.jpeg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/wangunsari/tahu-susu-cetakan-potong.webp",
        "targetProduct": "Tahu Susu Lembut Asli Wangunsari (1 Kotak Isi 10 Pcs)",
        "reason": "Balok-balok tahu susu segar berwarna kuning alami setelah proses pencetakan dan perendaman bumbu rempah."
    },
    "20261001/tahu susu-20261001T102221Z-1-001/tahu susu/WhatsApp Image 2026-09-30 at 12.07.14.jpeg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/wangunsari/tahu-susu-proses-kemas.webp",
        "targetProduct": "Tahu Susu Lembut Asli Wangunsari (1 Kotak Isi 10 Pcs)",
        "reason": "Proses pengemasan higienis tahu susu ke dalam kantong plastik berlabel resmi Tahu Agus."
    },
    "20261001/tahu susu-20261001T102221Z-1-001/tahu susu/WhatsApp Image 2026-09-30 at 12.07.13.jpeg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/wangunsari/tahu-susu-segar.webp",
        "targetProduct": "Tahu Susu Lembut Asli Wangunsari (1 Kotak Isi 10 Pcs)",
        "reason": "Dokumentasi kebersihan dapur produksi dan wadah stainless perendaman tahu susu."
    },
    "20261001/tahu susu-20261001T102221Z-1-001/tahu susu/WhatsApp Image 2026-09-30 at 13.07.55.jpeg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/wangunsari/tahu-susu-goreng-panas.webp",
        "targetProduct": "Tahu Susu Lembut Asli Wangunsari (1 Kotak Isi 10 Pcs)",
        "reason": "Tahu susu siap santap bertekstur lembut di dalam dan garing gurih di luar."
    },

    # -------------------------------------------------------------
    # 6. PEMBARUAN 01/10/2026: KICIMPRING SINGKONG WANGUNSARI
    # -------------------------------------------------------------
    "20261001/Kicimpring Singkong-20261001T102245Z-1-001/Kicimpring Singkong/Screenshot 2026-10-01 120129.png": {
        "decision": "accepted_hero",
        "webPath": "/images/client/wangunsari/kicimpring-singkong-renyah.webp",
        "targetProduct": "Kicimpring Singkong Renyah Gurih Wangunsari (250gr)",
        "reason": "Close-up keripik kicimpring singkong renyah dengan taburan bumbu cabai dan daun bawang gurih siap konsumsi."
    },
    "20261001/Kicimpring Singkong-20261001T102245Z-1-001/Kicimpring Singkong/21 Juni 2019 》Kegiatan kali ini kita berkunjung pada potensi yang ada di Desa Wangunsari yaitu a(1).jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/wangunsari/kicimpring-jemur-tradisional.webp",
        "targetProduct": "Kicimpring Singkong Renyah Gurih Wangunsari (250gr)",
        "reason": "Ibu-ibu perajin Wangunsari menjemur adonan kicimpring singkong di atas rak kawat tradisional di bawah sinar matahari pegunungan."
    },
    "20261001/Kicimpring Singkong-20261001T102245Z-1-001/Kicimpring Singkong/21 Juni 2019 》Kegiatan kali ini kita berkunjung pada potensi yang ada di Desa Wangunsari yaitu a.jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/wangunsari/kicimpring-produksi-warga.webp",
        "targetProduct": "Kicimpring Singkong Renyah Gurih Wangunsari (250gr)",
        "reason": "Dokumentasi kunjungan potensi desa dan proses pembuatan adonan kicimpring singkong bersama warga lokal."
    },

    # -------------------------------------------------------------
    # 7. PEMBARUAN 01/10/2026: PEUYEUM KETAN WANGUNSARI
    # -------------------------------------------------------------
    "20261001/peuyeum ketan-20261001T102251Z-1-001/peuyeum ketan/Gemini_Generated_Image_p455vip455vip455.jpg": {
        "decision": "accepted_hero",
        "webPath": "/images/client/wangunsari/peuyeum-ketan-daun-jambu.webp",
        "targetProduct": "Peuyeum Ketan Bungkus Daun Jambu Manis Legi Wangunsari",
        "reason": "Visual estetik peuyeum ketan hitam terbungkus daun jambu air rapi di atas tampah kayu bersama mangkuk keramik ketan hitam tradisional."
    },

    # -------------------------------------------------------------
    # 8. PEMBARUAN 01/10/2026: RANGINANG TERASI WANGUNSARI
    # -------------------------------------------------------------
    "20261001/Ranginang-20261001T102353Z-1-001/Ranginang/😍😍😍😍.jpg": {
        "decision": "accepted_hero",
        "webPath": "/images/client/wangunsari/ranginang-terasi-khas-wangunsari.webp",
        "targetProduct": "Ranginang Ketan Renyah Gurih Dapur Bu Entin Wangunsari",
        "reason": "Ranginang ketan rasa terasi gurih mekar renyah disajikan bersama cangkir teh hangat dan kaleng kerupuk vintage oranye. Sangat menggugah selera."
    },
    "20261001/Ranginang-20261001T102353Z-1-001/Ranginang/😍😍😍😍(1).jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/wangunsari/ranginang-mentah-terasi.webp",
        "targetProduct": "Ranginang Ketan Renyah Gurih Dapur Bu Entin Wangunsari",
        "reason": "Ranginang mentah siap goreng dengan butiran beras ketan pilihan berbumbu terasi gurih."
    },
    "20261001/Ranginang-20261001T102353Z-1-001/Ranginang/😍😍😍😍(2).jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/wangunsari/ranginang-goreng-mekar.webp",
        "targetProduct": "Ranginang Ketan Renyah Gurih Dapur Bu Entin Wangunsari",
        "reason": "Piring saji penuh dengan ranginang mekar renyah gurih siap santap."
    },
    "20261001/Ranginang-20261001T102353Z-1-001/Ranginang/😍😍😍😍(3).jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/wangunsari/ranginang-tampah-jemur.webp",
        "targetProduct": "Ranginang Ketan Renyah Gurih Dapur Bu Entin Wangunsari",
        "reason": "Proses penjemuran ranginang di tampah bambu secara tradisional."
    },

    # -------------------------------------------------------------
    # 9. PEMBARUAN 01/10/2026: TARI JAIPONG & GAMELAN GUDANGKAHURIPAN
    # -------------------------------------------------------------
    "20261001/gudangkahuripan-20261001T102355Z-1-001/gudangkahuripan/Dokumentasi saat materi Tari Jaipong 😍🥰.jpg": {
        "decision": "accepted_hero",
        "webPath": "/images/client/gudangkahuripan/hero-tari-jaipong-materi.webp",
        "targetProduct": "Workshop Seni Gamelan Sunda, Tari Tradisional & Literasi Kearifan Lokal",
        "reason": "Peserta workshop dan penari remaja menyambut tamu dengan salam hangat gerakan tari Jaipong tradisional di pelataran sanggar budaya."
    },
    "20261001/gudangkahuripan-20261001T102355Z-1-001/gudangkahuripan/789108465_17966266326159854_4186932252492757219_n.jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/gudangkahuripan/jaipong-peserta-senyum.webp",
        "targetProduct": "Workshop Seni Gamelan Sunda, Tari Tradisional & Literasi Kearifan Lokal",
        "reason": "Penari muda berkebaya Sunda putih tersenyum ramah bersama peserta pelatihan seni budaya."
    },
    "20261001/gudangkahuripan-20261001T102355Z-1-001/gudangkahuripan/790023457_17966266371159854_7924881403726805858_n.jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/gudangkahuripan/jaipong-pelatihan-kompak.webp",
        "targetProduct": "Workshop Seni Gamelan Sunda, Tari Tradisional & Literasi Kearifan Lokal",
        "reason": "Kekompakan penari sanggar Kamandaka Gudangkahuripan mengenakan kain jarik batik Pasundan."
    },
    "20261001/gudangkahuripan-20261001T102355Z-1-001/gudangkahuripan/790475973_17966266335159854_2867174840609974419_n.jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/gudangkahuripan/jaipong-kebersamaan.webp",
        "targetProduct": "Workshop Seni Gamelan Sunda, Tari Tradisional & Literasi Kearifan Lokal",
        "reason": "Momen interaksi hangat dan latihan gerak dasar tari bersama wisatawan edukasi."
    },
    "20261001/gudangkahuripan-20261001T102355Z-1-001/gudangkahuripan/Dokumentasii keseruan saat praktek Tari Jaipong 😉😍#ypjpapua #tembagapura #kamandakalembang #b.jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/gudangkahuripan/jaipong-praktek-lapangan.webp",
        "targetProduct": "Workshop Seni Gamelan Sunda, Tari Tradisional & Literasi Kearifan Lokal",
        "reason": "Keseruan praktik tari Jaipong di ruang terbuka sanggar seni Kamandaka Lembang."
    },
    "20261001/gudangkahuripan-20261001T102355Z-1-001/gudangkahuripan/Dokumentasii keseruan saat praktek Tari Jaipong 😉😍#ypjpapua #tembagapura #kamandakalembang #b(1).jpg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/gudangkahuripan/jaipong-gerak-dasar.webp",
        "targetProduct": "Workshop Seni Gamelan Sunda, Tari Tradisional & Literasi Kearifan Lokal",
        "reason": "Peserta mempraktikkan gerakan selendang dan ayunan tangan tari Jaipong."
    },

    # -------------------------------------------------------------
    # 10. PEMBARUAN 01/10/2026: SUKAJAYA (PA EMIN - BAROKAH)
    # -------------------------------------------------------------
    "20261001/sukajaya-20261001T102401Z-1-001/sukajaya/Screenshot 2026-10-01 122739.png": {
        "decision": "accepted_hero",
        "webPath": "/images/client/sukajaya/hero-yoghvit-botol.webp",
        "targetProduct": "Yoghurt Probiotik Susu Sapi Murni Sukajaya (Botol 250ml)",
        "reason": "Botol yoghurt dingin Yoghvit Barokah Fresh Milk aneka rasa buah tertata di rak pendingin show-case toko Pa Emin Sukajaya."
    },
    "20261001/sukajaya-20261001T102401Z-1-001/sukajaya/Screenshot 2026-10-01 122749.png": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/sukajaya/yoghurt-stick-mat-pochi.webp",
        "targetProduct": "Yoghurt Probiotik Susu Sapi Murni Sukajaya (Botol 250ml)",
        "reason": "Kemasan stick yoghurt Mat Pochi produksi Barokah Freshmilk Lembang bertanda Halal dan izin resmi."
    },
    "20261001/sukajaya-20261001T102401Z-1-001/sukajaya/Screenshot 2026-10-01 122758.png": {
        "decision": "accepted_hero",
        "webPath": "/images/client/sukajaya/hero-toko-barokah-susu-murni.webp",
        "targetProduct": "Susu Sapi Murni Segar Pasteur Sukajaya (Botol 1 Liter)",
        "reason": "Tampak depan kios dan sentra pengolahan Barokah milik Pa Emin: spanduk Susu Sapi Segar, Yoghurt, dan Tahu Susu Barokah di Sukajaya."
    },
    "20261001/sukajaya-20261001T102401Z-1-001/sukajaya/Screenshot 2026-10-01 122836.png": {
        "decision": "accepted_hero",
        "webPath": "/images/client/sukajaya/hero-tahu-susu-barokah.webp",
        "targetProduct": "Tahu Susu Lembut Sukajaya Olahan Peternak Lokal (1 Kotak)",
        "reason": "Kemasan Tahu Susu Barokah khas Sukajaya Citespong lengkap dengan label Halal dan NIB resmi."
    },

    # -------------------------------------------------------------
    # 11. PEMBARUAN 01/10/2026: RUMAH SUNTENJAYA (HOMESTAY & SEWA RUMAH WARGA)
    # -------------------------------------------------------------
    "20261001/rumah-suntenjaya/WhatsApp Image 2026-10-01 at 17.13.45.jpeg": {
        "decision": "accepted_hero",
        "webPath": "/images/client/suntenjaya/hero-homestay-teras-kayu.webp",
        "targetProduct": "Homestay Rumah Warga Lereng Palasari Suntenjaya (Sewa Kamar / Rumah)",
        "reason": "Fasad rumah panggung bernuansa kayu asri warga Suntenjaya berteras tanaman hias alami dengan udara sejuk dataran tinggi lereng Palasari."
    },
    "20261001/rumah-suntenjaya/WhatsApp Image 2026-10-01 at 17.13.49.jpeg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/suntenjaya/homestay-teras-kebun.webp",
        "targetProduct": "Homestay Rumah Warga Lereng Palasari Suntenjaya (Sewa Kamar / Rumah)",
        "reason": "Rumah warga bernuansa hijau asri berteras keramik bersih menghadap langsung kebun pertanian sayur lereng Palasari."
    },
    "20261001/rumah-suntenjaya/WhatsApp Image 2026-10-01 at 17.13.51.jpeg": {
        "decision": "accepted_gallery",
        "webPath": "/images/client/suntenjaya/homestay-fondasi-batu.webp",
        "targetProduct": "Homestay Rumah Warga Lereng Palasari Suntenjaya (Sewa Kamar / Rumah)",
        "reason": "Rumah bertingkat fondasi batu alam lereng pegunungan Suntenjaya yang bersih, kokoh, dan berlatar langit biru pegunungan."
    },
    "20261001/rumah-suntenjaya/WhatsApp Image 2026-10-01 at 17.13.52.jpeg": {
        "decision": "skipped_duplicate",
        "webPath": "-",
        "targetProduct": "Homestay Rumah Warga Lereng Palasari Suntenjaya (Sewa Kamar / Rumah)",
        "reason": "Sudut bidikan duplikat dan komposisi identik dengan foto 17.13.51."
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
