import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WHATSAPP_PHONE, formatWhatsAppUrl, createGeneralWhatsAppMessage } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = customMsg.trim() || createGeneralWhatsAppMessage();
    const url = formatWhatsAppUrl(WHATSAPP_PHONE, textToSend);
    window.open(url, '_blank');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start print:hidden">
      
      {/* Chat Popover */}
      {isOpen && (
        <div 
          role="region"
          aria-label={language === 'en' ? 'Village Admin WhatsApp Support' : 'Layanan Bantuan WhatsApp Admin Desa'}
          className="mb-3 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-stone-900 to-emerald-950 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="/images/logo-saba-lembang.png" 
                  alt="Admin Saba Lembang" 
                  loading="lazy"
                  decoding="async"
                  className="w-10 h-10 rounded-full border-2 border-amber-300 object-contain shadow-md" 
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Admin Saba Lembang</h4>
                <p className="text-[11px] text-emerald-200">
                  {language === 'en' ? 'Lembang Region Inter-Village Platform' : 'Platform Interdesa Kawasan Lembang'}
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={language === 'en' ? 'Close chat' : 'Tutup jendela chat'}
              className="p-1 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800/60 focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-amber-50/40 space-y-3 text-xs">
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-stone-200 shadow-xs space-y-1.5 max-w-[90%]">
              <p className="font-semibold text-emerald-900">
                {language === 'en' ? 'Welcome to Saba Lembang! 🙏' : 'Sampurasun! 🙏'}
              </p>
              <p className="text-stone-700 leading-relaxed">
                {language === 'en'
                  ? 'How can we help you regarding local commodities, homestays, or tour packages in Lembang Region?'
                  : 'Ada yang bisa kami bantu seputar produk komoditas, homestay, atau paket wisata desa di Kawasan Lembang?'}
              </p>
              <span className="text-[10px] text-stone-600 font-medium block text-right">
                {language === 'en' ? 'Admin Online' : 'Admin Online'}
              </span>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setCustomMsg(language === 'en' ? 'Hello Saba Lembang Admin, I would like to inquire about homestays and stays in Lembang Region.' : 'Halo Admin Saba Lembang, saya ingin tanya ketersediaan Penginapan & Homestay di Kawasan Lembang.')}
                className="px-3 py-1.5 min-h-[32px] bg-white border border-stone-200 hover:border-emerald-700 text-stone-800 rounded-full text-[11px] font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                {language === 'en' ? '🏡 Stays & Homestays' : '🏡 Penginapan & Homestay'}
              </button>
              <button
                type="button"
                onClick={() => setCustomMsg(language === 'en' ? 'Hello Saba Lembang Admin, I would like information about nature tours, camping & Cikole offroad.' : 'Halo Admin Saba Lembang, saya ingin info Paket Wisata Alam, Camping & Offroad Cikole.')}
                className="px-3 py-1.5 min-h-[32px] bg-white border border-stone-200 hover:border-emerald-700 text-stone-800 rounded-full text-[11px] font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                {language === 'en' ? '🎒 Nature Tours & Offroad' : '🎒 Paket Wisata Alam'}
              </button>
              <button
                type="button"
                onClick={() => setCustomMsg(language === 'en' ? 'Hello Saba Lembang Admin, I would like to consult on specialty coffee, organic crops & fresh dairy products.' : 'Halo Admin Saba Lembang, saya ingin konsultasi produk Kopi, Sayuran Organik, & Olahan Susu desa wisata.')}
                className="px-3 py-1.5 min-h-[32px] bg-white border border-stone-200 hover:border-emerald-700 text-stone-800 rounded-full text-[11px] font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                {language === 'en' ? '☕ Coffee & Produce' : '☕ Kopi & Komoditas'}
              </button>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder={language === 'en' ? 'Type your inquiry here...' : 'Tulis pertanyaan Anda...'}
              aria-label={language === 'en' ? 'Type your inquiry here' : 'Tulis pertanyaan Anda'}
              className="flex-1 px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-2xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <button
              type="submit"
              className="p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-all hover:scale-105 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-800"
              title="Kirim ke WhatsApp"
              aria-label="Kirim pertanyaan ke WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? (language === 'en' ? 'Close WhatsApp support chat' : 'Tutup chat bantuan WhatsApp') : (language === 'en' ? 'Open WhatsApp support chat with Village Admin' : 'Buka bantuan WhatsApp Admin Desa')}
        className="flex items-center gap-2.5 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white group cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-700"
        title={language === 'en' ? 'Village Admin WhatsApp Support' : 'Bantuan WhatsApp Admin Desa'}
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-emerald-700" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping motion-reduce:animate-none"></span>
        </div>
        <span className="text-xs font-bold font-sans tracking-wide">
          {isOpen ? (language === 'en' ? 'Close Chat' : 'Tutup Chat') : (language === 'en' ? 'Chat Village Admin' : 'Tanya Admin Desa')}
        </span>
      </button>

    </div>
  );
};
