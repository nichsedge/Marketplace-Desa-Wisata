// functions/api/midtrans-token.ts
// Cloudflare Pages Functions - Zero-config migration fallback for Midtrans Snap Token

interface Env {
  MIDTRANS_SERVER_KEY?: string;
  VITE_MIDTRANS_IS_PRODUCTION?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body: any = await context.request.json();
    const { orderId, grossAmount, customerDetails, items } = body || {};

    if (!orderId || !grossAmount) {
      return new Response(JSON.stringify({ error: 'Missing orderId or grossAmount' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    const serverKey = context.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-80uhszC-U-x.iH7pnFqIm~wo';
    const isProd = context.env.VITE_MIDTRANS_IS_PRODUCTION === 'true';
    const snapUrl = isProd
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const authHeader = `Basic ${btoa(`${serverKey}:`)}`;

    let itemDetails: any[] | undefined = undefined;
    if (Array.isArray(items) && items.length > 0) {
      const formatted = items.map((it, idx) => ({
        id: String(it.id || `item-${idx + 1}`).substring(0, 50),
        price: Math.round(Number(it.price) || 0),
        quantity: Math.max(1, Math.round(Number(it.quantity) || 1)),
        name: String(it.name || 'Produk Desa').substring(0, 50),
      }));

      const sum = formatted.reduce((acc, it) => acc + it.price * it.quantity, 0);
      const diff = Math.round(grossAmount) - sum;

      if (diff !== 0 && formatted.length > 0) {
        if (formatted[0].quantity === 1) {
          formatted[0].price += diff;
        } else {
          formatted.push({
            id: 'adj-01',
            price: diff,
            quantity: 1,
            name: 'Penyesuaian Biaya',
          });
        }
      }
      itemDetails = formatted;
    }

    const midtransPayload: Record<string, any> = {
      transaction_details: {
        order_id: String(orderId),
        gross_amount: Math.round(grossAmount),
      },
      customer_details: {
        first_name: customerDetails?.name || 'Wisatawan Saba Lembang',
        email: customerDetails?.email || 'wisatawan@sabalembang.id',
        phone: customerDetails?.phone || '08123456789',
      },
      credit_card: {
        secure: true,
      },
    };

    if (itemDetails && itemDetails.length > 0) {
      midtransPayload.item_details = itemDetails;
    }

    const midtransRes = await fetch(snapUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(midtransPayload),
    });

    const data = await midtransRes.json();

    if (!midtransRes.ok) {
      return new Response(JSON.stringify({ error: 'Midtrans gateway error', details: data }), {
        status: midtransRes.status,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    return new Response(JSON.stringify({ token: data.token, redirect_url: data.redirect_url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to create token', message: err?.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}
