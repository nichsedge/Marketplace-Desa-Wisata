-- db/schema.sql
-- Cloudflare D1 & SQLite Schema for Saba Lembang E-Commerce Platform

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,                                -- Unique Order ID, e.g. SABA-20261110-8921
  village_id TEXT NOT NULL,                           -- Village ID, e.g. des-01
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  total_amount INTEGER NOT NULL,                      -- Total in IDR
  status TEXT NOT NULL DEFAULT 'menunggu_pembayaran', -- 'menunggu_pembayaran' | 'selesai' | 'dibatalkan' | 'challenge' | 'gagal'
  payment_source TEXT DEFAULT 'midtrans',             -- 'midtrans' | 'direct_wa'
  midtrans_tx_id TEXT,
  midtrans_payment_type TEXT,
  settlement_time TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_orders_village ON orders(village_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
