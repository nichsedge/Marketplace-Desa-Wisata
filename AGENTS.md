# Repository Guidelines & Project Context (Saba Lembang)

## 📌 Project Background & Business Context
- **Nama Platform:** **Saba Lembang** (Platform Interdesa Kawasan Lembang)
- **Target Pembeli / Klien Langsung:** Mahasiswa program studi **DKV (Desain Komunikasi Visual)** yang sedang menempuh Tugas Akhir / Skripsi (perancangan identitas visual, kampanye promosi digital, UI/UX portal pariwisata terpadu, dan media informasi desa wisata).
- **Cakupan Destinasi:** **Kawasan Lembang** (Kabupaten Bandung Barat), saat ini mencakup 6 Desa Wisata aktif (Desa Wisata Cibodas dan Cikahuripan disembunyikan/dihapus sementara waktu per 1/10/26 menunggu kepastian update data survei riil dari klien):
  1. **Desa Wisata Suntenjaya** (1.290 mdpl - Minuman & Komoditas: Kopi Arabika premium single origin lereng Palasari, Situs Megalitikum Batu Loceng)
  2. **Desa Wisata Cikole** (1.400 mdpl - Wisata Alam: Paket camping pinus, sewa tenda kanopi, tiket wahana, offroad rimba Sukawana Land Rover Abah)
  3. **Desa Wisata Jayagiri** (1.350 mdpl - Kopi Spesialti: Maguru Kopi Pa Maliki)
  4. **Desa Wisata Wangunsari** (1.200 mdpl - Kuliner Tradisional: Tahu Susu Lembut, Kicimpring Singkong, Ranginang rasa terasi, Peuyeum Ketan PO)
  5. **Desa Wisata Gudangkahuripan** (1.220 mdpl - Seni & Budaya: Paket Pelatihan Wisata Budaya Tari Jaipong & Gamelan Pa Mei Wisana)
  6. **Desa Wisata Sukajaya** (1.260 mdpl - Olahan Susu Kemasan: Susu Sapi Murni Pasteurisasi, Tahu Susu, Yoghurt Yoghvit & Mat Pochi Toko Barokah Pa Emin)
- **Sistem Admin Desa & Alur Posting Konten:**
  - Istilah ramah pengguna awam: **"Admin Desa"** digunakan di seluruh antarmuka web.
  - Setiap desa memiliki Admin Desa resmi terverifikasi.
  - Alur transaksi fast-checkout WhatsApp menghubungkan wisatawan langsung ke kontak pengelola/penjual resmi.
  - Menu / seksi *"Kontak & Layanan Admin Desa"* di peta lokasi ditiadakan per 1/10/26 sesuai arahan klien agar antarmuka fokus ke peta lokasi presisi kantor desa.
  - Bagian Sekretariat dan Silamot disembunyikan.

---

## 💰 Kesepakatan Finansial & Protokol Penyerahan (*Escrow & Handover Rules*)
- **Estimasi Nilai Total Kesepakatan Proyek:** **Rp 7.500.000** *(Hasil negosiasi / potensi akhir)*
- **Status Pembayaran Saat Ini:**
  - **Dana Masuk / Diterima:** **Rp 3.000.000**
    - DP Awal: Rp 1.500.000 *(Lunas / Telah Diterima)*
    - Termin 2: Rp 1.500.000 *(Lunas / Telah Diterima)*
  - **Sisa Tagihan:** **Rp 4.500.000** *(Menunggu Pelunasan Sesuai Milestone)*
- **Protokol Keamanan Kode & Penyerahan (*Anti-Fraud / Anti-Ghosting Guidelines*):**
  1. **Strict Source Code Protection:** **DILARANG KERAS** menyerahkan repository GitHub, akses kolaborator tulis, atau file arsip `.zip` source code sebelum pembayaran lunas 100% (Rp 7.500.000).
  2. **Live Demo Control:** Selama proses bimbingan dosen, gladi bersih, dan sidang skripsi, klien hanya diberikan tautan aktif (*Live Preview URL*) di Vercel yang berada di bawah kepemilikan akun developer.
  3. **Milestone Pembayaran & Pelunasan:**
     - **Termin Lanjutan / Pelunasan (Rp 4.500.000):** Menjelang/pasca sidang saat serah terima resmi repository GitHub dan transfer kepemilikan proyek secara penuh.

---

## 🎨 Standar Desain & Estetika (DKV-Grade UI/UX)
1. **Tipografi Editorial & Modern:**
   - Judul / Headline: `Playfair Display` (serif elegan bernuansa budaya Pasundan & alam pegunungan).
   - Antarmuka / Teks Isi: `Plus Jakarta Sans` (sans-serif bersih, modern, dan sangat terbaca).
