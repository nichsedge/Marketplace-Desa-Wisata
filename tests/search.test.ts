import { describe, it, expect } from 'bun:test';
import { INITIAL_PRODUCTS } from '../src/data/mockData';
import { scoreProductSearch } from '../src/utils/search';

describe('Search & Matching System', () => {
  it('should score products when query matches product title', () => {
    for (const product of INITIAL_PRODUCTS) {
      // Pick the first significant word from title
      const words = product.title.split(/\s+/).filter(w => w.length > 3);
      if (words.length > 0) {
        const query = words[0];
        const score = scoreProductSearch(product, query);
        expect(score).toBeGreaterThan(0);
      }
    }
  });

  it('should match products via local synonyms', () => {
    // 1. Kopi
    const coffeeProduct = INITIAL_PRODUCTS.find(p => p.id === 'real-suntenjaya-kopi-angling')!;
    expect(scoreProductSearch(coffeeProduct, 'coffee')).toBeGreaterThan(0);
    expect(scoreProductSearch(coffeeProduct, 'arabika')).toBeGreaterThan(0);

    // 2. Homestay
    const homestayProduct = INITIAL_PRODUCTS.find(p => p.id === 'real-suntenjaya-homestay-warga')!;
    expect(scoreProductSearch(homestayProduct, 'penginapan')).toBeGreaterThan(0);
    expect(scoreProductSearch(homestayProduct, 'villa')).toBeGreaterThan(0);
    expect(scoreProductSearch(homestayProduct, 'inap')).toBeGreaterThan(0);

    // 3. Susu
    const dairyProduct = INITIAL_PRODUCTS.find(p => p.id === 'real-sukajaya-susu-murni-segar')!;
    expect(scoreProductSearch(dairyProduct, 'susu')).toBeGreaterThan(0);
    expect(scoreProductSearch(dairyProduct, 'pasteurisasi')).toBeGreaterThan(0);

    // 4. Sukulen / Agave
    const succulentProduct = INITIAL_PRODUCTS.find(p => p.id === 'real-gudangkahuripan-sukulen-agave-shark-shoi')!;
    expect(scoreProductSearch(succulentProduct, 'sukulen')).toBeGreaterThan(0);
    expect(scoreProductSearch(succulentProduct, 'tanaman')).toBeGreaterThan(0);
  });

  it('should return 0 score for completely irrelevant queries', () => {
    const coffeeProduct = INITIAL_PRODUCTS.find(p => p.id === 'real-suntenjaya-kopi-angling')!;
    const score = scoreProductSearch(coffeeProduct, 'pesawat jet tempur jakarta');
    expect(score).toBe(0);
  });
});
