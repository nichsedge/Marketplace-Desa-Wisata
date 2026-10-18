import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../components/ProductCard';
import { getCartItemTotal, getCartItemNights } from '../utils/booking';
import { Order } from '../types';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Calendar, 
  Users, 
  ArrowRight,
  QrCode,
  Building2,
  Wallet,
  Coins,
  Download,
  Printer,
  X,
  MapPin,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { WHATSAPP_PHONE, formatWhatsAppUrl, createCartWhatsAppMessage } from '../utils/whatsapp';
import { getLocalizedProduct } from '../i18n/productTranslations';

export const CartView: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartTotal, 
    clearCart, 
    placeOrder, 
    navigateTo,
    currentUser,
    language,
    t
  } = useApp();

  // Checkout Form State
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState('+62 812-3456-7890');
  const [paymentMethod, setPaymentMethod] = useState<string>('Konfirmasi & Bayar via WhatsApp');
  const [notes, setNotes] = useState<string>('');

  // Order Receipt Modal
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const serviceFee = 0;
  const grandTotal = cartTotal;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName || !customerPhone) return;

    // Send to WhatsApp
    const waText = createCartWhatsAppMessage(cart, {
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      notes: notes
    });
    const targetPhone = cart[0]?.product?.sellerPhone || WHATSAPP_PHONE;
    const waUrl = formatWhatsAppUrl(targetPhone, waText);
    window.open(waUrl, '_blank');

    const order = placeOrder(customerName, customerEmail, customerPhone, paymentMethod, notes);
    setCompletedOrder(order);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
        <div>
          <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider">{t('cart.summary')}</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-stone-900 mt-1">
            {t('cart.title')}
          </h1>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kosongkan / Clear</span>
          </button>
        )}
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              {language === 'en' ? `Order Items (${cart.length})` : `Item Pesanan (${cart.length})`}
            </h3>

            <div className="space-y-4">
              {cart.map((item) => {
                const itemProd = getLocalizedProduct(item.product, language);
                return (
                <div 
                  key={item.product.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={itemProd.image}
                      alt={itemProd.title}
                      className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {itemProd.villageName}
                      </span>
                      <h4 
                        onClick={() => navigateTo('product-detail', item.product.id)}
                        className="text-sm font-bold text-stone-900 line-clamp-1 hover:text-emerald-800 cursor-pointer"
                      >
                        {itemProd.title}
                      </h4>
                      <p className="text-xs font-extrabold text-emerald-800">
                        {formatRupiah(itemProd.price)} <span className="text-[10px] text-stone-500 font-normal">{itemProd.unit}</span>
                      </p>

                      {/* Date details if any */}
                      {item.bookingDateStart && (
                        <p className="text-[11px] text-stone-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-700" />
                          <span>{language === 'en' ? 'Date:' : 'Tgl:'} {item.bookingDateStart} {item.bookingDateEnd ? `${language === 'en' ? 'to' : 's/d'} ${item.bookingDateEnd}` : ''}</span>
                        </p>
                      )}
                      {item.guestCount && (
                        <p className="text-[11px] text-stone-500 flex items-center gap-1">
                          <Users className="w-3 h-3 text-emerald-700" />
                          <span>{item.guestCount} {language === 'en' ? 'Guests' : 'Tamu / Orang'}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Controls */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <div className="flex items-center gap-2 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-300">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="text-stone-600 hover:text-stone-900 font-bold cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-extrabold text-stone-900 min-w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="text-stone-600 hover:text-stone-900 font-bold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-stone-900">
                        Subtotal {getCartItemNights(item) > 1 ? `(${getCartItemNights(item)} ${language === 'en' ? 'nights' : 'malam'})` : ''}:
                      </p>
                      <p className="text-sm font-extrabold text-emerald-800">
                        {formatRupiah(getCartItemTotal(item))}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title={language === 'en' ? 'Remove' : 'Hapus'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <p>
                {language === 'en' ? (
                  <><strong>Official Village Guarantee:</strong> Your order is protected and directly verified by official village enterprises (BUMDes) and local village managers.</>
                ) : (
                  <><strong>Garansi Layanan Desa:</strong> Pesanan Anda terlindungi dan langsung terverifikasi oleh pengelola resmi BUMDes desa wisata terkait.</>
                )}
              </p>
            </div>
          </div>

          {/* Checkout Form & Payment Summary */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleCheckoutSubmit} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xl space-y-6">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-800" />
                <span>{language === 'en' ? 'Customer Details & Payment Form' : 'Form Data Pemesan & Pembayaran'}</span>
              </h3>

              {/* Personal Info Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {language === 'en' ? 'Customer Full Name*' : 'Nama Lengkap Pemesan*'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={language === 'en' ? 'Enter full name' : 'Masukkan nama sesuai ID'}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Email*</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {language === 'en' ? 'WhatsApp Number*' : 'No. WhatsApp*'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+62 812..."
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {language === 'en' ? 'Additional Notes (Optional):' : 'Catatan Tambahan (Opsional):'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'en' ? 'Check-in instructions / delivery note...' : 'Instruksi check-in / pengiriman...'}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 block">
                  {language === 'en' ? 'Select Payment Method*' : 'Pilih Metode Pembayaran*'}
                </label>
                <div className="space-y-2">
                  
                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'QRIS Instant' ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold' : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}>
                    <div className="flex items-center gap-2 text-xs">
                      <QrCode className="w-4 h-4 text-emerald-800" />
                      <span>QRIS (GoPay, OVO, Dana, ShopeePay, BCA Mobile)</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'QRIS Instant'}
                      onChange={() => setPaymentMethod('QRIS Instant')}
                      className="accent-emerald-800"
                    />
                  </label>

                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'Transfer Bank BUMDes' ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold' : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}>
                    <div className="flex items-center gap-2 text-xs">
                      <Building2 className="w-4 h-4 text-emerald-800" />
                      <span>{language === 'en' ? 'Bank Transfer (BCA / Mandiri / BRI Village BUMDes)' : 'Transfer Bank (BCA / Mandiri / BRI BUMDes)'}</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Transfer Bank BUMDes'}
                      onChange={() => setPaymentMethod('Transfer Bank BUMDes')}
                      className="accent-emerald-800"
                    />
                  </label>

                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'Bayar di Tempat (COD Desa)' ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold' : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}>
                    <div className="flex items-center gap-2 text-xs">
                      <Coins className="w-4 h-4 text-emerald-800" />
                      <span>{language === 'en' ? 'Pay on Site upon Check-in / Village COD' : 'Bayar di Tempat saat Check-in / COD Desa'}</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Bayar di Tempat (COD Desa)'}
                      onChange={() => setPaymentMethod('Bayar di Tempat (COD Desa)')}
                      className="accent-emerald-800"
                    />
                  </label>

                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>{language === 'en' ? 'Products & Services Subtotal:' : 'Subtotal Produk & Layanan:'}</span>
                  <span className="font-bold text-stone-900">{formatRupiah(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>{language === 'en' ? 'Village Platform Maintenance Fee:' : 'Biaya Pemeliharaan Platform Desa:'}</span>
                  <span className="font-bold text-stone-900">{formatRupiah(serviceFee)}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="font-bold text-stone-900 text-sm">
                    {language === 'en' ? 'Total Payment:' : 'Total Pembayaran:'}
                  </span>
                  <span className="font-black text-emerald-800 text-lg">{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 border-2 border-amber-300"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-800" />
                <span>{t('cart.checkoutWa')}</span>
              </button>
            </form>
          </div>

        </div>
      ) : (
        /* Empty Cart Screen */
        <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 space-y-4 max-w-lg mx-auto shadow-md">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-serif-title text-stone-900">{t('cart.empty')}</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {language === 'en'
                ? 'Explore our local village marketplace and authentic stays now!'
                : 'Mari jelajahi marketplace produk & homestay lokal desa sekarang!'}
            </p>
          </div>
          <button
            onClick={() => navigateTo('marketplace')}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-xl text-xs shadow-md transition-all hover:scale-105"
          >
            {t('cart.exploreNow')}
          </button>
        </div>
      )}

      {/* ORDER RECEIPT E-TICKET MODAL */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative my-8 print:m-0 print:p-6 print:border-none print:shadow-none">
            
            <button
              onClick={() => { setCompletedOrder(null); navigateTo('home'); }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 print:hidden"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Official Village Header */}
            <div className="border-b border-stone-200 pb-4 text-center space-y-2">
              <div className="flex justify-center">
                <img 
                  src="/images/logo-saba-lembang.png" 
                  alt="Saba Lembang" 
                  className="w-12 h-12 rounded-full shadow-xs object-contain" 
                />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {language === 'en'
                    ? 'SABA LEMBANG · LEMBANG REGION INTER-VILLAGE PLATFORM'
                    : 'SABA LEMBANG · PLATFORM INTERDESA KAWASAN LEMBANG'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-serif-title text-stone-900">
                {language === 'en' ? 'Official E-Ticket & Reservation Receipt' : 'E-Ticket & Bukti Reservasi Resmi'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {language === 'en'
                  ? 'Integrated Tourism & Agro-tourism Network of Lembang Region, West Bandung'
                  : 'Jaringan Pariwisata & Agrowisata Terpadu Kawasan Lembang, Kab. Bandung Barat'}
              </p>
            </div>

            {/* Success Status & Order ID */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                  {language === 'en' ? 'Reservation ID:' : 'ID Reservasi:'}
                </span>
                <span className="text-sm font-black text-stone-900 font-mono tracking-wider">{completedOrder.id}</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-700 text-white rounded-full text-[10px] font-bold shadow-xs">
                {language === 'en' ? 'Confirmed by Village Admin' : 'Terkonfirmasi Admin Desa'}
              </span>
            </div>

            {/* QR Code Simulation with verification note */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-center space-y-2">
              <div className="w-32 h-32 bg-white border border-stone-200 p-2 rounded-xl mx-auto flex items-center justify-center shadow-xs">
                <QrCode className="w-28 h-28 text-stone-900" />
              </div>
              <p className="text-[11px] font-bold text-emerald-900">
                {language === 'en'
                  ? 'Show this QR code to the respective Village Admin / Host upon arrival at the location'
                  : 'Tunjukkan QR Code ini kepada Admin / Pengelola Desa terkait saat tiba di lokasi'}
              </p>
            </div>

            {/* Order Details Table */}
            <div className="space-y-2.5 text-xs border-t border-stone-200 pt-4">
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">
                  {language === 'en' ? 'Customer Name:' : 'Nama Pemesan:'}
                </span>
                <span className="font-bold text-stone-900">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">WhatsApp:</span>
                <span className="font-bold text-stone-900">{completedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">
                  {language === 'en' ? 'Confirmation Method:' : 'Metode Konfirmasi:'}
                </span>
                <span className="font-bold text-emerald-800">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-medium">
                  {language === 'en' ? 'Transaction Date:' : 'Tanggal Transaksi:'}
                </span>
                <span className="font-bold text-stone-900">{completedOrder.createdAt}</span>
              </div>

              {/* Items Summary */}
              <div className="pt-3 border-t border-stone-200 space-y-2">
                <p className="font-bold text-stone-800 text-[11px] uppercase tracking-wider">
                  {language === 'en' ? 'Item & Service Details:' : 'Daftar Item & Layanan:'}
                </p>
                {completedOrder.items.map((it, idx) => {
                  const itProd = getLocalizedProduct(it.product, language);
                  const itNights = getCartItemNights(it);
                  return (
                    <div key={idx} className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-stone-900">{itProd.title}</p>
                        <p className="text-[10px] text-stone-500">
                          {it.quantity} {itProd.unit} {itNights > 1 ? `• ${itNights} ${language === 'en' ? 'nights' : 'malam'}` : ''} {it.bookingDateStart ? `• ${language === 'en' ? 'Date' : 'Tgl'} ${it.bookingDateStart}` : ''}
                        </p>
                      </div>
                      <span className="font-bold text-emerald-900">{formatRupiah(getCartItemTotal(it))}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-black text-stone-900">
                <span>{language === 'en' ? 'Total Amount:' : 'Total Biaya:'}</span>
                <span className="text-emerald-800">{formatRupiah(completedOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Actions (Hidden when printing) */}
            <div className="space-y-2 pt-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-bold rounded-2xl text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'en' ? 'Print / Save as PDF (Official Receipt)' : 'Cetak / Simpan PDF (Resi Resmi)'}</span>
              </button>

              <button
                onClick={() => { setCompletedOrder(null); navigateTo('home'); }}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-2xl text-xs transition-colors"
              >
                {language === 'en' ? 'Return to Home' : 'Kembali ke Beranda'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
