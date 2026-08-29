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
  ChevronLeft,
  Landmark,
  ShieldCheck,
  ExternalLink,
  Layers,
  Compass,
  FileText,
  Building2,
  Sparkles
} from 'lucide-react';

export const VillageDetailView: React.FC = () => {
  const { villages, selectedVillageId, products, navigateTo } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'pemerintahan' | 'products' | 'gallery'>('overview');

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
            {village.headOfVillage && (
              <span className="px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-emerald-200 text-xs font-medium">
                Kepala Desa: {village.headOfVillage}
              </span>
            )}
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

      {/* Official Village Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-500 font-medium">Luas Wilayah</p>
            <p className="text-sm font-bold text-stone-900">{village.villageArea || '845 Ha'}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-500 font-medium">Jumlah Penduduk</p>
            <p className="text-sm font-bold text-stone-900">{village.population || '12.450 Jiwa'}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-500 font-medium">Pembagian Wilayah</p>
            <p className="text-sm font-bold text-stone-900">{village.dusunCount || 4} Dusun Resmi</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
            <TreePine className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-500 font-medium">Ketinggian Alam</p>
            <p className="text-sm font-bold text-stone-900">{village.villageAltitude || '1.250 mdpl (Sejuk)'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Profil & Sejarah
        </button>

        <button
          onClick={() => setActiveTab('pemerintahan')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'pemerintahan'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Pemerintahan & Wilayah</span>
        </button>


        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Produk & Pariwisata ({villageProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Short Description & History */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold font-serif-title text-stone-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-800" />
                <span>Sekilas & Sejarah Desa</span>
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
                <span>Kebudayaan & Kearifan Lokal Sunda</span>
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

          {/* Contact & Secretariat Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-900 to-stone-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Sekretariat Desa & Pengelola</span>
              </h3>

              <div className="space-y-3.5 text-xs text-stone-200">
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Kepala Desa Suntenjaya:</span>
                  <p className="font-bold text-white text-sm">{village.headOfVillage || 'H. Asep Wahyono'}</p>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Pengelola Wisata (Pokdarwis):</span>
                  <p className="font-bold text-white text-sm">{village.managerName}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={`https://wa.me/${village.contactPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                    {village.contactPhone}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{village.instagram}</span>
                </div>

                <div className="pt-2 border-t border-stone-700/80">
                  <span className="text-[10px] text-stone-400 block font-semibold mb-1">Kantor Desa:</span>
                  <p className="text-xs leading-relaxed text-stone-300">{village.officeAddress || village.mapLocation}</p>
                </div>
              </div>

              {/* SILAMOT Integration Link */}
              <div className="p-3 bg-white/10 rounded-2xl border border-white/20 space-y-2">
                <p className="text-[11px] font-bold text-amber-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Layanan Administrasi SILAMOT</span>
                </p>
                <p className="text-[10px] text-stone-300 leading-snug">
                  Warga desa dapat mengurus surat pengantar RT/RW, domisili, dan KTP daring di portal resmi desa.
                </p>
                <a
                  href={village.silamotUrl || 'https://desasuntenjaya.site'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-white hover:text-amber-300 underline pt-1"
                >
                  <span>Buka desasuntenjaya.site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                onClick={() => setActiveTab('products')}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold rounded-2xl text-xs transition-all shadow-md"
              >
                Lihat Katalog Wisata & UMKM ({villageProducts.length})
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PEMERINTAHAN & 4 DUSUN */}
      {activeTab === 'pemerintahan' && (
        <div className="space-y-8">
          
          {/* Visi & Misi Card */}
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-emerald-800/40 space-y-6">
            <div className="max-w-3xl space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider inline-block">
                Visi & Misi Resmi Pemerintah Desa
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title">
                Visi Pembangunan Desa Suntenjaya
              </h2>
              <blockquote className="text-sm sm:text-base text-stone-200 italic border-l-4 border-amber-400 pl-4 py-1 leading-relaxed">
                "{village.vision || 'Terwujudnya Desa Suntenjaya yang Mandiri, Sejahtera, Berbudaya, dan Berbasis Digital Terdepan di Kabupaten Bandung Barat.'}"
              </blockquote>
            </div>

            <div className="pt-2 border-t border-emerald-800/60">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
                4 Pilar Misi Desa:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(village.missions || [
                  'Meningkatkan kualitas pelayanan publik melalui digitalisasi.',
                  'Mendorong pertumbuhan ekonomi kerakyatan dan UMKM.',
                  'Melestarikan seni dan budaya lokal Sunda.',
                  'Meningkatkan pembangunan infrastruktur desa yang merata.'
                ]).map((m, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-stone-200 leading-relaxed font-medium">{m}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4 Dusun Showcase */}
          <div className="space-y-4">
            <div className="border-b border-stone-200 pb-2">
              <h3 className="text-xl font-bold font-serif-title text-stone-900">
                Profil & Potensi Wilayah 4 Dusun Desa Suntenjaya
              </h3>
              <p className="text-xs text-stone-500">
                Pemerataan potensi agrowisata, cagar budaya, peternakan, dan kerajinan tangan di tiap dusun
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(village.dusuns || []).map((dusun) => (
                <div key={dusun.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-700 transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg">
                      {dusun.name}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Kepala Dusun: <strong className="text-stone-800">{dusun.kadus}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {dusun.description}
                  </p>
                  <div className="pt-2 border-t border-stone-100 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Fokus: {dusun.highlights}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Struktur Aparatur Desa */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold font-serif-title text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
              <span>Aparatur Pemerintahan Desa Suntenjaya</span>
            </h3>
            <p className="text-xs text-stone-500">
              Data resmi kepengurusan Pemerintah Desa Suntenjaya, Kecamatan Lembang, Kabupaten Bandung Barat
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {(village.villageApparatus || []).map((person, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">{person.role}</p>
                  <p className="text-xs font-extrabold text-stone-900">{person.name}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h2 className="text-xl font-bold font-serif-title text-stone-900">
              Katalog Homestay, Wisata & Produk UMKM ({villageProducts.length})
            </h2>
            <span className="text-xs text-emerald-800 font-semibold">Pemesanan Langsung ke Pokdarwis / Warga</span>
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
            <h2 className="text-xl font-bold font-serif-title text-stone-900">Galeri Foto Pesona Desa Suntenjaya</h2>
            <p className="text-xs text-stone-500">Lanskap lereng pegunungan, budaya Kadaplak, dan kearifan masyarakat lokal</p>
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
