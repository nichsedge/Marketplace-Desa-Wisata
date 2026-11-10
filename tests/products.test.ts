import { describe, it, expect } from 'bun:test';
import { INITIAL_PRODUCTS, INITIAL_VILLAGES, MOCK_PICS } from '../src/data/mockData';
import { REAL_PRODUCTS } from '../src/data/realProducts';
import { getLocalizedProduct } from '../src/i18n/productTranslations';
import fs from 'fs';
import path from 'path';

describe('Product Data Integrity & Invariants', () => {
  it('should have products loaded in INITIAL_PRODUCTS and REAL_PRODUCTS', () => {
    expect(INITIAL_PRODUCTS.length).toBeGreaterThan(0);
    expect(REAL_PRODUCTS.length).toBeGreaterThan(0);
    expect(INITIAL_PRODUCTS.length).toBe(REAL_PRODUCTS.length);
  });

  it('should have unique IDs across all products', () => {
    const ids = new Set<string>();
    for (const product of INITIAL_PRODUCTS) {
      expect(ids.has(product.id)).toBe(false);
      ids.add(product.id);
    }
  });

  it('should validate every product mandatory fields', () => {
    for (const product of INITIAL_PRODUCTS) {
      expect(product.id).toBeString();
      expect(product.id.length).toBeGreaterThan(0);

      expect(product.title).toBeString();
      expect(product.title.trim().length).toBeGreaterThan(0);

      expect(product.category).toBeString();
      expect(product.category.trim().length).toBeGreaterThan(0);

      expect(product.price).toBeNumber();
      expect(product.price).toBeGreaterThan(0);
      expect(Number.isInteger(product.price)).toBe(true);

      expect(product.unit).toBeString();
      expect(product.unit.trim().length).toBeGreaterThan(0);

      expect(product.villageId).toBeString();
      expect(product.villageName).toBeString();
      expect(product.location).toBeString();

      expect(product.rating).toBeNumber();
      expect(product.rating).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeLessThanOrEqual(5);

      expect(product.totalReviews).toBeNumber();
      expect(product.totalReviews).toBeGreaterThanOrEqual(0);

      expect(product.sellerName).toBeString();
      expect(product.sellerPhone).toBeString();
      expect(product.sellerPhone.length).toBeGreaterThanOrEqual(8);

      expect(product.description).toBeString();
      expect(product.description.trim().length).toBeGreaterThan(10);

      expect(Array.isArray(product.highlights)).toBe(true);
      expect(product.highlights.length).toBeGreaterThan(0);

      expect(product.stockQuota).toBeNumber();
      expect(product.stockQuota).toBeGreaterThanOrEqual(0);
    }
  });

  it('should link every product to a valid, active village in INITIAL_VILLAGES', () => {
    const villageMap = new Map(INITIAL_VILLAGES.map(v => [v.id, v.name]));

    for (const product of INITIAL_PRODUCTS) {
      expect(villageMap.has(product.villageId)).toBe(true);
      expect(villageMap.get(product.villageId)).toBe(product.villageName);
    }
  });

  it('should verify all product image files exist on disk in public/', () => {
    const rootDir = process.cwd();

    for (const product of INITIAL_PRODUCTS) {
      // Main image
      if (product.image.startsWith('/')) {
        const fullPath = path.join(rootDir, 'public', product.image);
        expect(fs.existsSync(fullPath)).toBe(true);
      }

      // Gallery images
      if (product.gallery && product.gallery.length > 0) {
        for (const img of product.gallery) {
          if (img.startsWith('/')) {
            const fullPath = path.join(rootDir, 'public', img);
            expect(fs.existsSync(fullPath)).toBe(true);
          }
        }
      }

      // Seller avatar
      if (product.sellerAvatar && product.sellerAvatar.startsWith('/')) {
        const fullPath = path.join(rootDir, 'public', product.sellerAvatar);
        expect(fs.existsSync(fullPath)).toBe(true);
      }
    }
  });

  it('should validate package tiers if defined on products', () => {
    for (const product of INITIAL_PRODUCTS) {
      if (product.packages && product.packages.length > 0) {
        for (const pkg of product.packages) {
          expect(pkg.name).toBeString();
          expect(pkg.name.trim().length).toBeGreaterThan(0);

          expect(pkg.price).toBeNumber();
          expect(pkg.price).toBeGreaterThan(0);

          expect(pkg.unit).toBeString();
          expect(pkg.unit.trim().length).toBeGreaterThan(0);

          expect(pkg.description).toBeString();
        }
      }
    }
  });

  it('should translate cleanly into both ID and EN without throwing or undefined', () => {
    for (const product of INITIAL_PRODUCTS) {
      const idVersion = getLocalizedProduct(product, 'id');
      expect(idVersion.title).toBe(product.title);
      expect(idVersion.description).toBe(product.description);

      const enVersion = getLocalizedProduct(product, 'en');
      expect(enVersion.title).toBeString();
      expect(enVersion.title.length).toBeGreaterThan(0);
      expect(enVersion.description).toBeString();
      expect(enVersion.description.length).toBeGreaterThan(0);
    }
  });

  it('should verify each active village has an associated PIC admin in MOCK_PICS', () => {
    const picVillageIds = new Set(MOCK_PICS.map(p => p.picVillageId).filter(Boolean));

    for (const village of INITIAL_VILLAGES) {
      expect(picVillageIds.has(village.id)).toBe(true);
    }
  });
});
