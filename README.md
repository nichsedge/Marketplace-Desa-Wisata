<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Saba Lembang (sabasunten.id) - Platform Desa Wisata Kawasan Lembang

Platform pariwisata terpadu dan marketplace resmi untuk **Desa Wisata di Kawasan Lembang**, Kabupaten Bandung Barat, Jawa Barat.

> **Deskripsi Platform:**  
> *Saba Lembang menghubungkan wisatawan dengan keindahan alam pegunungan (1.200 - 1.400 mdpl), homestay sejuk lereng gunung, agrowisata sayur & bunga, kopi specialty, dan paket petualangan alam terverifikasi langsung oleh PIC resmi masing-masing desa di Kawasan Lembang.*

> **Konteks Proyek & Kolaborasi Nyata:**  
> Dikembangkan sebagai karya Tugas Akhir / Skripsi program studi **Desain Komunikasi Visual (DKV)** dalam perancangan identitas visual, kampanye digital, dan media informasi interaktif desa wisata, berkolaborasi dengan jajaran **Pemerintah Desa & Pengurus Pokdarwis** di kawasan Lembang.

## 🏛️ Jaringan 5 Desa Wisata Kawasan Lembang

1. **Desa Wisata Suntenjaya (1.290 mdpl):** Homestay Pasir Angling, Situs Megalitikum Batu Loceng, Kopi Arabika, Kerajinan Balap Kayu Kadaplak, dan Peternakan Sapi Perah. (PIC: *Kang Asep Suhendar*)
2. **Desa Wisata Cibodas (1.250 mdpl):** Agrowisata Bunga Potong & Krisan, Lembah Maribaya, Greenhouse Paprika Hidroponik. (PIC: *Kang Dadang Herdiana*)
3. **Desa Wisata Cikole (1.400 mdpl):** Glamping Hutan Pinus Tangkuban Parahu, Orchid Forest, Kopi Hutan Rimba, Jalur Offroad Land Rover. (PIC: *Kang Dadan Ridwan*)
4. **Desa Wisata Jayagiri (1.350 mdpl):** Pintu Rimba Trekking Kawah Tangkuban Parahu, Kebun Teh Alami, Homestay Rumah Panggung Sunda. (PIC: *Teh Eni Rohaeni*)
5. **Desa Wisata Wangunsari (1.200 mdpl):** Sentra Seni Budaya Sunda, Agrowisata Petik Stroberi Manis, Budidaya Jamur & Anyaman Bambu. (PIC: *Kang Sandi Permana*)

## 🚀 Fitur Utama & Sistem PIC Desa

- 📸 **Alur Posting Media PIC Interaktif (4-Step Wizard):**
  - **Beranda PIC:** Feed postingan desa aktif + Tombol FAB `+ Tambah Post`.
  - **Pilih Media:** Tombol Kamera / Upload Foto dari perangkat (JPG/PNG langsung dari lokasi) + Galeri Preset Foto Riil Lembang.
  - **Isi Detail:** Preview foto terpilih, Judul, Deskripsi, Harga (Rp), Stok/Kuota, dan Pemilih Kategori (Homestay, Produk Lokal, Paket Wisata, Tiket Destinasi).
  - **Posting & Verifikasi:** Postingan langsung terdaftar dengan centang hijau verifikasi PIC dan aktif secara instan di marketplace publik.
- 👥 **Pengalih Peran Instan (Demo Mode Switcher):** Berpindah peran dalam 1-klik antara **Wisatawan (`Budi Santoso`)** dan **5 Akun PIC Desa Resmi** langsung dari header navbar atau halaman autentikasi.
- 🏞️ **Manajemen Profil Desa:** PIC dapat memperbarui informasi sejarah, visi misi, aparatur desa, kontak telepon resmi, serta galeri foto aktual desa.
- 🏡 **Katalog Homestay & Glamping:** Filter per desa, rentang harga, fasilitas (WiFi, sarapan, air hangat).
- 🎒 **Paket Wisata & Live-In:** Paket edukasi perah susu sapi, petik sayur, offroad kanopi pinus Cikole, trekking rimba Jayagiri.
- 📲 **Fast Checkout WhatsApp PIC:** Menghubungkan pembeli langsung ke nomor WhatsApp PIC desa terkait dengan rincian pesanan terformat otomatis.
- 🧾 **E-Ticket & Bukti Reservasi Resmi:** Lengkap dengan kode booking unik, QR Code kedatangan, dan siap cetak PDF (`window.print()`).

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