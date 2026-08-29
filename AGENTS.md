# Repository Guidelines & Project Context (sabasunten.id / Saba Lembang)

## 📌 Project Background & Business Context
- **Nama Platform:** **Saba Lembang** (Jaringan & Platform Terpadu Desa Wisata Kawasan Lembang - `sabasunten.id`)
- **Target Pembeli / Klien Langsung:** Mahasiswa program studi **DKV (Desain Komunikasi Visual)** yang sedang menempuh Tugas Akhir / Skripsi (perancangan identitas visual, kampanye promosi digital, UI/UX portal pariwisata terpadu, dan media informasi desa wisata).
- **Cakupan Destinasi:** **Kawasan Lembang** (Kabupaten Bandung Barat), mencakup 5 Desa Wisata unggulan:
  1. **Desa Wisata Suntenjaya** (1.290 mdpl - Pasir Angling, Megalitikum Batu Loceng, Kopi Arabika, Kadaplak, Sapi Perah)
  2. **Desa Wisata Cibodas** (1.250 mdpl - Agrowisata Bunga Potong, Lembah Maribaya, Greenhouse Paprika)
  3. **Desa Wisata Cikole** (1.400 mdpl - Hutan Pinus Tangkuban Parahu, Glamping, Kopi Hutan, Offroad)
  4. **Desa Wisata Jayagiri** (1.350 mdpl - Pintu Rimba, Trekking Gunung, Perkebunan Teh Alami)
  5. **Desa Wisata Wangunsari** (1.200 mdpl - Agrowisata Petik Stroberi, Seni Tradisi Budaya Sunda, Kerajinan Bambu)
- **Sistem PIC Multi-Desa & Alur Posting Konten (Bagan Wireframe):**
  - Tiap desa memiliki Person in Charge (PIC) resmi terverifikasi.
  - PIC dapat mengunggah foto aktual langsung dari perangkat/kamera atau memilih galeri foto riil Lembang.
  - Flow 4-step wizard: Beranda PIC (`+ Tambah Post`) ➔ Pilih Media (Kamera / File / Galeri) ➔ Isi Detail (Judul, Deskripsi, Harga, Stok, Kategori) ➔ Beranda (Status Terverifikasi Aktif).
  - Alur transaksi fast-checkout WhatsApp menghubungkan wisatawan langsung ke kontak PIC desa terkait.

---

## 💰 Kesepakatan Finansial & Protokol Penyerahan (*Escrow & Handover Rules*)
- **Nilai Total Kesepakatan Proyek:** **Rp 5.000.000**
- **Status Pembayaran Saat Ini:**
  - **DP Awal (30%):** Rp 1.500.000 *(Lunas / Telah Diterima)*
  - **Sisa Tagihan (70%):** Rp 3.500.000 *(Menunggu Pelunasan Sesuai Milestone)*
- **Protokol Keamanan Kode & Penyerahan (*Anti-Fraud / Anti-Ghosting Guidelines*):**
  1. **Strict Source Code Protection:** **DILARANG KERAS** menyerahkan repository GitHub, akses kolaborator tulis, atau file arsip `.zip` source code sebelum pembayaran lunas 100% (Rp 5.000.000).
  2. **Live Demo Control:** Selama proses bimbingan dosen, gladi bersih, dan sidang skripsi, klien hanya diberikan tautan aktif (*Live Preview URL*) di Vercel yang berada di bawah kepemilikan akun developer.
  3. **Milestone Pembayaran:**
     - **Termin 2 (Rp 2.000.000):** Menjelang pelaksanaan sidang skripsi / presentasi audiensi kepala desa (klien butuh sistem stabil tanpa watermark).
     - **Termin 3 / Pelunasan (Rp 1.500.000):** Pasca sidang saat serah terima resmi repository GitHub dan transfer kepemilikan proyek.

---

## 🎨 Standar Desain & Estetika (DKV-Grade UI/UX)
1. **Tipografi Editorial & Modern:**
   - Judul / Headline: `Playfair Display` (serif elegan bernuansa budaya luhur Sunda & alam pegunungan).
   - Antarmuka / Teks Isi: `Plus Jakarta Sans` (sans-serif bersih, modern, dan sangat terbaca).
2. **Palet Warna Alam Pasundan:**
   - Hijau Zamrud Pegunungan (`emerald-800`, `emerald-900`).
   - Emas Panen Padi & Kopi (`amber-300`, `amber-400`, `amber-500`).
   - Latar Hangat Organik (`amber-50/30`, `stone-50`).
   - Abu Arang Kontras (`stone-800`, `stone-900`, `stone-950`).
