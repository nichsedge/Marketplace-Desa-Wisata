import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TreePine, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Map, 
  X, 
  ExternalLink, 
  Building2, 
  Phone, 
  ArrowRight 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, villages } = useApp();
  const [modalVillageId, setModalVillageId] = useState<string>('des-01');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const currentModalVillage = villages.find(v => v.id === modalVillageId) || villages[0];

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Banner - Mission */}
        <div className="bg-gradient-to-r from-emerald-900/80 via-stone-900 to-amber-950/80 rounded-2xl p-6 sm:p-8 mb-12 border border-emerald-700/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Jaringan Desa Wisata Kawasan Lembang</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-white">
              Dukung Komoditas & Produk Asli Warga Desa
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              100% hasil pemesanan produk, paket wisata, dan penginapan lokal langsung memberdayakan masyarakat petani, peternak, serta pengrajin di Kawasan Lembang.
            </p>
          </div>
          <button
            onClick={() => navigateTo('marketplace')}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold rounded-xl text-xs sm:text-sm shadow-lg transition-all hover:scale-105 shrink-0 cursor-pointer"
          >
            Jelajahi Katalog Desa
          </button>
        </div>

        {/* Main Decentralized Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          
          {/* Brand Col (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-300 shadow-md">
                <TreePine className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold font-serif-title text-white">
                Saba<span className="text-emerald-400">Lembang</span><span className="text-sm font-sans font-semibold text-amber-400">.id</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md">
              Platform desa wisata terpadu berbasis jaringan desentralisasi desa wisata di Kawasan Lembang, Kab. Bandung Barat. Menghubungkan wisatawan langsung dengan komoditas pangan, kebun sayur, kopi specialty, homestay pegunungan, dan warga lokal di setiap kawasan.
            </p>
            <div className="pt-1">
              <button
                onClick={() => {
                  setModalVillageId('des-01');
                  setIsMapModalOpen(true);
                }}
                className="px-4 py-2 rounded-full bg-emerald-950/80 hover:bg-emerald-800 text-amber-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border border-emerald-700/60 shadow-sm"
              >
                <Map className="w-3.5 h-3.5 text-amber-300" />
                <span>Peta Kantor 8 Desa</span>
              </button>
            </div>
          </div>

          {/* Navigation Col (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Jelajah Platform</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><button onClick={() => navigateTo('home')} className="hover:text-emerald-400 transition-colors cursor-pointer">Beranda</button></li>
              <li><button onClick={() => navigateTo('marketplace')} className="hover:text-emerald-400 transition-colors cursor-pointer">Marketplace Komoditas & Produk</button></li>
              <li><button onClick={() => navigateTo('homestay')} className="hover:text-emerald-400 transition-colors cursor-pointer">Penginapan & Homestay Warga</button></li>
              <li><button onClick={() => navigateTo('paket-wisata')} className="hover:text-emerald-400 transition-colors cursor-pointer">Paket Wisata Alam & Offroad</button></li>
              <li><button onClick={() => navigateTo('desa-detail')} className="hover:text-emerald-400 transition-colors cursor-pointer">Direktori & Profil 8 Desa</button></li>
            </ul>
          </div>

          {/* 8 Decentralized Villages Directory Col (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Jaringan 8 Desa Wisata</h4>
              <button
                onClick={() => {
                  setModalVillageId('des-01');
                  setIsMapModalOpen(true);
                }}
                className="text-xs text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Peta</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {villages.map(v => (
                <button
                  key={v.id}
                  onClick={() => navigateTo('desa-detail', undefined, v.id)}
                  className="p-2 bg-stone-800/60 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded-xl border border-stone-800 hover:border-emerald-700/60 transition-all text-left flex flex-col justify-between cursor-pointer group"
                >
                  <span className="font-bold text-stone-200 group-hover:text-white truncate">
                    {v.name.replace('Desa Wisata ', '')}
                  </span>
                  <span className="text-[10px] text-stone-500 group-hover:text-emerald-400 truncate mt-0.5">
                    {v.villageAltitude || '1.250 mdpl'}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p className="flex items-center gap-1 text-center sm:text-left">
            <span>© 2026 sabasunten.id · Saba Lembang. Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk Kemandirian Desa & Pariwisata Berkelanjutan</span>
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 
              Desentralisasi 8 Desa · Transaksi Langsung ke Admin & Warga
            </span>
          </div>
        </div>

      </div>

      {/* Interactive Map & Office Directory Modal */}
      {isMapModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMapModalOpen(false);
          }}
        >
          <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden text-stone-900">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-serif-title">
                    Direktori & Peta Kantor 8 Desa Wisata
                  </h3>
                  <p className="text-[11px] text-stone-300">
                    Pilih desa untuk melihat lokasi kantor desa dan rute Google Maps
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMapModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Village Selector Pills in Modal */}
            <div className="p-3 bg-stone-100 border-b border-stone-200 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
              {villages.map(v => (
                <button
                  key={v.id}
                  onClick={() => setModalVillageId(v.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    modalVillageId === v.id
                      ? 'bg-emerald-800 text-amber-200 shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  {v.name.replace('Desa Wisata ', '')}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-stone-300 shadow-inner bg-stone-100">
                <iframe
                  title={`Peta Lokasi ${currentModalVillage.name}`}
                  src={currentModalVillage.officeMapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Village Detail & Address */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">Kantor {currentModalVillage.name}:</span>
                    <span>{currentModalVillage.officeAddress || currentModalVillage.mapLocation}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-stone-200">
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900">Kontak Admin Desa: </span>
                    <span className="text-emerald-800 font-bold">{currentModalVillage.contactPhone}</span>
                    <span className="text-stone-500"> ({currentModalVillage.managerName})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsMapModalOpen(false);
                    navigateTo('desa-detail', undefined, currentModalVillage.id);
                  }}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Profil Lengkap {currentModalVillage.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={currentModalVillage.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Buka Rute di Google Maps</span>
                  </a>
                  <button
                    onClick={() => setIsMapModalOpen(false)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </footer>
  );
};
