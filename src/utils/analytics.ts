import { Product, InteractionEvent, AnalyticsStats, Order } from '../types';

const STORAGE_KEY_EVENTS = 'saba_analytics_events_v1';

// Safe Google Analytics gtag helper
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const emitGtag = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, params);
    } catch {
      // ignore gtag error
    }
  }
};

// Default initial seeds for realistic baseline analytics in Lembang
const INITIAL_EVENTS: InteractionEvent[] = [
  { id: 'ev-1', type: 'product_tap', productId: 'prod-01', productTitle: 'Kopi Arabika Palasari Natural 200gr', villageId: 'des-01', villageName: 'Desa Wisata Suntenjaya', timestamp: '2026-10-18T09:12:00Z' },
  { id: 'ev-2', type: 'product_tap', productId: 'prod-02', productTitle: 'Paket Camping Pine Hill Cikole', villageId: 'des-02', villageName: 'Desa Wisata Cikole', timestamp: '2026-10-18T09:20:00Z' },
  { id: 'ev-3', type: 'search', query: 'kopi palasari', villageId: 'des-01', timestamp: '2026-10-18T09:35:00Z' },
  { id: 'ev-4', type: 'search', query: 'camping cikole', villageId: 'des-02', timestamp: '2026-10-18T09:40:00Z' },
  { id: 'ev-5', type: 'product_tap', productId: 'prod-03', productTitle: 'Susu Murni Pasteurisasi Sukajaya', villageId: 'des-06', villageName: 'Desa Wisata Sukajaya', timestamp: '2026-10-18T10:05:00Z' },
  { id: 'ev-6', type: 'wa_chat', productId: 'prod-01', productTitle: 'Kopi Arabika Palasari Natural 200gr', villageId: 'des-01', villageName: 'Desa Wisata Suntenjaya', amount: 85000, timestamp: '2026-10-18T10:15:00Z' },
  { id: 'ev-7', type: 'deal_completed', productId: 'prod-01', productTitle: 'Kopi Arabika Palasari Natural 200gr', villageId: 'des-01', villageName: 'Desa Wisata Suntenjaya', amount: 85000, timestamp: '2026-10-18T10:30:00Z' },
  { id: 'ev-8', type: 'product_tap', productId: 'prod-04', productTitle: 'Tahu Susu Lembang Wangunsari', villageId: 'des-04', villageName: 'Desa Wisata Wangunsari', timestamp: '2026-10-18T11:00:00Z' },
  { id: 'ev-9', type: 'wa_chat', productId: 'prod-02', productTitle: 'Paket Camping Pine Hill Cikole', villageId: 'des-02', villageName: 'Desa Wisata Cikole', amount: 450000, timestamp: '2026-10-18T11:22:00Z' },
  { id: 'ev-10', type: 'search', query: 'tahu susu', villageId: 'des-04', timestamp: '2026-10-18T11:45:00Z' },
  { id: 'ev-11', type: 'product_tap', productId: 'prod-01', productTitle: 'Kopi Arabika Palasari Natural 200gr', villageId: 'des-01', villageName: 'Desa Wisata Suntenjaya', timestamp: '2026-10-18T12:05:00Z' },
  { id: 'ev-12', type: 'deal_completed', productId: 'prod-02', productTitle: 'Paket Camping Pine Hill Cikole', villageId: 'des-02', villageName: 'Desa Wisata Cikole', amount: 450000, timestamp: '2026-10-18T12:30:00Z' }
];

export const getStoredEvents = (): InteractionEvent[] => {
  if (typeof window === 'undefined') return INITIAL_EVENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EVENTS;
  }
};

export const saveEvent = (event: Omit<InteractionEvent, 'id' | 'timestamp'>): InteractionEvent => {
  const newEvent: InteractionEvent = {
    ...event,
    id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    try {
      const current = getStoredEvents();
      const updated = [newEvent, ...current].slice(0, 500); // keep up to 500 latest events
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(updated));
    } catch {
      // storage quota or private browsing
    }
  }

  return newEvent;
};

