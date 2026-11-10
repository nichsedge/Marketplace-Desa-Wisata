// api/lib/whatsappDispatcher.ts
// Production WhatsApp Notification Dispatcher for Saba Lembang Orders
// Supports Fonnte, Wablas, Generic Webhook, and Zero-Config Simulation Mode

export interface OrderNotificationPayload {
  orderId: string;
  villageId: string;
  villageName?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  totalAmount: number;
  paymentType?: string;
  settlementTime?: string;
  notes?: string;
  items?: Array<{
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
}

export interface DispatchResult {
  success: boolean;
  targetPhone: string;
  mode: 'live_gateway' | 'simulation';
  provider?: string;
  directWaLink?: string;
  messagePreview: string;
  error?: string;
}

/**
 * Normalizes Indonesian phone number to international format:
 * '0812-2076-3734' -> '6281220763734'
 */
export function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('0')) {
    return '62' + digits.slice(1);
  }
  if (digits.startsWith('8')) {
    return '62' + digits;
  }
  return digits;
}

/**
 * Formats official notification message for Admin Desa & Mitra UMKM
 */
export function formatAdminOrderNotification(payload: OrderNotificationPayload): string {
  const netVillageEstimate = Math.round(payload.totalAmount * 0.943);

  let msg = `🔔 *NOTIFIKASI PESANAN LUNAS (SABA LEMBANG)*\n\n`;
  msg += `Sampurasun Admin *${(payload.villageName || 'Desa Wisata').toUpperCase()}*,\n`;
  msg += `Ada pesanan wisatawan baru yang *TELAH LUNAS* melalui payment gateway resmi:\n\n`;

  msg += `📋 *DETAIL PESANAN:*\n`;
  msg += `• *No. Pesanan:* \`${payload.orderId}\`\n`;
  msg += `• *Waktu Lunas:* ${payload.settlementTime || new Date().toLocaleString('id-ID')}\n`;
  msg += `• *Metode Bayar:* ${payload.paymentType || 'Midtrans QRIS / VA'}\n`;
  msg += `• *Nama Pemesan:* ${payload.customerName}\n`;
  msg += `• *WhatsApp Pemesan:* https://wa.me/${normalizePhoneNumber(payload.customerPhone)}\n`;
  if (payload.customerEmail) {
    msg += `• *Email:* ${payload.customerEmail}\n`;
  }

  if (Array.isArray(payload.items) && payload.items.length > 0) {
    msg += `\n📦 *DAFTAR ITEM / LAYANAN:*\n`;
    payload.items.forEach((it, idx) => {
      msg += `${idx + 1}. *${it.productName}*\n`;
      msg += `   - Jumlah: ${it.quantity}x @ Rp ${it.price.toLocaleString('id-ID')}\n`;
      msg += `   - Subtotal: Rp ${it.subtotal.toLocaleString('id-ID')}\n`;
    });
  }

  msg += `\n💰 *RINGKASAN PEMBAYARAN:*\n`;
  msg += `• *Total Pembayaran:* Rp ${payload.totalAmount.toLocaleString('id-ID')} (Lunas 100%)\n`;
  msg += `• *Estimasi Hak Kas Desa (94.3%):* Rp ${netVillageEstimate.toLocaleString('id-ID')}\n`;

  if (payload.notes) {
    msg += `\n📝 *Catatan Pemesan:*\n"${payload.notes}"\n`;
  }

  msg += `\n📄 *E-Ticket & Bukti Transaksi:*\n`;
  msg += `https://sabalembang.id/cart?orderId=${encodeURIComponent(payload.orderId)}\n\n`;
  msg += `Mohon Admin Desa segera menyiapkan produk / mengonfirmasi kesiapan penginapan/wisata kepada wisatawan terkait. Hatur nuhun!`;

  return msg;
}

/**
 * Formats official notification confirmation for Buyer (Wisatawan)
 */
export function formatCustomerOrderNotification(payload: OrderNotificationPayload): string {
  let msg = `🎉 *PEMBAYARAN BERHASIL — SABA LEMBANG*\n\n`;
  msg += `Halo *${payload.customerName}*,\n`;
  msg += `Terima kasih! Pembayaran pesanan Anda untuk *${payload.villageName || 'Kawasan Lembang'}* telah kami terima dengan rincian:\n\n`;

  msg += `• *No. Pesanan:* \`${payload.orderId}\`\n`;
  msg += `• *Total Lunas:* Rp ${payload.totalAmount.toLocaleString('id-ID')}\n`;
  msg += `• *Status:* Lunas / Terverifikasi\n\n`;

  msg += `📄 *Unduh / Cetak E-Ticket Resmi:*\n`;
  msg += `https://sabalembang.id/cart?orderId=${encodeURIComponent(payload.orderId)}\n\n`;
  msg += `Admin Desa kami akan segera memproses reservasi/pengiriman Anda. Jika ada pertanyaan, hubungi narahubung desa terkait. Wilujeng sumping di Kawasan Lembang!`;

  return msg;
}

/**
 * Dispatches WhatsApp notification via Fonnte, Wablas, or Simulation Mode
 */
export async function dispatchWhatsAppNotification(
  targetPhone: string,
  message: string
): Promise<DispatchResult> {
  const cleanPhone = normalizePhoneNumber(targetPhone);
  const directWaLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  const token = process.env.WHATSAPP_API_TOKEN || process.env.FONNTE_TOKEN;
  const customGatewayUrl = process.env.WHATSAPP_GATEWAY_URL;

  // Simulation Mode (Default if no token configured - 100% zero-cost)
  if (!token) {
    console.log(`[WhatsApp Dispatcher - SIMULATION MODE]`);
    console.log(`To: ${cleanPhone}`);
    console.log(`Message:\n${message}\n`);
    console.log(`Direct Link: ${directWaLink}\n`);

    return {
      success: true,
      targetPhone: cleanPhone,
      mode: 'simulation',
      provider: 'local_simulation',
      directWaLink,
      messagePreview: message.slice(0, 120) + '...',
    };
  }

  // Live Gateway Dispatch (Fonnte or Custom Gateway)
  try {
    const gatewayUrl = customGatewayUrl || 'https://api.fonnte.com/send';
    const response = await fetch(gatewayUrl, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: cleanPhone,
        message,
        countryCode: '62',
      }),
    });

    const data: any = await response.json();

    if (!response.ok) {
      console.warn(`[WhatsApp Gateway Dispatch Failed]:`, data);
      return {
        success: false,
        targetPhone: cleanPhone,
        mode: 'live_gateway',
        provider: 'fonnte',
        directWaLink,
        messagePreview: message.slice(0, 120) + '...',
        error: data?.reason || data?.message || 'Gateway error',
      };
    }

    console.log(`[WhatsApp Gateway Sent Successfully] to ${cleanPhone}`);
    return {
      success: true,
      targetPhone: cleanPhone,
      mode: 'live_gateway',
      provider: 'fonnte',
      directWaLink,
      messagePreview: message.slice(0, 120) + '...',
    };
  } catch (err: any) {
    console.error(`[WhatsApp Gateway Exception]:`, err);
    return {
      success: false,
      targetPhone: cleanPhone,
      mode: 'live_gateway',
      directWaLink,
      messagePreview: message.slice(0, 120) + '...',
      error: err?.message || 'Network exception',
    };
  }
}
