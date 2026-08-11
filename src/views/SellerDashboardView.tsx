import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, getCategoryBadge } from '../components/ProductCard';
import { Product, ProductCategory, OrderStatus } from '../types';
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
  Filter
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
    navigateTo,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'profile'>('products');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('homestay');
  const [newPrice, setNewPrice] = useState<number>(250000);
  const [newUnit, setNewUnit] = useState('/malam');
  const [newVillageId, setNewVillageId] = useState('des-01');
  const [newDescription, setNewDescription] = useState('');
  const [newSellerName, setNewSellerName] = useState('BUMDes Penglipuran');
  const [newSellerBadge, setNewSellerBadge] = useState('Pengelola Pokdarwis');
  const [newQuota, setNewQuota] = useState(10);
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80');

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'menunggu' || o.status === 'diproses').length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) return;

    const village = villages.find(v => v.id === newVillageId);

    addProduct({
      title: newTitle,
      category: newCategory,
      price: Number(newPrice),
      unit: newUnit,
      villageId: newVillageId,
      villageName: village?.name || 'Desa Wisata',
      location: village?.location || 'Indonesia',
      sellerName: newSellerName,
      sellerBadge: newSellerBadge,
      sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      sellerPhone: '+6281234567890',
      image: newImage,
      gallery: [newImage],
      description: newDescription,
      highlights: ['Produk Asli Desa', 'Sertifikasi Pokdarwis'],
      stockQuota: Number(newQuota),
      isAvailable: true,
      isFeatured: false
    });

    setShowAddModal(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewPrice(250000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Portal Header */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-700/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-lg shrink-0">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 mb-1">
              <ShieldCheck className="w-3 h-3" /> Portal Pengelola BUMDes & Penjual Desa
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-title">
              Dashboard Penjual & UMKM Desa
            </h1>
            <p className="text-xs text-stone-300">
              Kelola daftar homestay, produk suvenir, paket wisata, serta pantau pesanan wisatawan secara real-time.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold rounded-2xl text-xs shadow-lg transition-all hover:scale-105 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk / Layanan</span>
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-stone-500 font-semibold uppercase">Total Pendapatan</p>
            <p className="text-lg font-black text-stone-900">{formatRupiah(totalRevenue)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-stone-500 font-semibold uppercase">Pesanan Aktif</p>
            <p className="text-lg font-black text-stone-900">{pendingOrders} Pesanan</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-stone-500 font-semibold uppercase">Produk Diterbitkan</p>
            <p className="text-lg font-black text-stone-900">{products.length} Listing</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-stone-500 font-semibold uppercase">Rating Toko Desa</p>
            <p className="text-lg font-black text-stone-900">4.9 / 5.0 ★</p>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'products'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200'
          }`}
        >
          Kelola Produk & Layanan ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'orders'
              ? 'bg-emerald-800 text-amber-200 shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200'
          }`}
        >
          Daftar Pesanan Masuk ({orders.length})
        </button>
      </div>

      {/* Tab 1: PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base font-sans">Daftar Produk Desa Terdaftar</h3>
            <span className="text-xs text-stone-500">Klik ikon pensil untuk mengubah data produk</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-800">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase border-b border-stone-200">
                <tr>
                  <th className="p-3">Produk</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Harga</th>
                  <th className="p-3">Desa Wisata</th>
                  <th className="p-3">Stok / Kuota</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => {
                  const badge = getCategoryBadge(p.category);
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.title} className="w-12 h-12 rounded-xl object-cover border" referrerPolicy="no-referrer" />
                          <div>
                            <p className="font-bold text-stone-900 line-clamp-1">{p.title}</p>
                            <p className="text-[10px] text-stone-400">{p.sellerName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-800">
                        {formatRupiah(p.price)} <span className="text-[10px] text-stone-400 font-normal">{p.unit}</span>
                      </td>
                      <td className="p-3 text-stone-600 font-medium">{p.villageName}</td>
                      <td className="p-3 font-semibold">{p.stockQuota} unit</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: ORDERS MANAGER */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-stone-900 text-base">Kelola Pesanan Wisatawan Masuk</h3>

          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-xs font-black text-stone-900">{o.id}</span>
                    <span className="text-[11px] text-stone-500 ml-2">· {o.createdAt}</span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-600">Status:</span>
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                      className="p-1.5 bg-white border border-stone-300 rounded-xl text-xs font-bold focus:outline-none"
                    >
                      <option value="menunggu">Menunggu Pembayaran</option>
                      <option value="diproses">Sedang Diproses Desa</option>
                      <option value="selesai">Selesai / Sudah Check-in</option>
                      <option value="dibatalkan">Dibatalkan</option>
                    </select>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-700 font-medium">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-semibold">Nama Pemesan:</span>
                    <strong className="text-stone-900">{o.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-semibold">No. WhatsApp:</span>
                    <span>{o.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-semibold">Metode Bayar:</span>
                    <span className="text-emerald-800 font-bold">{o.paymentMethod}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1 text-xs">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Rincian Item:</span>
                  {o.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.quantity}x {it.product.title}</span>
                      <span className="font-bold">{formatRupiah(it.product.price * it.quantity)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-stone-100 flex justify-between font-extrabold text-stone-900">
                    <span>Total Bayar:</span>
                    <span className="text-emerald-800">{formatRupiah(o.totalAmount)}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE NEW PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-extrabold font-serif-title text-stone-900">
              Tambah Produk / Layanan Desa Baru
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="font-bold text-stone-800 block mb-1">Nama Produk / Layanan*</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Homestay Bambu Hijau / Kain Batik Tulis..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Kategori*</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="homestay">Homestay / Penginapan</option>
                    <option value="paket-wisata">Paket Wisata & Tour</option>
                    <option value="suvenir">Suvenir & Kerajinan Batik</option>
                    <option value="kuliner">Kuliner & Kopi Adat</option>
                    <option value="umkm">Produk UMKM Kelompok Tani</option>
                    <option value="destinasi">Tiket Wisata</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Desa Wisata*</label>
                  <select
                    value={newVillageId}
                    onChange={(e) => setNewVillageId(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none"
                  >
                    {villages.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Harga (Rp)*</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Satuan Unit*</label>
                  <input
                    type="text"
                    required
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="/malam, /pcs, /porsi..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Stok / Kuota*</label>
                  <input
                    type="number"
                    required
                    value={newQuota}
                    onChange={(e) => setNewQuota(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">URL Gambar Foto Produk*</label>
                <input
                  type="text"
                  required
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Deskripsi Lengkap*</label>
                <textarea
                  required
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Jelaskan keunggulan dan fasilitas produk desa Anda..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-800 text-amber-200 font-bold rounded-xl text-xs shadow-md hover:bg-emerald-900"
                >
                  Terbitkan Produk Sekarang
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 relative">
            <button onClick={() => setEditingProduct(null)} className="absolute top-4 right-4 text-stone-400">✕</button>
            <h3 className="font-bold text-base font-serif-title">Edit Produk #{editingProduct.id}</h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Judul Produk</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full p-2 bg-stone-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full p-2 bg-stone-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2 bg-stone-50 border rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-800 text-amber-200 font-bold rounded-xl text-xs"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