2. **Palet Warna Alam Pasundan:**
   - Hijau Zamrud Pegunungan (`emerald-800`, `emerald-900`).
   - Emas Panen Padi & Kopi (`amber-300`, `amber-400`, `amber-500`).
   - Latar Hangat Organik (`amber-50/30`, `stone-50`).
   - Abu Arang Kontras (`stone-800`, `stone-900`, `stone-950`).
3. **Akses Pengguna & Autentikasi Admin Desa (Direct `/login` URL):**
   - **Default View (Wisatawan / Pembeli):** Antarmuka publik murni untuk pembeli umum tanpa tombol login yang mengganggu. Pengunjung dapat menjelajah 8 desa, melihat detail produk, menambahkan ke keranjang, dan checkout WhatsApp langsung tanpa perlu login.
   - **Akses Langsung Admin Desa (`/login` / `#login`):**
     - Pengelola desa masuk dengan langsung mengetikkan rute `/login` (atau `/#login`, `/admin`) pada address bar browser.
     - Akun pengelola yang terdaftar di sistem:
       - **PIC/Admin Suntenjaya:** `pic.suntenjaya` / `suntenjaya123` (*Kang Asep Suhendar*)
       - **PIC/Admin Cikole:** `pic.cikole` / `cikole123` (*Kang Dadan Ridwan*)
       - **PIC/Admin Jayagiri:** `pic.jayagiri` / `jayagiri123` (*Teh Eni Rohaeni*)
       - **PIC/Admin Wangunsari:** `pic.wangunsari` / `wangunsari123` (*Kang Sandi Permana*)
       - **PIC/Admin Gudangkahuripan:** `pic.gudangkahuripan` / `gudang123` (*Kang Agus Hidayat*)
       - **PIC/Admin Sukajaya:** `pic.sukajaya` / `sukajaya123` (*Ibu Siti Maryam*)
       - **Super Admin Kawasan:** `admin.lembang` / `lembang2026`
       - *(PIC Cibodas & Cikahuripan dinonaktifkan sementara)*
     - Dasbor dilindungi barrier guard sehingga pengguna publik tidak dapat mengubah data katalog desa.

---

## 💻 Tech Stack & Deployment
- **Runtime & Package Manager:** **Bun** (`bun` v1.3+)
- **Frontend SPA:** React 19 + TypeScript + Vite 6
- **Styling:** Tailwind CSS v4 + Motion (`framer-motion`) + Lucide React
- **Hosting / Deployment:** Vercel SPA (Hobby tier gratis, konfigurasi rewrite di `vercel.json`).
- **Domain Target:** Menyesuaikan konfigurasi domain klien (*Custom Domain*)
- **Aset Gambar Lokal & Avatar Standar:** Seluruh aset foto katalog produk dan galeri desa tersimpan lokal di `public/images/`. Profil pengguna, Admin Desa, ulasan, dan testimoni menggunakan avatar standar *"no profile picture"* ala WhatsApp (`public/images/default-avatar.svg` via komponen `<UserAvatar />`) dan dilarang memakai foto wajah orang dummy/stok Unsplash.

---

## 🧭 Key Views & Routing
Routing dikendalikan via state terpusat `useApp().navigateTo(page: PageRoute)`:
- `home`: Landing page hero Kawasan Lembang, spotlight 8 desa wisata, peta kantor desa interaktif & CP, search cerdas.
- `marketplace`: Katalog terpadu produk 8 kelompok produk komoditas desa dengan filter desa, kelompok, dan harga.
- `product-detail`: Detail produk/homestay, kalkulator malam inap dinamis, share Web API, ulasan, checkout WA Admin Desa.
- `homestay`: Kurasi homestay & sewa rumah warga pegunungan dengan filter desa.
- `paket-wisata`: Aktivitas edukasi, live-in, offroad rimba, dan wisata alam pegunungan.
- `desa-detail`: Direktori, profil, dan peta lokasi kantor desa & CP 8 desa wisata di Kawasan Lembang.
- `cart`: Ringkasan pesanan dan modal penerbitan E-Ticket resmi siap cetak (`window.print()`).
- `auth`: Autentikasi pengelola/Admin Desa.
- `dashboard`: Dasbor Admin Desa untuk posting konten foto aktual, kelola data desa, dan pantau pesanan.

---

## 🛠️ Verification & Build Commands
```bash
# Typecheck
bun run lint

# Production Build
bun run build

# Development Server
bun run dev

# Client Real Data Pipeline (Clean TSV & WebP Image Compression)
uv run scripts/process_client_data.py
```

---

