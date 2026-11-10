// src/utils/shipping.ts
// Smart Multi-Zone Shipping & Logistics Calculator for Saba Lembang Physical Products
import type { CartItem, ProductCategory } from '../types';

export type ShippingZoneId =
  | 'bandung_raya'
  | 'jabodetabek'
  | 'jawa_barat'
  | 'jawa_tengah_timur'
  | 'luar_jawa';

export interface ShippingZone {
  id: ShippingZoneId;
  name: string;
  description: string;
  baseRatePerKg: number;
  flatLocalRate?: number;
  estimatedDays: string;
  courier: string;
}

export const SHIPPING_ZONES: Record<ShippingZoneId, ShippingZone> = {
  bandung_raya: {
    id: 'bandung_raya',
    name: 'Bandung Raya & Cimahi',
    description: 'Kota Bandung, Kab. Bandung Barat, Kab. Bandung, Cimahi',
    baseRatePerKg: 15000,
    flatLocalRate: 15000,
    estimatedDays: '1-2 Hari',
    courier: 'Kurir Lokal Lembang / JNE Reguler',
  },
  jabodetabek: {
    id: 'jabodetabek',
    name: 'Jabodetabek',
    description: 'DKI Jakarta, Bogor, Depok, Tangerang, Bekasi',
    baseRatePerKg: 12000,
    estimatedDays: '1-3 Hari',
    courier: 'J&T / JNE / SiCepat Reguler',
  },
  jawa_barat: {
    id: 'jawa_barat',
    name: 'Jawa Barat (Luar Bandung/Jabodetabek)',
    description: 'Sukabumi, Cianjur, Garut, Tasik, Cirebon, dll.',
    baseRatePerKg: 18000,
    estimatedDays: '2-3 Hari',
    courier: 'JNE / SiCepat Reguler',
  },
  jawa_tengah_timur: {
    id: 'jawa_tengah_timur',
    name: 'Jawa Tengah, DIY, & Jawa Timur',
    description: 'Semarang, Solo, Jogja, Surabaya, Malang, dll.',
    baseRatePerKg: 24000,
    estimatedDays: '2-4 Hari',
    courier: 'JNE / J&T Reguler',
  },
  luar_jawa: {
    id: 'luar_jawa',
    name: 'Luar Pulau Jawa',
    description: 'Sumatera, Bali, Kalimantan, Sulawesi, NTB, NTT, Papua',
    baseRatePerKg: 38000,
    estimatedDays: '3-6 Hari',
    courier: 'JNE OKE / J&T Cargo',
  },
};

/**
 * Returns whether a category requires physical shipping
 */
export function isPhysicalProductCategory(category: ProductCategory | string): boolean {
  const physicalCategories = new Set([
    'kopi-minuman',
    'kuliner',
    'kerajinan',
    'pertanian-organik',
    'tanaman-hias',
    'olahan-susu',
  ]);
  return physicalCategories.has(category);
}

/**
 * Checks if the cart contains any physical goods that require delivery
 */
export function hasPhysicalItems(items: CartItem[]): boolean {
  return items.some((item) => isPhysicalProductCategory(item.product.category));
}

/**
 * Estimates weight per unit based on product category (in grams)
 */
export function getProductUnitWeightGrams(category: ProductCategory | string): number {
  switch (category) {
    case 'kopi-minuman':
      return 250; // 250g coffee packaging
    case 'tanaman-hias':
      return 500; // sukulen / pot agave mini + media tanam
    case 'olahan-susu':
      return 500; // Susu pasteurisasi 500ml / yoghurt
    case 'kuliner':
      return 350; // Tahu susu / ranginang / peuyeum
    case 'pertanian-organik':
      return 1000; // Sayur segar / bibit
    case 'kerajinan':
      return 400;
    default:
      return 300;
  }
}

/**
 * Calculates total billable weight in grams and rounded kilograms
 */
export function calculateTotalWeight(items: CartItem[]): {
  totalGrams: number;
  billableKg: number;
} {
  let totalGrams = 0;
  for (const item of items) {
    if (isPhysicalProductCategory(item.product.category)) {
      const unitWeight = getProductUnitWeightGrams(item.product.category);
      totalGrams += unitWeight * Math.max(1, item.quantity);
    }
  }

  // Minimum 1kg billable, round up to nearest kg if >1.2kg
  const billableKg = totalGrams === 0 ? 0 : Math.max(1, Math.ceil(totalGrams / 1000));
  return { totalGrams, billableKg };
}

export interface ShippingCalculationResult {
  hasPhysical: boolean;
  zone: ShippingZone;
  totalGrams: number;
  billableKg: number;
  shippingFee: number;
  courierName: string;
  estimatedDelivery: string;
}

/**
 * Calculates complete shipping fee for cart items and chosen zone
 */
export function calculateShipping(
  items: CartItem[],
  zoneId: ShippingZoneId = 'bandung_raya'
): ShippingCalculationResult {
  const physicalPresent = hasPhysicalItems(items);
  const zone = SHIPPING_ZONES[zoneId] || SHIPPING_ZONES.bandung_raya;

  if (!physicalPresent) {
    return {
      hasPhysical: false,
      zone,
      totalGrams: 0,
      billableKg: 0,
      shippingFee: 0,
      courierName: 'Layanan Digital / Reservasi Langsung',
      estimatedDelivery: 'Instan (E-Ticket)',
    };
  }

  const { totalGrams, billableKg } = calculateTotalWeight(items);

  let shippingFee = 0;
  if (zone.flatLocalRate && billableKg <= 2) {
    shippingFee = zone.flatLocalRate;
  } else {
    shippingFee = zone.baseRatePerKg * billableKg;
  }

  return {
    hasPhysical: true,
    zone,
    totalGrams,
    billableKg,
    shippingFee,
    courierName: zone.courier,
    estimatedDelivery: zone.estimatedDays,
  };
}
