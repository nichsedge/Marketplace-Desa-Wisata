// src/utils/finance.ts
// Financial Revenue Split, Platform Fee, and Village Disbursement Ledger Logic
import type { Order } from '../types';

export interface VillageBankAccount {
  villageId: string;
  villageName: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  picName: string;
  picPhone: string;
}

export const VILLAGE_BANK_ACCOUNTS: Record<string, VillageBankAccount> = {
  'des-01': {
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    bankName: 'Bank BJB',
    accountNumber: '0129-3829-1001-00',
    accountHolder: 'BUMDes Pasir Impun Suntenjaya',
    picName: 'Kang Asep Suhendar',
    picPhone: '+6281220763734',
  },
  'des-03': {
    villageId: 'des-03',
    villageName: 'Desa Wisata Cikole',
    bankName: 'Bank BRI',
    accountNumber: '4109-0102-9843-531',
    accountHolder: 'Koperasi Wisata Rimba Cikole',
    picName: 'Kang Dadan Ridwan',
    picPhone: '+6282133449988',
  },
  'des-04': {
    villageId: 'des-04',
    villageName: 'Desa Wisata Jayagiri',
    bankName: 'Bank BJB',
    accountNumber: '0145-2290-8812-01',
    accountHolder: 'Kelompok Tani Kopi Maguru Jayagiri',
    picName: 'Teh Eni Rohaeni',
    picPhone: '+6285722337711',
  },
  'des-05': {
    villageId: 'des-05',
    villageName: 'Desa Wisata Wangunsari',
    bankName: 'Bank Mandiri',
    accountNumber: '1300-0198-2234-1',
    accountHolder: 'BUMDes Bina Mandiri Wangunsari',
    picName: 'Kang Sandi Permana',
    picPhone: '+6281809115544',
  },
  'des-07': {
    villageId: 'des-07',
    villageName: 'Desa Wisata Gudangkahuripan',
    bankName: 'Bank BCA',
    accountNumber: '283-091-2244',
    accountHolder: 'Paguyuban Budaya & Sukulen Gudangkahuripan',
    picName: 'Teh Rina Melati / Kang Agus',
    picPhone: '+6281233447788',
  },
  'des-08': {
    villageId: 'des-08',
    villageName: 'Desa Wisata Sukajaya',
    bankName: 'Bank BJB',
    accountNumber: '0156-4432-1109-00',
    accountHolder: 'Koperasi Peternak Sapi Barokah Sukajaya',
    picName: 'Kang Wawan Kurnia',
    picPhone: '+6281388996655',
  },
};

export interface TransactionRevenueSplit {
  orderId: string;
  createdAt: string;
  villageId: string;
  villageName: string;
  customerName: string;
  grossAmount: number;
  platformFeeRate: number; // 0.05 (5%)
  platformFee: number;
  gatewayFeeRate: number; // ~0.007 (0.7%) or flat
  gatewayFee: number;
  netVillagePayout: number;
  status: 'siap_cair' | 'sudah_ditransfer';
  paymentType?: string;
}

export interface VillageFinancialSummary {
  villageId: string;
  villageName: string;
  totalGross: number;
  totalPlatformFee: number;
  totalGatewayFee: number;
  totalNetPayout: number;
  settledOrdersCount: number;
  pendingOrdersCount: number;
  pendingGross: number;
  transactions: TransactionRevenueSplit[];
  disbursedAmount: number;
  readyForPayoutAmount: number;
}

const DISBURSED_ORDERS_STORAGE_KEY = 'saba_disbursed_order_ids';

export function getDisbursedOrderIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DISBURSED_ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markOrderAsDisbursed(orderId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDisbursedOrderIds();
    if (!current.includes(orderId)) {
      localStorage.setItem(DISBURSED_ORDERS_STORAGE_KEY, JSON.stringify([...current, orderId]));
    }
  } catch {
    // ignore
  }
}

export function markOrderAsPendingPayout(orderId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDisbursedOrderIds();
    localStorage.setItem(
      DISBURSED_ORDERS_STORAGE_KEY,
      JSON.stringify(current.filter((id) => id !== orderId))
    );
  } catch {
    // ignore
  }
}

/**
 * Calculates revenue split for a single transaction:
 * - Platform / BUMDes Fee: 5% (untuk biaya server, platform bersama, & promosi wisata)
 * - Gateway MDR: 0.7% (standar QRIS Midtrans) atau 0 jika direct WA
 * - Net Payout Desa: Gross - Platform Fee - Gateway Fee (94.3%)
 */
