import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import crypto from 'crypto';
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
