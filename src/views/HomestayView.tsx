import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard, formatRupiah } from '../components/ProductCard';
import { BedDouble, Wifi, Utensils, ShieldCheck, MapPin, Sparkles, Filter } from 'lucide-react';

export const HomestayView: React.FC = () => {
  const { products, villages, navigateTo } = useApp();

  const [selectedVillageId, setSelectedVillageId] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [requireWifi, setRequireWifi] = useState(false);
  const [requireBreakfast, setRequireBreakfast] = useState(false);

  const homestays = products.filter(p => p.category === 'homestay' || p.category === 'penginapan-lokal');

  const filteredHomestays = homestays.filter(h => {
    if (selectedVillageId !== 'all' && h.villageId !== selectedVillageId) return false;
    if (h.price > maxPrice) return false;
    if (requireWifi) {
      const hasWifi = (h.facilities && h.facilities.some(f => f.toLowerCase().includes('wifi'))) ||
                      (h.highlights && h.highlights.some(f => f.toLowerCase().includes('wifi'))) ||
                      h.description.toLowerCase().includes('wifi');
      if (!hasWifi) return false;
    }
    if (requireBreakfast) {
      const hasBreakfast = (h.facilities && h.facilities.some(f => f.toLowerCase().includes('sarapan') || f.toLowerCase().includes('liwet') || f.toLowerCase().includes('makan'))) ||
                           (h.highlights && h.highlights.some(f => f.toLowerCase().includes('sarapan') || f.toLowerCase().includes('liwet'))) ||
                           h.description.toLowerCase().includes('sarapan') || h.description.toLowerCase().includes('liwet');
      if (!hasBreakfast) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[260px] flex items-center p-8 sm:p-12 text-white shadow-xl border border-stone-200">
        <img
          src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1600&q=80"
          alt="Homestay Desa Kawasan Lembang"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/80 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <BedDouble className="w-4 h-4" />
            <span>Homestay & Glamping Lembang</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-title text-white">
            Menginap Sejuk di Pegunungan Kawasan Lembang
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Nikmati suasana pedesaan yang asri pada ketinggian 1.200 - 1.400 mdpl, udara berkabut sejuk, dan kehangatan tuan rumah warga lokal di desa-desa wisata Lembang. Dilengkapi air hangat, sarapan tradisional, dan pemandangan hijau alami.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-800" />
            <span>Filter Ketersediaan Homestay</span>
          </h3>
          <span className="text-xs text-stone-500">
            Ditemukan <strong className="text-stone-900">{filteredHomestays.length}</strong> homestay
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          
          {/* Village Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Pilih Desa Wisata:</span>
            </label>
            <select
              value={selectedVillageId}
              onChange={(e) => setSelectedVillageId(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-bold text-stone-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
            >
              <option value="all">🏞️ Semua Desa Wisata di Lembang (8 Desa)</option>
              {villages.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.villageAltitude || '1.250 mdpl'})</option>
              ))}
            </select>
          </div>

          {/* Max Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-stone-700">
              <span>Maksimal Harga:</span>
              <span className="text-emerald-800">{formatRupiah(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={150000}
              max={1000000}
              step={25000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
          </div>

          {/* Amenities Toggles */}
          <div className="flex items-center justify-around sm:justify-start gap-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl px-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={requireWifi}
                onChange={(e) => setRequireWifi(e.target.checked)}
                className="w-4 h-4 accent-emerald-800 rounded"
              />
              <span>Free WiFi</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={requireBreakfast}
                onChange={(e) => setRequireBreakfast(e.target.checked)}
                className="w-4 h-4 accent-emerald-800 rounded"
              />
              <span>Sarapan Gratis</span>
            </label>
          </div>

        </div>
      </div>

      {/* Homestay Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHomestays.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredHomestays.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-stone-200">
          <BedDouble className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">Tidak ada homestay yang sesuai filter</h3>
          <p className="text-xs text-stone-500">Coba naikkan batas harga maksimal atau pilih semua desa wisata.</p>
        </div>
      )}

    </div>
  );
};
