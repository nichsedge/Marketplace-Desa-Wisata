# Repository Guidelines & Project Context (sabasunten.id)

## 📌 Project Background & Business Context
- **Target Pembeli / Klien Langsung:** Mahasiswa program studi **DKV (Desain Komunikasi Visual)** yang sedang menempuh Tugas Akhir / Skripsi (perancangan identitas visual, kampanye promosi digital, UI/UX portal pariwisata terpadu, dan media informasi desa wisata).
- **Kolaborasi Nyata dengan Pemerintah Desa:** Klien (mahasiswa DKV) telah menjalin komunikasi langsung secara riil dengan jajaran **Pemerintah Desa Suntenjaya** (Kecamatan Lembang, Kabupaten Bandung Barat) dan pengurus **Pokdarwis Saba Sunten**.
- **Kondisi Lapangan Terkini (Desa):**
  - Rekening kas desa / BUMDes dan QRIS merchant resmi belum diterbitkan oleh pihak desa.
  - Alur transaksi sengaja difokuskan pada **Fast-Checkout WhatsApp Terotomasi** langsung ke kontak resmi Pokdarwis Saba Sunten (`+62 821-2233-4455`), bukan payment gateway rumit. Ini merupakan alur yang paling realistis, dipercaya warga, dan bebas potongan merchant.
  - E-Ticket dan bukti reservasi diterbitkan resmi di sisi front-end lengkap dengan kode booking unik, QR Code kedatangan, dan siap cetak PDF (`window.print()`).

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

## 🏛️ Profil & Domain Resmi Desa Suntenjaya
Portal diselaraskan dengan data resmi Pemerintah Desa Suntenjaya dan portal kependudukan **SILAMOT** (`desasuntenjaya.site`):
- **Kepala Desa:** H. Asep Wahyono
- **Sekretaris Desa:** Iwan Setiawan
- **Ketua Pokdarwis Saba Sunten:** Kang Asep Suhendar
- **Wilayah:** 845 Ha | **Penduduk:** 12.450 Jiwa | **Ketinggian:** 1.290 mdpl
- **4 Wilayah Dusun:**
  1. **Dusun I (Pasir Angling):** Homestay lereng tertinggi, spot sunrise, agrowisata sayur organik terasering. (Kadus: Hilman Nugraha)
  2. **Dusun II (Batu Loceng):** Cagar budaya megalitikum Batu Loceng, saung budaya, kebun Kopi Arabika Single Origin. (Kadus: Kiki Andrian)
  3. **Dusun III (Cikawari & Bincarung):** Hutan pinus Taman Bincarung, sentra sapi perah murni KPSBU Lembang. (Kadus: Vicky Permana Putra)
  4. **Dusun IV (Suntenjaya Pusat):** Kantor Desa & Layanan SILAMOT, kerajinan miniatur kereta kayu Kadaplak, olahan susu. (Kadus: Sandi Agustin E.P.)

---

## 🎨 Standar Desain & Estetika (DKV-Grade UI/UX)
Karena ditujukan untuk sidang skripsi DKV dan presentasi audiensi ke jajaran kepala desa:
1. **Tipografi Editorial & Modern:**
   - Judul / Headline: `Playfair Display` (serif elegan bernuansa budaya luhur Sunda).
   - Antarmuka / Teks Isi: `Plus Jakarta Sans` (sans-serif bersih, modern, dan sangat terbaca).
2. **Palet Warna Alam Pasundan:**
   - Hijau Zamrud Pegunungan (`emerald-800`, `emerald-900`).
   - Emas Panen Padi & Kopi (`amber-300`, `amber-400`, `amber-500`).
   - Latar Hangat Organik (`amber-50/30`, `stone-50`).
   - Abu Arang Kontras (`stone-800`, `stone-900`, `stone-950`).
3. **Pengalih Peran Instan (Demo Mode Switcher):**
   - Header Navbar dilengkapi tombol 1-klik untuk berganti perspektif:
     - **Mode Wisatawan (`Budi Santoso`)**: Menjelajahi 4 dusun, kalkulasi lama inap homestay, keranjang belanja, cetak e-ticket.
     - **Mode BUMDes (`Kang Asep Suhendar`)**: Membuka dashboard pengelola BUMDes untuk mengelola katalog produk dusun dan memantau pesanan wisatawan.

---

## 💻 Tech Stack & Deployment
- **Runtime & Package Manager:** **Bun** (`bun` v1.3+)
- **Frontend SPA:** React 19 + TypeScript + Vite 6
- **Styling:** Tailwind CSS v4 + Motion (`framer-motion`) + Lucide React
- **Hosting / Deployment:** Vercel SPA (Hobby tier gratis, konfigurasi rewrite di `vercel.json`).
- **Domain Target:** `sabasunten.id` (custom domain .id ditambahkan di Vercel tanpa biaya tambahan hosting).

---

## 🧭 Key Views & Routing
Routing dikendalikan via state terpusat `useApp().navigateTo(page: PageRoute)`:
- `home`: Landing page hero, search pintar, kartu spotlight 4 dusun, testimoni dampak desa.
- `marketplace`: Katalog komprehensif produk 4 dusun dengan filter kategori, harga, dan pencarian.
- `product-detail`: Detail produk/homestay, kalkulator malam inap dinamis, share Web API, ulasan, checkout WA.
- `homestay`: Kurasi khusus homestay lereng pegunungan 1.290 mdpl dengan filter harga & fasilitas.
- `paket-wisata`: Aktivitas edukasi & live-in dengan filter kategori (susu, kopi, budaya, live-in).
- `desa-detail`: Profil sejarah pemekaran Cibodas 1979, aparatur desa resmi, 4 kadus, dan tautan SILAMOT.
- `cart`: Ringkasan pesanan dan modal penerbitan E-Ticket resmi siap cetak (`window.print()`).
- `auth`: Autentikasi dan pengalih peran instan demo skripsi/pemdes (Wisatawan vs BUMDes).
- `dashboard`: Dasbor BUMDes / Pengelola Pokdarwis untuk CRUD produk dan pantau pesanan.

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
