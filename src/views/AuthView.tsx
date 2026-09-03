import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_PICS } from '../data/mockData';
import { 
  TreePine, 
  Lock, 
  User as UserIcon, 
  KeyRound, 
  ArrowRight, 
  AlertCircle,
  Eye, 
  EyeOff, 
  Loader2,
  ChevronLeft,
  HelpCircle,
  X,
  Sparkles
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const { loginWithCredentials, navigateTo } = useApp();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!usernameOrEmail.trim() || !password.trim()) {
      setErrorMessage('Mohon masukkan username/email dan kata sandi.');
      return;
    }

    setIsLoading(true);

    // Realistic brief loading before auth verification
    setTimeout(() => {
      const success = loginWithCredentials(usernameOrEmail, password);
      setIsLoading(false);
      if (!success) {
        setErrorMessage('Username atau kata sandi yang Anda masukkan salah. Silakan coba lagi.');
      }
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-stone-100/60">
      
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Brand Visual (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-emerald-950 text-white p-8 flex-col justify-between overflow-hidden">
          {/* Background Image with Dark Emerald Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
            style={{ 
              backgroundImage: `url('/images/unsplash/photo-1506744038136-46273834b3fb_w1000.jpg')` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent" />

          {/* Brand Top */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shadow-md font-bold">
                <TreePine className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black tracking-widest text-amber-300 uppercase block">
                  SABA LEMBANG
                </span>
                <span className="text-[11px] text-emerald-200">
                  Desa Wisata Terpadu
                </span>
              </div>
            </div>

            <div className="pt-6">
              <h2 className="text-2xl font-bold font-serif-title leading-snug text-white">
                Portal Pengelola Kawasan Lembang
              </h2>
              <p className="text-xs text-emerald-200/90 leading-relaxed mt-2">
                Sistem pengelolaan terpadu katalog komoditas, reservasi homestay, dan informasi destinasi 8 desa wisata di Kawasan Lembang.
              </p>
            </div>
          </div>

          {/* Bottom Security / Trust Notice */}
          <div className="relative z-10 pt-8 border-t border-emerald-800/60 text-[11px] text-emerald-300/80 space-y-1">
            <p className="font-semibold text-white">Jaringan 8 Desa Wisata Lembang</p>
            <p className="text-[10px] text-emerald-300/70">Suntenjaya · Cibodas · Cikole · Jayagiri · Wangunsari · Cikahuripan · Gudangkahuripan · Sukajaya</p>
          </div>
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* Top Logo for Mobile */}
            <div className="flex lg:hidden items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold">
                <TreePine className="w-5 h-5" />
              </div>
              <span className="text-xs font-black tracking-widest text-emerald-900 uppercase">
                SABA LEMBANG
              </span>
            </div>

            {/* Header */}
            <div>
              <h1 className="text-2xl font-black font-serif-title text-stone-900">
                Masuk ke Akun Pengelola
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Silakan masukkan username atau email akun Admin Desa Anda untuk melanjutkan.
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Field */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Username atau Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => {
                      setUsernameOrEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Masukkan username atau email"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white transition-all"
                  />
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-emerald-800 font-semibold hover:underline cursor-pointer"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Masukkan kata sandi"
                    className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white transition-all"
                  />
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-stone-400 hover:text-stone-700 absolute right-3 top-3 cursor-pointer"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-emerald-800 focus:ring-emerald-800 w-4 h-4"
                  />
                  <span>Ingat saya di perangkat ini</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Masuk</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Quick Demo Credentials Assistant */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Akun Demo Admin Desa:</span>
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Klik untuk Isi Otomatis
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {MOCK_PICS.map((pic) => (
                  <button
                    key={pic.id}
                    type="button"
                    onClick={() => {
                      setUsernameOrEmail(pic.username || '');
                      setPassword(pic.password || '');
                      setErrorMessage(null);
                    }}
                    className="p-2 text-left bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 rounded-xl transition-all cursor-pointer group"
                    title={`Masuk sebagai ${pic.name} (${pic.username})`}
                  >
                    <span className="block text-[11px] font-bold text-stone-800 group-hover:text-emerald-900 truncate">
                      {pic.picVillageName?.replace('Desa Wisata ', '') || pic.name}
                    </span>
                    <span className="block text-[10px] text-stone-400 font-mono truncate">
                      {pic.username}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Back Link */}
          <div className="pt-8 mt-6 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="flex items-center gap-1 font-semibold text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>
            <span>© 2026 Saba Lembang</span>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForgotModal(false);
          }}
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">Lupa Kata Sandi</h4>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Untuk keamanan akun pengelola desa wisata, reset kata sandi dilakukan melalui konfirmasi administrator kawasan. Silakan hubungi pusat bantuan pengelola untuk pemulihan akses.
            </p>

            <div className="pt-2">
              <a
                href="https://wa.me/6282122334455?text=Halo%20Admin%20Saba%20Lembang%2C%20saya%20Admin%20Desa%20ingin%20meminta%20bantuan%20reset%20kata%20sandi."
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-200 text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                Hubungi Bantuan via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
