import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { VillageLocationMap } from '../components/VillageLocationMap';
import { 
  MapPin, 
  Star, 
  TreePine, 
  Phone, 
  Users, 
  Store, 
  BookOpen, 
  CheckCircle2, 
  ChevronLeft, 
  Compass, 
  Sparkles,
  Building2
} from 'lucide-react';

export const VillageDetailView: React.FC = () => {
  const { villages, selectedVillageId, products, navigateTo } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'peta-lokasi' | 'products' | 'gallery'>('overview');

  const village = villages.find(v => v.id === selectedVillageId) || villages[0];
  const villageProducts = products.filter(p => p.villageId === village.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Village Selector & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-emerald-800 transition-colors bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs w-fit cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        {/* Village Switcher Dropdown */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-stone-600 shrink-0">Pilih Desa Wisata:</span>
          <select
            value={village.id}
            onChange={(e) => navigateTo('desa-detail', undefined, e.target.value)}
            className="flex-1 sm:flex-initial p-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer max-w-full"
          >
            {villages.map(v => (
              <option key={v.id} value={v.id}>{v.name} ({v.villageAltitude || '1.250 mdpl'})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Cover Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[340px] sm:min-h-[400px] flex items-end p-6 sm:p-10 text-white shadow-2xl border border-stone-200">
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
            <span className="px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-emerald-200 text-xs font-medium">
              Ketinggian: {village.villageAltitude || '1.250 mdpl'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-title text-white">
            {village.name}
          </h1>

          <p className="text-xs sm:text-sm text-stone-200 flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{village.officeAddress || village.mapLocation}</span>
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Profil & Potensi
        </button>

        <button
          onClick={() => setActiveTab('peta-lokasi')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'peta-lokasi'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Peta Kantor Desa & Kontak</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Produk & Layanan ({villageProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'gallery'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Galeri Foto
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-6">
              {/* Short Description & History */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-lg font-bold font-serif-title text-stone-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-800" />
                  <span>Sekilas & Sejarah {village.name}</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {village.description}
                </p>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  {village.history}
                </p>
              </div>

              {/* Culture & Highlights */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-lg font-bold font-serif-title text-stone-900 flex items-center gap-2">
                  <TreePine className="w-5 h-5 text-emerald-800" />
                  <span>Kebudayaan & Karakteristik Desa</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {village.culture}
                </p>

                <div className="pt-2">
                  <h4 className="text-xs font-bold text-stone-800 mb-2.5">Potensi & Daya Tarik Unggulan:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {village.highlights.map((hl, i) => (
                      <div key={i} className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs font-bold text-amber-950 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Quick Overview & Products CTA */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-950 to-stone-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                    Ringkasan Destinasi
                  </span>
                  <h3 className="text-xl font-bold font-serif-title text-white">
                    {village.name}
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-stone-200 pt-2 border-t border-emerald-800/60">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-semibold">Ketinggian Tempat:</span>
                    <p className="font-bold text-white text-sm">{village.villageAltitude || '1.250 mdpl'}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 block font-semibold">Alamat Kantor Desa:</span>
                    <p className="text-xs leading-relaxed text-stone-300">{village.officeAddress || village.mapLocation}</p>
                  </div>

                  {village.contactPhone && (
                    <div>
                      <span className="text-[10px] text-stone-400 block font-semibold">Kontak Layanan / CP:</span>
                      <p className="font-bold text-amber-300 text-xs">{village.contactPhone}</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => setActiveTab('peta-lokasi')}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-amber-300" />
                    <span>Lihat Peta Kantor Desa & CP</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('products')}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold rounded-2xl text-xs transition-all shadow-md cursor-pointer"
                  >
                    Lihat Katalog Produk & Layanan ({villageProducts.length})
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Embedded Kantor Desa Map Section below overview */}
          <VillageLocationMap
            villages={villages}
            initialVillageId={village.id}
            onVillageChange={(newId) => navigateTo('desa-detail', undefined, newId)}
          />
        </div>
      )}

      {/* TAB 2: PETA KANTOR DESA & KONTAK */}
      {activeTab === 'peta-lokasi' && (
        <div className="space-y-6">
          <VillageLocationMap
            villages={villages}
            initialVillageId={village.id}
            onVillageChange={(newId) => navigateTo('desa-detail', undefined, newId)}
          />
        </div>
      )}

      {/* TAB 3: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h2 className="text-xl font-bold font-serif-title text-stone-900">
              Katalog Produk & Layanan {village.name} ({villageProducts.length})
            </h2>
            <span className="text-xs text-emerald-800 font-semibold">Terhubung ke Admin Desa & Warga</span>
          </div>

          {villageProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {villageProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-8 text-center bg-white rounded-2xl border border-stone-200">
              Belum ada produk terdaftar untuk desa ini.
            </p>
          )}
        </div>
      )}

      {/* TAB 4: GALLERY */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-xl font-bold font-serif-title text-stone-900">Galeri Foto Pesona {village.name}</h2>
            <p className="text-xs text-stone-500">Lanskap alam lereng pegunungan dan kearifan masyarakat lokal</p>
          </div>

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
