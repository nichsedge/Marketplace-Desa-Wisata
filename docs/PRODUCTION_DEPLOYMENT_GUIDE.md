# 📘 Panduan Deployment & Go-Live Production: Saba Lembang

> **Platform Interdesa Kawasan Lembang (Kabupaten Bandung Barat)**  
> *Panduan Resmi Peluncuran Komersial Nyata, Pembayaran Midtrans Live, Cloudflare D1, & WhatsApp Gateway.*

---

## 📌 Ringkasan Eksekutif

Dokumen ini disusun sebagai panduan teknis operasional saat platform **Saba Lembang** bertransisi dari lingkungan *Sandbox Tugas Akhir DKV* menuju peluncuran **Production Komersial Nyata**.

Arsitektur platform dirancang secara modular dan **Zero-Lock-In**:
- **Frontend SPA:** React 19 + TypeScript + Vite 6 + Tailwind CSS v4.
- **Hosting:** Vercel SPA (atau Cloudflare Pages).
- **Payment Gateway:** Midtrans Snap API (QRIS, Virtual Account, E-Wallet).
- **Database Persisten:** Cloudflare D1 (10 GB SQLite Edge Database).
- **Notifikasi Otomatis:** WhatsApp Dispatcher (Fonnte/Wablas).

---

## 🔑 Langkah 1: Aktivasi Akun Midtrans Production & Webhook

### 1.1 Persyaratan Legalitas Merchant (KYC)
1. **Entitas Lembaga / BUMDes Bersama Kawasan:**
   - Nomor Induk Berusaha (NIB) BUMDes / Koperasi Kawasan.
   - NPWP Badan Usaha & KTP Direktur / Pengelola.
   - Rekening Giro Resmi Bank atas nama instansi yang sama.
2. **Proses Review:**
   - Masuk ke [Midtrans Dashboard](https://dashboard.midtrans.com) $\rightarrow$ Ubah environment ke **Production**.
   - Isi formulir *Go-Live Request*. Waktu verifikasi oleh tim Compliance Midtrans: **2–4 hari kerja**.

### 1.2 Konfigurasi Webhook Notification URL
Setelah disetujui, buka menu **Settings > Configuration**:
- **Payment Notification URL:** Masukkan URL endpoint webhook produksi:
  ```text
  https://sabalembang.id/api/midtrans-notification
  ```
- **Finish Redirect URL:** `https://sabalembang.id/cart`
- **Unfinish Redirect URL:** `https://sabalembang.id/cart`
- **Error Redirect URL:** `https://sabalembang.id/cart`

---

## 🗄️ Langkah 2: Setup Database Cloudflare D1

### 2.1 Membuat Database D1 di Cloudflare
Jalankan perintah berikut di terminal:
```bash
# Buat database D1
npx wrangler d1 create saba-lembang-d1

# Eksekusi skema database relasional Saba Lembang
npx wrangler d1 execute saba-lembang-d1 --file db/schema.sql --remote
```

### 2.2 Salin Kredensial REST API
Dapatkan kredensial berikut dari Cloudflare Dashboard:
1. `CLOUDFLARE_ACCOUNT_ID`
2. `CLOUDFLARE_DATABASE_ID`
3. `CLOUDFLARE_API_TOKEN` (Izin: *D1 Edit*)

---

## 📲 Langkah 3: Konfigurasi WhatsApp API Gateway

Untuk mengirim notifikasi otomatis seketika ada pesanan lunas ke HP Admin Desa dan E-Ticket ke wisatawan:
1. Daftar akun di penyedia gateway WhatsApp (misal [Fonnte](https://fonnte.com)).
2. Tautkan nomor WhatsApp Hotline Saba Lembang dengan memindai QR Code.
3. Salin token API dan masukkan ke *environment variable*:
   ```env
   WHATSAPP_API_TOKEN=your_fonnte_token_here
   WHATSAPP_GATEWAY_URL=https://api.fonnte.com/send
   ```

---

## ⚙️ Langkah 4: Pengaturan Environment Variables di Vercel

Pada dashboard proyek Vercel (**Settings > Environment Variables**), tambahkan variabel produksi:

| Nama Variabel | Nilai Contoh | Keterangan |
| :--- | :--- | :--- |
| `VITE_MIDTRANS_IS_PRODUCTION` | `true` | Mengaktifkan Snap script produksi |
| `VITE_MIDTRANS_CLIENT_KEY` | `Mid-client-xxxxxxxx` | Kunci publik client-side |
| `MIDTRANS_SERVER_KEY` | `Mid-server-xxxxxxxx` | Kunci rahasia serverless API |
| `CLOUDFLARE_ACCOUNT_ID` | `xxxxxxxxxxxxxxxx` | ID akun Cloudflare |
| `CLOUDFLARE_DATABASE_ID` | `xxxxxxxx-xxxx...` | ID database D1 |
| `CLOUDFLARE_API_TOKEN` | `xxxxxxxxxxxxxxxx` | Token API Cloudflare |
| `WHATSAPP_API_TOKEN` | `xxxxxxxxxxxxxxxx` | Token Fonnte / Wablas |
| `PUBLIC_BASE_URL` | `https://sabalembang.id` | Domain publik resmi |

---

## 🧪 Langkah 5: Rangkaian Pengujian End-to-End Sebelum Launching

Sebelum dibuka untuk publik, jalankan audit lengkap menggunakan CLI suite:

```bash
# 1. Verifikasi Typecheck & Build
bun run lint && bun run build

# 2. Uji Coba Webhook Notification SHA-512 Verifier
uv run scripts/test_webhook.py

# 3. Uji Coba Pembuatan Order, Database D1, & Settlement Pipeline
uv run scripts/test_order_pipeline.py

# 4. Audit Formula Bagi Hasil (Revenue Split 94.3% vs 5% BUMDes)
uv run scripts/test_finance_ledger.py

# 5. Uji Coba Pengiriman Pesan WhatsApp Otomatis
uv run scripts/test_whatsapp_dispatcher.py

# 6. Uji Coba Kalkulator Ongkir Multi-Zona
uv run scripts/test_shipping.py

# 7. Uji Coba Ketersediaan & Overbooking Guard
uv run scripts/test_availability.py
```

---

## 🛡️ Checklist Peluncuran (Go-Live Day Checklist)

- [ ] Domain resmi `sabalembang.id` aktif dengan sertifikat SSL (HTTPS valid).
- [ ] Environment variable `VITE_MIDTRANS_IS_PRODUCTION=true` terpasang.
- [ ] Webhook URL `https://sabalembang.id/api/midtrans-notification` berhasil dites via Midtrans Simulator.
- [ ] Transaksi riil perdana Rp 1.000 (QRIS) berhasil masuk ke rekening dan E-Ticket terbit.
- [ ] Pesan notifikasi WhatsApp masuk ke HP Admin Desa terkait secara otomatis.
- [ ] Rekapitulasi buku kas di dasbor menunjukkan nominal yang sesuai dengan hak kas desa.
- [ ] Halaman verifikasi tiket `/cek-pesanan` berhasil memvalidasi tiket perdana.

---
*Dokumentasi Resmi Saba Lembang — Platform Interdesa Kawasan Lembang, Kab. Bandung Barat.*
