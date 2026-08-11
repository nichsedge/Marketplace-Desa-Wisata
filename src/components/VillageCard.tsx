import React from 'react';
import { Village } from '../types';
import { useApp } from '../context/AppContext';
import { MapPin, Star, ArrowRight, Store, TreePine } from 'lucide-react';

interface VillageCardProps {
  village: Village;
}

export const VillageCard: React.FC<VillageCardProps> = ({ village }) => {
  const { navigateTo } = useApp();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      
      {/* Cover Image */}
      <div 
        className="relative h-48 overflow-hidden cursor-pointer bg-stone-100"
        onClick={() => navigateTo('desa-detail', undefined, village.id)}
      >
        <img
          src={village.image}
          alt={village.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
          <Star className="w-3.5 h-3.5 fill-amber-300" />
          <span>{village.rating}</span>
          <span className="text-[10px] text-stone-300">({village.totalReviews})</span>
        </div>

        {/* Location badge */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-900/80 text-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-1">
            <TreePine className="w-3 h-3" />
            {village.province}
          </span>
          <h3 className="text-lg font-bold font-serif-title text-white line-clamp-1">
            {village.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{village.location}</span>
          </div>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {village.description}
          </p>

          {/* Highlights tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {village.highlights.slice(0, 3).map((hl, i) => (
              <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-md text-[10px] font-semibold">
                • {hl}
              </span>
            ))}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
            <Store className="w-3.5 h-3.5 text-emerald-700" />
            <span>{village.totalListings} Produk & Layanan</span>
          </div>

          <button
            onClick={() => navigateTo('desa-detail', undefined, village.id)}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center gap-1 group-hover:bg-emerald-800 group-hover:text-amber-200"
          >
            <span>Detail Desa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
