<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Saba Lembang - Platform Interdesa Kawasan Lembang

Platform pariwisata terpadu dan marketplace resmi untuk **Desa Wisata di Kawasan Lembang**, Kabupaten Bandung Barat, Jawa Barat.

> **Deskripsi Platform:**  
> *Saba Lembang menghubungkan wisatawan dengan keindahan alam pegunungan (1.200 - 1.400 mdpl), sembako & susu murni harian, tanaman hias, kopi specialty, buah & herba, kuliner khas, olahan susu, paket wisata alam, dan penginapan lokal langsung terhubung ke Admin Desa resmi tiap kawasan.*

> **Konteks Proyek & Kolaborasi Nyata:**  
> Dikembangkan sebagai karya Tugas Akhir / Skripsi program studi **Desain Komunikasi Visual (DKV)** dalam perancangan identitas visual, kampanye digital, dan media informasi interaktif desa wisata, berkolaborasi dengan jajaran **Pemerintah Desa & Pengurus Pokdarwis** di kawasan Lembang.

## 🏛️ Platform Interdesa Kawasan Lembang

Saat ini mencakup 6 Desa Wisata aktif (Desa Wisata Cibodas dan Cikahuripan disembunyikan sementara menunggu update data lanjutan):
1. **Desa Wisata Suntenjaya (1.290 mdpl):** Minuman & Komoditas (Kopi Arabika premium single origin lereng Palasari, Situs Megalitikum Batu Loceng). (Admin: *Kang Asep Suhendar*)
2. **Desa Wisata Cikole (1.400 mdpl):** Wisata Alam (Paket camping kanopi pinus, offroad rimba Sukawana Land Rover Abah). (Admin: *Kang Dadan Ridwan*)
3. **Desa Wisata Jayagiri (1.350 mdpl):** Kopi Spesialti (Maguru Kopi Pa Maliki lereng Jayagiri). (Admin: *Teh Eni Rohaeni*)
4. **Desa Wisata Wangunsari (1.200 mdpl):** Kuliner Tradisional (Tahu Susu lembut Rp 5.000/kemasan 10 pcs, Kicimpring Singkong, Ranginang terasi Rp 65.000/kg, Peuyeum Ketan PO). (Admin: *Kang Sandi Permana*)
5. **Desa Wisata Gudangkahuripan (1.220 mdpl):** Seni & Budaya (Paket Wisata Budaya Tari Jaipong & Gamelan Pa Mei Wisana). (Admin: *Kang Agus Hidayat*)
6. **Desa Wisata Sukajaya (1.260 mdpl):** Olahan Susu Kemasan (Susu Sapi Murni Pasteurisasi, Tahu Susu, Yoghurt Yoghvit & Mat Pochi Toko Barokah Pa Emin). (Admin: *Ibu Siti Maryam*)

## 🗺️ Fitur Peta Interaktif Kantor Desa

- **Dropdown Pemilih Desa:** Pengguna dapat memilih salah satu desa wisata dan peta lokasi Kantor Desa Google Maps embed langsung tampil secara presisi dengan rute Google Maps eksternal.
- **Tersedia di Beranda dan Profil Desa:** Terintegrasi langsung untuk memudahkan pencarian titik lokasi kantor desa secara akurat.

## 🚀 Portal Admin Desa & Keamanan Sistem

