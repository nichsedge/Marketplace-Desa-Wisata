import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { TreePine, Compass, Calendar, Sparkles, CheckCircle2, Search, Filter } from 'lucide-react';

export const TourPackagesView: React.FC = () => {
  const { products, navigateTo } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [searchWord, setSearchWord] = useState<string>('');

  const packages = products.filter(p => p.category === 'paket-wisata');

  const filteredPackages = packages.filter(pkg => {
    if (searchWord.trim()) {
      const q = searchWord.toLowerCase();
      const match = pkg.title.toLowerCase().includes(q) || pkg.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterType === 'susu' && !pkg.title.toLowerCase().includes('susu') && !pkg.description.toLowerCase().includes('susu')) return false;
    if (filterType === 'kopi' && !pkg.title.toLowerCase().includes('kopi') && !pkg.description.toLowerCase().includes('kopi')) return false;
    if (filterType === 'budaya' && !pkg.title.toLowerCase().includes('batu') && !pkg.description.toLowerCase().includes('budaya') && !pkg.description.toLowerCase().includes('kadaplak')) return false;
    if (filterType === 'livein' && !pkg.title.toLowerCase().includes('live-in') && !pkg.description.toLowerCase().includes('live-in') && !pkg.title.toLowerCase().includes('kemah')) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner Header */}
      <div className="relative rounded-3xl overflow-hidden min-h-[260px] flex items-center p-8 sm:p-12 text-white shadow-xl border border-stone-200">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
          alt="Paket Wisata Suntenjaya"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-emerald-950/80 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <TreePine className="w-4 h-4" />
            <span>Petualangan & Edukasi Wisata Suntenjaya</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-title text-white">
            Paket Wisata & Live-In Pasir Angling Suntenjaya
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Dapatkan pengalaman hands-on otentik: dari live-in bersama keluarga warga, praktik perah susu sapi murni, petik sayuran organik langsung di ladang terasering, roasting kopi Arabika, hingga trekking Situs Batu Loceng dan Taman Bincarung.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Activity Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${filterType === 'all' ? 'bg-emerald-800 text-amber-200 shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
            >
              Semua Paket ({packages.length})
            </button>
            <button
              onClick={() => setFilterType('susu')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${filterType === 'susu' ? 'bg-emerald-800 text-amber-200 shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
            >
              🐄 Edukasi Susu & Tani
            </button>
            <button
              onClick={() => setFilterType('kopi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${filterType === 'kopi' ? 'bg-emerald-800 text-amber-200 shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
            >
              ☕ Kopi & Roasting
            </button>
            <button
              onClick={() => setFilterType('budaya')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${filterType === 'budaya' ? 'bg-emerald-800 text-amber-200 shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
            >
              🗿 Cagar Budaya & Kadaplak
            </button>
            <button
              onClick={() => setFilterType('livein')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${filterType === 'livein' ? 'bg-emerald-800 text-amber-200 shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
            >
              ⛺ Live-In & Camping
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="Cari aktivitas..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

        </div>
      </div>

      {/* Grid of Packages */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold font-serif-title text-stone-900">
            Daftar Paket Aktivitas Pilihan ({filteredPackages.length})
          </h2>
          <span className="text-xs text-emerald-800 font-semibold">Termasuk Pemandu Lokal & Perlengkapan</span>
        </div>

        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map(pkg => (
              <ProductCard key={pkg.id} product={pkg} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 space-y-2">
            <p className="font-bold text-stone-800 text-sm">Tidak ada paket wisata yang cocok</p>
            <button
              onClick={() => { setFilterType('all'); setSearchWord(''); }}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
