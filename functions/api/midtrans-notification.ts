// functions/api/midtrans-notification.ts
// Cloudflare Pages Functions: Midtrans Webhook Handler using standard Web Crypto API (SHA-512)

interface Env {
  MIDTRANS_SERVER_KEY?: string;
  VITE_MIDTRANS_IS_PRODUCTION?: string;
  DB?: any;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function sha512Hex(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const payload: any = await context.request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_id,
      transaction_status,
      payment_type,
      settlement_time,
    } = payload || {};

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return new Response(
        JSON.stringify({
          error: 'Bad Request',
          message: 'Missing essential webhook parameters',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const serverKey = context.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-80uhszC-U-x.iH7pnFqIm~wo';
    const raw = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const calculatedSignature = await sha512Hex(raw);

    if (calculatedSignature.toLowerCase() !== signature_key.toLowerCase()) {
      return new Response(
        JSON.stringify({
          error: 'Forbidden',
          message: 'Invalid signature key. Notification rejected.',
        }),
        { status: 403, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const isSettled = transaction_status === 'settlement' || transaction_status === 'capture';
    const internalStatus = isSettled
      ? 'selesai'
      : transaction_status === 'pending'
      ? 'menunggu_pembayaran'
      : transaction_status === 'expire' || transaction_status === 'cancel'
      ? 'dibatalkan'
      : 'gagal';

    if (context.env.DB) {
      try {
        const now = new Date().toISOString();
        await context.env.DB.prepare(
          `UPDATE orders
           SET status = ?, settlement_time = COALESCE(?, settlement_time),
               midtrans_tx_id = COALESCE(?, midtrans_tx_id),
               midtrans_payment_type = COALESCE(?, midtrans_payment_type),
               updated_at = ?
           WHERE id = ?`
        )
          .bind(internalStatus, settlement_time || null, transaction_id || null, payment_type || null, now, order_id)
          .run();
      } catch (dbErr) {
        console.error('[Cloudflare D1 Webhook Update Error]', dbErr);
      }
    }

    return new Response(
      JSON.stringify({
        status: 'OK',
        message: 'Notification received and signature verified successfully (Cloudflare runtime)',
        data: {
          orderId: order_id,
          transactionId: transaction_id,
          paymentType: payment_type,
          transactionStatus: transaction_status,
          isSettled,
          settlementTime: settlement_time || null,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: err?.message || 'Failed to process webhook',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
}
