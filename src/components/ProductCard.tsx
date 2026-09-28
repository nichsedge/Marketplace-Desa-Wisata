import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Phone } from 'lucide-react';
import { formatWhatsAppUrl } from '../utils/whatsapp';

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
  const { navigateTo } = useApp();
  const categoryBadge = getCategoryBadge(product.category);

  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-stone-200 hover:border-stone-400 transition-colors duration-300 flex flex-col justify-between">
      
      {/* Top Image */}
      <div 
        className="relative h-48 sm:h-52 overflow-hidden cursor-pointer bg-stone-100"
        onClick={() => navigateTo('product-detail', product.id)}
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Subtle Dark Gradient at bottom for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Category at bottom-left */}
        <div className="absolute bottom-3 left-3 text-white text-xs font-medium tracking-wide drop-shadow-sm">
          {categoryBadge.label}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Title */}
          <h3 
            onClick={() => navigateTo('product-detail', product.id)}
            className="text-lg font-medium text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-2 cursor-pointer font-sans leading-snug"
          >
            {product.title}
          </h3>

          {/* Rating */}
          {(product.rating > 0 || product.totalReviews > 0) && (
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-stone-600">
              <Star className="w-3.5 h-3.5 fill-stone-400 text-stone-400" />
              <span>{product.rating} <span className="text-stone-400 mx-0.5">&middot;</span> {product.totalReviews} ulasan</span>
            </div>
          )}

          {/* Price */}
          <div className="mt-3">
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through mr-1 block">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-stone-900">
                {formatRupiah(product.price)}
              </span>
              <span className="text-sm text-stone-500">/ {product.unit}</span>
            </div>
          </div>
        </div>

        {/* Seller Info & Actions */}
        <div className="pt-4 border-t border-stone-100 flex flex-col gap-3">
          {/* Seller Name and Village */}
          <div className="flex flex-col text-sm text-stone-700">
            <span>{product.sellerName}</span>
            <span className="text-stone-500">{product.villageName}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            {/* WhatsApp Link */}
            {product.sellerPhone ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const targetPhone = product.sellerPhone;
                  const text = `Halo Admin / CP ${product.sellerName} (${product.villageName}), saya tertarik dengan produk "${product.title}" (${formatRupiah(product.price)} ${product.unit}). Apakah masih tersedia?`;
                  const url = formatWhatsAppUrl(targetPhone, text);
                  window.open(url, '_blank');
                }}
                className="text-emerald-700 hover:text-emerald-800 text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                title={`Chat WhatsApp langsung dengan Admin Produk / CP (${product.sellerName})`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Hubungi via WhatsApp</span>
              </button>
            ) : (
              <div />
            )}

            {/* Detail Link */}
            <button
              onClick={() => navigateTo('product-detail', product.id)}
              className="text-stone-600 hover:text-stone-900 text-sm transition-colors flex items-center cursor-pointer"
            >
              Lihat Detail &rarr;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