3. **Akses Pengguna & Autentikasi PIC Desa (Direct `/login` URL):**
   - **Default View (Wisatawan / Pembeli):** Antarmuka publik murni untuk pembeli umum tanpa tombol login yang mengganggu. Pengunjung dapat menjelajah 5 desa, melihat detail produk, menambahkan ke keranjang, dan checkout WhatsApp langsung tanpa perlu login.
   - **Akses Langsung Admin / PIC (`/login` / `#login`):**
     - Pengelola/PIC desa masuk dengan langsung mengetikkan rute `/login` (atau `/#login`, `/admin`) pada address bar browser.
     - **Tampilan Standar Produksi Asli (100% Client-Side Static):**
       - Tampilan login card profesional dan minimalis setara platform web produksi modern (tanpa watermark prototype atau tabel demo yang terlihat di UI).
       - Field Username/Email, Kata Sandi, Ingat Saya, dan bantuan Lupa Kata Sandi.
       - Validasi autentikasi instan dengan animasi loading spinner bersih.
       - Akun pengelola yang terdaftar di sistem:
         - **PIC Suntenjaya:** `pic.suntenjaya` / `suntenjaya123` (*Kang Asep Suhendar*)
         - **PIC Cibodas:** `pic.cibodas` / `cibodas123` (*Kang Dadang Herdiana*)
         - **PIC Cikole:** `pic.cikole` / `cikole123` (*Kang Dadan Ridwan*)
         - **PIC Jayagiri:** `pic.jayagiri` / `jayagiri123` (*Teh Eni Rohaeni*)
         - **PIC Wangunsari:** `pic.wangunsari` / `wangunsari123` (*Kang Sandi Permana*)
         - **Super Admin Kawasan:** `admin.lembang` / `lembang2026`
     - **Otorisasi Berbasis Peran & Desa (Strict Scope):**
       - Setiap akun PIC hanya memiliki hak akses untuk mengelola katalog, foto aktual, profil desa, dan pesanan masuk khusus untuk desa yang menjadi tanggung jawabnya (misal: *Kang Asep Suhendar* hanya mengelola Desa Wisata Suntenjaya).
       - Tidak ada widget atau dropdown *Ganti PIC (Demo)* di UI. Penggantian akun dilakukan secara resmi melalui alur *Keluar Akun* dan *Login* kembali.
     - Dasbor PIC dilindungi barrier guard sehingga pengguna publik tidak dapat mengedit katalog desa.
     - Saat PIC telah login, menu profil PIC dan tombol logout akan muncul di header.

---

## 💻 Tech Stack & Deployment
- **Runtime & Package Manager:** **Bun** (`bun` v1.3+)
- **Frontend SPA:** React 19 + TypeScript + Vite 6
- **Styling:** Tailwind CSS v4 + Motion (`framer-motion`) + Lucide React
- **Hosting / Deployment:** Vercel SPA (Hobby tier gratis, konfigurasi rewrite di `vercel.json`).
- **Domain Target:** `sabasunten.id`

---

## 🧭 Key Views & Routing
Routing dikendalikan via state terpusat `useApp().navigateTo(page: PageRoute)`:
- `home`: Landing page hero Kawasan Lembang, spotlight 5 desa wisata, search pintar multi-desa.
- `marketplace`: Katalog terpadu produk 5 desa Lembang dengan filter desa, kategori, dan harga.
- `product-detail`: Detail produk/homestay, kalkulator malam inap dinamis, share Web API, ulasan, checkout WA PIC.
- `homestay`: Kurasi homestay & glamping pegunungan 1.200 - 1.400 mdpl dengan filter desa.
- `paket-wisata`: Aktivitas edukasi, live-in, offroad rimba, dan trekking Tangkuban Parahu.
- `desa-detail`: Direktori & profil lengkap 5 desa wisata di Kawasan Lembang.
- `cart`: Ringkasan pesanan dan modal penerbitan E-Ticket resmi siap cetak (`window.print()`).
- `auth`: Autentikasi dan pengalih peran instan demo (Wisatawan vs 5 Akun PIC Desa).
- `dashboard`: Dasbor PIC Desa untuk posting konten foto aktual, kelola profil desa, dan pantau pesanan.

---

## 🛠️ Verification & Build Commands
```bash
# Typecheck
bun run lint

# Production Build
bun run build

# Development Server
bun run dev
```