// 1. Track Product Tap / View
export const trackProductTap = (product: Product) => {
  saveEvent({
    type: 'product_tap',
    productId: product.id,
    productTitle: product.title,
    villageId: product.villageId,
    villageName: product.villageName,
    amount: product.price
  });

  emitGtag('view_item', {
    items: [{
      item_id: product.id,
      item_name: product.title,
      item_category: product.category,
      price: product.price,
      item_brand: product.villageName
    }]
  });
};

// 2. Track Search Keyword
export const trackSearchQuery = (query: string, resultCount?: number) => {
  const clean = query.trim().toLowerCase();
  if (!clean || clean.length < 2) return;

  saveEvent({
    type: 'search',
    query: clean
  });

  emitGtag('search', {
    search_term: clean,
    results_count: resultCount
  });
};

// 3. Track WhatsApp Chat / Order Intent
export const trackWhatsAppClick = (product: Product, quantity = 1, totalAmount?: number) => {
  const finalAmount = totalAmount || product.price * quantity;

  saveEvent({
    type: 'wa_chat',
    productId: product.id,
    productTitle: product.title,
    villageId: product.villageId,
    villageName: product.villageName,
    amount: finalAmount
  });

  emitGtag('begin_checkout', {
    currency: 'IDR',
    value: finalAmount,
    items: [{
      item_id: product.id,
      item_name: product.title,
      quantity,
      price: product.price
    }]
  });
};

// 4. Track Deal Completed (When Admin marks as Deal/Lunas)
export const trackDealCompleted = (order: Order) => {
  saveEvent({
    type: 'deal_completed',
    orderId: order.id,
    villageId: order.villageId,
    villageName: order.villageName,
    amount: order.totalAmount
  });

  emitGtag('purchase', {
    transaction_id: order.id,
    value: order.totalAmount,
    currency: 'IDR'
  });
};

// Calculate aggregated statistics for a specific village or whole region
export const calculateAnalyticsStats = (events: InteractionEvent[], orders: Order[], villageId?: string): AnalyticsStats => {
  // Filter events if villageId is specified and not 'all'
  const filteredEvents = villageId && villageId !== 'all'
    ? events.filter(e => !e.villageId || e.villageId === villageId)
    : events;

  const filteredOrders = villageId && villageId !== 'all'
    ? orders.filter(o => !o.villageId || o.villageId === villageId)
    : orders;

  const totalViews = filteredEvents.filter(e => e.type === 'product_tap').length;
  const searchEvents = filteredEvents.filter(e => e.type === 'search');
  const totalSearches = searchEvents.length;
  const totalWaChats = filteredEvents.filter(e => e.type === 'wa_chat').length;

  const completedOrders = filteredOrders.filter(o => o.status === 'selesai');
  const totalCompletedDeals = completedOrders.length;
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Conversion rate: Completed Deals / WA Chats * 100
  const conversionRate = totalWaChats > 0
    ? Number(((totalCompletedDeals / totalWaChats) * 100).toFixed(1))
    : (totalCompletedDeals > 0 ? 100 : 0);

  // Top searches
  const searchCounts: Record<string, number> = {};
  searchEvents.forEach(e => {
    if (e.query) {
      searchCounts[e.query] = (searchCounts[e.query] || 0) + 1;
    }
  });

  const topSearches = Object.entries(searchCounts)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top viewed products
  const productViewCounts: Record<string, { title: string; count: number }> = {};
  filteredEvents
    .filter(e => e.type === 'product_tap' && e.productId)
    .forEach(e => {
      const pId = e.productId!;
      if (!productViewCounts[pId]) {
        productViewCounts[pId] = { title: e.productTitle || 'Produk Desa', count: 0 };
      }
      productViewCounts[pId].count += 1;
    });

  const topViewedProducts = Object.entries(productViewCounts)
    .map(([id, info]) => ({ id, title: info.title, views: info.count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return {
    totalViews,
    totalSearches,
    totalWaChats,
    totalCompletedDeals,
    totalRevenue,
    conversionRate,
    topSearches,
    topViewedProducts
  };
};
