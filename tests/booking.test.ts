import { describe, it, expect } from 'bun:test';
import { calculateNights, getCartItemNights, getCartItemTotal } from '../src/utils/booking';
import { INITIAL_PRODUCTS } from '../src/data/mockData';

describe('Booking Calculations & Cart Pricing', () => {
  describe('calculateNights', () => {
    it('should calculate correct nights for normal consecutive dates', () => {
      expect(calculateNights('2026-11-10', '2026-11-11')).toBe(1);
      expect(calculateNights('2026-11-10', '2026-11-13')).toBe(3);
      expect(calculateNights('2026-11-01', '2026-11-08')).toBe(7);
    });

    it('should fallback to 1 night if dates are identical or reverse', () => {
      expect(calculateNights('2026-11-10', '2026-11-10')).toBe(1);
      expect(calculateNights('2026-11-15', '2026-11-10')).toBe(1);
    });

    it('should fallback to 1 night if dates are undefined or empty', () => {
      expect(calculateNights(undefined, undefined)).toBe(1);
      expect(calculateNights('2026-11-10', undefined)).toBe(1);
      expect(calculateNights(undefined, '2026-11-12')).toBe(1);
      expect(calculateNights('', '')).toBe(1);
    });
  });

  describe('getCartItemNights', () => {
    const homestay = INITIAL_PRODUCTS.find(p => p.category === 'penginapan-lokal' || p.category === 'homestay')!;
    const coffee = INITIAL_PRODUCTS.find(p => p.category === 'minuman-komoditas')!;

    it('should recognize homestays and calculate nights properly', () => {
      expect(homestay).toBeDefined();
      const nights = getCartItemNights({
        product: homestay,
        bookingDateStart: '2026-11-10',
        bookingDateEnd: '2026-11-14'
      });
      expect(nights).toBe(4);
    });

    it('should return 1 for non-homestay items even if dates are provided', () => {
      expect(coffee).toBeDefined();
      const nights = getCartItemNights({
        product: coffee,
        bookingDateStart: '2026-11-10',
        bookingDateEnd: '2026-11-14'
      });
      expect(nights).toBe(1);
    });
  });

  describe('getCartItemTotal', () => {
    it('should calculate standard product total price', () => {
      const coffee = INITIAL_PRODUCTS.find(p => p.category === 'minuman-komoditas')!;
      const total = getCartItemTotal({
        product: coffee,
        quantity: 3
      });
      expect(total).toBe(coffee.price * 3);
    });

    it('should calculate homestay total factoring in duration of stay', () => {
      const homestay = INITIAL_PRODUCTS.find(p => p.category === 'penginapan-lokal' || p.category === 'homestay')!;
      const total = getCartItemTotal({
        product: homestay,
        quantity: 2,
        bookingDateStart: '2026-11-10',
        bookingDateEnd: '2026-11-13' // 3 nights
      });
      expect(total).toBe(homestay.price * 2 * 3);
    });
  });
});
