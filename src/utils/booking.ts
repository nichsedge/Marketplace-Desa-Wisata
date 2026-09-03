import { Product } from '../types';

/**
 * Menghitung durasi malam untuk reservasi penginapan / homestay.
 * Minimal 1 malam.
 */
export const calculateNights = (dateStart?: string, dateEnd?: string): number => {
  if (!dateStart || !dateEnd) return 1;
  const start = new Date(dateStart);
  const end = new Date(dateEnd);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

/**
 * Menghitung durasi malam suatu item keranjang jika berjenis homestay / penginapan lokal.
 */
export const getCartItemNights = (item: {
  product: Product;
  bookingDateStart?: string;
  bookingDateEnd?: string;
}): number => {
  const isHomestay = item.product.category === 'homestay' || item.product.category === 'penginapan-lokal';
  if (!isHomestay) return 1;
  return calculateNights(item.bookingDateStart, item.bookingDateEnd);
};

/**
 * Menghitung total harga satu item keranjang (memperhitungkan malam jika homestay).
 */
export const getCartItemTotal = (item: {
  product: Product;
  quantity: number;
  bookingDateStart?: string;
  bookingDateEnd?: string;
}): number => {
  const nights = getCartItemNights(item);
  return item.product.price * item.quantity * nights;
};
