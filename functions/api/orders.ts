// functions/api/orders.ts
// Cloudflare Pages Functions: Native Cloudflare D1 Orders API
import type { OrderStatus } from '../../src/types';

interface Env {
  DB?: any; // Cloudflare D1 Database binding
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  try {
    const url = new URL(context.request.url);
    const orderId = url.searchParams.get('orderId');
    const villageId = url.searchParams.get('villageId');

    if (!context.env.DB) {
      return new Response(
        JSON.stringify({ error: 'Cloudflare D1 DB binding is not attached (env.DB)' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    if (orderId) {
      const order = await context.env.DB
        .prepare('SELECT * FROM orders WHERE id = ? LIMIT 1')
        .bind(orderId)
        .first();

      if (!order) {
        return new Response(JSON.stringify({ error: 'Order not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }

      const items = await context.env.DB
        .prepare('SELECT * FROM order_items WHERE order_id = ?')
        .bind(orderId)
        .all();

      return new Response(
        JSON.stringify({ order: { ...order, items: items.results || [] } }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    if (villageId) {
      const orders = await context.env.DB
        .prepare('SELECT * FROM orders WHERE village_id = ? ORDER BY created_at DESC')
        .bind(villageId)
        .all();

      return new Response(
        JSON.stringify({ orders: orders.results || [] }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const allOrders = await context.env.DB
      .prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100')
      .all();

    return new Response(
      JSON.stringify({ orders: allOrders.results || [] }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body: any = await context.request.json();
    if (!context.env.DB) {
      return new Response(
        JSON.stringify({ error: 'Cloudflare D1 DB binding is not attached (env.DB)' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const {
      id,
      villageId,
      customerName,
      customerPhone,
      customerEmail,
      totalAmount,
      status = 'menunggu_pembayaran',
      paymentSource = 'midtrans',
      midtransTxId,
      midtransPaymentType,
      notes,
      items,
    } = body || {};

    if (!id || !villageId || !totalAmount || !customerName || !customerPhone) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const now = new Date().toISOString();

    // Batch insert using D1 transactions / batching
    const statements: any[] = [
      context.env.DB.prepare(
        `INSERT INTO orders (id, village_id, customer_name, customer_phone, customer_email, total_amount, status, payment_source, midtrans_tx_id, midtrans_payment_type, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id,
        villageId,
        customerName,
        customerPhone,
        customerEmail || null,
        totalAmount,
        status,
        paymentSource,
        midtransTxId || null,
        midtransPaymentType || null,
        notes || null,
        now,
        now
      ),
    ];

    if (Array.isArray(items)) {
      for (const it of items) {
        statements.push(
          context.env.DB.prepare(
            `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal)
             VALUES (?, ?, ?, ?, ?, ?)`
          ).bind(id, it.productId, it.productName, it.price, it.quantity, it.subtotal)
        );
      }
    }

    await context.env.DB.batch(statements);

    return new Response(
      JSON.stringify({ status: 'Created', storage: 'cloudflare_d1_native', orderId: id }),
      { status: 201, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
}

export async function onRequestPatch(context: { request: Request; env: Env }) {
  try {
    const body: any = await context.request.json();
    if (!context.env.DB) {
      return new Response(
        JSON.stringify({ error: 'Cloudflare D1 DB binding is not attached (env.DB)' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const { orderId, status, settlementTime, midtransTxId, midtransPaymentType } = body || {};
    if (!orderId || !status) {
      return new Response(
        JSON.stringify({ error: 'Missing orderId or status' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const now = new Date().toISOString();
    await context.env.DB.prepare(
      `UPDATE orders
       SET status = ?, settlement_time = COALESCE(?, settlement_time),
           midtrans_tx_id = COALESCE(?, midtrans_tx_id),
           midtrans_payment_type = COALESCE(?, midtrans_payment_type),
           updated_at = ?
       WHERE id = ?`
    )
      .bind(status, settlementTime || null, midtransTxId || null, midtransPaymentType || null, now, orderId)
      .run();

    return new Response(
      JSON.stringify({ status: 'Updated', storage: 'cloudflare_d1_native', orderId }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: err?.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
}
