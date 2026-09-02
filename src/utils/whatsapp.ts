import { Product, CartItem } from '../types';

export const WHATSAPP_PHONE = '6282122334455'; // Hotline Terpadu Saba Lembang

export const formatWhatsAppUrl = (phone: string, text: string) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

export const createProductWhatsAppMessage = (
  product: Product,
  params: {
    quantity?: number;
    bookingDateStart?: string;
    bookingDateEnd?: string;
    guestCount?: number;
    notes?: string;
  }
) => {
  const isHomestay = product.category === 'homestay';
  const isPackage = product.category === 'paket-wisata';

  let message = `*HALO ADMIN ${product.villageName.toUpperCase()} (SABA LEMBANG - sabasunten.id)*\n`;
  message += `Saya tertarik untuk memesan layanan/produk berikut:\n\n`;
  message += `📌 *Item:* ${product.title}\n`;
  message += `🏞️ *Desa Wisata:* ${product.villageName}\n`;
  message += `🏷️ *Kategori:* ${product.category.toUpperCase()}\n`;
  message += `💰 *Harga Satuan:* Rp ${product.price.toLocaleString('id-ID')} ${product.unit}\n`;

  if (isHomestay) {
    if (params.bookingDateStart) message += `📅 *Check-In:* ${params.bookingDateStart}\n`;
    if (params.bookingDateEnd) message += `📅 *Check-Out:* ${params.bookingDateEnd}\n`;
    if (params.guestCount) message += `👥 *Jumlah Tamu:* ${params.guestCount} orang\n`;
    if (params.quantity) message += `🚪 *Jumlah Kamar/Unit:* ${params.quantity} unit\n`;
  } else if (isPackage) {
    if (params.bookingDateStart) message += `📅 *Tanggal Wisata:* ${params.bookingDateStart}\n`;
    if (params.guestCount) message += `👥 *Jumlah Peserta:* ${params.guestCount} orang\n`;
    if (params.quantity) message += `🎟️ *Jumlah Paket:* ${params.quantity} pax\n`;
  } else {
    if (params.quantity) message += `📦 *Jumlah Pesanan:* ${params.quantity} ${product.unit}\n`;
  }

  const total = product.price * (params.quantity || 1);
  message += `💵 *Estimasi Total:* Rp ${total.toLocaleString('id-ID')}\n`;

  if (params.notes) {
    message += `📝 *Catatan Khusus:* ${params.notes}\n`;
  }

  message += `\nMohon info ketersediaan dan panduan reservasinya dari Admin Desa. Hatur nuhun!`;

  return message;
};

export const createCartWhatsAppMessage = (
  items: CartItem[],
  customerInfo: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
  }
) => {
  let message = `*HALO ADMIN SABA LEMBANG (sabasunten.id)*\n`;
  message += `Saya ingin melakukan pemesanan wisata/produk via platform:\n\n`;
  message += `👤 *Nama Pemesan:* ${customerInfo.name}\n`;
  if (customerInfo.phone) message += `📱 *No. HP/WA:* ${customerInfo.phone}\n`;
  if (customerInfo.address) message += `📍 *Alamat/Kota Asal:* ${customerInfo.address}\n`;

  message += `\n📋 *RINCIAN PESANAN:*\n`;
  let subtotal = 0;

  items.forEach((item, index) => {
    const itemTotal = item.product.price * item.quantity;
    subtotal += itemTotal;
    message += `${index + 1}. *${item.product.title}* (${item.product.villageName})\n`;
    message += `   - Jumlah: ${item.quantity} ${item.product.unit}\n`;
    if (item.bookingDateStart) message += `   - Tanggal: ${item.bookingDateStart} ${item.bookingDateEnd ? `s.d ${item.bookingDateEnd}` : ''}\n`;
    message += `   - Subtotal: Rp ${itemTotal.toLocaleString('id-ID')}\n`;
  });

  message += `\n💵 *Total Pesanan:* Rp ${subtotal.toLocaleString('id-ID')}\n`;

  if (customerInfo.notes) {
    message += `📝 *Catatan:* ${customerInfo.notes}\n`;
  }

  message += `\nMohon konfirmasi pesanan dan penerbitan bukti reservasi dari Admin Desa terkait. Terima kasih!`;

  return message;
};

export const createGeneralWhatsAppMessage = () => {
  return `Halo Admin Saba Lembang (Platform Desa Wisata Kawasan Lembang),\nsaya ingin bertanya mengenai info destinasi / homestay / paket wisata di Kawasan Lembang.`;
};
