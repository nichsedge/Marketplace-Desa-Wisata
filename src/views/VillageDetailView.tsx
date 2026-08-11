import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { 
  MapPin, 
  Star, 
  TreePine, 
  Phone, 
  Instagram, 
  Users, 
  Store, 
  BookOpen, 
  Image as ImageIcon,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';

export const VillageDetailView: React.FC = () => {
  const { villages, selectedVillageId, products, navigateTo } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'gallery'>('overview');

  const village = villages.find(v => v.id === selectedVillageId) || villages[0];
  const villageProducts = products.filter(p => p.villageId === village.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Village Selector & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-emerald-800 transition-colors bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        {/* Village Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600">Pilih Desa Wisata:</span>
          <select
            value={village.id}
            onChange={(e) => navigateTo('desa-detail', undefined, e.target.value)}
            className="p-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            {villages.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Cover Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[380px] flex items-end p-6 sm:p-10 text-white shadow-2xl border border-stone-200">
        <img
          src={village.image}
          alt={village.name}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent" />

        <div className="relative z-10 w-full space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-amber-400 text-stone-950 font-bold rounded-full text-xs shadow-xs">
              {village.province}
            </span>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-stone-900/80 text-amber-300 text-xs font-bold border border-white/20">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{village.rating}</span>
              <span className="text-stone-300">({village.totalReviews} ulasan)</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-title text-white">
            {village.name}
          </h1>

          <p className="text-xs sm:text-sm text-stone-200 flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{village.mapLocation}</span>
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'overview'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Profil & Sejarah
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'products'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Produk & Layanan ({villageProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'gallery'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Galeri Foto
        </button>
      </div>

      {/* Tab Content: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold font-serif-title text-stone-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-800" />
                <span>Tentang & Sejarah Desa</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {village.description}
              </p>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                {village.history}
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold font-serif-title text-stone-900 flex items-center gap-2">
                <TreePine className="w-5 h-5 text-emerald-800" />
                <span>Kebudayaan & Adat Lokal</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {village.culture}
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-stone-800 mb-2">Daya Tarik Khas Desa:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {village.highlights.map((hl, i) => (
                    <div key={i} className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-950 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Contact & Manager Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-900 to-stone-900 p-6 rounded-2xl text-white shadow-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                Kontak Pengelola Pokdarwis
              </h3>

              <div className="space-y-3 text-xs text-stone-200">
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Ketua / Pengelola Desa:</span>
                  <p className="font-bold text-white text-sm">{village.managerName}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{village.contactPhone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{village.instagram}</span>
                </div>

                <div className="pt-2 border-t border-stone-700/80">
                  <span className="text-[10px] text-stone-400 block font-semibold mb-1">Alamat Lengkap:</span>
                  <p className="text-xs leading-relaxed">{village.mapLocation}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('products')}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition-colors shadow-md"
              >
                Lihat Produk Desa Ini ({villageProducts.length})
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Tab Content: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-stone-900">
            Seluruh Produk & Layanan dari {village.name}
          </h2>
          {villageProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {villageProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-8 text-center bg-white rounded-2xl border border-stone-200">Belum ada produk terdaftar untuk desa ini.</p>
          )}
        </div>
      )}

      {/* Tab Content: GALLERY */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-stone-900">Galeri Foto Pesona Desa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {village.gallery.map((imgUrl, i) => (
              <div key={i} className="h-64 rounded-2xl overflow-hidden border border-stone-200 shadow-md">
                <img src={imgUrl} alt={`gallery-${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
