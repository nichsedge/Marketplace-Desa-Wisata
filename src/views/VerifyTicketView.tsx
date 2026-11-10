// src/views/VerifyTicketView.tsx
// Public E-Ticket Verifier & Gatekeeper Check-In View for Saba Lembang
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../components/ProductCard';
import { fetchOrderById } from '../services/orderService';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  QrCode, 
  ArrowLeft,
  Calendar, 
  Users, 
  MapPin, 
  Phone, 
  Building2, 
  CheckCheck,
  Package,
  Receipt
} from 'lucide-react';

const CHECKED_IN_STORAGE_KEY = 'saba_checked_in_orders';

function getCheckedInOrderIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CHECKED_IN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function markOrderAsCheckedIn(orderId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCheckedInOrderIds();
    if (!current.includes(orderId)) {
      localStorage.setItem(CHECKED_IN_STORAGE_KEY, JSON.stringify([...current, orderId]));
    }
  } catch {
    // ignore
  }
}

function unmarkOrderAsCheckedIn(orderId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCheckedInOrderIds();
    localStorage.setItem(
      CHECKED_IN_STORAGE_KEY,
      JSON.stringify(current.filter((id) => id !== orderId))
    );
  } catch {
    // ignore
  }
}

export const VerifyTicketView: React.FC = () => {
  const { orders, navigateTo, language, showToast } = useApp();

  const [inputOrderId, setInputOrderId] = useState<string>('');
  const [searchedOrderId, setSearchedOrderId] = useState<string>('');
  const [foundOrder, setFoundOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkInStateKey, setCheckInStateKey] = useState<number>(0);

  // Auto-search if orderId is present in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlOrderId = params.get('orderId') || params.get('id');
      if (urlOrderId) {
        setInputOrderId(urlOrderId);
        handleLookup(urlOrderId);
      }
    }
  }, []);

  const handleLookup = async (idToSearch?: string) => {
    const target = (idToSearch || inputOrderId).trim();
    if (!target) return;

    setIsLoading(true);
    setSearchedOrderId(target);

    // 1. Search in local state orders first
    const localMatch = orders.find((o) => o.id.toLowerCase() === target.toLowerCase());
    if (localMatch) {
      setFoundOrder(localMatch);
      setIsLoading(false);
      return;
    }

    // 2. Fetch from Cloud DB / Serverless Orders API
    try {
      const cloudOrder = await fetchOrderById(target);
      if (cloudOrder) {
        setFoundOrder(cloudOrder);
      } else {
        setFoundOrder(null);
      }
    } catch {
      setFoundOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isCheckedIn = foundOrder ? getCheckedInOrderIds().includes(foundOrder.id) : false;

  const handleToggleCheckIn = () => {
    if (!foundOrder) return;
    if (isCheckedIn) {
      unmarkOrderAsCheckedIn(foundOrder.id);
      showToast('Status check-in dibatalkan.', 'info');
    } else {
      markOrderAsCheckedIn(foundOrder.id);
      showToast('Wisatawan berhasil Check-In! Tiket ditandai telah digunakan.', 'success');
    }
    setCheckInStateKey((k) => k + 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-emerald-800 transition-colors cursor-pointer mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300 text-xs font-extrabold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Gatekeeper & Tiket Verifier Resmi Saba Lembang</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif-title">
          Cek & Validasi E-Ticket Wisata
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
          Verifikasi keaslian reservasi homestay, tiket wisata pegunungan, dan transaksi digital komoditas desa secara instan.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup();
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputOrderId}
              onChange={(e) => setInputOrderId(e.target.value)}
              placeholder="Masukkan ID Pesanan (Contoh: SABA-2026-123456)..."
              className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-amber-200 font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {isLoading ? (
              <span>Memeriksa...</span>
            ) : (
              <>
                <QrCode className="w-4 h-4" />
                <span>Verifikasi Tiket</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Verification Result Display */}
      {foundOrder ? (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-lg overflow-hidden space-y-6">
          {/* Validity Status Banner */}
          <div
            className={`p-6 text-white ${
              foundOrder.status === 'selesai'
                ? 'bg-gradient-to-r from-emerald-800 to-emerald-950'
                : foundOrder.status === 'menunggu' || foundOrder.status === 'menunggu_pembayaran'
                ? 'bg-gradient-to-r from-amber-700 to-amber-900'
                : 'bg-gradient-to-r from-rose-800 to-rose-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xs">
                  {foundOrder.status === 'selesai' ? (
                    <ShieldCheck className="w-8 h-8 text-amber-300" />
                  ) : (
                    <Clock className="w-8 h-8 text-amber-200" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-80 block">
                    Status Keabsahan Reservasi
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black">
                    {foundOrder.status === 'selesai'
                      ? 'TIKET SAH & LUNAS'
                      : foundOrder.status === 'menunggu' || foundOrder.status === 'menunggu_pembayaran'
                      ? 'MENUNGGU PEMBAYARAN'
                      : 'TIKET DIBATALKAN / NONAKTIF'}
                  </h2>
                </div>
              </div>

              {/* Check-In Badge */}
              <div className="sm:text-right">
                <span className="text-[10px] uppercase font-bold opacity-80 block">Status Check-in Gerbang</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-xs ${
                    isCheckedIn
                      ? 'bg-blue-600 text-white'
                      : 'bg-emerald-400 text-emerald-950'
                  }`}
                >
                  {isCheckedIn ? <CheckCheck className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{isCheckedIn ? 'SUDAH DIGUNAKAN / CHECK-IN' : 'SIAP DIGUNAKAN'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Information Body */}
          <div className="p-6 sm:p-8 space-y-6 text-xs text-stone-700">
            {/* Top Grid Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-stone-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Nomor Tiket / Order</span>
                <span className="font-mono font-bold text-stone-900 text-sm">{foundOrder.id}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Waktu Pemesanan</span>
                <span className="font-semibold text-stone-800">{foundOrder.createdAt || foundOrder.created_at || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Nama Pemesan</span>
                <span className="font-bold text-stone-900">{foundOrder.customerName || foundOrder.customer_name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">No. WhatsApp Pemesan</span>
                <span className="font-mono text-stone-800">{foundOrder.customerPhone || foundOrder.customer_phone}</span>
              </div>
            </div>

            {/* Destination Village */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-emerald-800 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Lokasi Destinasi Desa</span>
                  <span className="font-extrabold text-stone-900 text-sm">
                    {foundOrder.villageName || foundOrder.village_id || 'Kawasan Lembang'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigateTo('desa-detail', undefined, foundOrder.villageId || foundOrder.village_id)}
                className="px-3 py-1.5 bg-emerald-800 text-amber-200 rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors"
              >
                Peta Lokasi Desa
              </button>
            </div>

            {/* Booked Items List */}
            <div className="space-y-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-800" />
                <span>Rincian Layanan / Produk Terdaftar</span>
              </h3>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                {(foundOrder.items || []).map((it: any, idx: number) => {
                  const title = it.product?.title || it.productName || it.product_name || 'Layanan Wisata';
                  const price = it.product?.price || it.price || 0;
                  const qty = it.quantity || 1;
                  return (
                    <div key={idx} className="p-3.5 bg-white flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-bold text-stone-900 text-xs block">{title}</span>
                        <div className="flex items-center gap-3 text-[11px] text-stone-500">
                          <span>Jumlah: {qty}x</span>
                          {it.bookingDateStart && (
                            <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                              <Calendar className="w-3 h-3" />
                              <span>{it.bookingDateStart} {it.bookingDateEnd ? `s.d ${it.bookingDateEnd}` : ''}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-extrabold text-stone-900 text-xs">{formatRupiah(price * qty)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Payment Details */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Nominal Terverifikasi</span>
                <span className="text-lg font-black text-emerald-800">
                  {formatRupiah(foundOrder.totalAmount || foundOrder.total_amount)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Metode Pembayaran</span>
                <span className="font-bold text-stone-800">
                  {foundOrder.paymentMethod || foundOrder.payment_source || 'Midtrans Digital Payment'}
                </span>
              </div>
            </div>

            {/* Gatekeeper & Tourist Action Bar */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleToggleCheckIn}
                className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  isCheckedIn
                    ? 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-amber-200'
                }`}
              >
                <CheckCheck className="w-4 h-4" />
                <span>{isCheckedIn ? 'Batal Status Check-In' : 'Konfirmasi Check-In Tamu (Pintu Masuk)'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-stone-600" />
                <span>Cetak Lembar E-Ticket</span>
              </button>
            </div>
          </div>
        </div>
      ) : searchedOrderId ? (
        <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 text-base">Pesanan Tidak Ditemukan</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Tidak ada data transaksi dengan nomor pesanan <strong>"{searchedOrderId}"</strong>. Pastikan nomor tiket yang Anda masukkan sudah sesuai.
          </p>
        </div>
      ) : null}
    </div>
  );
};
