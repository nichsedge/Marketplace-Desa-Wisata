import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard, formatRupiah } from '../components/ProductCard';
import { BedDouble, Wifi, Utensils, ShieldCheck, MapPin, Sparkles, Filter } from 'lucide-react';

export const HomestayView: React.FC = () => {
  const { products, navigateTo } = useApp();

  const [maxPrice, setMaxPrice] = useState<number>(600000);
  const [requireWifi, setRequireWifi] = useState(false);
  const [requireBreakfast, setRequireBreakfast] = useState(false);

  const homestays = products.filter(p => p.category === 'homestay');

  const filteredHomestays = homestays.filter(h => {
    if (h.price > maxPrice) return false;
    if (requireWifi && !h.facilities?.some(f => f.toLowerCase().includes('wifi'))) return false;
    if (requireBreakfast && !h.facilities?.some(f => f.toLowerCase().includes('sarapan'))) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[260px] flex items-center p-8 sm:p-12 text-white shadow-xl border border-stone-200">
        <img
          src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1600&q=80"
          alt="Homestay Desa"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/80 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <BedDouble className="w-4 h-4" />
            <span>Homestay & Saung Warga</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-title text-white">
            Menginap Sejuk di Tengah Pesona Pegunungan Suntenjaya
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Nikmati suasana pedesaan yang asri pada ketinggian 1.290 mdpl, udara pegunungan yang sejuk, dan kehangatan tuan rumah warga lokal Desa Suntenjaya Lembang. Dilengkapi air hangat, sarapan liwet hangat, dan pemandangan kebun terasering.
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
          <div className="flex items-center justify-around sm:justify-start gap-4 py-2 bg-stone-50 border border-stone-200 rounded-xl px-3">
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

          {/* Reset button */}
          <div>
            <button
              onClick={() => { setMaxPrice(600000); setRequireWifi(false); setRequireBreakfast(false); }}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs transition-colors"
            >
              Reset Filter
            </button>
          </div>

        </div>
      </div>

      {/* Homestay Grid */}
      {filteredHomestays.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHomestays.map(h => (
            <ProductCard key={h.id} product={h} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 space-y-3">
          <p className="text-base font-bold text-stone-900">Tidak ada homestay dengan filter tersebut</p>
          <p className="text-xs text-stone-500">Coba longgarkan rentang harga atau pilih desa lainnya.</p>
        </div>
      )}

    </div>
  );
};
