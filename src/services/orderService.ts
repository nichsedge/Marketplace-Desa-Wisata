// src/services/orderService.ts
// Client Service for Synchronizing Orders with Persistent Storage (Cloudflare D1 / Serverless API)
import type { Order } from '../types';

export async function syncOrderToCloud(order: Order): Promise<boolean> {
  try {
    const payload = {
      id: order.id,
      villageId: order.villageId || 'des-01',
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail || undefined,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentSource: order.source || 'midtrans',
      midtransTxId: order.midtransTransactionId || undefined,
      midtransPaymentType: order.midtransPaymentType || undefined,
      notes: order.notes || undefined,
      items: (order.items || []).map((it) => ({
        productId: it.product.id,
        productName: it.product.title,
        price: it.product.price,
        quantity: it.quantity,
        subtotal: it.product.price * it.quantity,
      })),
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    console.warn('[OrderService] Cloud sync failed, falling back to local state:', err);
    return false;
  }
}

export async function fetchOrderById(orderId: string): Promise<any | null> {
  try {
    const res = await fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.order || null;
  } catch {
    return null;
  }
}

export async function fetchOrdersFromCloud(villageId?: string): Promise<any[]> {
  try {
    const url = villageId ? `/api/orders?villageId=${encodeURIComponent(villageId)}` : '/api/orders';
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.orders || [];
  } catch {
    return [];
  }
}
