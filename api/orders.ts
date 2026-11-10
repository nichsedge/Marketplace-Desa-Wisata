// api/orders.ts
// Vercel Serverless Function: Unified Orders API with Cloudflare D1 & Local Persistence
import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

interface OrderItemPayload {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface CreateOrderPayload {
  id: string;
  villageId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  totalAmount: number;
  status?: string;
  paymentSource?: string;
  midtransTxId?: string;
  midtransPaymentType?: string;
  notes?: string;
  items: OrderItemPayload[];
}

// Local file-backed database path for Node / Vercel local dev fallback
const LOCAL_DB_PATH = path.resolve(process.cwd(), 'data', 'local_orders.json');

function ensureLocalDbExists() {
  const dir = path.dirname(LOCAL_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({ orders: [], items: [] }, null, 2));
  }
}

function readLocalDb(): { orders: any[]; items: any[] } {
  try {
    ensureLocalDbExists();
    const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { orders: [], items: [] };
  }
}

function writeLocalDb(data: { orders: any[]; items: any[] }) {
  try {
    ensureLocalDbExists();
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Local DB Write Error]', err);
  }
}

/**
 * Execute SQL against Cloudflare D1 REST API if configured
 */
async function queryCloudflareD1(sql: string, params: any[] = []): Promise<any> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    return null; // Not configured, fallback to local DB
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Cloudflare D1 Query Failed: ${response.status} ${errorBody}`);
  }

  const result: any = await response.json();
  return result?.result?.[0]?.results || [];
}

export default async function handler(
  req: IncomingMessage & { body?: any; query?: any },
  res: ServerResponse & { status?: any; json?: any }
) {
  const sendJson = (statusCode: number, data: any) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end(JSON.stringify(data));
  };

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  const urlObj = new URL(req.url || '/', 'http://localhost');
  const orderId = urlObj.searchParams.get('orderId');
  const villageId = urlObj.searchParams.get('villageId');

  try {
    // -----------------------------------------------------------------
    // GET: Query order by ID, by village, or list all
    // -----------------------------------------------------------------
    if (req.method === 'GET') {
      const isD1Configured = !!(
        process.env.CLOUDFLARE_ACCOUNT_ID &&
        process.env.CLOUDFLARE_DATABASE_ID &&
        process.env.CLOUDFLARE_API_TOKEN
      );

      if (isD1Configured) {
        if (orderId) {
          const orders = await queryCloudflareD1('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId]);
          if (!orders || orders.length === 0) {
            sendJson(404, { error: 'Order not found' });
            return;
          }
          const items = await queryCloudflareD1('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
          sendJson(200, { order: { ...orders[0], items } });
          return;
        }

        if (villageId) {
          const orders = await queryCloudflareD1(
            'SELECT * FROM orders WHERE village_id = ? ORDER BY created_at DESC',
            [villageId]
          );
          sendJson(200, { orders: orders || [] });
          return;
        }

        const orders = await queryCloudflareD1('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100');
        sendJson(200, { orders: orders || [] });
        return;
      }

      // Fallback: Local persistent DB
      const db = readLocalDb();
      if (orderId) {
        const order = db.orders.find((o) => o.id === orderId);
        if (!order) {
          sendJson(404, { error: 'Order not found' });
          return;
        }
        const items = db.items.filter((it) => it.order_id === orderId);
        sendJson(200, { order: { ...order, items } });
        return;
      }

      if (villageId) {
        const orders = db.orders.filter((o) => o.village_id === villageId);
        sendJson(200, { orders });
        return;
      }

      sendJson(200, { orders: db.orders });
      return;
    }

    // -----------------------------------------------------------------
    // POST: Create a new order with items
    // -----------------------------------------------------------------
    if (req.method === 'POST') {
      let body: CreateOrderPayload;
      if (typeof req.body === 'object' && req.body !== null) {
        body = req.body;
      } else {
        const rawBody = await new Promise<string>((resolve, reject) => {
          let acc = '';
          req.on('data', (chunk) => { acc += chunk; });
          req.on('end', () => resolve(acc));
          req.on('error', reject);
        });
        body = rawBody ? JSON.parse(rawBody) : ({} as any);
      }

      if (!body.id || !body.villageId || !body.totalAmount || !body.customerName || !body.customerPhone) {
        sendJson(400, {
          error: 'Missing required order fields (id, villageId, totalAmount, customerName, customerPhone)',
        });
        return;
      }

      const now = new Date().toISOString();
      const status = body.status || 'menunggu_pembayaran';
      const isD1Configured = !!(
        process.env.CLOUDFLARE_ACCOUNT_ID &&
        process.env.CLOUDFLARE_DATABASE_ID &&
        process.env.CLOUDFLARE_API_TOKEN
      );

      if (isD1Configured) {
        // Insert into Cloudflare D1
        await queryCloudflareD1(
          `INSERT INTO orders (id, village_id, customer_name, customer_phone, customer_email, total_amount, status, payment_source, midtrans_tx_id, midtrans_payment_type, notes, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            body.id,
            body.villageId,
            body.customerName,
            body.customerPhone,
            body.customerEmail || null,
            body.totalAmount,
            status,
            body.paymentSource || 'midtrans',
            body.midtransTxId || null,
            body.midtransPaymentType || null,
            body.notes || null,
            now,
            now,
          ]
        );

        if (Array.isArray(body.items)) {
          for (const it of body.items) {
            await queryCloudflareD1(
              `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [body.id, it.productId, it.productName, it.price, it.quantity, it.subtotal]
            );
          }
        }

        sendJson(201, {
          status: 'Created',
          storage: 'cloudflare_d1',
          orderId: body.id,
        });
        return;
      }

      // Local Persistent DB
      const db = readLocalDb();
      const newOrderRecord = {
        id: body.id,
        village_id: body.villageId,
        customer_name: body.customerName,
        customer_phone: body.customerPhone,
        customer_email: body.customerEmail || null,
        total_amount: body.totalAmount,
        status,
        payment_source: body.paymentSource || 'midtrans',
        midtrans_tx_id: body.midtransTxId || null,
        midtrans_payment_type: body.midtransPaymentType || null,
        notes: body.notes || null,
        created_at: now,
        updated_at: now,
      };

      const newItemsRecords = (body.items || []).map((it, idx) => ({
        id: Date.now() + idx,
        order_id: body.id,
        product_id: it.productId,
        product_name: it.productName,
        price: it.price,
        quantity: it.quantity,
        subtotal: it.subtotal,
      }));

      db.orders = [newOrderRecord, ...db.orders.filter((o) => o.id !== body.id)];
      db.items = [...db.items.filter((i) => i.order_id !== body.id), ...newItemsRecords];
      writeLocalDb(db);

      sendJson(201, {
        status: 'Created',
        storage: 'local_persistence',
        orderId: body.id,
      });
      return;
    }

    // -----------------------------------------------------------------
    // PATCH: Update order status (e.g. from webhook or admin dashboard)
    // -----------------------------------------------------------------
    if (req.method === 'PATCH') {
      let body: any;
      if (typeof req.body === 'object' && req.body !== null) {
        body = req.body;
      } else {
        const rawBody = await new Promise<string>((resolve, reject) => {
          let acc = '';
          req.on('data', (chunk) => { acc += chunk; });
          req.on('end', () => resolve(acc));
          req.on('error', reject);
        });
        body = rawBody ? JSON.parse(rawBody) : {};
      }

      const targetId = body.orderId || orderId;
      if (!targetId || !body.status) {
        sendJson(400, { error: 'Missing target orderId or status' });
        return;
      }

      const now = new Date().toISOString();
      const isD1Configured = !!(
        process.env.CLOUDFLARE_ACCOUNT_ID &&
        process.env.CLOUDFLARE_DATABASE_ID &&
        process.env.CLOUDFLARE_API_TOKEN
      );

      if (isD1Configured) {
        await queryCloudflareD1(
          `UPDATE orders
           SET status = ?, settlement_time = COALESCE(?, settlement_time),
               midtrans_tx_id = COALESCE(?, midtrans_tx_id),
               midtrans_payment_type = COALESCE(?, midtrans_payment_type),
               updated_at = ?
           WHERE id = ?`,
          [
            body.status,
            body.settlementTime || null,
            body.midtransTxId || null,
            body.midtransPaymentType || null,
            now,
            targetId,
          ]
        );
        sendJson(200, { status: 'Updated', storage: 'cloudflare_d1', orderId: targetId });
        return;
      }

      // Local Persistent DB
      const db = readLocalDb();
      const order = db.orders.find((o) => o.id === targetId);
      if (!order) {
        sendJson(404, { error: 'Order not found' });
        return;
      }

      order.status = body.status;
      if (body.settlementTime) order.settlement_time = body.settlementTime;
      if (body.midtransTxId) order.midtrans_tx_id = body.midtransTxId;
      if (body.midtransPaymentType) order.midtrans_payment_type = body.midtransPaymentType;
      order.updated_at = now;

      writeLocalDb(db);
      sendJson(200, { status: 'Updated', storage: 'local_persistence', orderId: targetId });
      return;
    }

    sendJson(405, { error: 'Method Not Allowed' });
  } catch (err: any) {
    console.error('[Orders API Error]', err);
    sendJson(500, { error: 'Internal Server Error', message: err?.message || 'Failed' });
  }
}
