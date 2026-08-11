import React from 'react';
import { useApp } from '../context/AppContext';
import { TreePine, Heart, MapPin, Phone, Mail, Instagram, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Banner - Mission */}
        <div className="bg-gradient-to-r from-emerald-900/80 via-stone-900 to-amber-950/80 rounded-2xl p-6 sm:p-8 mb-12 border border-emerald-700/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pemberdayaan Ekonomi Desa</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-white">
              Bantu Produk UMKM & Homestay Desa Tumbuh Bersama
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              100% hasil penjualan tiket, homestay, dan produk suvenir langsung disalurkan kepada pengelola lokal dan masyarakat desa setempat.
            </p>
          </div>
          <button
            onClick={() => navigateTo('marketplace')}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold rounded-xl text-xs sm:text-sm shadow-lg transition-all hover:scale-105 shrink-0"
          >
            Jelajahi Produk Desa Now
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
                Desa<span className="text-emerald-400">Wisata</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Platform marketplace & media promosi terpadu desa wisata Indonesia. Menghubungkan wisatawan langsung dengan keotentikan budaya, homestay ramah, dan produk karya warga desa.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#instagram" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-emerald-800 flex items-center justify-center text-stone-300 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#contact" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-emerald-800 flex items-center justify-center text-stone-300 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </a>
              <a href="#mail" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-emerald-800 flex items-center justify-center text-stone-300 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Navigasi Utama</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><button onClick={() => navigateTo('home')} className="hover:text-emerald-400 transition-colors">Beranda</button></li>
              <li><button onClick={() => navigateTo('marketplace')} className="hover:text-emerald-400 transition-colors">Semua Marketplace</button></li>
              <li><button onClick={() => navigateTo('homestay')} className="hover:text-emerald-400 transition-colors">Daftar Homestay</button></li>
              <li><button onClick={() => navigateTo('paket-wisata')} className="hover:text-emerald-400 transition-colors">Paket Wisata & Tour</button></li>
              <li><button onClick={() => navigateTo('desa-detail')} className="hover:text-emerald-400 transition-colors">Profil Desa Binaan</button></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Kategori Produk</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><button onClick={() => navigateTo('marketplace')} className="hover:text-emerald-400 transition-colors">Homestay & Penginapan</button></li>
              <li><button onClick={() => navigateTo('marketplace')} className="hover:text-emerald-400 transition-colors">Suvenir & Batik Tulis</button></li>
              <li><button onClick={() => navigateTo('marketplace')} className="hover:text-emerald-400 transition-colors">Kuliner & Kopi Adat</button></li>
              <li><button onClick={() => navigateTo('marketplace')} className="hover:text-emerald-400 transition-colors">Paket Edukasi & Experiential</button></li>
              <li><button onClick={() => navigateTo('marketplace')} className="hover:text-emerald-400 transition-colors">Produk UMKM Kelompok Tani</button></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Layanan Desa</h4>
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Gedung Koperasi Pokdarwis Desa Wisata Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+62 812-3456-7890 (Hotline Desa)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>info@desawisatamarketplace.id</span>
              </div>
              <div className="pt-2">
                <button 
                  onClick={() => navigateTo('dashboard')}
                  className="w-full py-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 rounded-lg text-xs font-medium transition-colors"
                >
                  Portal Penjual Desa
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p className="flex items-center gap-1 text-center sm:text-left">
            <span>© 2026 DesaWisata. Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk Pengembangan Ekonomi Lokal Indonesia (UTS Prototype)</span>
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Transaksi Aman</span>
            <span>·</span>
            <span>QRIS & Bank Transfer</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
