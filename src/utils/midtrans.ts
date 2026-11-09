// src/utils/midtrans.ts
// Client-side helper for Midtrans Snap Payment Gateway

export interface SnapResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string; // 'settlement' | 'capture' | 'pending' | 'deny' | 'cancel' | 'expire'
  va_numbers?: Array<{ bank: string; va_number: string }>;
  bill_key?: string;
  biller_code?: string;
  pdf_url?: string;
  finish_redirect_url?: string;
}

export interface SnapCallbacks {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    snap?: {
      pay: (token: string, callbacks?: SnapCallbacks) => void;
      embed?: (token: string, options: { embedId: string }) => void;
    };
  }
}

const CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-Mmm663wC3FYR8APA';
const IS_PROD = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true';
const SNAP_SCRIPT_URL = IS_PROD
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js';

let snapPromise: Promise<void> | null = null;

/**
 * Dynamically loads Midtrans Snap JS in browser
 */
export function loadSnapScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.snap) {
    return Promise.resolve();
  }

  if (snapPromise) {
    return snapPromise;
  }

  snapPromise = new Promise<void>((resolve, reject) => {
    // Check if script tag already exists
    const existing = document.querySelector(`script[src*="midtrans.com/snap/snap.js"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Midtrans Snap script')));
      return;
    }

    const script = document.createElement('script');
    script.src = SNAP_SCRIPT_URL;
    script.setAttribute('data-client-key', CLIENT_KEY);
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => {
      snapPromise = null;
      reject(new Error('Gagal memuat sistem pembayaran Midtrans. Periksa koneksi internet Anda.'));
    };

    document.head.appendChild(script);
  });

  return snapPromise;
}

/**
 * Request transaction snap token from Serverless API
 */
export async function createMidtransSnapToken(payload: {
  orderId: string;
  grossAmount: number;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}): Promise<{ token: string; redirect_url: string }> {
  const response = await fetch('/api/midtrans-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Gagal membuat token pembayaran (${response.status})`);
  }

  const data = await response.json();
  return data;
}

/**
 * Open Midtrans Snap Payment Modal
 */
export async function openSnapPaymentModal(token: string, callbacks: SnapCallbacks): Promise<void> {
  await loadSnapScript();

  if (!window.snap) {
    throw new Error('Midtrans Snap tidak tersedia di browser.');
  }

  window.snap.pay(token, callbacks);
}
