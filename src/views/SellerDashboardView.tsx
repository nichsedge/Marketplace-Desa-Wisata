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
  UploadCloud,
  BarChart3,
  MessageCircle,
  Activity,
  Play,
  Video,
  Star
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
    showToast,
    confirmOrderDeal,
    cancelOrder,
    getVillageAnalytics,
    analyticsEvents,
    language,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState<'feed' | 'profile' | 'orders' | 'analytics'>('feed');
  const [feedCategoryFilter, setFeedCategoryFilter] = useState<ProductCategory | 'all'>('all');
  
  // Current active village for PIC
  const activeVillageId = currentUser?.picVillageId || currentUser?.villageName ? 
    (villages.find(v => v.name === currentUser?.villageName || v.id === currentUser?.picVillageId)?.id || 'des-01') : 'des-01';
  
  const currentVillage = villages.find(v => v.id === activeVillageId) || villages[0];
  const villageProducts = products.filter(p => p.villageId === currentVillage.id);
  const filteredVillageProducts = feedCategoryFilter === 'all' 
    ? villageProducts 
    : villageProducts.filter(p => p.category === feedCategoryFilter);

  const analyticsStats = getVillageAnalytics(currentVillage.id);

  // Edit village profile state
  const [editVillageName, setEditVillageName] = useState(currentVillage.name);
  const [editVillageDesc, setEditVillageDesc] = useState(currentVillage.description);
  const [editVillageHistory, setEditVillageHistory] = useState(currentVillage.history);
  const [editVillagePhone, setEditVillagePhone] = useState(currentVillage.contactPhone);
  const [editVillageManager, setEditVillageManager] = useState(currentVillage.managerName);
  const [editVillageImage, setEditVillageImage] = useState(currentVillage.image);

  // Sync profile fields when switching between different Admin Desa accounts
  useEffect(() => {
    setEditVillageName(currentVillage.name);
    setEditVillageDesc(currentVillage.description);
    setEditVillageHistory(currentVillage.history);
    setEditVillagePhone(currentVillage.contactPhone);
    setEditVillageManager(currentVillage.managerName);
    setEditVillageImage(currentVillage.image);
  }, [currentVillage.id]);

  // Modal Posting Flow State (Wireframe 4-step wizard)
  const [showPostWizard, setShowPostWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<'pick-media' | 'fill-detail'>('pick-media');
  
  // Post Wizard Form State - Unified Media (Multiple Images + Video + Main Selection)
  const [wizardImages, setWizardImages] = useState<string[]>([LEMBANG_GALLERY_PRESETS[0].url]);
  const [wizardMainImage, setWizardMainImage] = useState<string>(LEMBANG_GALLERY_PRESETS[0].url);
  const [wizardMediaTab, setWizardMediaTab] = useState<'upload' | 'gallery' | 'video'>('upload');
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postPrice, setPostPrice] = useState<number>(250000);
  const [postUnit, setPostUnit] = useState('/malam');
  const [postStock, setPostStock] = useState<number>(3);
  const [postCategory, setPostCategory] = useState<ProductCategory>('homestay');
  const [postVideoUrl, setPostVideoUrl] = useState('');
  
  // Editing existing product state - Unified Media (Multiple Images + Video + Main Selection)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editImageTab, setEditImageTab] = useState<'upload' | 'gallery' | 'video' | 'url'>('upload');
  const [editHighlightsText, setEditHighlightsText] = useState<string>('');
  const [editImageUrlInput, setEditImageUrlInput] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize highlights text & gallery whenever editingProduct opens
  const openEditProductModal = (product: Product) => {
    const rawGallery = Array.from(new Set([
      product.image,
      ...(product.gallery || [])
    ])).filter(Boolean);

    setEditingProduct({
      ...product,
      image: product.image || rawGallery[0] || LEMBANG_GALLERY_PRESETS[0].url,
      gallery: rawGallery.length > 0 ? rawGallery : [product.image || LEMBANG_GALLERY_PRESETS[0].url],
      videoUrl: product.videoUrl || ''
    });
    setEditHighlightsText(product.highlights?.join(', ') || '');
    setEditImageUrlInput('');
    setEditImageTab('upload');
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

  // Handle local image file upload for new post (Base64) - Supports Multiple Files
  const handleWizardMultiUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      const readPromises = fileList.map((file: File) => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') resolve(reader.result);
        };
        reader.readAsDataURL(file);
      }));

      Promise.all(readPromises).then((newImages) => {
        const validImages = newImages.filter(Boolean);
        if (validImages.length > 0) {
          setWizardImages(prev => {
            const combined = [...prev, ...validImages];
            return combined;
          });
          if (!wizardMainImage || !wizardImages.includes(wizardMainImage)) {
            setWizardMainImage(validImages[0]);
          }
          showToast(`${validImages.length} foto berhasil ditambahkan!`, 'success');
        }
      });
      // reset input value so re-selecting same file triggers onChange
      e.target.value = '';
    }
  };

  const handleWizardTogglePreset = (url: string) => {
    if (wizardImages.includes(url)) {
      if (wizardImages.length === 1) {
        showToast('Minimal harus ada 1 foto untuk postingan.', 'info');
        return;
      }
      const updated = wizardImages.filter(img => img !== url);
      setWizardImages(updated);
      if (wizardMainImage === url) {
        setWizardMainImage(updated[0]);
      }
    } else {
      setWizardImages(prev => [...prev, url]);
      if (!wizardMainImage) setWizardMainImage(url);
      showToast('Foto ditambahkan ke koleksi!', 'info');
    }
  };

  const handleWizardRemoveImage = (indexToRemove: number) => {
    if (wizardImages.length <= 1) {
      showToast('Minimal harus ada 1 foto untuk postingan.', 'info');
      return;
    }
    const targetUrl = wizardImages[indexToRemove];
    const updated = wizardImages.filter((_, idx) => idx !== indexToRemove);
    setWizardImages(updated);
    if (wizardMainImage === targetUrl) {
      setWizardMainImage(updated[0]);
    }
  };

  // Handle local image file upload for editing product (Base64) - Supports Multiple Files
  const handleEditMultiUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && editingProduct) {
      const fileList = Array.from(files);
      const readPromises = fileList.map((file: File) => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') resolve(reader.result);
        };
        reader.readAsDataURL(file);
      }));

      Promise.all(readPromises).then((newImages) => {
        const validImages = newImages.filter(Boolean);
        if (validImages.length > 0) {
          const currentGal = editingProduct.gallery || [editingProduct.image];
          const updatedGal = [...currentGal, ...validImages];
          setEditingProduct({
            ...editingProduct,
            gallery: updatedGal
          });
          showToast(`${validImages.length} foto berhasil ditambahkan ke galeri!`, 'success');
        }
      });
      e.target.value = '';
    }
  };

  const handleEditTogglePreset = (url: string) => {
    if (!editingProduct) return;
    const currentGal = editingProduct.gallery || [editingProduct.image];
    if (currentGal.includes(url)) {
      if (currentGal.length <= 1) {
        showToast('Minimal harus ada 1 foto dalam galeri.', 'info');
        return;
      }
      const updated = currentGal.filter(img => img !== url);
      setEditingProduct({
        ...editingProduct,
        image: editingProduct.image === url ? updated[0] : editingProduct.image,
        gallery: updated
      });
    } else {
      setEditingProduct({
        ...editingProduct,
        gallery: [...currentGal, url]
      });
      showToast('Foto ditambahkan ke galeri produk!', 'info');
    }
  };

  const handleEditRemoveImage = (imgUrl: string) => {
    if (!editingProduct) return;
    const currentGal = editingProduct.gallery || [editingProduct.image];
    if (currentGal.length <= 1) {
      showToast('Minimal harus ada 1 foto dalam galeri produk.', 'info');
      return;
    }
    const updated = currentGal.filter(img => img !== imgUrl);
    setEditingProduct({
      ...editingProduct,
      image: editingProduct.image === imgUrl ? updated[0] : editingProduct.image,
      gallery: updated
    });
    showToast('Foto dihapus dari galeri.', 'info');
  };

  const handleAddImageUrlToEditGallery = () => {
    if (!editImageUrlInput.trim() || !editingProduct) return;
    const url = editImageUrlInput.trim();
    const currentGal = editingProduct.gallery || [editingProduct.image];
    if (currentGal.includes(url)) {
      showToast('URL foto sudah ada di galeri.', 'info');
      return;
    }
    setEditingProduct({
      ...editingProduct,
      gallery: [...currentGal, url]
    });
    setEditImageUrlInput('');
    showToast('Foto URL berhasil ditambahkan ke galeri!', 'success');
  };

  // Submit new post from wizard
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) {
      showToast('Mohon masukkan judul postingan.', 'error');
      return;
    }

    const safeGallery = wizardImages.length > 0 ? wizardImages : [LEMBANG_GALLERY_PRESETS[0].url];
    const safeMainImage = wizardMainImage && safeGallery.includes(wizardMainImage)
      ? wizardMainImage
      : safeGallery[0];

    addProduct({
      title: postTitle,
      category: postCategory,
      price: Number(postPrice),
      unit: postUnit,
      villageId: currentVillage.id,
      villageName: currentVillage.name,
      location: currentVillage.location,
      sellerName: currentUser?.sellerName || currentUser?.name || currentVillage.managerName,
      sellerBadge: 'Admin Desa Terverifikasi',
      sellerAvatar: currentUser?.avatar || '/images/default-avatar.svg',
      sellerPhone: currentUser?.phone || currentVillage.contactPhone,
      image: safeMainImage,
      gallery: safeGallery,
      videoUrl: postVideoUrl.trim() || undefined,
      description: postDescription || 'Konten dan penawaran aktual dari Desa Wisata.',
      highlights: ['Foto Asli Lokasi', 'Dikelola Langsung Admin Desa', 'Kualitas Terjamin'],
      stockQuota: Number(postStock),
      isAvailable: true,
      isFeatured: false
    });

    setShowPostWizard(false);
    resetWizard();
  };

  const resetWizard = () => {
    setWizardStep('pick-media');
    setWizardImages([LEMBANG_GALLERY_PRESETS[0].url]);
    setWizardMainImage(LEMBANG_GALLERY_PRESETS[0].url);
    setWizardMediaTab('upload');
    setPostTitle('');
    setPostDescription('');
    setPostPrice(250000);
    setPostStock(3);
    setPostCategory('homestay');
    setPostVideoUrl('');
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

    const safeGallery = editingProduct.gallery && editingProduct.gallery.length > 0
      ? editingProduct.gallery
      : [editingProduct.image];

    const safeMainImage = safeGallery.includes(editingProduct.image)
      ? editingProduct.image
      : safeGallery[0];

    const updated: Product = {
      ...editingProduct,
      image: safeMainImage,
      gallery: safeGallery,
      videoUrl: editingProduct.videoUrl?.trim() || undefined,
      highlights: parsedHighlights.length > 0 ? parsedHighlights : editingProduct.highlights,
    };

    updateProduct(updated);
    showToast(`Data produk "${updated.title}" dan koleksi media berhasil diperbarui!`, 'success');
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
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-stone-200 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-bold border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>
              {language === 'en' ? 'Restricted Access: Village Admin Only' : 'Akses Terbatas: Khusus Admin Desa'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-serif-title text-stone-900">
            {language === 'en' ? 'Tourism Village Admin Dashboard' : 'Dasbor Pengelola Desa Wisata'}
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            {language === 'en'
              ? 'This dashboard is reserved for authorized Village Admins across Lembang Region to manage catalogs, real media, and bookings. General visitors can explore and shop directly without logging in.'
              : 'Halaman ini khusus diperuntukkan bagi Admin Desa resmi di Kawasan Lembang untuk mengelola katalog, foto aktual, dan pesanan. Wisatawan umum dapat langsung berbelanja tanpa perlu login.'}
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => navigateTo('auth')}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>{language === 'en' ? 'Sign In to Village Admin Portal' : 'Masuk ke Portal Admin Desa'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Desa Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-emerald-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-amber-400 text-stone-950 font-bold rounded-full text-xs shadow-xs">
              {currentVillage.villageAltitude || '1.250 mdpl'}
            </span>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-200 text-xs font-medium border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Sistem Admin Desa Resmi · Saba Lembang</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-title">
            Portal Admin {currentVillage.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
            Admin Aktif: <strong className="text-amber-300">{currentUser?.name || currentVillage.managerName}</strong> · Kelola konten riil destinasi, foto aktual, dan pesanan wisatawan.
          </p>
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
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-semibold uppercase">Pendapatan Deal</p>
            <p className="text-sm sm:text-lg font-black text-stone-900">{formatRupiah(analyticsStats.totalRevenue)}</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-semibold uppercase">Chat WA Masuk (Leads)</p>
            <p className="text-sm sm:text-lg font-black text-stone-900">{analyticsStats.totalWaChats} Chat</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-semibold uppercase">Total Tap Produk</p>
            <p className="text-sm sm:text-lg font-black text-stone-900">{analyticsStats.totalViews} Kali Dilihat</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-semibold uppercase">Konversi Penjualan</p>
            <p className="text-sm sm:text-lg font-black text-emerald-800">{analyticsStats.conversionRate}% ({analyticsStats.totalCompletedDeals} Deal)</p>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'feed'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Postingan Desa ({villageProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
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
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Pesanan Wisatawan ({villageOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Analitik & Interaksi Pengunjung</span>
        </button>
      </div>

      {/* ========================================================== */}
      {/* TAB 1: FEED POSTINGAN DESA (FLOW WIREFRAME SESUAI GAMBAR) */}
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
              const badge = getCategoryBadge(p.category, language);
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

                    {/* Status Centang Hijau Terverifikasi Admin */}
                    <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white p-1 rounded-full shadow-md" title="Konten Terverifikasi Admin Desa">
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
              Status Admin Desa Terverifikasi
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
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama Admin / Pengelola Desa</label>
                <input
                  type="text"
                  value={editVillageManager}
                  onChange={(e) => setEditVillageManager(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nomor WhatsApp Resmi Admin Desa</label>
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
                  <th className="p-3">ID & Sumber</th>
                  <th className="p-3">Pemesan</th>
                  <th className="p-3">Item Dipesan</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {villageOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3">
                      <p className="font-mono font-bold text-stone-900">{o.id}</p>
                      <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full mt-1 ${
                        o.source === 'direct_wa' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {o.source === 'direct_wa' ? '💬 WhatsApp Lead' : '🛒 Web Cart'}
                      </span>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-stone-900">{o.customerName}</p>
                      <p className="text-[10px] text-stone-500">{o.customerPhone}</p>
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
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        o.status === 'selesai' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        o.status === 'diproses' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        o.status === 'menunggu' ? 'bg-sky-100 text-sky-900 border border-sky-300' :
                        'bg-stone-100 text-stone-700'
                      }`}>
                        {o.status === 'selesai' ? '✅ SELESAI / DEAL' :
                         o.status === 'menunggu' ? '⏳ MENUNGGU WA' :
                         o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {o.status !== 'selesai' && (
                          <button
                            type="button"
                            onClick={() => confirmOrderDeal(o.id)}
                            className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] shadow-xs flex items-center gap-1 cursor-pointer transition-transform hover:scale-102"
                            title="Konfirmasi tamu telah membayar/deal via WhatsApp"
                          >
                            <Check className="w-3 h-3" />
                            <span>Deal / Lunas</span>
                          </button>
                        )}
                        {o.status !== 'dibatalkan' && o.status !== 'selesai' && (
                          <button
                            type="button"
                            onClick={() => cancelOrder(o.id)}
                            className="px-2 py-1.5 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 rounded-lg font-semibold text-[11px] border border-stone-200 cursor-pointer"
                            title="Tandai pesanan batal"
                          >
                            Batal
                          </button>
                        )}
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="p-1 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none"
                        >
                          <option value="menunggu">Menunggu</option>
                          <option value="diproses">Diproses</option>
                          <option value="selesai">Selesai</option>
                          <option value="dibatalkan">Dibatalkan</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 4: ANALITIK & CORONG KONVERSI (OPTION A ZERO-COST) */}
      {/* ========================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Activity className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-stone-900 text-base sm:text-lg font-serif-title">
                  Statistik & Corong Konversi Pengunjung ({currentVillage.name})
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Lacak interaksi nyata pengunjung: dari membuka halaman produk (Tap), mencari kata kunci, mengklik chat WhatsApp, hingga konfirmasi transaksi pembelian deal.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero-Cost Serverless Tracking</span>
              </span>
            </div>
          </div>

          {/* 5 Funnel Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">1. Tap Produk</span>
              <p className="text-xl sm:text-2xl font-black text-stone-900">{analyticsStats.totalViews}</p>
              <p className="text-[10px] text-stone-500">Kunjungan produk dilihat</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">2. Pencarian</span>
              <p className="text-xl sm:text-2xl font-black text-stone-900">{analyticsStats.totalSearches}</p>
              <p className="text-[10px] text-stone-500">Kueri kata kunci dicari</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">3. Chat WA (Leads)</span>
              <p className="text-xl sm:text-2xl font-black text-amber-700">{analyticsStats.totalWaChats}</p>
              <p className="text-[10px] text-stone-500">Calon pembeli klik WA</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">4. Deal Terjual</span>
              <p className="text-xl sm:text-2xl font-black text-emerald-800">{analyticsStats.totalCompletedDeals}</p>
              <p className="text-[10px] text-stone-500">Dikonfirmasi Admin</p>
            </div>

            <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-emerald-800 to-emerald-950 p-4 rounded-2xl text-white shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">5. Rasio Konversi</span>
              <p className="text-xl sm:text-2xl font-black text-amber-300">{analyticsStats.conversionRate}%</p>
              <p className="text-[10px] text-emerald-200">Deals / Chat WA</p>
            </div>
          </div>

          {/* 2 Grid Tables: Top Searches & Top Viewed Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Searches */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-700" />
                  <span>Kata Kunci Paling Sering Dicari</span>
                </h4>
                <span className="text-[10px] font-bold text-stone-400 uppercase">Frekuensi</span>
              </div>
              {analyticsStats.topSearches.length > 0 ? (
                <div className="space-y-2">
                  {analyticsStats.topSearches.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-emerald-50/50 transition-colors text-xs">
                      <span className="font-bold text-stone-800 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-600 text-[10px] flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <span>"{s.query}"</span>
                      </span>
                      <span className="font-extrabold text-emerald-800 bg-white px-2.5 py-0.5 rounded-lg border border-stone-200">
                        {s.count}x dicari
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic py-4 text-center">Belum ada data pencarian yang terekam.</p>
              )}
            </div>

            {/* Top Viewed Products */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-700" />
                  <span>Produk Paling Banyak Dilihat (Tap)</span>
                </h4>
                <span className="text-[10px] font-bold text-stone-400 uppercase">Kunjungan</span>
              </div>
              {analyticsStats.topViewedProducts.length > 0 ? (
                <div className="space-y-2">
                  {analyticsStats.topViewedProducts.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-emerald-50/50 transition-colors text-xs">
                      <span className="font-bold text-stone-800 truncate max-w-[200px] sm:max-w-[250px] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-600 text-[10px] flex items-center justify-center font-mono shrink-0">
                          {idx + 1}
                        </span>
                        <span className="truncate">{p.title}</span>
                      </span>
                      <span className="font-extrabold text-emerald-800 bg-white px-2.5 py-0.5 rounded-lg border border-stone-200 shrink-0">
                        {p.views}x tap
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic py-4 text-center">Belum ada kunjungan produk yang terekam.</p>
              )}
            </div>
          </div>

          {/* Live Visitor Activity Stream */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-700" />
                  <span>Feed Interaksi Real-Time Wisatawan</span>
                </h4>
                <p className="text-xs text-stone-500">Aktivitas terkini yang dilakukan pengunjung di web Saba Lembang.</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Live Data
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {analyticsEvents.slice(0, 10).map((ev) => (
                <div key={ev.id} className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`p-1.5 rounded-xl ${
                      ev.type === 'deal_completed' ? 'bg-emerald-100 text-emerald-800' :
                      ev.type === 'wa_chat' ? 'bg-amber-100 text-amber-900' :
                      ev.type === 'search' ? 'bg-sky-100 text-sky-800' :
                      'bg-stone-200 text-stone-700'
                    }`}>
                      {ev.type === 'deal_completed' ? <CheckCircle2 className="w-4 h-4" /> :
                       ev.type === 'wa_chat' ? <MessageCircle className="w-4 h-4" /> :
                       ev.type === 'search' ? <Search className="w-4 h-4" /> :
                       <Eye className="w-4 h-4" />}
                    </span>
                    <div>
                      <p className="font-bold text-stone-900">
                        {ev.type === 'deal_completed' ? `Transaksi Berhasil / Deal (${formatRupiah(ev.amount)})` :
                         ev.type === 'wa_chat' ? `Pengunjung Chat WhatsApp (${ev.productTitle || 'Produk'})` :
                         ev.type === 'search' ? `Pencarian kata kunci: "${ev.query}"` :
                         `Pengunjung membuka detail: "${ev.productTitle || 'Produk'}"`}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {ev.villageName || currentVillage.name}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-stone-400 font-mono shrink-0">
                    {new Date(ev.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="post-wizard-title"
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
                  {wizardStep === 'pick-media' ? 'Langkah 1: KELOLA MEDIA' : 'Langkah 2: ISI DETAIL'}
                </span>
                <h3 id="post-wizard-title" className="font-extrabold text-sm sm:text-base tracking-wide uppercase">
                  {wizardStep === 'pick-media' ? 'Koleksi Media (Foto & Video)' : 'Detail Postingan'}
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

            {/* STEP 1: PILIH & KELOLA MEDIA TERPADU */}
            {wizardStep === 'pick-media' && (
              <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6 overscroll-contain">
                
                {/* 1. SELECTED MEDIA TRAY (Daftar Media Terpilih & Pemilihan Konten Utama) */}
                <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-stone-900 uppercase tracking-wider block">
                        Media Terpilih ({wizardImages.length} Foto{postVideoUrl ? ' + 1 Video' : ''})
                      </span>
                      <p className="text-[11px] text-stone-500">
                        Klik <strong>"Jadikan Utama"</strong> untuk memilih foto yang tampil sebagai cover depan.
                      </p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                      ✓ Siap Diposting
                    </span>
                  </div>

                  {/* Horizontal Scrollable Thumbnails Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                    {wizardImages.map((imgUrl, idx) => {
                      const isMain = wizardMainImage === imgUrl;
                      return (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all bg-stone-900 flex flex-col justify-between group ${
                            isMain
                              ? 'border-amber-400 ring-2 ring-amber-400/60 shadow-md'
                              : 'border-stone-200 hover:border-emerald-600'
                          }`}
                        >
                          <div className="relative h-24 w-full overflow-hidden">
                            <img src={imgUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                            {isMain && (
                              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-amber-400 text-stone-950 font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 text-stone-950" />
                                <span>Cover Utama</span>
                              </span>
                            )}
                            {wizardImages.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleWizardRemoveImage(idx)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-stone-950/70 hover:bg-rose-600 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                                title="Hapus foto ini"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          <div className="p-1.5 bg-white border-t border-stone-100 flex items-center justify-between">
                            <span className="text-[10px] text-stone-500 font-bold">#{idx + 1}</span>
                            {!isMain ? (
                              <button
                                type="button"
                                onClick={() => setWizardMainImage(imgUrl)}
                                className="px-2 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                              >
                                Jadikan Cover
                              </button>
                            ) : (
                              <span className="text-[10px] text-amber-600 font-bold">★ Cover Aktif</span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Video Card if URL is provided */}
                    {postVideoUrl && (
                      <div className="relative rounded-xl overflow-hidden border-2 border-rose-400 bg-stone-900 flex flex-col justify-between p-2 text-white">
                        <div className="flex items-center justify-between">
                          <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-white" />
                            <span>Video</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setPostVideoUrl('')}
                            className="w-5 h-5 rounded-full bg-white/20 hover:bg-rose-600 text-white flex items-center justify-center text-[10px] transition-colors"
                            title="Hapus video"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="py-2 text-center">
                          <Play className="w-6 h-6 fill-rose-500 text-rose-500 mx-auto" />
                          <p className="text-[10px] font-mono text-stone-300 truncate max-w-[120px] mt-1 mx-auto">
                            {postVideoUrl}
                          </p>
                        </div>
                        <span className="text-[9px] text-emerald-300 font-semibold text-center">
                          Tampil di galeri detail
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. MEDIA INPUT TABS (UPLOAD / GALERI / VIDEO) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
                      TAMBAH MEDIA BARU
                    </span>
                    <span className="text-[10px] text-stone-500">Mendukung multi-foto & video</span>
                  </div>

                  <div className="flex bg-stone-100 p-1 rounded-2xl gap-1 border border-stone-200">
                    <button
                      type="button"
                      onClick={() => setWizardMediaTab('upload')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        wizardMediaTab === 'upload' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload (Bisa Banyak)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardMediaTab('gallery')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        wizardMediaTab === 'gallery' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Galeri Lembang</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardMediaTab('video')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        wizardMediaTab === 'video' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Link Video</span>
                    </button>
                  </div>

                  {/* Tab 1: Upload Multiple Files from Device */}
                  {wizardMediaTab === 'upload' && (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-sky-50 hover:bg-sky-100/70 border-2 border-dashed border-sky-300 rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group"
                    >
                      <div className="w-14 h-14 rounded-full bg-sky-200/60 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-extrabold text-stone-900">
                          Pilih 1 atau Beberapa Foto Sekaligus
                        </p>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Tahan tombol Ctrl / Shift atau seleksi banyak foto langsung dari galeri HP / komputer
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleWizardMultiUpload}
                        className="hidden"
                      />
                    </div>
                  )}

                  {/* Tab 2: Preset Galeri Riil Lembang */}
                  {wizardMediaTab === 'gallery' && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-stone-500">
                        Klik pada foto untuk menambahkannya ke koleksi postingan:
                      </p>
                      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 bg-stone-50 rounded-2xl border border-stone-200">
                        {LEMBANG_GALLERY_PRESETS.map((preset) => {
                          const isIncluded = wizardImages.includes(preset.url);
                          const isMain = wizardMainImage === preset.url;
                          return (
                            <div
                              key={preset.id}
                              onClick={() => handleWizardTogglePreset(preset.url)}
                              className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                                isMain
                                  ? 'border-amber-400 ring-2 ring-amber-400'
                                  : isIncluded
                                  ? 'border-emerald-600 ring-2 ring-emerald-400'
                                  : 'border-stone-200 hover:border-stone-400'
                              }`}
                            >
                              <img src={preset.url} alt={preset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              {isIncluded && (
                                <div className="absolute top-1 right-1 bg-emerald-700 text-white rounded-full p-0.5 shadow-sm">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                              {isMain && (
                                <span className="absolute bottom-1 left-1 bg-amber-400 text-stone-950 text-[8px] font-black px-1.5 py-0.2 rounded shadow-xs uppercase">
                                  Cover
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Video URL Input */}
                  {wizardMediaTab === 'video' && (
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-800 mb-1">
                          Tautan Video YouTube / Vimeo / MP4:
                        </label>
                        <input
                          type="url"
                          value={postVideoUrl}
                          onChange={(e) => setPostVideoUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                          className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                        <p className="text-[10px] text-stone-500 mt-1">
                          Video akan langsung tersemat dan bisa diputar oleh wisatawan di galeri foto/video produk.
                        </p>
                      </div>

                      {postVideoUrl && (
                        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2 truncate">
                            <Play className="w-4 h-4 fill-emerald-800 text-emerald-800 shrink-0" />
                            <span className="font-semibold truncate">Video siap disematkan bersama foto</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPostVideoUrl('')}
                            className="text-[11px] text-rose-600 font-bold hover:underline shrink-0 ml-2"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPostWizard(false)}
                    className="px-4 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardStep('fill-detail')}
                    className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <span>Lanjut Isi Detail Postingan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ISI DETAIL POSTINGAN */}
            {wizardStep === 'fill-detail' && (
              <form onSubmit={handlePublishPost} className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-4 text-left overscroll-contain">
                
                {/* Media Summary in Step 2 Header */}
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border shrink-0 bg-stone-900 shadow-xs">
                    <img src={wizardMainImage} alt="Foto Utama" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-stone-950/80 text-amber-300 text-[8px] font-black text-center py-0.5 uppercase tracking-wider">
                      Cover
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">
                      {wizardImages.length} Foto Terpilih {postVideoUrl ? '• 1 Video' : ''}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Konten Utama telah ditentukan</p>
                    <button
                      type="button"
                      onClick={() => setWizardStep('pick-media')}
                      className="text-[11px] font-bold text-emerald-700 hover:underline mt-0.5 cursor-pointer inline-block"
                    >
                      Kelola Media ↺
                    </button>
                  </div>
                </div>

                {/* JUDUL */}
                <div>
                  <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-1">
                    JUDUL POSTINGAN*
                  </label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Contoh: Kamar Melati Homestay Pasir Angling"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* DESKRIPSI */}
                <div>
                  <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-1">
                    DESKRIPSI LENGKAP*
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={postDescription}
                    onChange={(e) => setPostDescription(e.target.value)}
                    placeholder="Contoh: Kamar nyaman bersih sejuk pegunungan, include sarapan liwet hangat khas desa..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* HARGA (Rp) & UNIT */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-1">
                      HARGA (Rp)*
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
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                    >
                      <option value="/malam">/malam (Homestay)</option>
                      <option value="/orang">/orang (Paket Wisata)</option>
                      <option value="/pack">/pack (Kopi/Olahan)</option>
                      <option value="/kg">/kg (Sayur/Buah)</option>
                      <option value="/pcs">/pcs (Suvenir/Kerajinan)</option>
                      <option value="/porsi">/porsi (Kuliner)</option>
                      <option value="/botol">/botol (Susu)</option>
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

                {/* PILIH KATEGORI */}
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
                        className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          postCategory === cat.id
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
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
                    className="px-4 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
                  >
                    ← Kelola Media
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-black rounded-2xl text-xs sm:text-sm shadow-xl transition-all hover:scale-[1.01] tracking-wider uppercase cursor-pointer"
                  >
                    POSTING SEKARANG ✓
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-product-title"
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
                      Admin {currentVillage.name}
                    </span>
                    <span className="text-[10px] text-stone-400">ID: #{editingProduct.id}</span>
                  </div>
                  <h3 id="edit-product-title" className="text-base sm:text-lg font-bold text-white font-serif-title truncate max-w-md mt-0.5">
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
                  
                  {/* --- UNIFIED MEDIA MANAGER SECTION (MULTI-PHOTO & VIDEO) --- */}
                  <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-emerald-800" />
                        <span className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">
                          1. Koleksi Media (Foto & Video)
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {(editingProduct.gallery || [editingProduct.image]).length} Foto {editingProduct.videoUrl ? '+ 1 Video' : ''}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600">
                      Kelola kumpulan foto produk & video dalam satu tempat. Klik <strong>"Jadikan Cover"</strong> pada foto yang ingin dijadikan tampilan utama katalog.
                    </p>

                    {/* Media Gallery Grid Preview */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 bg-stone-200/50 p-3 rounded-2xl border border-stone-300/70 max-h-56 overflow-y-auto">
                      {(editingProduct.gallery || [editingProduct.image]).map((imgUrl, idx) => {
                        const isMain = editingProduct.image === imgUrl;
                        return (
                          <div 
                            key={`edit-gal-${idx}`}
                            className={`group relative h-28 rounded-xl overflow-hidden border-2 transition-all shadow-xs ${
                              isMain ? 'border-amber-500 ring-2 ring-amber-400' : 'border-stone-300 hover:border-emerald-600'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Foto ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Main Cover Badge / Button */}
                            {isMain ? (
                              <div className="absolute top-1 left-1 bg-amber-400 text-stone-950 font-black text-[9px] px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                <Star className="w-2.5 h-2.5 fill-stone-950" />
                                <span>Cover Utama</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setEditingProduct({ ...editingProduct, image: imgUrl })}
                                className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/80 hover:bg-amber-400 hover:text-stone-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md cursor-pointer shadow-sm"
                                title="Jadikan Cover Utama"
                              >
                                Jadikan Cover
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleEditRemoveImage(imgUrl)}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white p-1 rounded-md cursor-pointer shadow-sm"
                              title="Hapus foto ini"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>

                            <div className="absolute bottom-1 right-1 bg-stone-900/70 text-white text-[9px] font-bold px-1 rounded">
                              #{idx + 1}
                            </div>
                          </div>
                        );
                      })}

                      {/* Video Item Card if present */}
                      {editingProduct.videoUrl && (
                        <div className="relative h-28 rounded-xl overflow-hidden border-2 border-emerald-500 bg-stone-900 flex flex-col items-center justify-center p-2 text-center shadow-xs">
                          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center mb-1">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                          <span className="text-[10px] text-white font-bold leading-tight">Video Aktif</span>
                          <span className="text-[9px] text-stone-400 truncate max-w-full px-1">{editingProduct.videoUrl}</span>
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...editingProduct, videoUrl: '' })}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-md cursor-pointer shadow-sm"
                            title="Hapus video"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleEditMultiUpload}
                      className="hidden"
                    />

                    {/* Media Tabs Selector */}
                    <div className="space-y-2">
                      <div className="flex bg-stone-200/80 p-1 rounded-xl gap-1 overflow-x-auto">
                        <button
                          type="button"
                          onClick={() => setEditImageTab('upload')}
                          className={`flex-1 min-w-[100px] py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                            editImageTab === 'upload' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'
                          }`}
                        >
                          📸 Upload Foto
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditImageTab('gallery')}
                          className={`flex-1 min-w-[100px] py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                            editImageTab === 'gallery' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'
                          }`}
                        >
                          🏞️ Galeri Lembang
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditImageTab('video')}
                          className={`flex-1 min-w-[100px] py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                            editImageTab === 'video' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'
                          }`}
                        >
                          ▶ Video {editingProduct.videoUrl ? '✓' : ''}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditImageTab('url')}
                          className={`flex-1 min-w-[80px] py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                            editImageTab === 'url' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'
                          }`}
                        >
                          🔗 Tambah URL
                        </button>
                      </div>

                      {/* Tab 1: Upload Multiple Files */}
                      {editImageTab === 'upload' && (
                        <div className="p-4 bg-white rounded-xl border border-stone-200 text-center space-y-2">
                          <p className="text-xs text-stone-600">
                            Pilih satu atau beberapa foto dari galeri HP / komputer Anda:
                          </p>
                          <button
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-xs transition-transform hover:scale-105"
                          >
                            <UploadCloud className="w-4 h-4" />
                            <span>Pilih Foto dari Galeri / File (Bisa Banyak)</span>
                          </button>
                          <p className="text-[10px] text-stone-400">Mendukung multi-select (JPG, PNG, WebP)</p>
                        </div>
                      )}

                      {/* Tab 2: Galeri Lembang Presets */}
                      {editImageTab === 'gallery' && (
                        <div className="space-y-2 pt-1">
                          <p className="text-[10px] text-stone-500 font-medium">
                            Klik foto untuk menambah / mengurangi foto dari galeri produk ini:
                          </p>
                          <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1 bg-white rounded-xl border border-stone-200">
                            {LEMBANG_GALLERY_PRESETS.map((preset) => {
                              const isInGallery = (editingProduct.gallery || [editingProduct.image]).includes(preset.url);
                              return (
                                <button
                                  key={preset.id}
                                  type="button"
                                  onClick={() => handleEditTogglePreset(preset.url)}
                                  className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                                    isInGallery ? 'border-emerald-600 ring-2 ring-emerald-400' : 'border-transparent hover:border-emerald-400 opacity-70 hover:opacity-100'
                                  }`}
                                >
                                  <img
                                    src={preset.url}
                                    alt={preset.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                  />
                                  {isInGallery && (
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

                      {/* Tab 3: Video URL */}
                      {editImageTab === 'video' && (
                        <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                          <label className="text-[10px] font-bold text-stone-700 block">
                            Tautan Video (YouTube atau direct .mp4):
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={editingProduct.videoUrl || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, videoUrl: e.target.value })}
                              placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                              className="flex-1 p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                            />
                            {editingProduct.videoUrl && (
                              <button
                                type="button"
                                onClick={() => setEditingProduct({ ...editingProduct, videoUrl: '' })}
                                className="px-3 py-1.5 bg-red-100 text-red-700 font-bold rounded-xl text-xs hover:bg-red-200 cursor-pointer"
                              >
                                Hapus
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] text-stone-500">
                            Video otomatis menyatu di koleksi media dan dapat langsung diputar di detail produk.
                          </p>
                        </div>
                      )}

                      {/* Tab 4: Direct URL */}
                      {editImageTab === 'url' && (
                        <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                          <label className="text-[10px] font-bold text-stone-700 block">
                            Tambah URL Foto Eksternal (HTTPS):
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={editImageUrlInput}
                              onChange={(e) => setEditImageUrlInput(e.target.value)}
                              placeholder="Masukkan URL foto (contoh: https://...)"
                              className="flex-1 p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleAddImageUrlToEditGallery}
                              disabled={!editImageUrlInput.trim()}
                              className="px-3 py-1.5 bg-emerald-800 text-amber-300 font-bold rounded-xl text-xs hover:bg-emerald-900 disabled:opacity-50 cursor-pointer"
                            >
                              + Tambah
                            </button>
                          </div>
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
                      <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white p-1 rounded-full shadow-md" title="Konten Terverifikasi Admin Desa">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 bg-stone-950/75 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-amber-300">
                        {editingProduct.stockQuota} kuota tersedia
                      </div>

                      {/* Unified Media Indicators in Preview */}
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1">
                        {editingProduct.videoUrl && (
                          <div className="bg-red-600 text-white p-1 rounded-md shadow-md" title="Memiliki Video">
                            <Play className="w-3 h-3 fill-white" />
                          </div>
                        )}
                        {(editingProduct.gallery?.length || 1) > 1 && (
                          <div className="bg-stone-950/75 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 text-amber-300" />
                            <span>{editingProduct.gallery?.length} Foto</span>
                          </div>
                        )}
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
                          Aktif Admin Desa
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
