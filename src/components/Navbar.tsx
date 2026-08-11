import React, { useState } from 'react';
import { useApp, PageRoute } from '../context/AppContext';
import { 
  ShoppingBag, 
  Home, 
  Compass, 
  BedDouble, 
  MapPin, 
  Store, 
  User as UserIcon, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  Sparkles,
  TreePine,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    page, 
    navigateTo, 
    cartCount, 
    currentUser, 
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

  const navItems: { label: string; route: PageRoute; icon: React.ReactNode }[] = [
    { label: 'Beranda', route: 'home', icon: <Home className="w-4 h-4" /> },
    { label: 'Marketplace', route: 'marketplace', icon: <Compass className="w-4 h-4" /> },
    { label: 'Homestay', route: 'homestay', icon: <BedDouble className="w-4 h-4" /> },
    { label: 'Paket Wisata', route: 'paket-wisata', icon: <TreePine className="w-4 h-4" /> },
    { label: 'Profil Desa', route: 'desa-detail', icon: <MapPin className="w-4 h-4" /> },
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
                Desa<span className="text-emerald-700">Wisata</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium tracking-widest text-amber-800 uppercase font-sans">
                Marketplace Produk & Wisata Lokal
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
              placeholder="Cari homestay, batik, kopi, paket wisata..."
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
            
            {/* Seller Dashboard Quick Link */}
            <button
              onClick={() => navigateTo('dashboard')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                page === 'dashboard'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-stone-100/80 hover:bg-amber-100/60 text-stone-800 border-stone-200'
              }`}
            >
              <Store className="w-4 h-4 text-emerald-700" />
              <span>Dashboard Penjual</span>
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => navigateTo('cart')}
              className="relative p-2.5 rounded-full text-stone-700 hover:bg-stone-200/60 transition-colors"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-white border border-stone-200 hover:border-emerald-600 transition-colors shadow-xs"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-700"
                    referrerPolicy="no-referrer"
                  />
                  <span className="hidden sm:inline text-xs font-medium text-stone-800 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900">{currentUser.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                      <span className="mt-1 inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-full uppercase">
                        {currentUser.role === 'penjual' ? 'Penjual UMKM Desa' : 'Wisatawan'}
                      </span>
                    </div>

                    <button
                      onClick={() => { navigateTo('dashboard'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <Store className="w-4 h-4 text-emerald-700" />
                      Dashboard Penjual & Produk
                    </button>

                    <button
                      onClick={() => { navigateTo('cart'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-700" />
                      Pesanan Saya
                    </button>

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigateTo('auth')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs shadow-md transition-all hover:scale-105"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </button>
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
              placeholder="Cari homestay, batik, paket wisata..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2">
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

          <div className="pt-2 border-t border-stone-200 flex gap-2">
            <button
              onClick={() => { navigateTo('dashboard'); setMobileMenuOpen(false); }}
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-semibold"
            >
              <Store className="w-4 h-4 text-emerald-800" />
              <span>Dashboard Penjual</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
