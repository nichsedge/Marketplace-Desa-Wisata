import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { VillageCard } from '../components/VillageCard';
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
  Award,
  Users,
  Store,
  CheckCircle2,
  Coffee,
  Palette
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
  const [heroVillage, setHeroVillage] = useState<string>('all');
  const [heroCategory, setHeroCategory] = useState<ProductCategory | 'all'>('all');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(heroSearch);
    if (heroVillage !== 'all') setVillageFilter(heroVillage);
    if (heroCategory !== 'all') setCategoryFilter(heroCategory);
    navigateTo('marketplace');
  };

  // Filtered lists for homepage showcase
  const featuredProducts = products.filter(p => p.isFeatured || p.rating >= 4.8).slice(0, 4);
  const homestayListings = products.filter(p => p.category === 'homestay').slice(0, 3);
  const tourPackages = products.filter(p => p.category === 'paket-wisata').slice(0, 3);

  const categoryCards: { id: ProductCategory | 'all'; title: string; count: string; icon: React.ReactNode; color: string }[] = [
    { id: 'homestay', title: 'Homestay Desa', count: '12+ Penginapan', icon: <BedDouble className="w-6 h-6 text-indigo-700" />, color: 'bg-indigo-50 border-indigo-200' },
    { id: 'paket-wisata', title: 'Paket Wisata & Tour', count: '15+ Aktivitas', icon: <TreePine className="w-6 h-6 text-emerald-700" />, color: 'bg-emerald-50 border-emerald-200' },
    { id: 'suvenir', title: 'Suvenir & Kerajinan', count: '40+ Karya Seni', icon: <Palette className="w-6 h-6 text-amber-700" />, color: 'bg-amber-50 border-amber-200' },
    { id: 'kuliner', title: 'Kuliner & Kopi Adat', count: '30+ Rasa Lokal', icon: <Coffee className="w-6 h-6 text-rose-700" />, color: 'bg-rose-50 border-rose-200' },
    { id: 'umkm', title: 'Produk UMKM Tani', count: '25+ Olahan Murni', icon: <Store className="w-6 h-6 text-sky-700" />, color: 'bg-sky-50 border-sky-200' },
    { id: 'destinasi', title: 'Tiket & Spot Wisata', count: '10+ Destinasi', icon: <Compass className="w-6 h-6 text-teal-700" />, color: 'bg-teal-50 border-teal-200' },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center rounded-3xl overflow-hidden mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-2xl border border-stone-200">
        
        {/* Background Image & Gradient */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=80"
            alt="Desa Wisata Indonesia Landscape"
            className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/80 to-emerald-950/60" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 py-16 text-center space-y-8 z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs sm:text-sm font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Platform Resmi Marketplace Desa Wisata Indonesia</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif-title text-white tracking-tight leading-tight">
            Jelajahi Pesona Kebudayaan & <br className="hidden sm:inline" />
            <span className="text-amber-300 underline decoration-emerald-500 underline-offset-8">
              Produk Otentik Desa
            </span>
          </h1>

          <p className="text-stone-200 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Pesan homestay ramah warga, beli suvenir kain batik tulis, rasakan kopi khas adat, serta ikuti paket edukasi wisata langsung dari pengelola lokal desa.
          </p>

          {/* Interactive Search Box */}
          <form 
            onSubmit={handleHeroSearch}
            className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl sm:rounded-full shadow-2xl border border-stone-200 text-left max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-2"
          >
            {/* Search Input */}
            <div className="sm:col-span-5 relative flex items-center px-3 border-b sm:border-b-0 sm:border-r border-stone-200 pb-2 sm:pb-0">
              <Search className="w-5 h-5 text-emerald-800 mr-2 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Cari homestay, batik, kopi..."
                className="w-full bg-transparent text-sm text-stone-900 placeholder-stone-400 focus:outline-none font-medium"
              />
            </div>

            {/* Select Village */}
            <div className="sm:col-span-3 flex items-center px-3 border-b sm:border-b-0 sm:border-r border-stone-200 pb-2 sm:pb-0">
              <MapPin className="w-4 h-4 text-emerald-800 mr-2 shrink-0" />
              <select
                value={heroVillage}
                onChange={(e) => setHeroVillage(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-stone-800 focus:outline-none font-medium cursor-pointer"
              >
                <option value="all">Semua Desa Wisata</option>
                {villages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Select Category */}
            <div className="sm:col-span-2 flex items-center px-3 pb-2 sm:pb-0">
              <select
                value={heroCategory}
                onChange={(e) => setHeroCategory(e.target.value as ProductCategory | 'all')}
                className="w-full bg-transparent text-xs sm:text-sm text-stone-800 focus:outline-none font-medium cursor-pointer"
              >
                <option value="all">Semua Kategori</option>
                <option value="homestay">Homestay</option>
                <option value="paket-wisata">Paket Wisata</option>
                <option value="suvenir">Suvenir Batik</option>
                <option value="kuliner">Kuliner & Kopi</option>
                <option value="umkm">Produk UMKM</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-xl sm:rounded-full text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Cari</span>
              </button>
            </div>
          </form>

          {/* Quick Stats Pill Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-white/90 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Produk Asli Warga</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Desa Binaan Terverifikasi</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Dampak Ekonomi Langsung</span>
            </div>
          </div>

        </div>
      </section>

      {/* STATS COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-md grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl sm:text-4xl font-black font-serif-title text-emerald-800">50+</p>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">Desa Wisata Binaan</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-4xl font-black font-serif-title text-emerald-800">250+</p>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">Penginapan Homestay</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-4xl font-black font-serif-title text-emerald-800">1.200+</p>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">Produk UMKM Terdaftar</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-4xl font-black font-serif-title text-emerald-800">15.000+</p>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">Wisatawan Terlayani</p>
          </div>
        </div>
      </section>

      {/* CATEGORY EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Kategori Pilihan</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-stone-900 mt-1">
              Temukan Yang Anda Cari
            </h2>
          </div>
          <button
            onClick={() => { setCategoryFilter('all'); navigateTo('marketplace'); }}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group"
          >
            <span>Lihat Semua Kategori</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryCards.map((cat) => (
            <div
              key={cat.id}
              onClick={() => { setCategoryFilter(cat.id); navigateTo('marketplace'); }}
              className={`p-4 rounded-2xl border ${cat.color} cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-between space-y-3 group`}
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-sans">{cat.title}</h3>
                <p className="text-[11px] text-stone-500 mt-0.5">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Produk Unggulan Desa</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-stone-900 mt-1">
              Paling Laris & Direkomendasikan
            </h2>
          </div>
          <button
            onClick={() => navigateTo('marketplace')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group"
          >
            <span>Buka Marketplace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* REKOMENDASI HOMESTAY */}
      <section className="bg-amber-100/50 py-12 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-full text-[11px] font-bold">
                Penginapan Adat & Ramah
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-stone-900 mt-2">
                Homestay Pilihan Wisatawan
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Rasakan kehangatan tinggal di rumah warga desa dengan fasilitas bersih dan nyaman.
              </p>
            </div>
            <button
              onClick={() => navigateTo('homestay')}
              className="px-4 py-2 bg-indigo-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-800 transition-all hover:scale-105 shrink-0"
            >
              Lihat Semua Homestay
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homestayListings.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* PAKET WISATA UNGGULAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Aktivitas & Tour</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-stone-900 mt-1">
              Paket Wisata Berkesan
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Dari trekking gunung purba hingga workshop membatik dan bajak sawah bersama peternak.
            </p>
          </div>
          <button
            onClick={() => navigateTo('paket-wisata')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group"
          >
            <span>Semua Paket Wisata</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tourPackages.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* JELAJAHI DESA WISATA POPULAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Destinasi Budaya</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-stone-900 mt-1">
              Profil Desa Wisata Binaan
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Kenali keunikan sejarah, budaya lokal, dan arsitektur otentik setiap desa.
            </p>
          </div>
          <button
            onClick={() => navigateTo('desa-detail')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group"
          >
            <span>Lihat Semua Desa</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {villages.slice(0, 3).map((village) => (
            <VillageCard key={village.id} village={village} />
          ))}
        </div>
      </section>

      {/* TESTIMONIAL & IMPACT SECTION */}
      <section className="bg-stone-900 text-stone-100 rounded-3xl mx-4 sm:mx-6 lg:mx-8 p-8 sm:p-12 border border-stone-800 space-y-8">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold">
            Dampak Bagi Warga Desa
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-title text-white">
            "Satu Pesanan Anda, Penghidupan Bagi Keluarga Pengrajin & Tuan Rumah Desa"
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/80 space-y-4">
            <p className="text-xs sm:text-sm text-stone-300 italic leading-relaxed">
              "Melalui platform DesaWisata ini, homestay bambu kami sekarang selalu terisi wisatawan tiap akhir pekan. Kami bisa menyajikan masakan tradisional Bali dengan bangga."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-700">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="I Wayan Suparta"
                className="w-10 h-10 rounded-full object-cover border border-amber-300"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs font-bold text-white">I Wayan Suparta</p>
                <p className="text-[10px] text-amber-300">Pengelola Homestay Desa Penglipuran</p>
              </div>
            </div>
          </div>

          <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/80 space-y-4">
            <p className="text-xs sm:text-sm text-stone-300 italic leading-relaxed">
              "Kopi specialty Wae Rebo kami sekarang bisa dikirim langsung ke seluruh Indonesia tanpa perantara. Pendapatan petani kopi adat kami meningkat drastis!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-700">
              <img
                src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80"
                alt="Bapa Martinus"
                className="w-10 h-10 rounded-full object-cover border border-amber-300"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs font-bold text-white">Bapa Martinus</p>
                <p className="text-[10px] text-amber-300">Kelompok Tani Kopi Wae Rebo, NTT</p>
              </div>
            </div>
          </div>

          <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/80 space-y-4">
            <p className="text-xs sm:text-sm text-stone-300 italic leading-relaxed">
              "Senang sekali pesan kain batik tulis Nglanggeran dan paket membatik. Semuanya transparan, respon penjual cepat via WhatsApp, dan hasilnya otentik banget!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-stone-700">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                alt="Siti Rahmawati"
                className="w-10 h-10 rounded-full object-cover border border-amber-300"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs font-bold text-white">Siti Rahmawati</p>
                <p className="text-[10px] text-amber-300">Wisatawan Asal Bandung</p>
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
              Siap Merencanakan Liburan Berkesan di Desa Wisata?
            </h2>
            <p className="text-stone-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Dapatkan pengalaman autentik, dukung ekonomi masyarakat lokal, dan bawa pulang kenangan manis produk khas nusantara.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigateTo('marketplace')}
                className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-900 font-extrabold rounded-full text-xs sm:text-sm shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Mulai Belanja & Pesan</span>
              </button>
              <button
                onClick={() => navigateTo('dashboard')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full text-xs sm:text-sm border border-white/30 backdrop-blur-md transition-all"
              >
                Daftarkan Produk Desa Anda
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
