import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Search, 
  MapPin, 
  ArrowRight,
  Check,
  ChevronDown,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { ProductCategory } from '../types';

export const HomeView: React.FC = () => {
  const { 
    products, 
    villages,
    navigateTo, 
    setSearchQuery, 
    setCategoryFilter,
    setVillageFilter
  } = useApp();

  const [heroSearch, setHeroSearch] = useState('');
  const [heroCategory, setHeroCategory] = useState<ProductCategory | 'all'>('all');
  const [heroVillage, setHeroVillage] = useState<string>('all');
  const [isVillageOpen, setIsVillageOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const villageRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (villageRef.current && !villageRef.current.contains(e.target as Node)) {
        setIsVillageOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(heroSearch);
    if (heroCategory !== 'all') setCategoryFilter(heroCategory);
    if (heroVillage !== 'all') setVillageFilter(heroVillage);
    navigateTo('marketplace');
  };

  const selectedVillageObj = villages.find(v => v.id === heroVillage);
  const villageDisplayTitle = heroVillage === 'all' 
    ? 'Semua Desa di Lembang' 
    : (selectedVillageObj ? selectedVillageObj.name.replace('Desa Wisata ', 'Desa ') : 'Pilih Desa');

  const CATEGORY_OPTIONS: { id: ProductCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'Semua Kelompok', icon: '✨' },
    { id: 'sembako', label: 'Sembako & Susu Murni', icon: '🥬' },
    { id: 'tanaman-hias', label: 'Tanaman Hias & Sukulen', icon: '🪴' },
    { id: 'minuman-komoditas', label: 'Minuman & Kopi Specialty', icon: '☕' },
    { id: 'buah-herba', label: 'Buah & Herba Alami', icon: '🍋' },
    { id: 'kuliner', label: 'Kuliner & Kerajinan', icon: '🍲' },
    { id: 'olahan-susu', label: 'Olahan Susu Kemasan', icon: '🥛' },
    { id: 'wisata-alam', label: 'Wisata Alam & Offroad', icon: '🌲' },
    { id: 'penginapan-lokal', label: 'Penginapan Lokal & Homestay', icon: '🏡' },
  ];

  const selectedCategoryObj = CATEGORY_OPTIONS.find(c => c.id === heroCategory);

  // Filtered lists for homepage showcase: prioritize real products with direct CP
  const realProducts = products.filter(p => p.dataSource === 'real');
  const mockProducts = products.filter(p => p.dataSource !== 'real' && (p.isFeatured || p.rating >= 4.8));
  const featuredProducts = [...realProducts, ...mockProducts].slice(0, 8);

  const categoryLinks: { id: ProductCategory; title: string }[] = [
    { id: 'sembako', title: 'Sembako' },
    { id: 'tanaman-hias', title: 'Tanaman Hias' },
    { id: 'minuman-komoditas', title: 'Kopi & Komoditas' },
    { id: 'buah-herba', title: 'Buah & Herba' },
    { id: 'kuliner', title: 'Kuliner' },
    { id: 'olahan-susu', title: 'Olahan Susu' },
    { id: 'wisata-alam', title: 'Wisata Alam' },
    { id: 'penginapan-lokal', title: 'Penginapan' },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center rounded-2xl sm:rounded-3xl mx-2 sm:mx-6 lg:mx-8 mt-2 sm:mt-4 shadow-2xl border border-stone-200">
        
        {/* Background Image & Editorial Overlay */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none">
          <img
            src="/images/unsplash/photo-1506744038136-46273834b3fb_w2000.jpg"
            alt="Desa Wisata Kawasan Lembang Lanskap Pegunungan"
            className="w-full h-full object-cover object-center scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/70 to-stone-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-5xl mx-auto px-3 sm:px-10 py-10 sm:py-20 text-center space-y-6 sm:space-y-8 z-10 w-full">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900/60 text-amber-200 border border-white/20 text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
            <span>Kawasan Lembang · 1.200 — 1.400 mdpl</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-title font-extrabold text-white tracking-tight leading-[1.18]">
            Harmoni Alam & Hasil Bumi <br className="hidden sm:inline" />
            <span className="text-amber-300 italic font-serif">Delapan Desa Wisata</span>
          </h1>

          <p className="text-stone-200/90 text-xs sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Portal terpadu belanja komoditas kebun segar, kriya lokal, kopi specialty, dan reservasi penginapan asri — terhubung langsung dengan warga & pengelola resmi desa.
          </p>

          {/* Interactive Search Box with Custom Dropdowns */}
          <form 
            onSubmit={handleHeroSearch}
            className="bg-white p-2 sm:p-3 rounded-2xl sm:rounded-full shadow-2xl border border-stone-200 text-left max-w-4xl mx-auto flex flex-col md:flex-row items-stretch md:items-center gap-1.5 sm:gap-2 relative z-30 w-full"
          >
            {/* Search Input */}
            <div className="flex-1 relative flex items-center px-3 sm:px-4 py-2 border-b md:border-b-0 md:border-r border-stone-200">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800 mr-2 sm:mr-2.5 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Cari sembako, kopi, tanaman, offroad, homestay..."
                className="w-full bg-transparent text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none font-medium"
              />
              {heroSearch && (
                <button
                  type="button"
                  onClick={() => setHeroSearch('')}
                  className="p-1 text-stone-400 hover:text-stone-700 text-xs rounded-full cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Custom Village Dropdown */}
            <div ref={villageRef} className="relative flex-1 md:max-w-[260px] px-2 py-1.5 md:py-0 border-b md:border-b-0 md:border-r border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setIsVillageOpen(!isVillageOpen);
                  setIsCategoryOpen(false);
                }}
                className="w-full flex items-center justify-between gap-2 text-left py-1 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[9px] sm:text-[10px] uppercase font-extrabold text-emerald-800 tracking-wider">Lokasi Desa</span>
                    <span className="block text-xs sm:text-sm font-bold text-stone-900 truncate">
                      {villageDisplayTitle}
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${isVillageOpen ? 'rotate-180 text-emerald-800' : ''}`} />
              </button>

              {/* Village Popover Menu */}
              {isVillageOpen && (
                <div className="absolute top-full left-0 right-0 md:right-auto md:w-96 mt-2 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">Pilih Desa di Kawasan Lembang</span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">{villages.length} Desa</span>
                  </div>

                  <div className="py-1 max-h-60 sm:max-h-72 overflow-y-auto space-y-1">
                    {/* Option: Semua Desa */}
                    <button
                      type="button"
                      onClick={() => {
                        setHeroVillage('all');
                        setIsVillageOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-left transition-all cursor-pointer ${
                        heroVillage === 'all'
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'hover:bg-stone-100 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                        <span className="text-base sm:text-lg shrink-0">🏞️</span>
                        <div className="min-w-0">
                          <span className="block text-xs font-bold leading-tight truncate">Semua Desa di Lembang</span>
                          <span className={`block text-[10px] sm:text-[11px] mt-0.5 truncate ${heroVillage === 'all' ? 'text-emerald-200' : 'text-stone-500'}`}>
                            Kawasan Lembang (1.200 - 1.400 mdpl)
                          </span>
                        </div>
                      </div>
                      {heroVillage === 'all' && <Check className="w-4 h-4 text-amber-300 shrink-0 ml-1" />}
                    </button>

                    {/* All Specific Villages */}
                    {villages.map(v => {
                      const isSelected = heroVillage === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setHeroVillage(v.id);
                            setIsVillageOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'hover:bg-emerald-50/70 text-stone-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                            <span className="text-base sm:text-lg shrink-0">📍</span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs truncate">{v.name}</span>
                                <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                  isSelected ? 'bg-emerald-700 text-amber-200' : 'bg-stone-200 text-stone-700'
                                }`}>
                                  {v.villageAltitude || '1.250 mdpl'}
                                </span>
                              </div>
                              <span className={`block text-[10px] sm:text-[11px] truncate mt-0.5 ${
                                isSelected ? 'text-emerald-200' : 'text-stone-500'
                              }`}>
                                {v.highlights[0] || 'Desa Wisata Lembang'}
                              </span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-amber-300 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Category Dropdown */}
            <div ref={categoryRef} className="relative flex-1 md:max-w-[220px] px-2 py-1.5 md:py-0 border-b md:border-b-0 md:border-r border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsVillageOpen(false);
                }}
                className="w-full flex items-center justify-between gap-2 text-left py-1 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[9px] sm:text-[10px] uppercase font-extrabold text-amber-800 tracking-wider">Kelompok Produk</span>
                    <span className="block text-xs sm:text-sm font-bold text-stone-900 truncate">
                      {selectedCategoryObj?.label || 'Semua Kelompok'}
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180 text-amber-800' : ''}`} />
              </button>

              {/* Category Popover Menu */}
              {isCategoryOpen && (
                <div className="absolute top-full left-0 right-0 md:left-auto md:right-0 mt-2 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <span className="text-[10px] sm:text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">Pilih Kelompok Produk</span>
                  </div>
                  <div className="py-1 max-h-60 sm:max-h-72 overflow-y-auto space-y-1">
                    {CATEGORY_OPTIONS.map(cat => {
                      const isSelected = heroCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setHeroCategory(cat.id);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-left text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-800 text-white font-bold shadow-xs'
                              : 'hover:bg-stone-100 text-stone-800 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-amber-300" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="px-1 py-1">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-xl sm:rounded-2xl md:rounded-full text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Cari</span>
              </button>
            </div>
          </form>

          {/* Quick Indicators */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-stone-300 text-xs sm:text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Terhubung Langsung ke Kontak Desa
            </span>
            <span className="hidden sm:inline text-stone-600">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Pemberdayaan Warga & Komoditas Lokal
            </span>
            <span className="hidden sm:inline text-stone-600">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              8 Desa Wisata Terpadu
            </span>
          </div>
        </div>
      </section>

      {/* STATS COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-stone-800">
          <div className="space-y-1 py-2 md:py-0">
            <p className="text-3xl sm:text-4xl font-extrabold font-serif-title text-amber-300">{villages.length} Desa</p>
            <p className="text-xs sm:text-sm text-stone-400 font-medium">Jaringan Wisata Lembang</p>
          </div>
          <div className="space-y-1 py-2 md:py-0">
            <p className="text-3xl sm:text-4xl font-extrabold font-serif-title text-amber-300">8 Kelompok</p>
            <p className="text-xs sm:text-sm text-stone-400 font-medium">Komoditas & Produk Unggulan</p>
          </div>
          <div className="space-y-1 py-2 md:py-0">
            <p className="text-3xl sm:text-4xl font-extrabold font-serif-title text-amber-300">1.400 mdpl</p>
            <p className="text-xs sm:text-sm text-stone-400 font-medium">Ketinggian Alam Pegunungan</p>
          </div>
          <div className="space-y-1 py-2 md:py-0">
            <p className="text-3xl sm:text-4xl font-extrabold font-serif-title text-emerald-400">100%</p>
            <p className="text-xs sm:text-sm text-stone-400 font-medium">Langsung ke Petani & Warga</p>
          </div>
        </div>
      </section>

      {/* SPOTLIGHT DESA WISATA KAWASAN LEMBANG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-emerald-800 font-bold text-xs uppercase tracking-widest font-mono">Direktori Kawasan</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-stone-900 mt-1">
              Delapan Desa Wisata di Kawasan Lembang
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Masing-masing desa menyimpan keunikan ekologis, komoditas khas, dan keramahtamahan warga pegunungan.
            </p>
          </div>
          <button
            onClick={() => navigateTo('desa-detail')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group shrink-0 cursor-pointer"
          >
            <span>Buka Direktori Lengkap Desa</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 8 Village Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {villages.map((village) => (
            <div
              key={village.id}
              onClick={() => navigateTo('desa-detail', undefined, village.id)}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden cursor-pointer hover:shadow-xl hover:border-emerald-700/40 transition-all hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={village.image}
                  alt={village.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />
                <div className="absolute top-3 left-3 bg-stone-900/90 text-amber-200 font-medium text-[10px] px-2.5 py-0.5 rounded-full border border-white/15">
                  {village.villageAltitude || '1.250 mdpl'}
                </div>
                <div className="absolute top-3 right-3 bg-stone-900/90 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full border border-white/15">
                  ★ {village.rating} ({village.totalReviews})
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif-title font-extrabold text-base leading-snug">{village.name}</h3>
                  <p className="text-[11px] text-stone-300 flex items-center gap-1 mt-0.5 font-light">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{village.location}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {village.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex flex-wrap gap-1">
                    {village.highlights.slice(0, 2).map((hl, idx) => (
                      <span key={idx} className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                        {hl}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-stone-500 font-medium">
                      Admin: <strong className="text-stone-700">{village.managerName.split('(')[0]}</strong>
                    </span>
                    <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      <span>Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Katalog Terpadu</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-stone-900 mt-1">
              8 Kelompok Produk & Komoditas Desa
            </h2>
          </div>
          <button
            onClick={() => { setCategoryFilter('all'); navigateTo('marketplace'); }}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group cursor-pointer"
          >
            <span>Buka Marketplace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm font-medium text-stone-700">
          {categoryLinks.map((cat, idx) => (
            <React.Fragment key={cat.id}>
              <button
                onClick={() => { setCategoryFilter(cat.id); navigateTo('marketplace'); }}
                className="hover:text-emerald-800 transition-colors cursor-pointer"
              >
                {cat.title}
              </button>
              {idx < categoryLinks.length - 1 && <span className="text-stone-300">·</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-emerald-800 font-bold text-xs uppercase tracking-widest font-mono">Pilihan Terkurasi</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-stone-900 mt-1">
              Produk & Komoditas Unggulan Kawasan Lembang
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Hasil panen terbaik dan kerajinan otentik, terhubung langsung ke narahubung resmi warga desa.
            </p>
          </div>
          <button
            onClick={() => navigateTo('marketplace')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group cursor-pointer"
          >
            <span>Buka Semua Produk Marketplace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* TESTIMONIAL & IMPACT SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="text-center space-y-6">
          <blockquote className="text-2xl sm:text-4xl font-serif-title text-stone-900 leading-snug relative">
            <span className="text-stone-300 text-6xl leading-none absolute -left-8 -top-4">"</span>
            Melalui portal Saba Lembang ini, sayuran organik dan susu murni kami di Cibodas terhubung langsung ke pembeli. Pengunjung juga mudah memesan penginapan warga.
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <img
              src="/images/unsplash/photo-1500648767791-00dcc994a43e_w150.jpg"
              alt="Kang Dadang Herdiana"
              className="w-12 h-12 rounded object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <p className="text-sm font-bold text-stone-900">Kang Dadang Herdiana</p>
              <p className="text-xs text-stone-600">Admin Desa Wisata Cibodas</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-stone-200">
          <div className="space-y-4">
            <p className="text-sm text-stone-700 leading-relaxed">
              "Biji kopi Arabika single origin lereng Suntenjaya kini semakin dikenal luas. Komunikasi dengan wisatawan sangat praktis melalui kontak Admin Desa."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="/images/unsplash/photo-1507003211169-0a1dd7228f2d_w150.jpg"
                alt="Kang Asep Suhendar"
                className="w-10 h-10 rounded object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-sm font-bold text-stone-900">Kang Asep Suhendar</p>
                <p className="text-xs text-stone-600">Admin Desa Wisata Suntenjaya</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-stone-700 leading-relaxed">
              "Platform ini memudahkan kami mencari produk asli desa di Lembang, mulai dari camping di Cikole, buah segar di Cikahuripan, hingga olahan susu di Sukajaya."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="/images/unsplash/photo-1494790108377-be9c29b29330_w150.jpg"
                alt="Siti Rahmawati"
                className="w-10 h-10 rounded object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-sm font-bold text-stone-900">Siti Rahmawati</p>
                <p className="text-xs text-stone-600">Wisatawan Asal Jakarta</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6 border-t border-stone-200">
        <h2 className="text-3xl sm:text-5xl font-serif-title font-extrabold text-stone-900">
          Siap Menikmati Liburan di Lembang?
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Dapatkan pengalaman autentik di ketinggian pegunungan Lembang, nikmati udara segar berkabut, dukung ekonomi warga lokal, dan rasakan kehangatan keramahan warga desa.
        </p>
        <div className="pt-6">
          <button
            onClick={() => navigateTo('marketplace')}
            className="text-emerald-800 font-bold hover:text-emerald-900 text-sm sm:text-base border-b-2 border-emerald-800 pb-1 cursor-pointer transition-colors"
          >
            Mulai Jelajah & Kontak Langsung →
          </button>
        </div>
      </section>

    </div>
  );
};
