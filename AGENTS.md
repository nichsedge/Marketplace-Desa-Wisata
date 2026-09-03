# Repository Guidelines & Project Context (Saba Lembang)

## 📌 Project Background & Business Context
- **Nama Platform:** **Saba Lembang** (Jaringan & Platform Terpadu Desa Wisata Kawasan Lembang)
- **Target Pembeli / Klien Langsung:** Mahasiswa program studi **DKV (Desain Komunikasi Visual)** yang sedang menempuh Tugas Akhir / Skripsi (perancangan identitas visual, kampanye promosi digital, UI/UX portal pariwisata terpadu, dan media informasi desa wisata).
- **Cakupan Destinasi:** **Kawasan Lembang** (Kabupaten Bandung Barat), mencakup 8 Desa Wisata:
  1. **Desa Wisata Suntenjaya** (1.290 mdpl - Minuman & Komoditas: Kopi Arabika/Robusta premium, Kadaplak, Megalitikum Batu Loceng)
  2. **Desa Wisata Cibodas** (1.250 mdpl - Sembako & Penginapan Lokal: Sayuran organik segar, susu sapi harian, homestay & sewa rumah warga)
  3. **Desa Wisata Cikole** (1.400 mdpl - Wisata Alam: Paket camping, sewa tenda, tiket wahana, sewa offroad pinus)
  4. **Desa Wisata Jayagiri** (1.350 mdpl - Tanaman Hias: Tanaman hias, sukulen, media tanam, pot)
  5. **Desa Wisata Wangunsari** (1.200 mdpl - Kuliner: Tahu susu, bolu, camilan kering, kerajinan tangan)
  6. **Desa Wisata Cikahuripan** (1.280 mdpl - Buah & Herba serta Wisata Alam: Lemon segar, stroberi, herbal alami, camping & offroad)
  7. **Desa Wisata Gudangkahuripan** (1.220 mdpl - Kuliner: Tahu susu, bolu, camilan kering, kerajinan tangan)
  8. **Desa Wisata Sukajaya** (1.260 mdpl - Olahan Susu Kemasan: Yoghurt, keju lokal, mentega buatan rumahan)
- **Sistem Admin Desa & Alur Posting Konten:**
  - Istilah ramah pengguna awam: **"Admin Desa"** digunakan di seluruh antarmuka web.
  - Setiap desa memiliki Admin Desa resmi terverifikasi.
  - Alur transaksi fast-checkout WhatsApp menghubungkan wisatawan langsung ke kontak Admin Desa terkait.
  - Peta lokasi kantor desa interaktif (Google Maps embed) dan kontak/CP desa terhubung langsung via dropdown pemilih desa.
  - Bagian Sekretariat tidak ditampilkan sementara waktu menunggu kepastian data final. Silamot disembunyikan.

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
       - **PIC/Admin Cibodas:** `pic.cibodas` / `cibodas123` (*Kang Dadang Herdiana*)
       - **PIC/Admin Cikole:** `pic.cikole` / `cikole123` (*Kang Dadan Ridwan*)
       - **PIC/Admin Jayagiri:** `pic.jayagiri` / `jayagiri123` (*Teh Eni Rohaeni*)
       - **PIC/Admin Wangunsari:** `pic.wangunsari` / `wangunsari123` (*Kang Sandi Permana*)
       - **PIC/Admin Cikahuripan:** `pic.cikahuripan` / `cikahuripan123` (*Kang Cecep Mulyana*)
       - **PIC/Admin Gudangkahuripan:** `pic.gudangkahuripan` / `gudang123` (*Kang Agus Hidayat*)
       - **PIC/Admin Sukajaya:** `pic.sukajaya` / `sukajaya123` (*Ibu Siti Maryam*)
       - **Super Admin Kawasan:** `admin.lembang` / `lembang2026`
     - Dasbor dilindungi barrier guard sehingga pengguna publik tidak dapat mengubah data katalog desa.

---

## 💻 Tech Stack & Deployment
- **Runtime & Package Manager:** **Bun** (`bun` v1.3+)
- **Frontend SPA:** React 19 + TypeScript + Vite 6
- **Styling:** Tailwind CSS v4 + Motion (`framer-motion`) + Lucide React
- **Hosting / Deployment:** Vercel SPA (Hobby tier gratis, konfigurasi rewrite di `vercel.json`).
- **Domain Target:** Menyesuaikan konfigurasi domain klien (*Custom Domain*)
- **Aset Gambar Lokal (Offline-Ready):** Seluruh aset foto katalog produk, avatar Admin Desa, dan galeri desa tersimpan lokal di `public/images/` untuk menjamin tampilan tidak pernah hilang atau lambat saat demo / presentasi.

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
```
