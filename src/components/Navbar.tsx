import React, { useState } from 'react';
import { useApp, PageRoute } from '../context/AppContext';
import { 
  ShoppingBag, 
  Home, 
  Compass, 
  BedDouble, 
  MapPin, 
  Search, 
  Menu, 
  X, 
  TreePine,
  User as UserIcon,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  LogOut
} from 'lucide-react';

/**
 * 🔒 FITUR TAHAP 2 (SEPTEMBER / SAAT PELUNASAN):
 * Ubah menjadi `true` untuk mengaktifkan kembali Menu Autentikasi & Pengalih Peran Demo BUMDes di header.
 * Saat `false`, antarmuka 100% difokuskan pada pengalaman publik wisatawan.
 */
const ENABLE_BUMDES_AUTH_SWITCHER = false;

export const Navbar: React.FC = () => {
  const { 
    page, 
    navigateTo, 
    cartCount, 
    currentUser,
    login,
    logout,
    searchQuery, 
    setSearchQuery 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch);
      navigateTo('marketplace');
    }
  };

  const switchDemoRole = (targetRole: 'wisatawan' | 'penjual') => {
    if (targetRole === 'penjual') {
      login({
        id: 'usr-seller-01',
        name: 'Kang Asep Suhendar',
        email: 'asep.suhendar@sabasunten.id',
        role: 'penjual',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        sellerName: 'Pokdarwis Saba Sunten / BUMDes Suntenjaya Mandiri'
      });
      navigateTo('dashboard');
    } else {
      login({
        id: 'usr-tourist-01',
        name: 'Budi Wisatawan',
        email: 'budi@wisatawan.id',
        role: 'wisatawan',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      });
      navigateTo('home');
    }
    setUserDropdownOpen(false);
  };

  const navItems: { label: string; route: PageRoute; icon: React.ReactNode }[] = [
    { label: 'Beranda', route: 'home', icon: <Home className="w-4 h-4" /> },
    { label: 'Marketplace', route: 'marketplace', icon: <Compass className="w-4 h-4" /> },
    { label: 'Homestay', route: 'homestay', icon: <BedDouble className="w-4 h-4" /> },
    { label: 'Paket Wisata', route: 'paket-wisata', icon: <TreePine className="w-4 h-4" /> },
    { label: 'Profil Desa', route: 'desa-detail', icon: <MapPin className="w-4 h-4" /> },
    ...(ENABLE_BUMDES_AUTH_SWITCHER && currentUser?.role === 'penjual' ? [
      { label: 'Dashboard BUMDes', route: 'dashboard' as PageRoute, icon: <LayoutDashboard className="w-4 h-4 text-amber-500" /> }
    ] : [])
  ];

  return (
    <header className="sticky top-0 z-40 bg-amber-50/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-transform">
              <TreePine className="w-5 h-5 fill-amber-300/30" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold font-serif-title tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors">
                Saba<span className="text-emerald-700">Sunten</span><span className="text-sm font-sans font-semibold text-amber-600">.id</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium tracking-widest text-amber-800 uppercase font-sans">
                Portal & Marketplace Desa Wisata Suntenjaya
              </span>
            </div>
          </div>

          {/* Search bar on desktop */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md mx-4 relative"
          >
            <Search className="w-4 h-4 absolute left-3.5 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Cari homestay Pasir Angling, kopi Suntenjaya, paket wisata..."
              className="w-full pl-10 pr-4 py-2 bg-white/80 border border-stone-300/80 rounded-full text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white shadow-xs transition-all"
            />
            {localSearch && (
              <button 
                type="button" 
                onClick={() => { setLocalSearch(''); setSearchQuery(''); }}
                className="absolute right-3 text-stone-400 hover:text-stone-600 text-xs"
              >
                ✕
              </button>
            )}
          </form>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = page === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navigateTo(item.route)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-amber-200 shadow-xs'
                      : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-100/80'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Direct WhatsApp Hotline Button */}
            <a
              href="https://wa.me/6282122334455?text=Halo%20Admin%20Saba%20Sunten%2C%20saya%20ingin%20tanya%20info%20Desa%20Wisata%20Suntenjaya"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-amber-200 text-xs font-bold shadow-sm transition-all hover:scale-105 border border-amber-300/40"
            >
              <span>Hotline Pokdarwis</span>
            </a>

            {/* Cart Icon */}
            <button
              onClick={() => navigateTo('cart')}
              className="relative p-2.5 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors shadow-xs"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Optional Auth / Role Switcher (Hidden in Phase 1, toggled via ENABLE_BUMDES_AUTH_SWITCHER) */}
            {ENABLE_BUMDES_AUTH_SWITCHER && (
              <div className="relative">
                {currentUser ? (
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 py-1 px-2 sm:py-1.5 sm:px-2.5 rounded-full bg-white border border-stone-200 hover:border-emerald-700 transition-all shadow-xs"
                    title="Akun Pengguna & Pengalih Peran Demo"
                  >
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-emerald-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="hidden sm:flex flex-col text-left text-xs leading-none pr-1">
                      <span className="font-bold text-stone-900 truncate max-w-[100px]">{currentUser.name}</span>
                      <span className={`text-[10px] font-semibold mt-0.5 ${currentUser.role === 'penjual' ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {currentUser.role === 'penjual' ? '⭐ BUMDes' : '🎒 Wisatawan'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigateTo('auth')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-bold hover:bg-stone-50 transition-colors shadow-xs"
                  >
                    <UserIcon className="w-4 h-4 text-emerald-800" />
                    <span>Masuk</span>
                  </button>
                )}

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 py-3 z-50">
                    <div className="px-4 pb-3 border-b border-stone-100">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Status Akun Demo</p>
                      <p className="text-sm font-bold text-stone-900 truncate mt-0.5">{currentUser?.name}</p>
                      <p className="text-xs text-stone-500 truncate">{currentUser?.email}</p>
                    </div>

                    <div className="p-3 bg-amber-50/70 border-y border-amber-100 my-2">
                      <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block mb-1.5">
                        ⚡ Ganti Peran Demo (Skripsi & Desa):
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => switchDemoRole('wisatawan')}
                          className={`px-2 py-1.5 rounded-lg text-xs font-bold text-center transition-all ${
                            currentUser?.role === 'wisatawan'
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                          }`}
                        >
                          🎒 Wisatawan
                        </button>
                        <button
                          onClick={() => switchDemoRole('penjual')}
                          className={`px-2 py-1.5 rounded-lg text-xs font-bold text-center transition-all ${
                            currentUser?.role === 'penjual'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                          }`}
                        >
                          🏛️ BUMDes Desa
                        </button>
                      </div>
                    </div>

                    <div className="px-2 space-y-1">
                      {currentUser?.role === 'penjual' && (
                        <button
                          onClick={() => { navigateTo('dashboard'); setUserDropdownOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-50 rounded-xl transition-colors text-left"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                          <span>Buka Dashboard BUMDes</span>
                        </button>
                      )}
                      <button
                        onClick={() => { navigateTo('auth'); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-xl transition-colors text-left"
                      >
                        <ShieldCheck className="w-4 h-4 text-stone-500" />
                        <span>Halaman Autentikasi / Ganti Akun</span>
                      </button>
                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 bg-amber-50/95 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Cari homestay, kopi Suntenjaya, sayur..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </form>

          {/* Optional Mobile Role Switcher (Hidden in Phase 1) */}
          {ENABLE_BUMDES_AUTH_SWITCHER && (
            <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">{currentUser?.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${currentUser?.role === 'penjual' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
                  {currentUser?.role === 'penjual' ? 'BUMDes' : 'Wisatawan'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => { switchDemoRole('wisatawan'); setMobileMenuOpen(false); }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold ${currentUser?.role === 'wisatawan' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700'}`}
                >
                  🎒 Wisatawan
                </button>
                <button
                  onClick={() => { switchDemoRole('penjual'); setMobileMenuOpen(false); }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold ${currentUser?.role === 'penjual' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'}`}
                >
                  🏛️ BUMDes
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => { navigateTo(item.route); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${
                  page === item.route
                    ? 'bg-emerald-800 text-amber-200 shadow-sm'
                    : 'bg-white/80 text-stone-700 border border-stone-200/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200 space-y-2">
            <a
              href="https://wa.me/6282122334455?text=Halo%20Admin%20Saba%20Sunten%2C%20saya%20ingin%20tanya%20info%20Desa%20Wisata%20Suntenjaya"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-800 text-amber-200 rounded-xl text-xs font-bold shadow-md"
            >
              <span>Hubungi Pengelola via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
