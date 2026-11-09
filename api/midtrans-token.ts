// api/midtrans-token.ts
// Vercel Serverless Function for Midtrans Snap Transaction Token Generation
import type { IncomingMessage, ServerResponse } from 'http';

interface SnapItemPayload {
  id?: string;
  price: number;
  quantity: number;
  name?: string;
}

interface MidtransRequestBody {
  orderId: string;
  grossAmount: number;
  customerDetails?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  items?: SnapItemPayload[];
}

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse & { status?: any; json?: any }) {
  // Setup helper methods if not injected by runtime
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
    sendJson(405, { error: 'Method Not Allowed' });
    return;
  }

  try {
    // Parse body if not pre-parsed
    let body: MidtransRequestBody;
    if (typeof req.body === 'object' && req.body !== null) {
      body = req.body;
    } else {
      const rawBody = await new Promise<string>((resolve, reject) => {
        let acc = '';
        req.on('data', chunk => { acc += chunk; });
        req.on('end', () => resolve(acc));
        req.on('error', reject);
      });
      body = rawBody ? JSON.parse(rawBody) : {};
    }

    const { orderId, grossAmount, customerDetails, items } = body;

    if (!orderId || !grossAmount) {
      sendJson(400, { error: 'Missing orderId or grossAmount' });
      return;
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-80uhszC-U-x.iH7pnFqIm~wo';
    const isProd = process.env.VITE_MIDTRANS_IS_PRODUCTION === 'true';
    const snapUrl = isProd
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const authHeader = `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`;

    // Item details with strict sum matching
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

    const response = await fetch(snapUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(midtransPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Midtrans Error Response]', data);
      sendJson(response.status, {
        error: 'Midtrans gateway error',
        details: data,
      });
      return;
    }

    sendJson(200, {
      token: data.token,
      redirect_url: data.redirect_url,
    });
  } catch (err: any) {
    console.error('[Midtrans Serverless Error]', err);
    sendJson(500, {
      error: 'Failed to create Midtrans transaction token',
      message: err?.message || 'Unknown server error',
    });
  }
}
