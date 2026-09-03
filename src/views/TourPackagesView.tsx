import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { TreePine, Compass, Calendar, Sparkles, CheckCircle2, Search, Filter, MapPin } from 'lucide-react';
import { matchProductSearch } from '../utils/search';

export const TourPackagesView: React.FC = () => {
  const { products, villages, navigateTo } = useApp();

  const [selectedVillageId, setSelectedVillageId] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchWord, setSearchWord] = useState<string>('');

  const packages = products.filter(p => p.category === 'paket-wisata' || p.category === 'wisata-alam');

  const filteredPackages = packages.filter(pkg => {
    if (selectedVillageId !== 'all' && pkg.villageId !== selectedVillageId) return false;
    
    if (searchWord.trim()) {
      if (!matchProductSearch(pkg, searchWord)) return false;
    }
    if (filterType === 'susu' && !pkg.title.toLowerCase().includes('susu') && !pkg.description.toLowerCase().includes('susu') && !pkg.description.toLowerCase().includes('paprika') && !pkg.description.toLowerCase().includes('sayur') && !pkg.description.toLowerCase().includes('agro') && !pkg.description.toLowerCase().includes('kebun')) return false;
    if (filterType === 'kopi' && !pkg.title.toLowerCase().includes('kopi') && !pkg.description.toLowerCase().includes('kopi')) return false;
    if (filterType === 'offroad' && !pkg.title.toLowerCase().includes('offroad') && !pkg.description.toLowerCase().includes('offroad') && !pkg.title.toLowerCase().includes('trekking') && !pkg.description.toLowerCase().includes('trekking') && !pkg.title.toLowerCase().includes('pinus') && !pkg.description.toLowerCase().includes('pinus')) return false;
    if (filterType === 'livein' && !pkg.title.toLowerCase().includes('live-in') && !pkg.description.toLowerCase().includes('live-in') && !pkg.title.toLowerCase().includes('glamping') && !pkg.title.toLowerCase().includes('camping') && !pkg.title.toLowerCase().includes('tenda') && !pkg.description.toLowerCase().includes('camping') && !pkg.description.toLowerCase().includes('tenda')) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner Header */}
      <div className="relative rounded-3xl overflow-hidden min-h-[260px] flex items-center p-8 sm:p-12 text-white shadow-xl border border-stone-200">
        <img
          src="/images/unsplash/photo-1464822759023-fed622ff2c3b_w1600.jpg"
          alt="Paket Wisata Kawasan Lembang"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-emerald-950/80 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <TreePine className="w-4 h-4" />
            <span>Petualangan & Edukasi Desa Wisata Lembang</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-title text-white">
            Paket Wisata, Live-In & Trekking Rimba Lembang
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Dapatkan pengalaman hands-on otentik: live-in bersama keluarga warga desa, perah susu sapi murni, offroad kanopi pinus Cikole, agrowisata bunga & paprika Cibodas, hingga susur jalur rimba berkabut Tangkuban Parahu di Jayagiri.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        
        {/* Village Selector & Search Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <select
              value={selectedVillageId}
              onChange={(e) => setSelectedVillageId(e.target.value)}
              className="px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-bold text-stone-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
            >
              <option value="all">🏞️ Semua Desa Wisata di Lembang (8 Desa)</option>
              {villages.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.villageAltitude || '1.250 mdpl'})</option>
              ))}
            </select>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="Cari aktivitas, offroad, live-in..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>

        {/* Activity Category Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-100">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${filterType === 'all' ? 'bg-emerald-800 text-amber-200 shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
          >
            Semua Aktivitas ({packages.length})
          </button>
          <button
            onClick={() => setFilterType('offroad')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${filterType === 'offroad' ? 'bg-emerald-800 text-amber-200 shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
          >
            🚙 Offroad & Trekking Rimba
          </button>
          <button
            onClick={() => setFilterType('susu')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${filterType === 'susu' ? 'bg-emerald-800 text-amber-200 shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
          >
            🐄 Edukasi Susu & Agrowisata
          </button>
          <button
            onClick={() => setFilterType('livein')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${filterType === 'livein' ? 'bg-emerald-800 text-amber-200 shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
          >
            ⛺ Live-In & Glamping
          </button>
        </div>

      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-stone-200">
          <TreePine className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">Tidak ada paket wisata yang sesuai</h3>
          <p className="text-xs text-stone-500">Coba pilih semua desa wisata atau bersihkan kata kunci pencarian.</p>
        </div>
      )}

    </div>
  );
};
