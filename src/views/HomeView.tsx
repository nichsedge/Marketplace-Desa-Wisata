import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Search, 
  MapPin, 
  BedDouble, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  TreePine, 
  ArrowRight,
  ShoppingBag,
  Store,
  Coffee,
  Palette,
  Mountain,
  Check,
  ChevronDown,
  Layers,
  Milk,
  Flower2,
  Apple,
  Utensils
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

  // Filtered lists for homepage showcase
  const featuredProducts = products.filter(p => p.isFeatured || p.rating >= 4.8).slice(0, 4);

  const categoryCards: { id: ProductCategory; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
    { id: 'sembako', title: 'Sembako', subtitle: 'Sayur Segar & Susu Murni (Cibodas)', icon: <Store className="w-6 h-6 text-emerald-700" />, color: 'bg-emerald-50 border-emerald-200' },
    { id: 'tanaman-hias', title: 'Tanaman Hias', subtitle: 'Sukulen, Pot & Media Tanam (Jayagiri)', icon: <Flower2 className="w-6 h-6 text-teal-700" />, color: 'bg-teal-50 border-teal-200' },
    { id: 'minuman-komoditas', title: 'Minuman & Komoditas', subtitle: 'Kopi Arabika/Robusta (Suntenjaya)', icon: <Coffee className="w-6 h-6 text-amber-700" />, color: 'bg-amber-50 border-amber-200' },
    { id: 'buah-herba', title: 'Buah & Herba', subtitle: 'Lemon, Stroberi & Jamu (Cikahuripan)', icon: <Apple className="w-6 h-6 text-lime-700" />, color: 'bg-lime-50 border-lime-200' },
    { id: 'kuliner', title: 'Kuliner', subtitle: 'Tahu Susu, Bolu & Kriya (Wangunsari, Gudangkahuripan)', icon: <Utensils className="w-6 h-6 text-rose-700" />, color: 'bg-rose-50 border-rose-200' },
    { id: 'olahan-susu', title: 'Olahan Susu Kemasan', subtitle: 'Yoghurt, Keju & Mentega (Sukajaya)', icon: <Milk className="w-6 h-6 text-sky-700" />, color: 'bg-sky-50 border-sky-200' },
    { id: 'wisata-alam', title: 'Wisata Alam', subtitle: 'Camping, Tenda & Offroad (Cikole, Cikahuripan)', icon: <TreePine className="w-6 h-6 text-emerald-800" />, color: 'bg-emerald-50 border-emerald-300' },
    { id: 'penginapan-lokal', title: 'Penginapan Lokal', subtitle: 'Homestay & Sewa Rumah (Cibodas)', icon: <BedDouble className="w-6 h-6 text-indigo-700" />, color: 'bg-indigo-50 border-indigo-200' },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center rounded-2xl sm:rounded-3xl mx-2 sm:mx-6 lg:mx-8 mt-2 sm:mt-4 shadow-2xl border border-stone-200">
        
        {/* Background Image & Gradient */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none">
          <img
            src="/images/unsplash/photo-1506744038136-46273834b3fb_w2000.jpg"
            alt="Desa Wisata Kawasan Lembang Lanskap Pegunungan"
            className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/80 to-emerald-950/60" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-5xl mx-auto px-3 sm:px-10 py-8 sm:py-16 text-center space-y-6 sm:space-y-8 z-10 w-full">
          
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-emerald-500/20 text-amber-300 border border-amber-400/40 text-[11px] sm:text-sm font-semibold backdrop-blur-md max-w-full">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="truncate">Platform Terpadu Desa Wisata Kawasan Lembang</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold font-serif-title text-white tracking-tight leading-tight">
            Jelajahi Pesona Alam & <br className="hidden sm:inline" />
            <span className="text-amber-300 underline decoration-emerald-500 underline-offset-8">
              Desa Wisata Kawasan Lembang
            </span>
          </h1>

          <p className="text-stone-200 text-xs sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Temukan sembako organik segar, tanaman hias, kopi specialty, buah & herba, kuliner khas, olahan susu, hingga penginapan asri langsung dari petani, peternak, dan warga lokal di Kawasan Lembang.
          </p>

          {/* Interactive Search Box with Custom Dropdowns */}
          <form 
            onSubmit={handleHeroSearch}
            className="bg-white/95 backdrop-blur-md p-2 sm:p-3 rounded-2xl sm:rounded-full shadow-2xl border border-stone-200 text-left max-w-4xl mx-auto flex flex-col md:flex-row items-stretch md:items-center gap-1.5 sm:gap-2 relative z-30 w-full"
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

          {/* Quick Stats Pill Bar */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 text-white/90 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Langsung ke Petani & Warga Desa</span>
            </div>
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Ketinggian 1.200 - 1.400 mdpl</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400 shrink-0" />
              <span>100% Dampak Langsung Warga Lokal</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl sm:text-4xl font-black font-serif-title text-emerald-800">{villages.length} Desa</p>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">Jaringan Wisata Lembang</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-4xl font-black font-serif-title text-emerald-800">8 Kelompok</p>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">Komoditas & Produk Unggulan</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-4xl font-black font-serif-title text-emerald-800">1.400 mdpl</p>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">Ketinggian Alam Pegunungan</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-4xl font-black font-serif-title text-emerald-800">Langsung</p>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">Ke Petani & Warga Desa</p>
          </div>
        </div>
      </section>

      {/* SPOTLIGHT DESA WISATA KAWASAN LEMBANG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Destinasi Pilihan</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-stone-900 mt-1">
              Jelajahi {villages.length} Desa Wisata di Kawasan Lembang
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Setiap desa memiliki karakter alam, cagar budaya, dan keunggulan produk yang khas.
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
              className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={village.image}
                  alt={village.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-amber-400 text-stone-950 font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md">
                  {village.villageAltitude || '1.250 mdpl'}
                </div>
                <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-sm text-amber-300 font-bold text-[10px] px-2.5 py-1 rounded-full border border-white/20">
                  ★ {village.rating} ({village.totalReviews})
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif-title font-extrabold text-base leading-snug">{village.name}</h3>
                  <p className="text-[11px] text-stone-300 flex items-center gap-1 mt-0.5">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryCards.map((cat) => (
            <div
              key={cat.id}
              onClick={() => { setCategoryFilter(cat.id); navigateTo('marketplace'); }}
              className={`p-4 rounded-2xl border ${cat.color} cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-between space-y-2 group`}
            >
              <div className="w-11 h-11 rounded-xl bg-white shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-sans">{cat.title}</h3>
                <p className="text-[11px] text-stone-600 mt-0.5 line-clamp-2 leading-relaxed">{cat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Paling Direkomendasikan</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-stone-900 mt-1">
              Produk & Layanan Unggulan Kawasan Lembang
            </h2>
          </div>
          <button
            onClick={() => navigateTo('marketplace')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group cursor-pointer"
          >
            <span>Lihat Semua Produk</span>
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
      <section className="bg-stone-900 text-stone-100 rounded-3xl mx-4 sm:mx-6 lg:mx-8 p-8 sm:p-12 border border-stone-800 space-y-8">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold">
            Dampak Nyata Ekonomi Desa
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-title text-white">
            "Pariwisata Berkelanjutan yang Menyejahterakan Petani, Peternak & Pengrajin Lembang"
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/80 space-y-4">
            <p className="text-xs sm:text-sm text-stone-300 italic leading-relaxed">
              "Melalui portal Saba Lembang ini, sayuran organik dan susu murni kami di Cibodas terhubung langsung ke pembeli. Pengunjung juga mudah memesan penginapan warga."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-700">
              <img
                src="/images/unsplash/photo-1500648767791-00dcc994a43e_w150.jpg"
                alt="Kang Dadang Herdiana"
                className="w-10 h-10 rounded-full object-cover border border-amber-300"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs font-bold text-white">Kang Dadang Herdiana</p>
                <p className="text-[10px] text-amber-300">Admin Desa Wisata Cibodas</p>
              </div>
            </div>
          </div>

          <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/80 space-y-4">
            <p className="text-xs sm:text-sm text-stone-300 italic leading-relaxed">
              "Biji kopi Arabika single origin lereng Suntenjaya kini semakin dikenal luas. Komunikasi dengan wisatawan sangat praktis melalui kontak Admin Desa."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-700">
              <img
                src="/images/unsplash/photo-1507003211169-0a1dd7228f2d_w150.jpg"
                alt="Kang Asep Suhendar"
                className="w-10 h-10 rounded-full object-cover border border-amber-300"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs font-bold text-white">Kang Asep Suhendar</p>
                <p className="text-[10px] text-amber-300">Admin Desa Wisata Suntenjaya</p>
              </div>
            </div>
          </div>

          <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/80 space-y-4">
            <p className="text-xs sm:text-sm text-stone-300 italic leading-relaxed">
              "Platform ini memudahkan kami mencari produk asli desa di Lembang, mulai dari camping di Cikole, buah segar di Cikahuripan, hingga olahan susu di Sukajaya."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-700">
              <img
                src="/images/unsplash/photo-1494790108377-be9c29b29330_w150.jpg"
                alt="Siti Rahmawati"
                className="w-10 h-10 rounded-full object-cover border border-amber-300"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs font-bold text-white">Siti Rahmawati</p>
                <p className="text-[10px] text-amber-300">Wisatawan Asal Jakarta</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-4">
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-8 sm:p-12 rounded-3xl text-white shadow-2xl space-y-6 relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-title">
              Siap Menikmati Sejuknya Liburan di Kawasan Lembang?
            </h2>
            <p className="text-stone-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Dapatkan pengalaman autentik di ketinggian pegunungan Lembang, nikmati udara segar berkabut, dukung ekonomi warga lokal, dan rasakan kehangatan keramahan warga desa.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigateTo('marketplace')}
                className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-900 font-extrabold rounded-full text-xs sm:text-sm shadow-lg transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Mulai Jelajah & Pesan</span>
              </button>
              <a
                href="https://wa.me/6282122334455?text=Halo%20Admin%20Saba%20Lembang%2C%20saya%20ingin%20konsultasi%20destinasi%20wisata%20Kawasan%20Lembang"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full text-xs sm:text-sm border border-white/30 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Konsultasi via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
