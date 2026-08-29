import React, { useState, useEffect, useRef } from 'react';
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
  LogOut,
  Phone,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const POPULAR_SEARCH_TAGS = [
  '☕ Kopi Arabika Suntenjaya',
  '🏡 Homestay Maribaya',
  '🌲 Glamping Pinus Cikole',
  '🧗 Trekking Jayagiri',
  '🍓 Petik Stroberi Wangunsari',
  '🚜 Offroad Tangkuban Parahu'
];

export const Navbar: React.FC = () => {
  const { 
    page, 
    navigateTo, 
    cartCount, 
    currentUser,
    login,
    logout,
    searchQuery, 
    setSearchQuery,
    products
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [modalSearchText, setModalSearchText] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Autofocus input saat modal terbuka
  useEffect(() => {
    if (searchModalOpen) {
      setModalSearchText(searchQuery || '');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [searchModalOpen, searchQuery]);

  // Filter produk instan untuk live modal search
  const modalMatches = (modalSearchText && modalSearchText.trim().length > 0 && Array.isArray(products))
    ? products.filter(p => {
        const q = modalSearchText.toLowerCase().trim();
        return (
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.villageName && p.villageName.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.location && p.location.toLowerCase().includes(q))
        );
      }).slice(0, 5)
    : [];

  const handleModalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (modalSearchText.trim()) {
      setSearchQuery(modalSearchText.trim());
      setSearchModalOpen(false);
      navigateTo('marketplace');
    }
  };

  const handleTagClick = (tag: string) => {
    const cleanedTag = tag.replace(/^[^\w\s]+/, '').trim();
    setSearchQuery(cleanedTag);
    setSearchModalOpen(false);
    navigateTo('marketplace');
  };

  const navItems: { label: string; route: PageRoute; icon: React.ReactNode }[] = [
    { label: 'Beranda', route: 'home', icon: <Home className="w-4 h-4" /> },
    { label: 'Marketplace', route: 'marketplace', icon: <Compass className="w-4 h-4" /> },
    { label: 'Homestay', route: 'homestay', icon: <BedDouble className="w-4 h-4" /> },
    { label: 'Paket Wisata', route: 'paket-wisata', icon: <TreePine className="w-4 h-4" /> },
    { label: 'Profil Desa', route: 'desa-detail', icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-amber-50/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-2 sm:gap-3">
          
          {/* Sisi Kiri: Logo Saba Lembang */}
          <div 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <TreePine className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-300/30" />
            </div>
            <div className="shrink-0">
              <span className="text-base sm:text-xl xl:text-2xl font-extrabold font-serif-title tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors">
                Saba<span className="text-emerald-700">Lembang</span><span className="text-xs sm:text-sm font-sans font-semibold text-amber-600">.id</span>
              </span>
              <span className="hidden 2xl:block text-[10px] font-medium tracking-widest text-amber-800 uppercase font-sans">
                Platform Desa Wisata Kawasan Lembang
              </span>
            </div>
          </div>

          {/* Bagian Tengah: Menu Navigasi Utama (Hanya Tampil di Desktop Besar) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
            {navItems.map((item) => {
              const isActive = page === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navigateTo(item.route)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-amber-200 shadow-xs'
                      : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-100/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sisi Kanan: Search Button, Kontak, Keranjang, & Akun */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Tombol Pencarian - Icon Only, tidak menggencet navbar */}
            <button 
              onClick={() => setSearchModalOpen(true)}
              className="relative p-1.5 sm:p-2.5 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-emerald-700 transition-colors shadow-xs shrink-0"
              title="Cari homestay, kopi, wisata..."
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
            </button>

            {/* Direct WhatsApp Contact Button */}
            <a
              href="https://wa.me/6282122334455?text=Halo%20Admin%20Saba%20Lembang%2C%20saya%20ingin%20tanya%20info%20Desa%20Wisata%20Kawasan%20Lembang"
              target="_blank"
              rel="noreferrer"
              className="hidden 2xl:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-amber-200 text-xs font-bold shadow-sm transition-all hover:scale-105 border border-amber-300/40 whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hubungi Kami</span>
            </a>

            {/* Cart Icon */}
            <button
              onClick={() => navigateTo('cart')}
              className="relative p-1.5 sm:p-2.5 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors shadow-xs shrink-0"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-black text-[10px] w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* PIC Session Menu (Only visible when logged in as PIC/Admin via /login) */}
            {currentUser && currentUser.role === 'penjual' && (
              <div className="relative shrink-0">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1 sm:gap-2 py-1 px-1.5 sm:py-1.5 sm:px-2.5 rounded-full bg-emerald-900 text-amber-200 border border-emerald-700/80 hover:bg-emerald-950 transition-all shadow-xs shrink-0 cursor-pointer"
                  title="Sesi PIC Aktif · Klik untuk menu pengelola"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                    alt={currentUser.name}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-amber-300 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden sm:flex flex-col text-left text-xs leading-none pr-1">
                    <span className="font-bold text-white truncate max-w-[120px]">{currentUser.name}</span>
                    <span className="text-[10px] font-semibold text-amber-300 mt-0.5">
                      ⭐ PIC {currentUser.picVillageName?.replace('Desa Wisata ', '') || 'Desa'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-200 shrink-0" />
                </button>

              {userDropdownOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 pb-3 border-b border-stone-100">
                    <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>PIC Resmi Terverifikasi</span>
                    </div>
                    <p className="text-sm font-bold text-stone-900 truncate mt-0.5">{currentUser.name}</p>
                    <p className="text-xs text-stone-500 truncate">{currentUser.picVillageName || currentUser.villageName}</p>
                  </div>

                  <div className="px-2 pt-2 space-y-1">
                    <button
                      onClick={() => { navigateTo('dashboard'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                      <span>Buka Dasbor PIC ({currentUser.picVillageName?.replace('Desa Wisata ', '') || currentUser.villageName})</span>
                    </button>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar Sesi PIC</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors"
              aria-label="Menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-amber-50/95 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchModalOpen(true);
            }}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-stone-300 rounded-2xl text-left shadow-xs"
          >
            <div className="flex items-center gap-2.5 text-stone-500">
              <Search className="w-4 h-4 text-emerald-800" />
              <span className="text-sm font-medium">{searchQuery || 'Cari homestay, kopi, wisata...'}</span>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">Buka</span>
          </button>

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
            {currentUser && currentUser.role === 'penjual' && (
              <div className="space-y-2">
                <button
                  onClick={() => { navigateTo('dashboard'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-900 text-amber-200 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Buka Dasbor PIC ({currentUser.picVillageName?.replace('Desa Wisata ', '') || currentUser.villageName})</span>
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Sesi PIC</span>
                </button>
              </div>
            )}

            <a
              href="https://wa.me/6282122334455?text=Halo%20Admin%20Saba%20Lembang%2C%20saya%20ingin%20tanya%20info%20Desa%20Wisata%20Kawasan%20Lembang"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-800 text-amber-200 rounded-xl text-xs font-bold shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>Hubungi Kami via WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE SEARCH MODAL (COMMAND PALETTE STYLE) - ZERO OVERFLOW GUARANTEE */}
      {/* ========================================================================= */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-start justify-center pt-12 sm:pt-20 px-4 animate-in fade-in duration-150">
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <form 
              onSubmit={handleModalSubmit}
              className="flex items-center gap-3 p-4 sm:p-5 border-b border-stone-200 bg-stone-50/50"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-800 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={modalSearchText}
                onChange={(e) => setModalSearchText(e.target.value)}
                placeholder="Cari homestay, kopi Lembang, sayur, offroad, profil desa..."
                className="w-full bg-transparent text-stone-900 text-base sm:text-lg font-semibold placeholder:text-stone-400 placeholder:font-normal focus:outline-none"
                style={{ color: '#1c1917' }}
              />
              {modalSearchText && (
                <button
                  type="button"
                  onClick={() => setModalSearchText('')}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 text-xs"
                >
                  ✕
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="px-2.5 py-1 text-xs font-bold text-stone-500 bg-stone-200/80 hover:bg-stone-300 rounded-lg transition-colors"
              >
                ESC
              </button>
            </form>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
              
              {/* Quick Tags (Tampil bila input kosong atau selalu untuk navigasi instan) */}
              <div>
                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pencarian Cepat & Populer di Kawasan Lembang:</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCH_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-emerald-800 hover:text-amber-200 text-stone-700 text-xs font-semibold rounded-xl transition-all border border-stone-200/80 hover:scale-102"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Results Section */}
              {modalSearchText.trim().length > 0 && (
                <div className="pt-2 border-t border-stone-100">
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-3">
                    Hasil Produk & Wisata Terkait:
                  </p>
                  
                  {modalMatches.length > 0 ? (
                    <div className="space-y-2">
                      {modalMatches.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSearchModalOpen(false);
                            navigateTo('product-detail', item.id);
                          }}
                          className="flex items-center gap-3.5 p-3 rounded-2xl border border-stone-200/80 hover:border-emerald-700/50 hover:bg-emerald-50/40 cursor-pointer transition-all group"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-14 h-14 rounded-xl object-cover border border-stone-200 group-hover:scale-105 transition-transform shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors truncate">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                                {item.villageName}
                              </span>
                              <span className="text-xs font-extrabold text-stone-800">
                                Rp {item.price.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform">
                            <span>Buka</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-stone-500 text-sm">
                      Tidak ditemukan hasil instan untuk "<strong>{modalSearchText}</strong>".
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                Gunakan <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono font-bold">↵ Enter</kbd> untuk buka katalog lengkap
              </span>
              <button
                type="button"
                onClick={() => handleModalSubmit()}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-200 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all ml-auto"
              >
                <span>Lihat Seluruh Hasil di Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
