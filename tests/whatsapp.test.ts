import { describe, it, expect } from 'bun:test';
import { INITIAL_PRODUCTS } from '../src/data/mockData';
import { formatWhatsAppUrl, createProductWhatsAppMessage, createCartWhatsAppMessage, createGeneralWhatsAppMessage, WHATSAPP_PHONE } from '../src/utils/whatsapp';

describe('WhatsApp Direct Order Integration', () => {
  it('should clean phone numbers and generate valid wa.me URLs', () => {
    const url1 = formatWhatsAppUrl('+62 812-2076-3734', 'Halo tes');
    expect(url1).toBe('https://wa.me/6281220763734?text=Halo%20tes');

    const url2 = formatWhatsAppUrl('0821-3053-2424', 'Tes order');
    expect(url2).toBe('https://wa.me/082130532424?text=Tes%20order');
  });

  it('should generate valid WhatsApp messages for all 28 products without throwing', () => {
    for (const product of INITIAL_PRODUCTS) {
      const msg = createProductWhatsAppMessage(product, {
        quantity: 2,
        notes: 'Pesan untuk rombongan keluarga'
      });

      expect(msg).toBeString();
      expect(msg).toContain(product.villageName.toUpperCase());
      expect(msg).toContain(product.title);
      expect(msg).toContain('Rp');
      expect(msg).toContain('Pesan untuk rombongan keluarga');

      const targetPhone = product.sellerPhone || WHATSAPP_PHONE;
      const url = formatWhatsAppUrl(targetPhone, msg);
      expect(url.startsWith('https://wa.me/')).toBe(true);
      expect(url).toContain('?text=');
    }
  });

  it('should include check-in, check-out, and duration for homestay products', () => {
    const homestay = INITIAL_PRODUCTS.find(p => p.category === 'penginapan-lokal' || p.category === 'homestay')!;
    expect(homestay).toBeDefined();

    const msg = createProductWhatsAppMessage(homestay, {
      quantity: 1,
      bookingDateStart: '2026-11-20',
      bookingDateEnd: '2026-11-22',
      guestCount: 4,
      notes: 'Minta ekstra selimut'
    });

    expect(msg).toContain('Check-In');
    expect(msg).toContain('2026-11-20');
    expect(msg).toContain('Check-Out');
    expect(msg).toContain('2026-11-22');
    expect(msg).toContain('2 malam');
    expect(msg).toContain('4 orang');
    expect(msg).toContain('Minta ekstra selimut');
  });

  it('should include tour date and pax count for tour packages', () => {
    const tour = INITIAL_PRODUCTS.find(p => p.category === 'paket-wisata' || p.category === 'wisata-alam')!;
    expect(tour).toBeDefined();

    const msg = createProductWhatsAppMessage(tour, {
      quantity: 6,
      bookingDateStart: '2026-11-25',
      guestCount: 6,
      notes: 'Meeting point di Balai Desa'
    });

    expect(msg).toContain('Tanggal Wisata');
    expect(msg).toContain('2026-11-25');
    expect(msg).toContain('6 orang');
    expect(msg).toContain('Meeting point di Balai Desa');
  });

  it('should generate valid cart checkout WhatsApp message with multiple items', () => {
    const items = [
      { product: INITIAL_PRODUCTS[0], quantity: 2 },
      { product: INITIAL_PRODUCTS[1], quantity: 1, bookingDateStart: '2026-11-15' }
    ];

    const msg = createCartWhatsAppMessage(items, {
      name: 'Budi Test',
      phone: '08123456789',
      notes: 'Harap dikirim rapi'
    });

    expect(msg).toContain('RINCIAN PESANAN');
    expect(msg).toContain(INITIAL_PRODUCTS[0].title);
    expect(msg).toContain(INITIAL_PRODUCTS[1].title);
    expect(msg).toContain('Budi Test');
    expect(msg).toContain('Harap dikirim rapi');

    const url = formatWhatsAppUrl(WHATSAPP_PHONE, msg);
    expect(url.startsWith('https://wa.me/6282122334455')).toBe(true);
  });

  it('should generate valid general inquiry message', () => {
    const msg = createGeneralWhatsAppMessage();
    expect(msg).toContain('Saba Lembang');
    const url = formatWhatsAppUrl(WHATSAPP_PHONE, msg);
    expect(url.startsWith('https://wa.me/6282122334455')).toBe(true);
  });
});
