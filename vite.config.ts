import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const serverKey = env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-80uhszC-U-x.iH7pnFqIm~wo';
  const isProd = env.VITE_MIDTRANS_IS_PRODUCTION === 'true';

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'midtrans-dev-api',
        configureServer(server) {
          server.middlewares.use('/api/midtrans-token', async (req, res) => {
            if (req.method === 'POST') {
              let raw = '';
              req.on('data', (chunk: Buffer) => {
                raw += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const body = raw ? JSON.parse(raw) : {};
                  const {orderId, grossAmount, customerDetails, items} = body;
                  const snapUrl = isProd
                    ? 'https://app.midtrans.com/snap/v1/transactions'
                    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

                  const authHeader = `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`;

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
                  res.statusCode = response.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({error: err?.message || 'Server error'}));
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });

          server.middlewares.use('/api/midtrans-notification', async (req, res) => {
            if (req.method === 'POST') {
              let raw = '';
              req.on('data', (chunk: Buffer) => {
                raw += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const payload = raw ? JSON.parse(raw) : {};
                  const {
                    order_id,
                    status_code,
                    gross_amount,
                    signature_key,
                    transaction_status,
                    fraud_status,
                    payment_type,
                    transaction_id,
                    settlement_time,
                  } = payload;

                  if (!order_id || !status_code || !gross_amount || !signature_key) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({error: 'Missing required webhook parameters'}));
                    return;
                  }

                  const rawSignature = `${order_id}${status_code}${gross_amount}${serverKey}`;
                  const expected = crypto.createHash('sha512').update(rawSignature).digest('hex');

                  if (signature_key.toLowerCase() !== expected.toLowerCase()) {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({error: 'Invalid SHA-512 signature'}));
                    return;
                  }

                  const isSettled = transaction_status === 'settlement' || (transaction_status === 'capture' && fraud_status !== 'challenge');

                  // Update local orders if present
                  try {
                    const localPath = path.resolve(process.cwd(), 'data', 'local_orders.json');
                    if (fs.existsSync(localPath)) {
                      const dbData = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
                      const target = dbData.orders.find((o: any) => o.id === order_id);
                      if (target) {
                        target.status = isSettled ? 'selesai' : (transaction_status === 'expire' ? 'dibatalkan' : 'menunggu_pembayaran');
                        if (settlement_time) target.settlement_time = settlement_time;
                        if (transaction_id) target.midtrans_tx_id = transaction_id;
                        if (payment_type) target.midtrans_payment_type = payment_type;
                        target.updated_at = new Date().toISOString();
                        fs.writeFileSync(localPath, JSON.stringify(dbData, null, 2));
                      }
                    }
                  } catch (e) {
                    console.error('Local order update failed', e);
                  }

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    status: 'OK',
                    message: 'Notification verified in local dev middleware',
                    data: {
                      orderId: order_id,
                      transactionId: transaction_id,
                      paymentType: payment_type,
                      transactionStatus: transaction_status,
                      isSettled,
                      settlementTime: settlement_time || null,
                    },
                  }));
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({error: err?.message || 'Server error'}));
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });

          // Local Dev API: /api/orders
          server.middlewares.use('/api/orders', async (req, res) => {
            const localPath = path.resolve(process.cwd(), 'data', 'local_orders.json');
            const ensureDb = () => {
              const dir = path.dirname(localPath);
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              if (!fs.existsSync(localPath)) fs.writeFileSync(localPath, JSON.stringify({ orders: [], items: [] }, null, 2));
            };

            const readDb = () => {
              ensureDb();
              try {
                return JSON.parse(fs.readFileSync(localPath, 'utf-8'));
              } catch {
                return { orders: [], items: [] };
              }
            };

            const writeDb = (data: any) => {
              ensureDb();
              fs.writeFileSync(localPath, JSON.stringify(data, null, 2));
            };

            const urlObj = new URL(req.url || '/', 'http://localhost');
            const orderId = urlObj.searchParams.get('orderId');
            const villageId = urlObj.searchParams.get('villageId');

            if (req.method === 'GET') {
              const db = readDb();
              if (orderId) {
                const order = db.orders.find((o: any) => o.id === orderId);
                if (!order) {
                  res.statusCode = 404;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Order not found' }));
                  return;
                }
                const items = db.items.filter((it: any) => it.order_id === orderId);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ order: { ...order, items } }));
                return;
              }

              if (villageId) {
                const orders = db.orders.filter((o: any) => o.village_id === villageId);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ orders }));
                return;
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ orders: db.orders }));
              return;
            }

            if (req.method === 'POST') {
              let raw = '';
              req.on('data', (chunk: Buffer) => { raw += chunk.toString(); });
              req.on('end', () => {
                try {
                  const body = raw ? JSON.parse(raw) : {};
                  if (!body.id || !body.villageId || !body.totalAmount) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Missing required order fields' }));
                    return;
                  }

                  const db = readDb();
                  const now = new Date().toISOString();
                  const newOrder = {
                    id: body.id,
                    village_id: body.villageId,
                    customer_name: body.customerName,
                    customer_phone: body.customerPhone,
                    customer_email: body.customerEmail || null,
                    total_amount: body.totalAmount,
                    status: body.status || 'menunggu_pembayaran',
                    payment_source: body.paymentSource || 'midtrans',
                    midtrans_tx_id: body.midtransTxId || null,
                    midtrans_payment_type: body.midtransPaymentType || null,
                    notes: body.notes || null,
                    created_at: now,
                    updated_at: now,
                  };

                  const newItems = (body.items || []).map((it: any, idx: number) => ({
                    id: Date.now() + idx,
                    order_id: body.id,
                    product_id: it.productId,
                    product_name: it.productName,
                    price: it.price,
                    quantity: it.quantity,
                    subtotal: it.subtotal,
                  }));

                  db.orders = [newOrder, ...db.orders.filter((o: any) => o.id !== body.id)];
                  db.items = [...db.items.filter((i: any) => i.order_id !== body.id), ...newItems];
                  writeDb(db);

                  res.statusCode = 201;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ status: 'Created', storage: 'local_persistence', orderId: body.id }));
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err?.message || 'Server error' }));
                }
              });
              return;
            }

            res.statusCode = 405;
            res.end('Method Not Allowed');
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 5175,
      host: true,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/lucide-react/')) {
              return 'vendor-icons';
            }
          },
        },
      },
    },
  };
});
