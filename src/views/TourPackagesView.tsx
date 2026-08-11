import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { TreePine, Compass, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

export const TourPackagesView: React.FC = () => {
  const { products, navigateTo } = useApp();

  const packages = products.filter(p => p.category === 'paket-wisata');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner Header */}
      <div className="relative rounded-3xl overflow-hidden min-h-[260px] flex items-center p-8 sm:p-12 text-white shadow-xl border border-stone-200">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
          alt="Paket Wisata"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-emerald-950/80 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <TreePine className="w-4 h-4" />
            <span>Petualangan & Edukasi Wisata</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-title text-white">
            Paket Wisata & Experiential Tour Desa
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Dapatkan pengalaman hands-on: dari mendaki Gunung Purba, belajar membatik canting, membajak sawah tradisional, hingga petik buah segar bersama pemandu lokal berlisensi.
          </p>
        </div>
      </div>

      {/* Grid of Packages */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold font-serif-title text-stone-900">
            Daftar Paket Aktivitas Pilihan ({packages.length})
          </h2>
          <span className="text-xs text-emerald-800 font-semibold">Termasuk Pemandu Lokal & Perlengkapan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <ProductCard key={pkg.id} product={pkg} />
          ))}
        </div>
      </div>

    </div>
  );
};
