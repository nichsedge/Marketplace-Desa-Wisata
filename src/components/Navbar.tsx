import React, { useState, useEffect, useRef } from 'react';
import { useApp, PageRoute } from '../context/AppContext';
import { UserAvatar } from './UserAvatar';
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
  Sparkles,
  Globe
} from 'lucide-react';
import { scoreProductSearch } from '../utils/search';
import { getLocalizedProduct } from '../i18n/productTranslations';

const POPULAR_SEARCH_TAGS_ID = [
  '☕ Kopi Arabika Pasir Angling',
  '🏛️ Megalitikum Batu Loceng',
  '🚜 Offroad Land Rover Cikole',
  '🏕️ Camping Pasir Angling',
  '🍲 Tahu Susu Wangunsari',
  '☕ Maguru Kopi Jayagiri',
  '🥛 Susu Murni Sukajaya',
  '🎭 Tari Jaipong Gudangkahuripan'
];

const POPULAR_SEARCH_TAGS_EN = [
  '☕ Arabica Coffee Pasir Angling',
  '🏛️ Megalithic Batu Loceng',
  '🚜 Offroad Land Rover Cikole',
  '🏕️ Camping Pasir Angling',
  '🍲 Milk Tofu Wangunsari',
  '☕ Maguru Coffee Jayagiri',
  '🥛 Pure Milk Sukajaya',
  '🎭 Jaipong Dance Gudangkahuripan'
];

