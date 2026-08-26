import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';
import { User as UserIcon, Store, ShieldCheck, TreePine, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, navigateTo } = useApp();

  const [role, setRole] = useState<UserRole>('wisatawan');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      sellerName: role === 'penjual' ? `UMKM ${name}` : undefined
    };

    login(newUser);
    navigateTo(role === 'penjual' ? 'dashboard' : 'home');
  };

  const handleQuickTouristLogin = () => {
    login({
      id: 'usr-tourist-01',
      name: 'Budi Santoso (Wisatawan)',
      email: 'budi.santoso@wisatawan.id',
      role: 'wisatawan',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    });
    navigateTo('home');
  };

  const handleQuickSellerLogin = () => {
    login({
      id: 'usr-seller-01',
      name: 'Kang Asep Suhendar (Pengelola Desa)',
      email: 'asep.suhendar@sabasunten.id',
      role: 'penjual',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      sellerName: 'Pokdarwis Saba Sunten / BUMDes Suntenjaya Mandiri'
    });
    navigateTo('dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      
      {/* Card Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl text-center space-y-6">
        
        <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center mx-auto shadow-md">
          <TreePine className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold font-serif-title text-stone-900">
            Masuk / Autentikasi
          </h1>
          <p className="text-xs text-stone-500">
            Akses portal & marketplace desa wisata sebagai wisatawan atau pengelola BUMDes Suntenjaya.
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              ⚡ Masuk Cepat Demo Skripsi & Pemdes:
            </span>
            <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded-full">
              Saba Sunten
            </span>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={handleQuickTouristLogin}
              className="w-full py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 flex items-center justify-between transition-colors shadow-xs group"
            >
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-emerald-700" />
                <span>Masuk sebagai Wisatawan</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleQuickSellerLogin}
              className="w-full py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-amber-200 rounded-xl text-xs font-bold flex items-center justify-between transition-colors shadow-xs group"
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-300" />
                <span>Masuk sebagai Pengelola Desa (Kang Asep)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div>
          <div className="relative text-[10px] text-stone-400 bg-white px-2 uppercase font-bold">atau isi form manual</div>
        </div>

        {/* Role Toggle Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4 text-left text-xs">
          
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => setRole('wisatawan')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                role === 'wisatawan' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500'
              }`}
            >
              Wisatawan
            </button>
            <button
              type="button"
              onClick={() => setRole('penjual')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                role === 'penjual' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500'
              }`}
            >
              Penjual / BUMDes
            </button>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Nama Lengkap*</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Alamat Email*</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-xl text-xs shadow-md transition-all hover:scale-105"
          >
            Masuk Sekarang
          </button>

          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition-colors"
          >
            ← Kembali ke Beranda
          </button>
        </form>

      </div>

    </div>
  );
};
