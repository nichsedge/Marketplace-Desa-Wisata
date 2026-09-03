import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, getCategoryBadge, ProductCard } from '../components/ProductCard';
import { calculateNights } from '../utils/booking';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Minus, 
  Plus, 
  CheckCircle2, 
  ChevronLeft, 
  Share2, 
  Heart, 
  Clock, 
  Phone,
  Send,
  BedDouble,
  TreePine,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { WHATSAPP_PHONE, formatWhatsAppUrl, createProductWhatsAppMessage } from '../utils/whatsapp';

export const ProductDetailView: React.FC = () => {
  const { 
    products, 
    selectedProductId, 
    navigateTo, 
    addToCart, 
    reviews, 
    addReview,
    showToast
  } = useApp();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getDayAfterTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [activeImage, setActiveImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [bookingDateStart, setBookingDateStart] = useState(getTomorrowDate());
  const [bookingDateEnd, setBookingDateEnd] = useState(getDayAfterTomorrowDate());
  const [guestCount, setGuestCount] = useState(2);
  const [specialNotes, setSpecialNotes] = useState('');

  // Keep state in sync when switching between products
  useEffect(() => {
    setActiveImage(product.image);
    setQuantity(1);
    setBookingDateStart(getTomorrowDate());
    setBookingDateEnd(getDayAfterTomorrowDate());
    setGuestCount(2);
    setSpecialNotes('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id, product.image]);

  // Review Form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewAuthorName, setReviewAuthorName] = useState('');

  const productReviews = reviews.filter(r => r.productId === product.id);
  const relatedProducts = products.filter(p => p.id !== product.id && (p.villageId === product.villageId || p.category === product.category)).slice(0, 3);

  const categoryBadge = getCategoryBadge(product.category);
  const isHomestay = product.category === 'homestay' || product.category === 'penginapan-lokal';
  const nights = isHomestay ? calculateNights(bookingDateStart, bookingDateEnd) : 1;
  const totalPrice = isHomestay
    ? product.price * quantity * nights
    : product.price * quantity;

  // Deduplicate gallery images so main image doesn't repeat
  const allGalleryImages = Array.from(new Set([product.image, ...(product.gallery || [])]));

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.title} - Saba Lembang`,
          text: `Cek ${product.title} di ${product.villageName} (Kawasan Lembang):`,
          url: shareUrl
        });
      } catch {
        // user dismiss
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Tautan produk berhasil disalin ke clipboard!', 'info');
    }
  };

  const handleAddToCart = () => {
    addToCart(
      product, 
      quantity, 
      product.category === 'homestay' || product.category === 'paket-wisata' ? bookingDateStart : undefined,
      product.category === 'homestay' ? bookingDateEnd : undefined,
      guestCount,
      specialNotes
    );
  };

  const handleOrderViaWhatsApp = () => {
    const text = createProductWhatsAppMessage(product, {
      quantity,
      bookingDateStart: product.category === 'homestay' || product.category === 'paket-wisata' ? bookingDateStart : undefined,
      bookingDateEnd: product.category === 'homestay' ? bookingDateEnd : undefined,
      guestCount: product.category === 'homestay' || product.category === 'paket-wisata' ? guestCount : undefined,
      notes: specialNotes
    });
    const targetPhone = product.sellerPhone || WHATSAPP_PHONE;
    const url = formatWhatsAppUrl(targetPhone, text);
    window.open(url, '_blank');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview(product.id, newRating, newComment, reviewAuthorName.trim() || undefined);
    setNewComment('');
    setReviewAuthorName('');
  };

  const handleWhatsAppChat = () => {
    const text = `Halo Admin ${product.villageName} (${product.sellerName}), saya ingin bertanya tentang "${product.title}" (${product.unit}).`;
    const targetPhone = product.sellerPhone || WHATSAPP_PHONE;
    const url = formatWhatsAppUrl(targetPhone, text);
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('marketplace')}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-emerald-800 transition-colors bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-emerald-800 transition-colors text-xs font-bold shadow-xs"
            title="Bagikan Produk"
          >
            <Share2 className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Bagikan</span>
          </button>
        </div>
      </div>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Gallery & Product Info */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-md">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border shadow-md ${categoryBadge.bg}`}>
                {categoryBadge.label}
              </span>
            </div>

            {/* Gallery Thumbnails */}
            {allGalleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {allGalleryImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImage === imgUrl ? 'border-emerald-700 scale-105 shadow-md' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Header & Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>{product.villageName} ({product.location})</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-stone-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating & Stock Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-600">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
                <span className="text-stone-600 font-normal">({product.totalReviews} ulasan)</span>
              </div>

              <div className="flex items-center gap-1 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ketersediaan Stok: {product.stockQuota} unit</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h3 className="font-bold text-stone-900 text-sm font-sans uppercase tracking-wider">
              Deskripsi Produk / Layanan
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            {/* Highlights bullet list */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="pt-3 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-800 mb-2">Keunggulan Utama:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.highlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Facilities / Included Items (if any) */}
          {product.facilities && product.facilities.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">
                Fasilitas & Kelengkapan Termasuk
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.facilities.map((fac, i) => (
                  <div key={i} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2 text-xs font-semibold text-stone-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tour Package Itinerary (if available) */}
          {product.itinerary && product.itinerary.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Rencana Perjalanan (Itinerary)</span>
              </h3>
              <div className="space-y-3 pl-2 border-l-2 border-emerald-600">
                {product.itinerary.map((item, i) => (
                  <div key={i} className="relative pl-4 space-y-0.5">
                    <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-700 border-2 border-white" />
                    <p className="text-xs font-extrabold text-emerald-800">{item.time}</p>
                    <p className="text-xs text-stone-700 font-medium">{item.activity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seller / Host Profile Card */}
          <div className="bg-gradient-to-r from-stone-900 to-emerald-950 p-6 rounded-2xl text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Informasi Penjual / Tuan Rumah</span>
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Terverifikasi Desa
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={product.sellerAvatar}
                alt={product.sellerName}
                className="w-14 h-14 rounded-full object-cover border-2 border-amber-300 shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-white truncate">{product.sellerName}</h4>
                <p className="text-xs text-stone-300 font-medium">{product.sellerBadge}</p>
                <p className="text-[11px] text-amber-200 mt-0.5">{product.villageName}</p>
              </div>
            </div>

            <button
              onClick={handleWhatsAppChat}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Tanya / Chat Penjual via WhatsApp</span>
            </button>
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">
                Ulasan Wisatawan ({productReviews.length})
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{product.rating} dari 5.0</span>
              </div>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <p className="text-xs font-bold text-stone-800">Tulis Ulasan Pengalaman Anda</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">Nama Anda (Opsional):</label>
                  <input
                    type="text"
                    value={reviewAuthorName}
                    onChange={(e) => setReviewAuthorName(e.target.value)}
                    placeholder="Contoh: Budi Santoso / Wisatawan Jakarta"
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">Beri Nilai Bintang:</label>
                  <div className="flex items-center gap-1 h-9">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-stone-600 ml-2">({newRating} / 5)</span>
                  </div>
                </div>
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Bagikan ulasan pengalaman Anda saat tinggal atau menggunakan produk ini..."
                rows={3}
                required
                className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Ulasan</span>
              </button>
            </form>

            {/* Review List */}
            <div className="space-y-4">
              {productReviews.length > 0 ? (
                productReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-stone-50/60 rounded-xl border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={rev.authorAvatar} alt={rev.authorName} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <p className="text-xs font-bold text-stone-900">{rev.authorName}</p>
                          <p className="text-[10px] text-stone-400">{rev.userRole}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed italic">{rev.comment}</p>
                    <span className="text-[10px] text-stone-400 block">{rev.date}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 italic text-center py-4">Belum ada ulasan untuk produk ini. Jadilah yang pertama memberikan ulasan!</p>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Interactive Booking Widget Sticky */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border-2 border-emerald-700/80 shadow-2xl space-y-6 sticky top-24">
            
            {/* Price Banner */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">Harga Resmi Desa</span>
                <span className="text-2xl font-black text-emerald-800 font-sans">
                  {formatRupiah(product.price)}
                </span>
                <span className="text-xs font-semibold text-stone-600 ml-1">{product.unit}</span>
              </div>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Interactive Inputs */}
            <div className="space-y-4">
              
              {/* Date Selectors for Homestay / Tour */}
              {(product.category === 'homestay' || product.category === 'paket-wisata') && (
                <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>Pilih Tanggal Booking</span>
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-stone-500 font-semibold block">Check-in / Mulai</span>
                      <input
                        type="date"
                        value={bookingDateStart}
                        onChange={(e) => setBookingDateStart(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    {product.category === 'homestay' && (
                      <div>
                        <span className="text-[10px] text-stone-500 font-semibold block">Check-out</span>
                        <input
                          type="date"
                          value={bookingDateEnd}
                          onChange={(e) => setBookingDateEnd(e.target.value)}
                          className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Guest Count */}
              {(product.category === 'homestay' || product.category === 'paket-wisata') && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">Jumlah Tamu / Orang</span>
                    <span className="text-[10px] text-stone-500">Maksimal ketersediaan desa</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-stone-300">
                    <button
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="text-stone-600 hover:text-stone-900 font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-extrabold text-stone-900 min-w-5 text-center">{guestCount}</span>
                    <button
                      onClick={() => setGuestCount(guestCount + 1)}
                      className="text-stone-600 hover:text-stone-900 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Quantity Counter for Physical Souvenir / Culinary / UMKM */}
              {product.category !== 'homestay' && product.category !== 'paket-wisata' && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">Jumlah Pesanan</span>
                    <span className="text-[10px] text-stone-500">Stok sedia: {product.stockQuota}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-stone-300">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-stone-600 hover:text-stone-900 font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-extrabold text-stone-900 min-w-5 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuota, quantity + 1))}
                      className="text-stone-600 hover:text-stone-900 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Special Notes */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Catatan Khusus (Opsional):</label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Contoh: Minta jam check-in awal / Alergi..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

            </div>

            {/* Subtotal Calculation */}
            <div className="pt-4 border-t border-stone-200 space-y-1.5">
              {product.category === 'homestay' && (
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Rincian ({nights} malam x {quantity} unit):</span>
                  <span className="font-semibold text-stone-700">{formatRupiah(product.price)} x {nights} x {quantity}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">Total Biaya:</span>
                <span className="text-xl font-black text-emerald-800">{formatRupiah(totalPrice)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleOrderViaWhatsApp}
                className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 border-2 border-amber-300"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-800" />
                <span>Pesan Sekarang via WhatsApp</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-2xl text-xs border border-amber-300 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-800" />
                <span>+ Masukkan ke Keranjang Belanja</span>
              </button>

              <button
                onClick={handleWhatsAppChat}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tanya Pengelola tentang Produk Ini</span>
              </button>
            </div>

            <p className="text-[10px] text-stone-500 text-center font-medium">
              ✨ Pemesanan langsung terhubung ke Admin Desa resmi Saba Lembang
            </p>

          </div>
        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-stone-200 space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold font-serif-title text-stone-900">
            Produk Lain dari {product.villageName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
