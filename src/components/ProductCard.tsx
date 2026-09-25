import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, MapPin, ShoppingBag, Eye, ShieldCheck, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
};

export const getCategoryBadge = (category: string) => {
  switch (category) {
    case 'sembako':
      return { label: 'Sembako', bg: 'bg-emerald-100 text-emerald-950 border-emerald-300' };
    case 'tanaman-hias':
      return { label: 'Tanaman Hias', bg: 'bg-teal-100 text-teal-950 border-teal-300' };
    case 'minuman-komoditas':
      return { label: 'Minuman & Komoditas', bg: 'bg-amber-100 text-amber-950 border-amber-300' };
    case 'buah-herba':
      return { label: 'Buah & Herba', bg: 'bg-lime-100 text-lime-950 border-lime-300' };
    case 'kuliner':
      return { label: 'Kuliner', bg: 'bg-rose-100 text-rose-950 border-rose-300' };
    case 'olahan-susu':
      return { label: 'Olahan Susu Kemasan', bg: 'bg-sky-100 text-sky-950 border-sky-300' };
    case 'wisata-alam':
    case 'paket-wisata':
      return { label: 'Wisata Alam', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    case 'penginapan-lokal':
    case 'homestay':
      return { label: 'Penginapan Lokal', bg: 'bg-indigo-100 text-indigo-950 border-indigo-300' };
    case 'suvenir':
      return { label: 'Suvenir & Kriya', bg: 'bg-orange-100 text-orange-900 border-orange-200' };
    case 'umkm':
      return { label: 'Produk UMKM', bg: 'bg-cyan-100 text-cyan-900 border-cyan-200' };
    case 'destinasi':
      return { label: 'Tiket Wisata', bg: 'bg-stone-100 text-stone-900 border-stone-300' };
    default:
      return { label: 'Produk Desa', bg: 'bg-stone-100 text-stone-800 border-stone-200' };
  }
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart } = useApp();
  const categoryBadge = getCategoryBadge(product.category);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      
      {/* Top Image & Badges */}
      <div 
        className="relative h-48 sm:h-52 overflow-hidden cursor-pointer bg-stone-100"
        onClick={() => navigateTo('product-detail', product.id)}
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges Bar (Unified Flex to Prevent Any Overlap) */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-2 pointer-events-none z-10">
          {/* Left: Category & Featured Tag (Stacked Vertically) */}
          <div className="flex flex-col items-start gap-1 max-w-[calc(100%-85px)]">
            <span className={`px-2.5 py-0.5 text-[10px] sm:text-[11px] font-extrabold rounded-full border shadow-xs truncate max-w-full backdrop-blur-xs ${categoryBadge.bg}`}>
              {categoryBadge.label}
            </span>
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-400 text-stone-950 shadow-xs border border-amber-300">
                <Sparkles className="w-2.5 h-2.5 text-stone-950 fill-stone-950 shrink-0" />
                <span>Unggulan</span>
              </span>
            )}
            {product.dataSource === 'real' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-700 text-emerald-100 shadow-xs border border-emerald-500/80">
                <ShieldCheck className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                <span>Data Riil Mitra</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium rounded-full bg-stone-900/70 text-stone-300 backdrop-blur-xs shadow-xs border border-white/15">
                <span>Simulasi</span>
              </span>
            )}
          </div>

          {/* Right: Rating Badge */}
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-900/85 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20 shrink-0 shadow-xs">
            <Star className="w-3 h-3 fill-amber-300 shrink-0" />
            <span>{product.rating}</span>
            <span className="text-[10px] text-stone-300 font-normal">({product.totalReviews})</span>
          </div>
        </div>

        {/* Village Location Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-xs font-medium drop-shadow-md">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{product.villageName}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Title */}
          <h3 
            onClick={() => navigateTo('product-detail', product.id)}
            className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2 cursor-pointer font-sans leading-snug"
          >
            {product.title}
          </h3>

          {/* Highlights or Short Description */}
          <p className="mt-1.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
          <img
            src={product.sellerAvatar}
            alt={product.sellerName}
            className="w-6 h-6 rounded-full object-cover border border-emerald-600"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-stone-800 truncate flex items-center gap-1">
              <span>{product.sellerName}</span>
              <ShieldCheck className="w-3 h-3 text-emerald-600 inline shrink-0" />
            </p>
            <p className="text-[10px] text-stone-400 truncate">{product.sellerBadge}</p>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 flex items-end justify-between gap-2">
          <div>
            {product.originalPrice && (
              <span className="text-[11px] text-stone-400 line-through mr-1">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-extrabold text-emerald-800">
                {formatRupiah(product.price)}
              </span>
              <span className="text-[11px] font-medium text-stone-500">{product.unit}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigateTo('product-detail', product.id)}
              className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold text-xs shadow-sm transition-all hover:scale-105 flex items-center gap-1.5"
            >
              <span>Detail & Pesan</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
