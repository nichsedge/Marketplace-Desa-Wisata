import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard, formatRupiah } from '../components/ProductCard';
import { ProductCategory } from '../types';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Grid, 
  List, 
  MapPin, 
  Star, 
  Tag, 
  SlidersHorizontal,
  ChevronDown,
  ShoppingBag
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const {
    products,
    villages,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    villageFilter,
    setVillageFilter,
    priceFilter,
    setPriceFilter,
    ratingFilter,
    setRatingFilter,
    sortBy,
    setSortBy,
    resetFilters
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Semua Produk' },
    { id: 'homestay', label: 'Homestay' },
    { id: 'paket-wisata', label: 'Paket Wisata' },
    { id: 'kuliner', label: 'Kuliner & Kopi' },
    { id: 'umkm', label: 'Sayur & Hasil Tani' },
    { id: 'suvenir', label: 'Suvenir & Kerajinan' },
    { id: 'destinasi', label: 'Tiket Wisata' },
  ];

  // Apply filters
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchVillage = product.villageName.toLowerCase().includes(q);
      const matchSeller = product.sellerName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchVillage && !matchSeller) return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && product.category !== categoryFilter) return false;

    // Village filter
    if (villageFilter !== 'all' && product.villageId !== villageFilter) return false;

    // Price filter
    if (product.price > priceFilter) return false;

    // Rating filter
    if (product.rating < ratingFilter) return false;

    return true;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    // default 'popular'
    return b.totalReviews - a.totalReviews;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-amber-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-700/30">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Katalog Resmi Jaringan Desa Wisata Lembang</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-title">
            Marketplace Desa Wisata Kawasan Lembang
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
            Pesan langsung homestay sejuk lereng gunung, paket edukasi & offroad, kopi specialty, hingga sayuran segar langsung dari PIC resmi desa di Kawasan Lembang.
          </p>
        </div>

        {/* Search Input In Marketplace Header */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk / homestay..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-stone-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Village Filter Bar (Kawasan Lembang) */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-xs font-bold text-stone-700 flex items-center gap-1 shrink-0 mr-1">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <span>Pilih Desa:</span>
        </span>

        <button
          onClick={() => setVillageFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            villageFilter === 'all'
              ? 'bg-emerald-800 text-amber-200 shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          Semua Desa
        </button>

        {villages.map(v => (
          <button
            key={v.id}
            onClick={() => setVillageFilter(v.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              villageFilter === v.id
                ? 'bg-emerald-800 text-amber-200 shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {v.name.replace('Desa Wisata ', '')}
          </button>
        ))}
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === cat.id
                ? 'bg-emerald-800 text-amber-200 shadow-md scale-105'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid Layout: Sidebar Filter + Product List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs h-fit sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <span>Filter Pencarian</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Village Filter Sidebar */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 block">Desa Wisata di Lembang</label>
            <select
              value={villageFilter}
              onChange={(e) => setVillageFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
            >
              <option value="all">🏞️ Semua Desa di Lembang (5 Desa)</option>
              {villages.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.villageAltitude || '1.250 mdpl'})</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800">
              <label>Harga Maksimal</label>
              <span className="text-emerald-800 font-extrabold">{formatRupiah(priceFilter)}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={1000000}
              step={10000}
              value={priceFilter}
              onChange={(e) => setPriceFilter(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-medium">
              <span>Rp 10rb</span>
              <span>Rp 1 Jt+</span>
            </div>
          </div>

          {/* Minimum Rating Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Rating Minimal</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 4.0, 4.5, 4.8].map((r) => (
                <button
                  key={r}
                  onClick={() => setRatingFilter(r)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                    ratingFilter === r
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {r === 0 ? 'Semua' : `${r}★`}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
            <p className="font-bold">✨ PIC Terhubung Langsung</p>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Setiap pesanan dihubungkan langsung ke WhatsApp PIC desa terkait untuk kemudahan konfirmasi & kedatangan.
            </p>
          </div>
        </aside>

        {/* Main Product Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar: Search Chip, Results count, View Mode, Sort */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            
            {/* Left Result Counter & Mobile Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-stone-300"
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-800" />
                <span>Filter</span>
              </button>

              <p className="text-xs font-medium text-stone-600">
                Menampilkan <span className="font-bold text-stone-900">{sortedProducts.length}</span> produk/layanan
              </p>
            </div>

            {/* Right Controls: Sort & Grid View */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Sort By */}
              <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
                <span className="hidden sm:inline">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="popular">Terpopuler</option>
                  <option value="price-asc">Harga Terendah</option>
                  <option value="price-desc">Harga Tertinggi</option>
                  <option value="rating">Rating Tertinggi</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Product Grid / List Display */}
          {sortedProducts.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-stone-200">
              <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Tidak Ada Produk Yang Sesuai</h3>
                <p className="text-xs text-stone-500 mt-1">Coba ubah filter desa, kategori, atau kata kunci pencarian Anda.</p>
              </div>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-emerald-800 text-amber-200 font-bold rounded-xl text-xs shadow-md"
              >
                Reset Semua Filter
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm lg:hidden p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-900">Filter Produk</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-stone-400">✕</button>
            </div>

            {/* Village Selector Mobile */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800">Desa Wisata di Lembang</label>
              <select
                value={villageFilter}
                onChange={(e) => setVillageFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="all">🏞️ Semua Desa di Lembang (5 Desa)</option>
                {villages.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.villageAltitude || '1.250 mdpl'})</option>
                ))}
              </select>
            </div>

            {/* Price Filter Mobile */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                <label>Harga Maksimal</label>
                <span className="text-emerald-800 font-extrabold">{formatRupiah(priceFilter)}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={1000000}
                step={10000}
                value={priceFilter}
                onChange={(e) => setPriceFilter(Number(e.target.value))}
                className="w-full accent-emerald-800"
              />
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-emerald-800 text-amber-200 font-bold rounded-xl text-xs shadow-md"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
