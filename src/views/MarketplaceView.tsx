import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard, formatRupiah } from '../components/ProductCard';
import { ProductCategory } from '../types';
import { 
  Search, 
  RotateCcw, 
  Grid, 
  List, 
  MapPin, 
  Star, 
  ShoppingBag,
  Sparkles,
  X
} from 'lucide-react';
import { scoreProductSearch } from '../utils/search';

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

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Semua Produk' },
    { id: 'sembako', label: '🌾 Sembako & Sayur' },
    { id: 'tanaman-hias', label: '🪴 Tanaman Hias' },
    { id: 'minuman-komoditas', label: '☕ Kopi & Komoditas' },
    { id: 'buah-herba', label: '🍋 Buah & Herba' },
    { id: 'kuliner', label: '🍲 Kuliner & Camilan' },
    { id: 'olahan-susu', label: '🥛 Olahan Susu Kemasan' },
    { id: 'wisata-alam', label: '🌲 Wisata Alam & Camping' },
    { id: 'penginapan-lokal', label: '🏡 Penginapan & Homestay' },
  ];

  // Filter products based on active filters & smart search scoring
  const filteredProducts = products.filter(product => {
    // Category filter
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'penginapan-lokal' && product.category !== 'penginapan-lokal' && product.category !== 'homestay') {
        return false;
      } else if (categoryFilter === 'wisata-alam' && product.category !== 'wisata-alam' && product.category !== 'paket-wisata') {
        return false;
      } else if (categoryFilter !== 'penginapan-lokal' && categoryFilter !== 'wisata-alam' && product.category !== categoryFilter) {
        return false;
      }
    }

    // Village filter
    if (villageFilter !== 'all' && product.villageId !== villageFilter) {
      return false;
    }

    // Price Filter
    if (product.price > priceFilter) {
      return false;
    }

    // Rating Filter
    if (product.rating < ratingFilter) {
      return false;
    }

    // Smart Search Query Scoring (multi-word token, synonym, corpus matching)
    if (searchQuery.trim()) {
      const score = scoreProductSearch(product, searchQuery);
      if (score === 0) {
        return false;
      }
    }

    return true;
  });

  // Sorting with Search Relevance Priority
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (searchQuery.trim() && sortBy === 'popular') {
      const scoreA = scoreProductSearch(a, searchQuery);
      const scoreB = scoreProductSearch(b, searchQuery);
      if (scoreA !== scoreB) return scoreB - scoreA;
    }
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    // default 'popular'
    return b.totalReviews - a.totalReviews;
  });

  const isFiltered = categoryFilter !== 'all' || villageFilter !== 'all' || priceFilter < 1000000 || ratingFilter > 0 || searchQuery.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
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
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
            Pesan langsung sembako segar, tanaman hias, kopi specialty, buah & herba, kuliner khas, olahan susu, paket wisata alam, hingga penginapan lokal langsung dari petani, peternak, dan warga lokal di Kawasan Lembang.
          </p>
        </div>

        {/* Search Input In Marketplace Header */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk, komoditas, homestay..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-stone-400 hover:text-white text-xs cursor-pointer"
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
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            villageFilter === 'all'
              ? 'bg-emerald-800 text-amber-200 shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          Semua Desa ({villages.length})
        </button>

        {villages.map(v => (
          <button
            key={v.id}
            onClick={() => setVillageFilter(v.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === cat.id
                ? 'bg-emerald-800 text-amber-200 shadow-md scale-102'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Controls Bar: Results count, Reset Filter, Price Filter, Rating Filter, Sort, View Toggle */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        
        {/* Left: Result Counter & Active Filter / Reset */}
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5">
          <p className="text-xs font-semibold text-stone-600">
            Menampilkan <span className="font-extrabold text-stone-900">{sortedProducts.length}</span> produk & layanan
            {searchQuery.trim() && (
              <span> untuk "<strong className="text-emerald-800">{searchQuery}</strong>"</span>
            )}
          </p>

          {searchQuery.trim() && (
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100/80 hover:bg-amber-200 text-amber-900 rounded-full text-xs font-bold transition-colors cursor-pointer"
              title="Hapus kata kunci pencarian"
            >
              <span>Kata kunci: {searchQuery}</span>
              <X className="w-3 h-3" />
            </button>
          )}

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        {/* Right Controls: Price Dropdown, Rating Dropdown, Sort By, View Mode */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto">
          
          {/* Price Filter Dropdown */}
          <div className="w-full sm:w-auto">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(Number(e.target.value))}
              aria-label="Filter Harga Maksimal"
              className="w-full sm:w-auto px-2 sm:px-2.5 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-[11px] sm:text-xs text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              <option value={1000000}>Semua Harga</option>
              <option value={35000}>≤ Rp 35rb</option>
              <option value={50000}>≤ Rp 50rb</option>
              <option value={100000}>≤ Rp 100rb</option>
              <option value={250000}>≤ Rp 250rb</option>
              <option value={500000}>≤ Rp 500rb</option>
            </select>
          </div>

          {/* Minimum Rating Dropdown */}
          <div className="w-full sm:w-auto">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
              aria-label="Filter Rating Minimal"
              className="w-full sm:w-auto px-2 sm:px-2.5 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-[11px] sm:text-xs text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              <option value={0}>Semua Rating</option>
              <option value={4.0}>⭐ 4.0+</option>
              <option value={4.5}>⭐ 4.5+</option>
              <option value={4.8}>⭐ 4.8+</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Urutkan Produk"
              className="w-full sm:w-auto px-2 sm:px-2.5 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-[11px] sm:text-xs text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="popular">Terpopuler</option>
              <option value="price-asc">Termurah</option>
              <option value="price-desc">Tertinggi</option>
              <option value="rating">Rating ⭐</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500 hover:text-stone-800'}`}
              title="Tampilan Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500 hover:text-stone-800'}`}
              title="Tampilan List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Symmetrical Full-Width Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
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
            <p className="text-xs text-stone-500 mt-1">Coba ubah filter desa, kelompok produk, harga, atau kata kunci pencarian Anda.</p>
          </div>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

    </div>
  );
};