## 🔄 Client Data Ingestion & Media Processing Pipeline
- **Raw Data Integrity:** File `assets/real_data_from_client/list produk unggulan marketplace lembang.tsv` bersifat **strictly read-only / immutable**. Script pipeline tidak pernah menimpa file mentah klien.
- **Adaptive Execution:** Menggunakan toolchain Python modern via `uv run scripts/process_client_data.py` dengan metadata PEP 723 (`pillow`, `pillow-heif`).
- **Data Provenance Rule (Backend Metadata Only):**
  - Data riil klien di-generate ke `src/data/realProducts.ts` dengan metadata `dataSource: 'real'`, `isDummy: false`, `rawSourceRow: <row_idx>`, dan `verifiedBadge: 'Data Riil Mitra Terverifikasi'`.
  - Data mock katalog dipertahankan dengan metadata `dataSource: 'dummy'`, `isDummy: true`, dan `verifiedBadge: 'Data Simulasi / Mock'`.
  - **Aturan Ketat Frontend (FE):** Pembedaan data riil vs dummy hanya berada di level metadata data/backend. Seluruh label/badge seperti *"Data Riil Mitra"*, *"Simulasi"*, *"Mock"*, atau filter provenance **DILARANG** ditampilkan di antarmuka publik (Frontend/FE) agar seluruh katalog tampil utuh, imersif, dan representatif untuk sidang Tugas Akhir (TA) DKV.
- **Optimasi Gambar WebP:**
  - Seluruh gambar klien dikurasi, dirotasi otomatis via EXIF transpose, dan di-downsample menjadi format WebP berkualitas 82% (ukuran berkurang >95% dari ~10MB ke ~100KB-250KB) di `public/images/client/`.
- **Media Curation Tracker (`docs/MEDIA_CURATION_TRACKER.md`):**
  - Seluruh 153 berkas aset media (foto & video) di folder unduhan klien diaudit lengkap dengan nama folder, nama file, status keputusan (Hero, Galeri, atau Skipped), serta penjelasan kurasi spesifik.
  - Tracker bersifat dinamis dan otomatis mendeteksi jika ada foto baru yang ditambahkan klien ke folder unduhan saat `uv run scripts/process_client_data.py` dijalankan kembali. Manifes disimpan di `assets/real_data_from_client/media_curation_manifest.json`.

---

## 🤖 Future Agent Ingestion Playbook (Alur Kerja Saat Klien Menambah Data / Foto)

Ketika user/klien mengabarkan penambahan data baru, seluruh AI Agent **WAJIB** mengikuti panduan standar berikut:

### Skenario 1: Klien Menambah Baris Baru di File TSV
1. Pastikan file TSV tersimpan di `assets/real_data_from_client/list produk unggulan marketplace lembang.tsv` (ingat: **JANGAN PERNAH** menimpa/mengubah format file mentah ini).
2. Jalankan pipeline langsung:
   ```bash
   uv run scripts/process_client_data.py
   ```
3. Skrip akan secara otomatis:
   - Mendeteksi baris baru via `parse_tsv_adaptive()`.
   - Menormalisasi nomor telepon WA menjadi format internasional `628...`.
   - Mengonversi harga teks ke angka nominal integer rupiah.
   - Mengaitkan desa ke salah satu dari 8 Desa Wisata (`des-01` s/d `des-08`).
   - Meng-generate produk baru ke `src/data/realProducts.ts` dengan metadata `dataSource: 'real'` dan `isDummy: false`.
4. Jalankan verifikasi integritas build:
   ```bash
   bun run lint && bun run build
   ```

### Skenario 2: Klien Menambahkan Foto Baru ke Folder Unduhan
1. Letakkan foto/video baru ke folder terkait di `assets/real_data_from_client/<Nama Folder>/`.
2. Jalankan pipeline:
   ```bash
   uv run scripts/process_client_data.py
   ```
3. Skrip akan secara otomatis:
   - Memindai berkas baru dan mencatatnya ke `assets/real_data_from_client/media_curation_manifest.json`.
   - Menilai resolusi dan format (JPEG, PNG, HEIC).
   - Mengompresi gambar ke WebP (kualitas 82%, max width 1200px/900px, <250KB) ke `public/images/client/<slug>/`.
   - Memperbarui tabel evaluasi & alasan kurasi di `docs/MEDIA_CURATION_TRACKER.md`.
4. Jika ingin menetapkan foto tertentu sebagai **Hero** atau memberikan *copywriting* narasi khusus:
   - Tambahkan aturan spesifik pada `KNOWN_CURATION_RULES` di `scripts/media_tracker.py`.
   - Jalankan ulang `uv run scripts/process_client_data.py`.

### Aturan Ketat untuk Agent:
* **Strict Immutability:** Dilarang mengedit atau menghapus isi mentah `assets/real_data_from_client/list produk unggulan marketplace lembang.tsv`.
* **Strict uv run:** Selalu gunakan `uv run scripts/process_client_data.py` (DILARANG menambahkan `python`).
* **Verifikasi Wajib:** Setiap ada pembaruan data real, wajib jalankan `bun run lint && bun run build` untuk menjamin tidak ada regresi tipe TypeScript.
