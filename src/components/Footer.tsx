import React from 'react';
import { useApp } from '../context/AppContext';
import { TreePine, Heart, MapPin, Phone, Mail, Instagram, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, villages } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Banner - Mission */}
        <div className="bg-gradient-to-r from-emerald-900/80 via-stone-900 to-amber-950/80 rounded-2xl p-6 sm:p-8 mb-12 border border-emerald-700/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Jaringan Wisata Berkelanjutan Kawasan Lembang</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-white">
              Dukung Produk UMKM, Homestay & Petani Desa Bersama
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              100% hasil pemesanan homestay, paket wisata, dan produk lokal langsung disalurkan kepada pengelola PIC resmi dan masyarakat desa setempat di kawasan Lembang.
            </p>
          </div>
          <button
            onClick={() => navigateTo('marketplace')}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold rounded-xl text-xs sm:text-sm shadow-lg transition-all hover:scale-105 shrink-0"
          >
            Jelajahi Katalog Desa
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-300 shadow-md">
                <TreePine className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold font-serif-title text-white">
                Saba<span className="text-emerald-400">Lembang</span><span className="text-sm font-sans font-semibold text-amber-400">.id</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Platform desa wisata terpadu & marketplace resmi Kawasan Lembang, Kab. Bandung Barat. Menghubungkan wisatawan langsung dengan keotentikan budaya, homestay sejuk lereng gunung, sayur organik, kopi specialty, dan PIC resmi tiap desa.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-emerald-800 flex items-center justify-center text-stone-300 hover:text-white transition-colors" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="tel:+6282122334455" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-emerald-800 flex items-center justify-center text-stone-300 hover:text-white transition-colors" title="Telepon">
                <Phone className="w-4 h-4" />
              </a>
              <a href="mailto:kontak@sabasunten.id" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-emerald-800 flex items-center justify-center text-stone-300 hover:text-white transition-colors" title="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Navigasi Utama</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><button onClick={() => navigateTo('home')} className="hover:text-emerald-400 transition-colors">Beranda</button></li>
              <li><button onClick={() => navigateTo('marketplace')} className="hover:text-emerald-400 transition-colors">Marketplace Lembang</button></li>
              <li><button onClick={() => navigateTo('homestay')} className="hover:text-emerald-400 transition-colors">Homestay & Glamping</button></li>
              <li><button onClick={() => navigateTo('paket-wisata')} className="hover:text-emerald-400 transition-colors">Paket Edukasi & Tour</button></li>
              <li><button onClick={() => navigateTo('desa-detail')} className="hover:text-emerald-400 transition-colors">Profil Desa Wisata</button></li>
            </ul>
          </div>

          {/* 5 Villages Directory */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Desa Wisata di Lembang</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              {villages.map(v => (
                <li key={v.id}>
                  <button 
                    onClick={() => navigateTo('desa-detail', undefined, v.id)} 
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    {v.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Sekretariat & PIC Wisata</h4>
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Kawasan Pariwisata Terpadu Lembang, Kab. Bandung Barat 40391</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="https://wa.me/6282122334455" target="_blank" rel="noreferrer" className="hover:text-emerald-300">
                  +62 821-2233-4455 (Admin Saba Lembang)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>info@sabasunten.id</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://desasuntenjaya.site"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-3 bg-emerald-900/80 hover:bg-emerald-800 text-amber-200 border border-emerald-600/50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Portal Layanan SILAMOT Desa</span>
                </a>
              </div>
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
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Transaksi Langsung ke PIC & Warga Desa</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
