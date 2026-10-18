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
  ArrowRight,
  Globe 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, villages, language, setLanguage, t } = useApp();
  const [modalVillageId, setModalVillageId] = useState<string>('des-01');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  React.useEffect(() => {
    if (isMapModalOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMapModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMapModalOpen]);

  const currentModalVillage = villages.find(v => v.id === modalVillageId) || villages[0];

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Banner - Mission */}
        <div className="bg-gradient-to-r from-emerald-900/80 via-stone-900 to-amber-950/80 rounded-2xl p-6 sm:p-8 mb-12 border border-emerald-700/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Lembang Region Inter-Village Platform' : 'Platform Interdesa Kawasan Lembang'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-white">
              {language === 'en' ? 'Support Authentic Village Products & Commodities' : 'Dukung Komoditas & Produk Asli Warga Desa'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              {language === 'en'
                ? '100% of order proceeds for local products, tour packages, and homestays directly empower farmers, breeders, and artisans in Lembang Region.'
                : '100% hasil pemesanan produk, paket wisata, dan penginapan lokal langsung memberdayakan masyarakat petani, peternak, serta pengrajin di Kawasan Lembang.'}
            </p>
          </div>
          <button
            onClick={() => navigateTo('marketplace')}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold rounded-xl text-xs sm:text-sm shadow-lg transition-all hover:scale-105 shrink-0 cursor-pointer"
          >
            {language === 'en' ? 'Explore Village Catalog' : 'Jelajahi Katalog Desa'}
          </button>
        </div>

        {/* Main Decentralized Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          
          {/* Brand Col (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="/images/logo-saba-lembang.png" 
                alt="Logo Saba Lembang" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full shadow-md shrink-0 object-contain" 
              />
              <span className="text-2xl font-extrabold font-serif-title text-white">
                Saba<span className="text-emerald-400">Lembang</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md">
              {language === 'en'
                ? 'Integrated tourism village platform based on a decentralized village network in Lembang Region, West Bandung. Connecting travelers directly to fresh produce, specialty coffee, highland homestays, and local hosts in every village.'
                : 'Platform desa wisata terpadu berbasis jaringan desentralisasi desa wisata di Kawasan Lembang, Kab. Bandung Barat. Menghubungkan wisatawan langsung dengan komoditas pangan, kebun sayur, kopi specialty, homestay pegunungan, dan warga lokal di setiap kawasan.'}
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
                <span>{language === 'en' ? 'Village Office Location Map' : 'Peta Lokasi Kantor Desa'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Col (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {language === 'en' ? 'Explore Platform' : 'Jelajah Platform'}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><button onClick={() => navigateTo('home')} className="hover:text-emerald-400 transition-colors cursor-pointer">{language === 'en' ? 'Home' : 'Beranda'}</button></li>
              <li><button onClick={() => navigateTo('marketplace')} className="hover:text-emerald-400 transition-colors cursor-pointer">{language === 'en' ? 'Commodities & Products Marketplace' : 'Marketplace Komoditas & Produk'}</button></li>
              <li><button onClick={() => navigateTo('homestay')} className="hover:text-emerald-400 transition-colors cursor-pointer">{language === 'en' ? 'Local Stays & Homestays' : 'Penginapan & Homestay Warga'}</button></li>
              <li><button onClick={() => navigateTo('paket-wisata')} className="hover:text-emerald-400 transition-colors cursor-pointer">{language === 'en' ? 'Nature & Offroad Tour Packages' : 'Paket Wisata Alam & Offroad'}</button></li>
              <li><button onClick={() => navigateTo('desa-detail')} className="hover:text-emerald-400 transition-colors cursor-pointer">{language === 'en' ? 'Tourism Village Directory & Profiles' : 'Direktori & Profil Desa Wisata'}</button></li>
            </ul>
          </div>

          {/* Decentralized Villages Directory Col (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {language === 'en' ? 'Tourism Village Network' : 'Jaringan Desa Wisata'}
              </h4>
              <button
                onClick={() => {
                  setModalVillageId('des-01');
                  setIsMapModalOpen(true);
                }}
                className="text-xs text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'en' ? 'View Map' : 'Lihat Peta'}</span>
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
                    {v.villageAltitude ? (language === 'en' ? v.villageAltitude.replace('mdpl', 'MASL') : v.villageAltitude) : (language === 'en' ? '1,250 MASL' : '1.250 mdpl')}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p className="flex items-center gap-1 text-center sm:text-left">
            <span>{language === 'en' ? '© 2026 Saba Lembang. Crafted with' : '© 2026 Saba Lembang. Dibuat dengan'}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{language === 'en' ? 'for Village Independence & Sustainable Tourism' : 'untuk Kemandirian Desa & Pariwisata Berkelanjutan'}</span>
          </p>
          <div className="flex flex-wrap items-center gap-4 text-stone-400">
            {/* Language Switcher */}
            <div 
              className="flex items-center gap-1.5 bg-stone-800/80 p-1 rounded-full border border-stone-700"
              role="group"
              aria-label="Pilih Bahasa / Language Selector"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 ml-1.5" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setLanguage('id')}
                aria-label="Bahasa Indonesia"
                className={`text-[11px] font-bold px-2.5 py-1.5 min-h-[32px] rounded-full cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 ${language === 'id' ? 'bg-emerald-700 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                ID
              </button>
              <span className="text-stone-600" aria-hidden="true">|</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-label="English"
                className={`text-[11px] font-bold px-2.5 py-1.5 min-h-[32px] rounded-full cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 ${language === 'en' ? 'bg-emerald-700 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> 
              {language === 'en'
                ? 'Decentralized Tourism Villages · Direct Transactions with Village Admins & Locals'
                : 'Desentralisasi Desa Wisata · Transaksi Langsung ke Admin & Warga'}
            </span>
          </div>
        </div>

      </div>

      {/* Interactive Map & Office Directory Modal */}
      {isMapModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-map-title"
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
                  <Building2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="footer-map-title" className="text-base sm:text-lg font-bold font-serif-title">
                    {language === 'en' ? 'Directory & Village Office Location Map' : 'Direktori & Peta Lokasi Kantor Desa'}
                  </h3>
                  <p className="text-[11px] text-stone-300">
                    {language === 'en' ? 'Select a village to view official office locations and Google Maps route' : 'Pilih desa untuk melihat lokasi kantor desa dan rute Google Maps'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                aria-label={language === 'en' ? 'Close map directory' : 'Tutup direktori peta'}
                className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-rose-600 text-stone-300 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
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
                    <span className="font-bold text-stone-900 block">
                      {language === 'en' ? `${currentModalVillage.name.replace('Desa Wisata ', 'Village ')} Office:` : `Kantor ${currentModalVillage.name}:`}
                    </span>
                    <span>{currentModalVillage.officeAddress || currentModalVillage.mapLocation}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-stone-200">
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900">
                      {language === 'en' ? 'Village Admin Contact: ' : 'Kontak Admin Desa: '}
                    </span>
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
                  <span>
                    {language === 'en' ? `View Full Profile of ${currentModalVillage.name.replace('Desa Wisata ', 'Village ')}` : `Buka Profil Lengkap ${currentModalVillage.name}`}
                  </span>
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
                    <span>{language === 'en' ? 'Open Route in Google Maps' : 'Buka Rute di Google Maps'}</span>
                  </a>
                  <button
                    onClick={() => setIsMapModalOpen(false)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'Close' : 'Tutup'}
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
