// api/midtrans-notification.ts
// Vercel Serverless Function: Midtrans HTTP Webhook Notification Handler with SHA512 Verification
import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';

interface MidtransNotificationPayload {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_id: string;
  transaction_status: string;
  transaction_time?: string;
  payment_type?: string;
  fraud_status?: string;
  settlement_time?: string;
  status_message?: string;
  merchant_id?: string;
  currency?: string;
}

export type OrderPaymentStatus =
  | 'menunggu_pembayaran'
  | 'selesai'
  | 'challenge'
  | 'gagal'
  | 'dibatalkan'
  | 'refund';

/**
 * Maps Midtrans transaction_status & fraud_status to platform order status
 */
export function resolvePaymentStatus(
  transactionStatus: string,
  fraudStatus?: string
): { internalStatus: OrderPaymentStatus; isSettled: boolean; note: string } {
  switch (transactionStatus) {
    case 'capture':
      if (fraudStatus === 'challenge') {
        return {
          internalStatus: 'challenge',
          isSettled: false,
          note: 'Transaksi kartu kredit terdeteksi fraud challenge (perlu review manual)',
        };
      }
      return {
        internalStatus: 'selesai',
        isSettled: true,
        note: 'Pembayaran kartu kredit berhasil dicapture (lunas)',
      };

    case 'settlement':
      return {
        internalStatus: 'selesai',
        isSettled: true,
        note: 'Pembayaran terverifikasi dan berhasil diselesaikan (settlement)',
      };

    case 'pending':
      return {
        internalStatus: 'menunggu_pembayaran',
        isSettled: false,
        note: 'Menunggu pembayaran dari wisatawan (Virtual Account / QRIS / Gerai)',
      };

    case 'deny':
      return {
        internalStatus: 'gagal',
        isSettled: false,
        note: 'Pembayaran ditolak oleh penyedia pembayaran atau bank penerbit',
      };

    case 'expire':
      return {
        internalStatus: 'dibatalkan',
        isSettled: false,
        note: 'Batas waktu pembayaran telah habis (expired)',
      };

    case 'cancel':
      return {
        internalStatus: 'dibatalkan',
        isSettled: false,
        note: 'Transaksi dibatalkan oleh pengguna atau admin',
      };

    case 'refund':
    case 'partial_refund':
      return {
        internalStatus: 'refund',
        isSettled: false,
        note: 'Dana transaksi telah dikembalikan (refund)',
      };

    default:
      return {
        internalStatus: 'menunggu_pembayaran',
        isSettled: false,
        note: `Status transaksi belum dipetakan: ${transactionStatus}`,
      };
  }
}

/**
 * Validates SHA512 signature against Midtrans specification:
 * SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string,
  serverKey: string
): boolean {
  if (!orderId || !statusCode || !grossAmount || !signatureKey || !serverKey) {
    return false;
  }

  const raw = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const calculatedSignature = crypto.createHash('sha512').update(raw).digest('hex');

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signatureKey.toLowerCase()),
    Buffer.from(calculatedSignature.toLowerCase())
  );
}

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse & { status?: any; json?: any }
) {
  const sendJson = (statusCode: number, data: any) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end(JSON.stringify(data));
  };

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(405, { error: 'Method Not Allowed. Midtrans sends POST webhook.' });
    return;
  }

  try {
    let payload: MidtransNotificationPayload;
    if (typeof req.body === 'object' && req.body !== null) {
      payload = req.body;
    } else {
      const rawBody = await new Promise<string>((resolve, reject) => {
        let acc = '';
        req.on('data', (chunk) => { acc += chunk; });
        req.on('end', () => resolve(acc));
        req.on('error', reject);
      });
      payload = rawBody ? JSON.parse(rawBody) : ({} as any);
    }

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_id,
      transaction_status,
      fraud_status,
      payment_type,
      settlement_time,
    } = payload;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      sendJson(400, {
        error: 'Bad Request',
        message: 'Missing essential webhook parameters (order_id, status_code, gross_amount, signature_key)',
      });
      return;
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-80uhszC-U-x.iH7pnFqIm~wo';

    // 1. Verifikasi Keaslian Notifikasi (SHA-512)
    const isValidSignature = verifyMidtransSignature(
      order_id,
      status_code,
      gross_amount,
      signature_key,
      serverKey
    );

    if (!isValidSignature) {
      console.warn(`[Midtrans Webhook Spoof Attempt] Order ${order_id} rejected due to invalid SHA-512 signature.`);
      sendJson(403, {
        error: 'Forbidden',
        message: 'Invalid signature key. Notification rejected.',
      });
      return;
    }

    // 2. Pemetaan Status Transaksi
    const { internalStatus, isSettled, note } = resolvePaymentStatus(transaction_status, fraud_status);

    console.log(`[Midtrans Webhook Verified] Order: ${order_id} | Status: ${transaction_status} -> ${internalStatus} | TX ID: ${transaction_id}`);

    // 3. Response Berhasil ke Midtrans (Midtrans memerlukan respons 200 OK segera)
    sendJson(200, {
      status: 'OK',
      message: 'Notification received and signature verified successfully',
      data: {
        orderId: order_id,
        transactionId: transaction_id,
        paymentType: payment_type,
        transactionStatus: transaction_status,
        internalStatus,
        isSettled,
        settlementTime: settlement_time || null,
        note,
      },
    });
  } catch (err: any) {
    console.error('[Midtrans Webhook Error]', err);
    sendJson(500, {
      error: 'Internal Server Error',
      message: err?.message || 'Failed to process webhook notification',
    });
  }
}
