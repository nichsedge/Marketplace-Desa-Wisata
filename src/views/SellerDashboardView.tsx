import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, getCategoryBadge } from '../components/ProductCard';
import { Product, ProductCategory, OrderStatus, Village } from '../types';
import { LEMBANG_GALLERY_PRESETS } from '../data/mockData';
import { 
  Store, 
  Plus, 
  Trash2, 
  Edit3, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  X, 
  ShieldCheck, 
  Sparkles,
  Search,
  Filter,
  Camera,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Upload,
  Check,
  Building2,
  MapPin,
  Phone,
  Save,
  Compass,
  BedDouble,
  TreePine,
  Coffee,
  Palette,
  Lock,
  LogOut,
  ExternalLink,
  Layers,
  Tag,
  UploadCloud
} from 'lucide-react';

export const SellerDashboardView: React.FC = () => {
  const { 
    products, 
    orders, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus, 
    villages,
    updateVillage,
    currentUser,
    login,
    logout,
    navigateTo,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'feed' | 'profile' | 'orders'>('feed');
  const [feedCategoryFilter, setFeedCategoryFilter] = useState<ProductCategory | 'all'>('all');
  
  // Current active village for PIC
  const activeVillageId = currentUser?.picVillageId || currentUser?.villageName ? 
    (villages.find(v => v.name === currentUser?.villageName || v.id === currentUser?.picVillageId)?.id || 'des-01') : 'des-01';
  
  const currentVillage = villages.find(v => v.id === activeVillageId) || villages[0];
  const villageProducts = products.filter(p => p.villageId === currentVillage.id);
  const filteredVillageProducts = feedCategoryFilter === 'all' 
    ? villageProducts 
    : villageProducts.filter(p => p.category === feedCategoryFilter);

  // Edit village profile state
  const [editVillageName, setEditVillageName] = useState(currentVillage.name);
  const [editVillageDesc, setEditVillageDesc] = useState(currentVillage.description);
  const [editVillageHistory, setEditVillageHistory] = useState(currentVillage.history);
  const [editVillagePhone, setEditVillagePhone] = useState(currentVillage.contactPhone);
  const [editVillageManager, setEditVillageManager] = useState(currentVillage.managerName);
  const [editVillageImage, setEditVillageImage] = useState(currentVillage.image);

  // Modal Posting Flow State (Wireframe 4-step wizard)
  const [showPostWizard, setShowPostWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<'pick-media' | 'fill-detail'>('pick-media');
  
  // Post Wizard Form State
  const [selectedImage, setSelectedImage] = useState<string>(LEMBANG_GALLERY_PRESETS[0].url);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postPrice, setPostPrice] = useState<number>(250000);
  const [postUnit, setPostUnit] = useState('/malam');
  const [postStock, setPostStock] = useState<number>(3);
  const [postCategory, setPostCategory] = useState<ProductCategory>('homestay');
  
  // Editing existing product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editImageTab, setEditImageTab] = useState<'gallery' | 'upload' | 'url'>('gallery');
  const [editHighlightsText, setEditHighlightsText] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize highlights text whenever editingProduct opens
  const openEditProductModal = (product: Product) => {
    setEditingProduct({ ...product });
    setEditHighlightsText(product.highlights?.join(', ') || '');
    setEditImageTab('gallery');
  };

  // Close modals on Escape key & manage body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPostWizard) setShowPostWizard(false);
        if (editingProduct) setEditingProduct(null);
      }
    };

    if (showPostWizard || editingProduct) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPostWizard, editingProduct]);

  // Handle local image file upload for new post (Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
          showToast('Foto aktual berhasil dimuat!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local image file upload for editing product (Base64)
  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const newImg = reader.result;
          setEditingProduct({
            ...editingProduct,
            image: newImg,
            gallery: [newImg, ...(editingProduct.gallery?.filter(g => g !== newImg) || [])]
          });
          showToast('Foto aktual produk berhasil diperbarui!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSelectGalleryPreset = (imgUrl: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      image: imgUrl,
      gallery: [imgUrl, ...(editingProduct.gallery?.filter(g => g !== imgUrl) || [])]
    });
    showToast('Foto dari galeri Lembang dipilih!', 'info');
  };

  // Submit new post from wizard
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) {
      showToast('Mohon masukkan judul postingan.', 'error');
      return;
    }

    addProduct({
      title: postTitle,
      category: postCategory,
      price: Number(postPrice),
      unit: postUnit,
      villageId: currentVillage.id,
      villageName: currentVillage.name,
      location: currentVillage.location,
      sellerName: currentUser?.sellerName || currentUser?.name || currentVillage.managerName,
      sellerBadge: 'PIC Terverifikasi Desa',
      sellerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      sellerPhone: currentUser?.phone || currentVillage.contactPhone,
      image: selectedImage,
      gallery: [selectedImage],
      description: postDescription || 'Konten dan penawaran aktual dari Desa Wisata.',
      highlights: ['Foto Asli Lokasi', 'Dikelola Langsung PIC Desa', 'Kualitas Terjamin'],
      stockQuota: Number(postStock),
      isAvailable: true,
      isFeatured: false
    });

    setShowPostWizard(false);
    resetWizard();
  };

  const resetWizard = () => {
    setWizardStep('pick-media');
    setPostTitle('');
    setPostDescription('');
    setPostPrice(250000);
    setPostStock(3);
    setPostCategory('homestay');
  };

  const handleSaveVillageProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateVillage({
      ...currentVillage,
      name: editVillageName,
      description: editVillageDesc,
      history: editVillageHistory,
      contactPhone: editVillagePhone,
      managerName: editVillageManager,
      image: editVillageImage
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.title.trim()) {
      showToast('Judul produk tidak boleh kosong.', 'error');
      return;
    }

    const parsedHighlights = editHighlightsText
      .split(',')
      .map(h => h.trim())
      .filter(h => h.length > 0);

    const updated: Product = {
      ...editingProduct,
      highlights: parsedHighlights.length > 0 ? parsedHighlights : editingProduct.highlights,
      gallery: editingProduct.image 
        ? [editingProduct.image, ...(editingProduct.gallery?.filter(g => g !== editingProduct.image) || [])]
        : editingProduct.gallery
    };

    updateProduct(updated);
    showToast(`Data produk "${updated.title}" dan foto berhasil diperbarui!`, 'success');
    setEditingProduct(null);
  };

  // Village-specific orders & revenue based on PIC role
  const villageOrders = (currentUser?.picVillageId === 'all' || currentUser?.role === 'admin')
    ? orders
    : orders.filter(o => o.items.some(item => item.product.villageId === currentVillage.id));

  // Stats calculation
  const totalRevenue = villageOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = villageOrders.filter(o => o.status === 'menunggu' || o.status === 'diproses').length;

  // Access Control Guard: Only authenticated PICs/Admins can manage catalogues
  if (!currentUser || currentUser.role !== 'penjual') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8 text-amber-700" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Akses Terbatas: Khusus PIC / Admin Desa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-stone-900">
            Dasbor Pengelola Desa Wisata
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Halaman ini khusus diperuntukkan bagi PIC resmi 5 Desa Wisata di Kawasan Lembang untuk mengelola katalog, foto aktual, dan reservasi. Wisatawan umum dapat langsung berbelanja tanpa perlu login.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigateTo('auth')}
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Masuk ke Portal PIC Desa</span>
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="w-full sm:w-auto px-5 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-28 relative">
      
      {/* PIC Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-700/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-lg shrink-0">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 mb-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sistem PIC Resmi · Saba Lembang</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-title">
              Portal PIC {currentVillage.name}
            </h1>
            <p className="text-xs text-stone-300">
              PIC Aktif: <strong className="text-amber-300">{currentUser?.name || currentVillage.managerName}</strong> · Kelola konten riil destinasi, foto aktual, dan reservasi wisatawan.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('marketplace')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition-all cursor-pointer"
          >
            ← Lihat Marketplace
          </button>

          <button
            onClick={() => logout()}
            className="px-3.5 py-2.5 bg-rose-600/80 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Keluar dari akun pengelola"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-semibold uppercase">Pendapatan Desa</p>
            <p className="text-sm sm:text-lg font-black text-stone-900">{formatRupiah(totalRevenue)}</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-semibold uppercase">Pesanan Aktif</p>
            <p className="text-sm sm:text-lg font-black text-stone-900">{pendingOrders} Pesanan</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-semibold uppercase">Listing Desa</p>
            <p className="text-sm sm:text-lg font-black text-stone-900">{villageProducts.length} Konten</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-semibold uppercase">Rating {currentVillage.name}</p>
            <p className="text-sm sm:text-lg font-black text-stone-900">{currentVillage.rating} / 5.0 ★</p>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'feed'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Beranda Postingan PIC ({villageProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Kelola Profil & Foto Desa</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Pesanan Wisatawan ({orders.length})</span>
        </button>
      </div>

      {/* ========================================================== */}
      {/* TAB 1: FEED POSTINGAN PIC (FLOW WIREFRAME SESUAI GAMBAR) */}
      {/* ========================================================== */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          
          {/* Feed Filter & Header Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-stone-600">Filter Kategori:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['all', 'homestay', 'paket-wisata', 'kuliner', 'umkm', 'suvenir'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFeedCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      feedCategoryFilter === cat
                        ? 'bg-emerald-800 text-amber-200'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat === 'all' ? 'Semua' : cat === 'homestay' ? 'Homestay' : cat === 'paket-wisata' ? 'Paket Wisata' : cat === 'kuliner' ? 'Kuliner' : cat === 'umkm' ? 'Produk Lokal' : 'Suvenir'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                resetWizard();
                setShowPostWizard(true);
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Postingan Baru</span>
            </button>
          </div>

          {/* Post Grid (Wireframe Screen 1 & 4 layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVillageProducts.map((p) => {
              const badge = getCategoryBadge(p.category);
              return (
                <div 
                  key={p.id}
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all relative"
                >
                  {/* Image with Verified Checkmark (matching wireframe) */}
                  <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Status Centang Hijau Terverifikasi PIC */}
                    <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white p-1 rounded-full shadow-md" title="Konten Terverifikasi PIC">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>

                    <div className="absolute bottom-2 left-2.5 bg-stone-950/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-300">
                      {p.stockQuota} kuota tersedia
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm line-clamp-1">{p.title}</h4>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1">{p.description}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-stone-400 font-semibold uppercase">Harga Pemesanan</p>
                          <p className="text-sm font-extrabold text-emerald-800">
                            {formatRupiah(p.price)}
                            <span className="text-[10px] text-stone-500 font-normal"> {p.unit}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => openEditProductModal(p)}
                          className="w-full py-2 px-2 bg-emerald-800 hover:bg-emerald-900 text-amber-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-transform hover:scale-102 cursor-pointer"
                          title="Edit Detail & Foto Produk"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Detail</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateTo('product-detail', p.id)}
                          className="w-full py-2 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Buka Tampilan Publik"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                          <span>Lihat</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredVillageProducts.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-stone-200">
              <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Belum Ada Postingan untuk Kategori Ini</h3>
                <p className="text-xs text-stone-500 mt-1">Unggah foto dan penawaran destinasi desa Anda dengan tombol tambah di bawah.</p>
              </div>
              <button
                onClick={() => {
                  resetWizard();
                  setShowPostWizard(true);
                }}
                className="px-6 py-2.5 bg-emerald-800 text-amber-200 font-bold rounded-xl text-xs shadow-md"
              >
                + Tambah Post Sekarang
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 2: KELOLA PROFIL & FOTO DESA */}
      {/* ========================================================== */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-serif-title">
                Kelola Informasi & Data Resmi {currentVillage.name}
              </h3>
              <p className="text-xs text-stone-500">
                Data ini ditampilkan secara publik kepada wisatawan di portal destinasi Lembang.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold w-fit">
              Status PIC Terverifikasi
            </span>
          </div>

          <form onSubmit={handleSaveVillageProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama Desa Wisata</label>
                <input
                  type="text"
                  value={editVillageName}
                  onChange={(e) => setEditVillageName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama Ketua Pokdarwis / PIC</label>
                <input
                  type="text"
                  value={editVillageManager}
                  onChange={(e) => setEditVillageManager(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nomor WhatsApp Resmi PIC</label>
                <input
                  type="text"
                  value={editVillagePhone}
                  onChange={(e) => setEditVillagePhone(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">URL Foto Sampul Utama Desa</label>
                <input
                  type="text"
                  value={editVillageImage}
                  onChange={(e) => setEditVillageImage(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Deskripsi Singkat Desa</label>
              <textarea
                rows={3}
                value={editVillageDesc}
                onChange={(e) => setEditVillageDesc(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Sejarah & Karakteristik Budaya</label>
              <textarea
                rows={3}
                value={editVillageHistory}
                onChange={(e) => setEditVillageHistory(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-medium"
              />
            </div>

            {/* Gallery Preview of Village */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-stone-700">Galeri Foto Riil Destinasi Desa</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentVillage.gallery.map((img, idx) => (
                  <div key={idx} className="relative h-28 rounded-xl overflow-hidden border border-stone-200 group">
                    <img src={img} alt="Galeri Desa" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                      Foto Aktual #{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-200">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Profil Desa</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 3: DAFTAR PESANAN WISATAWAN */}
      {/* ========================================================== */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <h3 className="font-bold text-stone-900 text-base font-serif-title">Pesanan Masuk Wisatawan</h3>
              <p className="text-xs text-stone-500">Pantau reservasi homestay, paket wisata, dan belanja produk desa.</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {villageOrders.length} Pesanan Masuk
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-800">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase border-b border-stone-200">
                <tr>
                  <th className="p-3">ID Pesanan</th>
                  <th className="p-3">Pemesan</th>
                  <th className="p-3">Item Dipesan</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {villageOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-stone-900">{o.id}</td>
                    <td className="p-3">
                      <p className="font-bold text-stone-900">{o.customerName}</p>
                      <p className="text-[10px] text-stone-400">{o.customerPhone}</p>
                    </td>
                    <td className="p-3">
                      <div className="space-y-0.5">
                        {o.items.map((item, idx) => (
                          <p key={idx} className="text-stone-700">
                            • {item.quantity}x {item.product.title}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 font-extrabold text-emerald-800">{formatRupiah(o.totalAmount)}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        o.status === 'selesai' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        o.status === 'diproses' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        'bg-stone-100 text-stone-700'
                      }`}>
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="p-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold focus:outline-none"
                      >
                        <option value="menunggu">Menunggu</option>
                        <option value="diproses">Diproses</option>
                        <option value="selesai">Selesai</option>
                        <option value="dibatalkan">Dibatalkan</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* FLOATING ACTION BUTTON (FAB) + TAMBAH POST SESUAI WIREFRAME */}
      {/* ========================================================== */}
      <div className="fixed bottom-6 right-6 sm:right-10 z-40">
        <button
          onClick={() => {
            resetWizard();
            setShowPostWizard(true);
          }}
          className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl flex items-center gap-2.5 font-extrabold text-sm border-2 border-white hover:scale-105 transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span>Tambah Post</span>
        </button>
      </div>

      {/* ========================================================== */}
      {/* 4-STEP POSTING WIZARD MODAL (PERSIS SESUAI BAGAN WIREFRAME) */}
      {/* ========================================================== */}
      {showPostWizard && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPostWizard(false);
          }}
        >
          <div className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header Wizard (Always visible & sticky at top) */}
            <div className="shrink-0 bg-gradient-to-r from-emerald-700 to-teal-800 p-4 sm:p-5 text-white flex items-center justify-between shadow-xs select-none">
              <button
                type="button"
                onClick={() => {
                  if (wizardStep === 'fill-detail') {
                    setWizardStep('pick-media');
                  } else {
                    setShowPostWizard(false);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white transition-all flex items-center gap-1.5 text-xs font-bold"
                title="Kembali"
                aria-label="Kembali"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{wizardStep === 'fill-detail' ? 'Pilih Media' : 'Kembali'}</span>
              </button>
              
              <div className="text-center px-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200 block">
                  {wizardStep === 'pick-media' ? 'Langkah 1: PILIH MEDIA' : 'Langkah 2: ISI DETAIL'}
                </span>
                <h3 className="font-extrabold text-sm sm:text-base tracking-wide uppercase">
                  {wizardStep === 'pick-media' ? 'Upload / Pilih Foto' : 'Detail Postingan'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowPostWizard(false)}
                className="p-2 rounded-xl bg-white/15 hover:bg-rose-500 hover:text-white active:bg-rose-600 transition-all text-white"
                title="Tutup Modal"
                aria-label="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: PILIH MEDIA */}
            {wizardStep === 'pick-media' && (
              <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6 overscroll-contain">
                
                {/* Upload Camera / File Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-sky-50 hover:bg-sky-100/70 border-2 border-dashed border-sky-300 rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-sky-200/60 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-stone-900">Ambil Foto / Upload dari Perangkat</p>
                    <p className="text-xs text-stone-500 mt-0.5">Mendukung format JPG, PNG langsung dari lokasi destinasi</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Selected Preview if any */}
                {selectedImage && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700">Foto Terpilih:</span>
                      <span className="text-[10px] text-emerald-700 font-bold">Siap Digunakan ✓</span>
                    </div>
                    <div className="relative h-40 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-sm">
                      <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {/* Preset Galeri Foto Riil Lembang */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
                      GALERI FOTO AKTUAL DESA
                    </span>
                    <span className="text-[11px] text-stone-500">Pilih dari koleksi riil</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {LEMBANG_GALLERY_PRESETS.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => setSelectedImage(preset.url)}
                        className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedImage === preset.url
                            ? 'border-emerald-600 ring-2 ring-emerald-400 scale-95'
                            : 'border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        {selectedImage === preset.url && (
                          <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white stroke-[3]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPostWizard(false)}
                    className="px-4 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl text-xs transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardStep('fill-detail')}
                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Lanjut Isi Detail Postingan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ISI DETAIL */}
            {wizardStep === 'fill-detail' && (
              <form onSubmit={handlePublishPost} className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-4 text-left overscroll-contain">
                
                {/* Photo Preview in Step 2 Header */}
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <img src={selectedImage} alt="Foto terpilih" className="w-16 h-16 rounded-xl object-cover border" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-stone-900">Foto Destinasi Terpilih</p>
                    <button
                      type="button"
                      onClick={() => setWizardStep('pick-media')}
                      className="text-[11px] font-bold text-emerald-700 hover:underline mt-0.5"
                    >
                      Ganti Foto Lain ↺
                    </button>
                  </div>
                </div>

                {/* JUDUL */}
                <div>
                  <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-1">
                    JUDUL POSTINGAN
                  </label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Contoh: Kamar Melati Homestay"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* DESKRIPSI */}
                <div>
                  <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-1">
                    DESKRIPSI
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={postDescription}
                    onChange={(e) => setPostDescription(e.target.value)}
                    placeholder="Contoh: Kamar nyaman bersih, include sarapan liwet hangat"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* HARGA (Rp) & UNIT */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-1">
                      HARGA (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={postPrice}
                      onChange={(e) => setPostPrice(Number(e.target.value))}
                      placeholder="250000"
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-1">
                      SATUAN
                    </label>
                    <select
                      value={postUnit}
                      onChange={(e) => setPostUnit(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="/malam">/malam (Homestay)</option>
                      <option value="/orang">/orang (Paket Wisata)</option>
                      <option value="/pack">/pack (Kopi/Olahan)</option>
                      <option value="/kg">/kg (Sayur/Buah)</option>
                      <option value="/pcs">/pcs (Suvenir/Kerajinan)</option>
                    </select>
                  </div>
                </div>

                {/* STOK / JUMLAH */}
                <div>
                  <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-1">
                    STOK / JUMLAH KUOTA
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={postStock}
                    onChange={(e) => setPostStock(Number(e.target.value))}
                    placeholder="Contoh: 3 kamar tersedia / 20 kuota"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* PILIH KATEGORI (Checkboxes / Pills persis wireframe) */}
                <div>
                  <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-1.5">
                    PILIH KATEGORI
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'homestay', label: 'Homestay', icon: <BedDouble className="w-3.5 h-3.5" /> },
                      { id: 'umkm', label: 'Produk Lokal', icon: <Store className="w-3.5 h-3.5" /> },
                      { id: 'paket-wisata', label: 'Paket Wisata', icon: <TreePine className="w-3.5 h-3.5" /> },
                      { id: 'kuliner', label: 'Kopi & Kuliner', icon: <Coffee className="w-3.5 h-3.5" /> },
                      { id: 'suvenir', label: 'Suvenir Kayu', icon: <Palette className="w-3.5 h-3.5" /> },
                      { id: 'destinasi', label: 'Tiket Wisata', icon: <Compass className="w-3.5 h-3.5" /> }
                    ].map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setPostCategory(cat.id as ProductCategory)}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                          postCategory === cat.id
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {cat.icon}
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* POSTING BUTTON */}
                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setWizardStep('pick-media')}
                    className="px-4 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl text-xs transition-colors"
                  >
                    ← Ganti Foto
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-2xl text-xs sm:text-sm shadow-xl transition-all hover:scale-[1.01] tracking-wider uppercase"
                  >
                    POSTING SEKARANG
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* ADVANCED EDIT MODAL FOR LISTINGS & PHOTO UPDATE */}
      {/* ========================================================== */}
      {editingProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingProduct(null);
          }}
        >
          <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="shrink-0 bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-emerald-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md shrink-0">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-emerald-900/80 px-2 py-0.5 rounded-md border border-emerald-700/50">
                      PIC {currentVillage.name}
                    </span>
                    <span className="text-[10px] text-stone-400">ID: #{editingProduct.id}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-serif-title truncate max-w-md mt-0.5">
                    Edit Detail & Foto: {editingProduct.title || 'Produk'}
                  </h3>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => setEditingProduct(null)} 
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-stone-300 hover:text-white transition-all cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - 2 Column Responsive Grid */}
            <form onSubmit={handleEditSubmit} className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6 text-left text-xs overscroll-contain">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left 7 Cols: Form Inputs */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* --- PHOTO MANAGER SECTION --- */}
                  <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-emerald-800" />
                        <span className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">
                          1. Foto Aktual Produk / Homestay
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Resolusi Tinggi
                      </span>
                    </div>

                    {/* Active Photo Preview & Controls */}
                    <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-emerald-600/40 bg-stone-900 h-48 group">
                      <img
                        src={editingProduct.image}
                        alt={editingProduct.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end justify-between p-3">
                        <div className="text-white">
                          <p className="text-[10px] text-amber-300 font-bold uppercase">Foto Utama Aktif</p>
                          <p className="text-xs font-semibold truncate max-w-[200px]">{editingProduct.title}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => editFileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-[11px] flex items-center gap-1.5 shadow-md transition-transform hover:scale-105 cursor-pointer"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Ganti dari File</span>
                        </button>
                      </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileUpload}
                      className="hidden"
                    />

                    {/* Photo Source Selector Tabs */}
                    <div className="space-y-2">
                      <div className="flex bg-stone-200/80 p-1 rounded-xl gap-1">
                        <button
                          type="button"
                          onClick={() => setEditImageTab('gallery')}
                          className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                            editImageTab === 'gallery' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'
                          }`}
                        >
                          🏞️ Galeri Lembang ({LEMBANG_GALLERY_PRESETS.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditImageTab('upload')}
                          className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                            editImageTab === 'upload' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'
                          }`}
                        >
                          📸 Kamera / Upload
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditImageTab('url')}
                          className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                            editImageTab === 'url' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'
                          }`}
                        >
                          🔗 URL Gambar
                        </button>
                      </div>

                      {/* Tab 1: Galeri Lembang */}
                      {editImageTab === 'gallery' && (
                        <div className="space-y-2 pt-1">
                          <p className="text-[10px] text-stone-500 font-medium">
                            Pilih salah satu foto riil destinasi & homestay di Kawasan Lembang:
                          </p>
                          <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-stone-200">
                            {LEMBANG_GALLERY_PRESETS.map((preset) => {
                              const isSelected = editingProduct.image === preset.url;
                              return (
                                <button
                                  key={preset.id}
                                  type="button"
                                  onClick={() => handleEditSelectGalleryPreset(preset.url)}
                                  className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                                    isSelected ? 'border-amber-500 ring-2 ring-amber-400' : 'border-transparent hover:border-emerald-600'
                                  }`}
                                >
                                  <img
                                    src={preset.url}
                                    alt={preset.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                  />
                                  {isSelected && (
                                    <div className="absolute inset-0 bg-emerald-900/60 flex items-center justify-center text-amber-300 font-black text-xs">
                                      <Check className="w-4 h-4 stroke-[3]" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Tab 2: Upload Device */}
                      {editImageTab === 'upload' && (
                        <div className="p-4 bg-white rounded-xl border border-stone-200 text-center space-y-2">
                          <p className="text-xs text-stone-600">
                            Unggah foto aktual langsung dari galeri HP, kamera, atau komputer Anda:
                          </p>
                          <button
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-xs"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Buka Kamera / Pilih File Foto</span>
                          </button>
                        </div>
                      )}

                      {/* Tab 3: URL Input */}
                      {editImageTab === 'url' && (
                        <div className="space-y-1 pt-1">
                          <label className="text-[10px] font-bold text-stone-600">Tautan Gambar Langsung (HTTPS URL):</label>
                          <input
                            type="url"
                            value={editingProduct.image}
                            onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* --- BASIC INFORMATION --- */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                    <span className="font-extrabold text-stone-900 text-xs uppercase tracking-wider block">
                      2. Informasi Utama Produk
                    </span>

                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Judul Produk / Homestay*</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.title}
                        onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                        placeholder="Contoh: Kopi Arabika Specialty Suntenjaya 250gr"
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      />
                    </div>

                    {/* Category Selector Pills */}
                    <div>
                      <label className="font-bold text-stone-800 block mb-1.5">Kategori Produk</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'homestay', label: '🏡 Homestay' },
                          { id: 'paket-wisata', label: '🌲 Paket Wisata' },
                          { id: 'kuliner', label: '🍲 Kuliner' },
                          { id: 'umkm', label: '📦 Produk Lokal' },
                          { id: 'suvenir', label: '🎁 Suvenir' },
                          { id: 'destinasi', label: '🎫 Destinasi' }
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setEditingProduct({ ...editingProduct, category: cat.id as ProductCategory })}
                            className={`py-2 px-2 text-center text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                              editingProduct.category === cat.id
                                ? 'bg-emerald-800 text-amber-200 border-emerald-900 shadow-xs'
                                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Deskripsi Lengkap*</label>
                      <textarea
                        rows={3}
                        required
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        placeholder="Jelaskan keunikan, fasilitas, atau rasa dari produk/destinasi ini..."
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* --- PRICE, STOCK & UNIT --- */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                    <span className="font-extrabold text-stone-900 text-xs uppercase tracking-wider block">
                      3. Harga, Satuan & Stok
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-bold text-stone-800 block mb-1">Harga Jual (Rp)*</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                          className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-emerald-800 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-stone-800 block mb-1">Satuan</label>
                        <select
                          value={editingProduct.unit}
                          onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                          className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-semibold text-stone-800 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none cursor-pointer"
                        >
                          <option value="/malam">/malam (Homestay)</option>
                          <option value="/paket">/paket (Wisata/Tour)</option>
                          <option value="/pcs">/pcs (Barang/Suvenir)</option>
                          <option value="/porsi">/porsi (Kuliner)</option>
                          <option value="/kg">/kg (Sayur/Kopi)</option>
                          <option value="/orang">/orang (Tiket/Peserta)</option>
                          <option value="/botol">/botol (Susu/Minuman)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-stone-800 block mb-1">Stok / Kuota*</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={editingProduct.stockQuota}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stockQuota: Number(e.target.value) })}
                          className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Highlights / Fasilitas */}
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">
                        Poin Keunggulan / Fasilitas (Pisahkan dengan koma):
                      </label>
                      <input
                        type="text"
                        value={editHighlightsText}
                        onChange={(e) => setEditHighlightsText(e.target.value)}
                        placeholder="Contoh: Single Origin, Pemandangan Lereng, WiFi, Sarapan Sunda"
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-800 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      />
                    </div>
                  </div>

                </div>

                {/* Right 5 Cols: Live Card Preview & Info */}
                <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-2">
                  
                  <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Live Marketplace Preview</span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Begini tampilan produk yang akan dilihat langsung oleh wisatawan di halaman katalog:
                    </p>
                  </div>

                  {/* Card Simulation */}
                  <div className="bg-white rounded-3xl border border-stone-200 shadow-lg overflow-hidden flex flex-col group">
                    <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                      <img
                        src={editingProduct.image}
                        alt={editingProduct.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-800 text-amber-200 shadow-md">
                          {editingProduct.category}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white p-1 rounded-full shadow-md" title="Konten Terverifikasi PIC">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 bg-stone-950/75 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-amber-300">
                        {editingProduct.stockQuota} kuota tersedia
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                          {currentVillage.name}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm mt-0.5 line-clamp-1">
                          {editingProduct.title || 'Judul Produk'}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                          {editingProduct.description || 'Deskripsi produk...'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-stone-400 font-semibold uppercase">Harga Pemesanan</p>
                          <p className="text-base font-extrabold text-emerald-800">
                            {formatRupiah(editingProduct.price)}
                            <span className="text-xs text-stone-500 font-normal"> {editingProduct.unit}</span>
                          </p>
                        </div>
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-lg">
                          Aktif PIC
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Modal Footer Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-full sm:w-auto px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan & Foto</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
