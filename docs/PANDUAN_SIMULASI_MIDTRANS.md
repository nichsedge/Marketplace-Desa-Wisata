# Cara Uji Coba Pembayaran (Midtrans Sandbox)

Panduan singkat untuk mencoba alur pembayaran online dan cetak tiket di Saba Lembang tanpa memotong saldo rekening asli.

---

### Cara Paling Mudah: Virtual Account BCA (3 Langkah)

Ini cara paling cepat dan tidak ribet:

1. **Pilih Produk & Checkout:**
   * Buka web, masukkan produk ke keranjang, lalu buka menu **Keranjang**.
   * Isi nama dan no. WhatsApp.
   * Pilih metode **"Pembayaran Digital Instan (Midtrans)"**, lalu klik **"Bayar Sekarang via Midtrans"**.

2. **Salin Nomor VA:**
   * Pada popup pembayaran, pilih **Bank Transfer** > **BCA**.
   * Klik tombol **"Salin"** pada nomor Virtual Account yang muncul (contoh: `7001200000001234`).

3. **Bayar di Simulator:**
   * Buka link ini di tab baru:  
     👉 **[https://simulator.sandbox.midtrans.com/bca/va/index](https://simulator.sandbox.midtrans.com/bca/va/index)**
   * Tempel (*paste*) nomor VA tadi, klik **Inquire**, lalu klik **Pay**.
   * Selesai! Kembali ke tab Saba Lembang, halaman otomatis berubah jadi **Lunas** dan memunculkan E-Ticket resmi.

---

### Cara Alternatif: QRIS (GoPay / OVO / Dana)

1. Saat popup Midtrans muncul, pilih **QRIS**.
2. **Klik kanan** pada gambar barcode QR &rarr; pilih **"Copy image address"** (*Salin alamat gambar*).
3. Buka simulator QRIS di tab baru:  
   👉 **[https://simulator.sandbox.midtrans.com/v2/qris/index](https://simulator.sandbox.midtrans.com/v2/qris/index)**
4. Tempel (*paste*) alamat URL gambar tadi di kolom, lalu klik **Scan QR** &rarr; klik **Pay**.
5. Halaman web otomatis mendeteksi pembayaran berhasil.

---

### Cara Simpan / Cetak E-Ticket ke PDF

1. Setelah pembayaran berhasil, klik tombol hijau **"Cetak / Simpan PDF (Resi Resmi)"**.
2. Pada jendela cetak browser:
   * Pilih tujuan (*Destination*): **Save as PDF** (*Simpan sebagai PDF*).
   * Ukuran kertas: **A4**.
3. Klik **Save**. Hasilnya adalah 1 lembar tiket bersih lengkap dengan barcode, ID pesanan, dan rincian belanja.

---

### Link Simulator Midtrans Lainnya

Jika ingin mencoba bank lain:
* **BNI Virtual Account:** [simulator.sandbox.midtrans.com/bni/va/index](https://simulator.sandbox.midtrans.com/bni/va/index)
* **BRI Virtual Account:** [simulator.sandbox.midtrans.com/bri/va/index](https://simulator.sandbox.midtrans.com/bri/va/index)
* **Mandiri Bill:** [simulator.sandbox.midtrans.com/mandiri/bill/index](https://simulator.sandbox.midtrans.com/mandiri/bill/index)