- 🎒 **Mode Pengunjung Bebas:** Pengunjung dapat langsung menjelajahi katalog desa, mencari produk/layanan, menambah ke keranjang, dan order WhatsApp tanpa perlu login.
- 🔐 **Portal Login Admin Desa (`/login`):**
  - **Daftar Kredensial Pengelola:**
    - **Super Admin Kawasan:** `admin.lembang` / `lembang2026`
    - **Desa Suntenjaya:** `pic.suntenjaya` / `suntenjaya123` (*Kang Asep Suhendar*)
    - **Desa Cikole:** `pic.cikole` / `cikole123` (*Kang Dadan Ridwan*)
    - **Desa Jayagiri:** `pic.jayagiri` / `jayagiri123` (*Teh Eni Rohaeni*)
    - **Desa Wangunsari:** `pic.wangunsari` / `wangunsari123` (*Kang Sandi Permana*)
    - **Desa Gudangkahuripan:** `pic.gudangkahuripan` / `gudang123` (*Kang Agus Hidayat*)
    - **Desa Sukajaya:** `pic.sukajaya` / `sukajaya123` (*Ibu Siti Maryam*)
    - *(PIC Cibodas & Cikahuripan dinonaktifkan sementara)*

## 📦 Aset Visual Lokal & Avatar Standar WhatsApp
Seluruh foto katalog produk, homestay, dan lanskap 7 desa aktif tersimpan secara lokal di folder `public/images/`. Untuk avatar profil Admin Desa, pembeli, ulasan, dan testimoni, sistem menerapkan avatar default *"no profile picture"* ala WhatsApp (`/images/default-avatar.svg` via komponen `<UserAvatar />`) yang bersih dan seragam, tanpa menggunakan foto wajah stok/dummy.

## 🛠️ Cara Menjalankan Aplikasi

1. Pasang dependensi (menggunakan Bun):
   ```bash
   bun install
   ```

2. Jalankan server pengembangan (Vite):
   ```bash
   bun run dev
   ```

3. Build untuk produksi:
   ```bash
   bun run build
   ```

4. Pemeriksaan Typecheck:
   ```bash
   bun run lint
   ```

## 🔄 Pipeline Pembersihan Data Riil Klien & Kompresi WebP (Adaptive Pipeline)

Platform dilengkapi script pemrosesan otomatis berbasis `uv` untuk membaca data riil lapangan dari klien tanpa mengubah file mentah (`assets/real_data_from_client/list produk unggulan marketplace lembang.tsv`):

```bash
# Jalankan pipeline pembersihan data riil dan kurasi gambar
uv run scripts/process_client_data.py
```

- **Data Provenance:** Produk ditandai secara transparan dengan metadata `dataSource: 'real'` (Data Riil Mitra) dan `dataSource: 'dummy'` (Simulasi / Mock) yang dapat difilter di Marketplace.
- **Kompresi Gambar WebP:** Foto DSLR/HP beresolusi besar (5-12MB) dikurasi dan dikonversi otomatis menjadi format WebP berkualitas tinggi dengan ukuran ringan (~60KB - 250KB) di `public/images/client/`.
- **Adaptif Terhadap Penambahan Baris Baru:** Setiap baris baru yang ditambahkan klien ke file TSV akan otomatis terdeteksi, dibersihkan nomor WhatsApp-nya, dan diintegrasikan ke modul TypeScript `src/data/realProducts.ts`.
- **Pelacak & Log Kurasi Media (Tracker):** Seluruh berkas gambar dan video yang diunduh dari klien (153 berkas) diaudit dan dicatat dalam manifes data `assets/real_data_from_client/media_curation_manifest.json` serta laporan transparan di `docs/MEDIA_CURATION_TRACKER.md`. Jika klien memasukkan foto baru ke folder unduhan, pelacak akan mendeteksinya secara otomatis.

### 📋 Alur Kerja Saat Ada Penambahan Data / Foto Baru:
1. **Jika Klien Mengirim Baris TSV Baru:** Cukup simpan perubahan di `assets/real_data_from_client/list produk unggulan marketplace lembang.tsv`.
2. **Jika Klien Mengirim Foto Baru:** Masukkan foto ke folder terkait di `assets/real_data_from_client/<Folder>/`.
3. **Jalankan Pipeline:**
   ```bash
   uv run scripts/process_client_data.py
   ```
4. **Verifikasi:** Jalankan `bun run lint && bun run build` dan periksa laporan kurasi terbaru di `docs/MEDIA_CURATION_TRACKER.md`.