export function calculateSingleOrderSplit(order: Order, isDisbursed: boolean): TransactionRevenueSplit {
  const gross = order.totalAmount || 0;
  const isDirectWa = order.source === 'direct_wa';

  const platformFeeRate = 0.05; // 5%
  const platformFee = Math.round(gross * platformFeeRate);

  const gatewayFeeRate = isDirectWa ? 0 : 0.007; // 0.7% QRIS
  const gatewayFee = isDirectWa ? 0 : Math.round(gross * gatewayFeeRate);

  const netVillagePayout = Math.max(0, gross - platformFee - gatewayFee);

  return {
    orderId: order.id,
    createdAt: order.createdAt,
    villageId: order.villageId || 'des-01',
    villageName: order.villageName || 'Desa Wisata Lembang',
    customerName: order.customerName || 'Wisatawan',
    grossAmount: gross,
    platformFeeRate,
    platformFee,
    gatewayFeeRate,
    gatewayFee,
    netVillagePayout,
    status: isDisbursed ? 'sudah_ditransfer' : 'siap_cair',
    paymentType: order.midtransPaymentType || (isDirectWa ? 'Direct WA' : 'Midtrans QRIS/VA'),
  };
}

/**
 * Summarizes financial balances for a village or all villages
 */
export function calculateFinancialSummary(
  orders: Order[],
  targetVillageId?: string
): VillageFinancialSummary {
  const disbursedIds = new Set(getDisbursedOrderIds());

  const isAll = !targetVillageId || targetVillageId === 'all';
  const relevantOrders = isAll
    ? orders
    : orders.filter((o) => o.villageId === targetVillageId);

  const settledOrders = relevantOrders.filter((o) => o.status === 'selesai');
  const pendingOrders = relevantOrders.filter(
    (o) => o.status === 'menunggu' || o.status === 'menunggu_pembayaran'
  );

  const transactions: TransactionRevenueSplit[] = settledOrders.map((o) =>
    calculateSingleOrderSplit(o, disbursedIds.has(o.id))
  );

  let totalGross = 0;
  let totalPlatformFee = 0;
  let totalGatewayFee = 0;
  let totalNetPayout = 0;
  let disbursedAmount = 0;
  let readyForPayoutAmount = 0;

  transactions.forEach((tx) => {
    totalGross += tx.grossAmount;
    totalPlatformFee += tx.platformFee;
    totalGatewayFee += tx.gatewayFee;
    totalNetPayout += tx.netVillagePayout;

    if (tx.status === 'sudah_ditransfer') {
      disbursedAmount += tx.netVillagePayout;
    } else {
      readyForPayoutAmount += tx.netVillagePayout;
    }
  });

  const pendingGross = pendingOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const villageName = isAll
    ? 'Konsolidasi Seluruh Kawasan Lembang (6 Desa)'
    : VILLAGE_BANK_ACCOUNTS[targetVillageId]?.villageName || 'Desa Wisata Lembang';

  return {
    villageId: targetVillageId || 'all',
    villageName,
    totalGross,
    totalPlatformFee,
    totalGatewayFee,
    totalNetPayout,
    settledOrdersCount: settledOrders.length,
    pendingOrdersCount: pendingOrders.length,
    pendingGross,
    transactions,
    disbursedAmount,
    readyForPayoutAmount,
  };
}

/**
 * Exports financial ledger to CSV string for reporting & excel audits
 */
export function exportLedgerToCsv(summary: VillageFinancialSummary): string {
  const headers = [
    'No. Order',
    'Tanggal',
    'Desa Wisata',
    'Nama Pemesan',
    'Metode Bayar',
    'Omzet Kotor (Gross Rp)',
    'Fee Kawasan (5% Rp)',
    'Biaya Gateway (MDR Rp)',
    'Hak Bersih Desa (Net Rp)',
    'Status Pencairan',
  ];

  const rows = summary.transactions.map((tx) => [
    `"${tx.orderId}"`,
    `"${tx.createdAt}"`,
    `"${tx.villageName}"`,
    `"${tx.customerName.replace(/"/g, '""')}"`,
    `"${tx.paymentType || '-'}"`,
    tx.grossAmount,
    tx.platformFee,
    tx.gatewayFee,
    tx.netVillagePayout,
    `"${tx.status === 'sudah_ditransfer' ? 'Sudah Ditransfer' : 'Siap Cair'}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