const QUICK_VILLAGE_TAGS = [
  { id: 'des-01', name: 'Suntenjaya', icon: '☕', highlight: 'Kopi & Budaya' },
  { id: 'des-02', name: 'Cikole', icon: '🌲', highlight: 'Camping & Offroad' },
  { id: 'des-03', name: 'Jayagiri', icon: '⛰️', highlight: 'Maguru Kopi' },
  { id: 'des-04', name: 'Wangunsari', icon: '🍲', highlight: 'Tahu Susu & Kuliner' },
  { id: 'des-05', name: 'Gudangkahuripan', icon: '🎭', highlight: 'Tari Jaipong' },
  { id: 'des-06', name: 'Sukajaya', icon: '🥛', highlight: 'Susu Murni' },
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
    setCategoryFilter,
    setVillageFilter,
    products,
    language,
    setLanguage,
    t,
    recordSearch
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [modalSearchText, setModalSearchText] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Autofocus input saat modal terbuka & Escape key handler
  useEffect(() => {
    if (searchModalOpen) {
      setModalSearchText(searchQuery || '');
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSearchModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [searchModalOpen, searchQuery]);

  // Filter produk instan untuk live modal search dengan smart relevance scoring
  const modalMatches = (modalSearchText && modalSearchText.trim().length > 0 && Array.isArray(products))
    ? products
        .map(p => ({ product: p, score: scoreProductSearch(p, modalSearchText) }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.product)
        .slice(0, 6)
    : [];

  const handleModalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (modalSearchText.trim()) {
      recordSearch(modalSearchText.trim(), modalMatches.length);
      setSearchQuery(modalSearchText.trim());
      setCategoryFilter('all');
      setVillageFilter('all');
      setSearchModalOpen(false);
      navigateTo('marketplace');
    }
  };

  const handleTagClick = (tag: string) => {
    const cleanedTag = tag.replace(/^[^\w\s]+/, '').trim();
    recordSearch(cleanedTag);
    setSearchQuery(cleanedTag);
    setCategoryFilter('all');
    setVillageFilter('all');
    setSearchModalOpen(false);
    navigateTo('marketplace');
  };

  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll position to apply crisp dynamic elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; route: PageRoute; icon: React.ReactNode }[] = [
    { label: t('nav.home'), route: 'home', icon: <Home className="w-4 h-4" /> },
    { label: t('nav.marketplace'), route: 'marketplace', icon: <Compass className="w-4 h-4" /> },
    { label: t('nav.homestay'), route: 'homestay', icon: <BedDouble className="w-4 h-4" /> },
    { label: t('nav.packages'), route: 'paket-wisata', icon: <TreePine className="w-4 h-4" /> },
    { label: t('nav.villages'), route: 'desa-detail', icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white border-b border-stone-200/90 shadow-sm' 
          : 'bg-white/95 sm:bg-white border-b border-stone-200/60 shadow-none'
      }`}
    >
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-2 sm:gap-3">
          
          {/* Sisi Kiri: Logo Saba Lembang */}
          <button 
            type="button"
            onClick={() => navigateTo('home')}
            aria-label="Saba Lembang - Beranda Platform Interdesa Kawasan Lembang"
            className="flex items-center gap-1.5 sm:gap-2.5 text-left cursor-pointer group shrink-0 rounded-xl p-1 focus-visible:ring-2 focus-visible:ring-emerald-700 min-w-0"
          >
            <img 
              src="/images/logo-saba-lembang.png" 
              alt="Logo Saba Lembang" 
              className="w-8 h-8 sm:w-11 sm:h-11 rounded-full shadow-xs group-hover:scale-105 transition-transform shrink-0 object-contain" 
            />
            <div className="shrink-0">
              <span className="text-sm sm:text-xl xl:text-2xl font-extrabold font-serif-title tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors">
                Saba<span className="text-emerald-700">Lembang</span>
              </span>
              <span className="hidden 2xl:block text-[10px] font-medium tracking-widest text-amber-800 uppercase font-sans">
                {language === 'en' ? 'Lembang Region Inter-Village Platform' : 'Platform Interdesa Kawasan Lembang'}
              </span>
            </div>
          </button>

          {/* Bagian Tengah: Menu Navigasi Utama (Hanya Tampil di Desktop Besar) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0" aria-label="Navigasi Utama">
            {navItems.map((item) => {
              const isActive = page === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navigateTo(item.route)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-emerald-700 ${
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

          {/* Sisi Kanan: Language Switcher (Desktop), Search, Cart, & Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Desktop Language Switcher (Only visible on desktop >= lg; on mobile it lives inside the drawer) */}
            <div 
              className="hidden lg:flex items-center bg-stone-100 border border-stone-200 rounded-full p-0.5 shadow-2xs shrink-0"
              role="group"
              aria-label="Pilih Bahasa / Language Selector"
            >
              <button
                type="button"
                onClick={() => setLanguage('id')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all cursor-pointer min-h-[32px] focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                  language === 'id'
                    ? 'bg-emerald-800 text-amber-200 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Bahasa Indonesia"
                aria-label="Gunakan Bahasa Indonesia"
              >
                <Globe className={`w-3 h-3 ${language === 'id' ? 'text-amber-300' : 'text-stone-500'}`} />
                <span>ID</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all cursor-pointer min-h-[32px] focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                  language === 'en'
                    ? 'bg-emerald-800 text-amber-200 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="English"
                aria-label="Switch to English"
              >
                <span>EN</span>
              </button>
            </div>

            {/* Tombol Pencarian - Icon Only */}
            <button 
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-10 h-10 min-w-[40px] min-h-[40px] sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-emerald-700 transition-colors shadow-2xs shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-700"
              title={t('nav.searchPlaceholder')}
              aria-label={t('nav.searchPlaceholder')}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
            </button>

            {/* Cart Icon */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('cart');
              }}
              className="relative w-10 h-10 min-w-[40px] min-h-[40px] sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors shadow-2xs shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
              title={t('nav.cart')}
              aria-label={`${t('nav.cart')}, ${cartCount} item`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Desa Session Menu (Only visible when logged in as Admin Desa via /login) */}
            {currentUser && currentUser.role === 'penjual' && (
              <div className="relative shrink-0">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1 sm:gap-2 py-1 px-1.5 sm:py-1.5 sm:px-2.5 rounded-full bg-emerald-900 text-amber-200 border border-emerald-700/80 hover:bg-emerald-950 transition-all shadow-xs shrink-0 cursor-pointer"
                  title="Sesi Admin Desa Aktif · Klik untuk menu pengelola"
                >
                  <UserAvatar
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    sizeClassName="w-6 h-6 sm:w-7 sm:h-7"
                    className="border border-amber-300 shrink-0"
                  />
                  <div className="hidden sm:flex flex-col text-left text-xs leading-none pr-1">
                    <span className="font-bold text-white truncate max-w-[120px]">{currentUser.name}</span>
                    <span className="text-[10px] font-semibold text-amber-300 mt-0.5">
                      ⭐ Admin {currentUser.picVillageName?.replace('Desa Wisata ', language === 'en' ? 'Village ' : '') || 'Desa'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-200 shrink-0" />
                </button>

              {userDropdownOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 pb-3 border-b border-stone-100">
                    <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{language === 'en' ? 'Verified Village Admin' : 'Admin Desa Terverifikasi'}</span>
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
                      <span>
                        {language === 'en' ? 'Open Dashboard' : 'Buka Dasbor'} ({currentUser.picVillageName?.replace('Desa Wisata ', language === 'en' ? 'Village ' : '') || currentUser.villageName})
                      </span>
                    </button>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{language === 'en' ? 'Sign Out of Admin Session' : 'Keluar Sesi Admin Desa'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 min-w-[40px] min-h-[40px] sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-emerald-700 transition-colors shadow-2xs shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-700"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? (language === 'en' ? 'Close navigation menu' : 'Tutup menu navigasi') : (language === 'en' ? 'Open navigation menu' : 'Buka menu navigasi')}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-stone-800 stroke-[2.2]" />
              ) : (
                <Menu className="w-5 h-5 text-emerald-800 stroke-[2.2]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3.5 pb-6 space-y-3.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Full-width Sleek Search Box Trigger */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchModalOpen(true);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white hover:bg-stone-50 active:scale-[0.99] border border-emerald-900/15 hover:border-emerald-700/50 rounded-2xl text-left shadow-xs transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            <div className="flex items-center gap-3 text-stone-600 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-amber-200 transition-colors">
                <Search className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                  {language === 'en' ? 'Quick Search' : 'Pencarian Cepat'}
                </span>
                <span className="block text-xs sm:text-sm font-semibold text-stone-800 truncate">
                  {searchQuery || (language === 'en' ? 'Search coffee, stays, tours...' : 'Cari kopi, homestay, offroad...')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-800 text-amber-200 text-xs font-bold shadow-2xs group-hover:bg-emerald-900 transition-all shrink-0">
              <span>{language === 'en' ? 'Search' : 'Cari'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Nav Items Grid */}
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.route}
                onClick={() => { navigateTo(item.route); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer transition-all ${
                  page === item.route
                    ? 'bg-emerald-800 text-amber-200 shadow-sm'
                    : 'bg-white/90 text-stone-700 hover:bg-white border border-stone-200/80 shadow-2xs'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Language Switcher Bar in Drawer */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-200/80 px-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600">
              <Globe className="w-3.5 h-3.5 text-emerald-800" />
              <span>{language === 'en' ? 'Display Language' : 'Bahasa Tampilan'}</span>
            </div>
            <div 
              className="flex items-center bg-stone-100 border border-stone-200 rounded-full p-0.5 shadow-2xs shrink-0"
              role="group"
              aria-label="Pilih Bahasa / Language Selector"
            >
              <button
                type="button"
                onClick={() => {
                  setLanguage('id');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer min-h-[32px] ${
                  language === 'id'
                    ? 'bg-emerald-800 text-amber-200 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Bahasa Indonesia"
                aria-label="Bahasa Indonesia"
              >
                <span>ID</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer min-h-[32px] ${
                  language === 'en'
                    ? 'bg-emerald-800 text-amber-200 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="English"
                aria-label="English"
              >
                <span>EN</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-200 space-y-2">
            {currentUser && currentUser.role === 'penjual' && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => { navigateTo('dashboard'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-900 text-amber-200 rounded-xl text-xs font-bold shadow-md cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-700"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>
                    {language === 'en' ? 'Open Dashboard' : 'Buka Dasbor'} ({currentUser.picVillageName?.replace('Desa Wisata ', language === 'en' ? 'Village ' : '') || currentUser.villageName})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'en' ? 'Sign Out of Admin Session' : 'Keluar Sesi Admin Desa'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE SEARCH MODAL (COMMAND PALETTE STYLE) - ZERO OVERFLOW GUARANTEE */}
      {/* ========================================================================= */}
      {searchModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label={language === 'en' ? 'Search Products & Villages' : 'Pencarian Produk dan Desa Wisata'}
          className="fixed inset-0 z-50 bg-stone-950/70 sm:backdrop-blur-sm flex items-start justify-center p-0 sm:p-4 sm:pt-16 animate-in fade-in duration-200"
          onClick={() => setSearchModalOpen(false)}
        >
          <div 
            className="w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-2xl bg-white sm:rounded-3xl shadow-2xl border-0 sm:border sm:border-stone-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <form 
              onSubmit={handleModalSubmit}
              className="flex items-center gap-2.5 sm:gap-3 p-3.5 sm:p-5 border-b border-stone-200 bg-stone-50/70 shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-800/10 text-emerald-800 flex items-center justify-center shrink-0">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800 stroke-[2.2]" aria-hidden="true" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={modalSearchText}
                onChange={(e) => setModalSearchText(e.target.value)}
                placeholder={
                  language === 'en'
                    ? 'Search homestays, coffee, dairy, offroad...'
                    : 'Cari homestay, kopi, sayur, offroad, desa...'
                }
                aria-label={language === 'en' ? 'Search query' : 'Kata kunci pencarian'}
                className="w-full bg-transparent text-stone-900 text-sm sm:text-base font-bold placeholder:text-stone-400 placeholder:font-normal focus:outline-none"
              />
              {modalSearchText && (
                <button
                  type="button"
                  onClick={() => setModalSearchText('')}
                  aria-label={language === 'en' ? 'Clear search text' : 'Hapus kata kunci'}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 text-xs transition-colors shrink-0 cursor-pointer"
                >
                  ✕
                </button>
              )}
              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                aria-label={language === 'en' ? 'Close search' : 'Tutup pencarian'}
                className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-stone-200/80 text-stone-700 hover:bg-stone-300 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              {/* Desktop ESC Badge Button */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                aria-label={language === 'en' ? 'Close search modal' : 'Tutup modal pencarian'}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-bold text-stone-600 bg-stone-200/80 hover:bg-stone-300 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                ESC
              </button>
            </form>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* Quick Tags (Tampil bila input kosong) */}
              {modalSearchText.trim().length === 0 && (
                <div className="space-y-5">
                  {/* Popular Tags */}
                  <div>
                    <p className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                      <span>
                        {language === 'en'
                          ? 'Popular Searches in Lembang Region:'
                          : 'Pencarian Populer di Kawasan Lembang:'}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(language === 'en' ? POPULAR_SEARCH_TAGS_EN : POPULAR_SEARCH_TAGS_ID).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagClick(tag)}
                          className="px-3 py-2 min-h-[36px] bg-stone-100 hover:bg-emerald-800 hover:text-amber-200 text-stone-800 text-xs font-semibold rounded-xl transition-all border border-stone-200/80 hover:scale-[1.02] cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-700"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1-Tap Village Filter Chips */}
                  <div>
                    <p className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                      <span>
                        {language === 'en' ? 'Explore by Village:' : 'Pencarian Cepat per Desa Wisata:'}
                      </span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {QUICK_VILLAGE_TAGS.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            recordSearch(v.name);
                            setVillageFilter(v.id);
                            setCategoryFilter('all');
                            setSearchQuery('');
                            setSearchModalOpen(false);
                            navigateTo('marketplace');
                          }}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-200/80 hover:border-emerald-700/50 text-left transition-all cursor-pointer group"
                        >
                          <span className="text-base shrink-0">{v.icon}</span>
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-stone-800 group-hover:text-emerald-800 truncate">
                              {v.name}
                            </span>
                            <span className="block text-[10px] text-stone-500 truncate">
                              {v.highlight}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Top Curated Recommendations */}
                  {Array.isArray(products) && products.length > 0 && (
                    <div className="pt-2 border-t border-stone-100">
                      <p className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2.5">
                        {language === 'en' ? 'Featured Village Highlights:' : 'Rekomendasi Unggulan Hari Ini:'}
                      </p>
                      <div className="space-y-2">
                        {products.slice(0, 3).map((item) => {
                          const locItem = getLocalizedProduct(item, language);
                          const villageDisplay = language === 'en' ? item.villageName.replace('Desa Wisata ', 'Village ') : item.villageName;
                          return (
                            <button
                              type="button"
                              key={item.id}
                              onClick={() => {
                                setSearchModalOpen(false);
                                navigateTo('product-detail', item.id);
                              }}
                              className="w-full text-left flex items-center gap-3 p-2.5 rounded-2xl border border-stone-200/70 hover:border-emerald-700/50 hover:bg-emerald-50/40 cursor-pointer transition-all group"
                            >
                              <img
                                src={item.image}
                                alt={locItem.title}
                                loading="lazy"
                                decoding="async"
                                className="w-12 h-12 rounded-xl object-cover border border-stone-200 group-hover:scale-105 transition-transform shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors truncate">
                                  {locItem.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[9px] sm:text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                                    {villageDisplay}
                                  </span>
                                  <span className="text-xs font-bold text-stone-800">
                                    Rp {item.price.toLocaleString('id-ID')}
                                  </span>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Live Results Section */}
              {modalSearchText.trim().length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-3">
                    {language === 'en'
                      ? 'Matching Products & Tourism Activities:'
                      : 'Hasil Produk & Wisata Terkait:'}
                  </p>
                  
                  {modalMatches.length > 0 ? (
                    <div className="space-y-2">
                      {modalMatches.map((item) => {
                        const locItem = getLocalizedProduct(item, language);
                        const villageDisplay = language === 'en' ? item.villageName.replace('Desa Wisata ', 'Village ') : item.villageName;
                        return (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => {
                              setSearchModalOpen(false);
                              navigateTo('product-detail', item.id);
                            }}
                            className="w-full text-left flex items-center gap-3.5 p-3 rounded-2xl border border-stone-200/80 hover:border-emerald-700/50 hover:bg-emerald-50/40 cursor-pointer transition-all group focus-visible:ring-2 focus-visible:ring-emerald-700"
                          >
                            <img
                              src={item.image}
                              alt={locItem.title}
                              loading="lazy"
                              decoding="async"
                              className="w-14 h-14 rounded-xl object-cover border border-stone-200 group-hover:scale-105 transition-transform shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors truncate">
                                {locItem.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                                  {villageDisplay}
                                </span>
                                <span className="text-xs font-extrabold text-stone-800">
                                  Rp {item.price.toLocaleString('id-ID')}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform">
                              <span>{language === 'en' ? 'View' : 'Buka'}</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                        <Search className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <p className="text-stone-700 text-sm font-bold">
                        {language === 'en'
                          ? `No matches for "${modalSearchText}"`
                          : `Tidak ditemukan hasil untuk "${modalSearchText}"`}
                      </p>
                      <p className="text-stone-500 text-xs max-w-xs mx-auto">
                        {language === 'en'
                          ? 'Try searching with general keywords like "coffee", "offroad", or select one of the villages.'
                          : 'Coba gunakan kata kunci umum seperti "kopi", "offroad", "homestay", atau pilih salah satu desa di atas.'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                {language === 'en' ? (
                  <>Press <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono font-bold">↵ Enter</kbd> to view full catalog</>
                ) : (
                  <>Gunakan <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono font-bold">↵ Enter</kbd> untuk buka katalog lengkap</>
                )}
              </span>
              <button
                type="button"
                onClick={() => handleModalSubmit()}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-200 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all ml-auto cursor-pointer active:scale-98"
              >
                <span>{language === 'en' ? 'View All Results in Marketplace' : 'Lihat Seluruh Hasil di Marketplace'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
