import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { WHATSAPP_PHONE, formatWhatsAppUrl, createGeneralWhatsAppMessage } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Popover */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-700 border-2 border-amber-300 flex items-center justify-center font-bold text-white text-sm">
                  SS
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Pokdarwis Saba Sunten</h4>
                <p className="text-[11px] text-emerald-200">Desa Wisata Suntenjaya Lembang</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-amber-50/40 space-y-3 text-xs">
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-stone-200 shadow-xs space-y-1.5 max-w-[85%]">
              <p className="font-semibold text-emerald-900">Sampurasun! 🙏</p>
              <p className="text-stone-700 leading-relaxed">
                Ada yang bisa kami bantu seputar homestay, paket wisata edukasi, atau sayur organik & kopi Desa Suntenjaya?
              </p>
              <span className="text-[10px] text-stone-400 block text-right">Online</span>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setCustomMsg('Halo, saya ingin tanya ketersediaan Homestay di Pasir Angling akhir pekan ini.')}
                className="px-2.5 py-1 bg-white border border-stone-200 hover:border-emerald-700 text-stone-700 rounded-full text-[11px] transition-colors"
              >
                🏡 Tanya Homestay
              </button>
              <button
                type="button"
                onClick={() => setCustomMsg('Halo, saya ingin info Paket Live-in Edukasi & Perah Susu Sapi Suntenjaya.')}
                className="px-2.5 py-1 bg-white border border-stone-200 hover:border-emerald-700 text-stone-700 rounded-full text-[11px] transition-colors"
              >
                🎒 Paket Wisata
              </button>
              <button
                type="button"
                onClick={() => setCustomMsg('Halo, saya ingin pesan Kopi Arabika & Sayuran Organik Segar Desa Suntenjaya.')}
                className="px-2.5 py-1 bg-white border border-stone-200 hover:border-emerald-700 text-stone-700 rounded-full text-[11px] transition-colors"
              >
                ☕ Kopi & Sayur
              </button>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Tulis pesan Anda ke WhatsApp..."
              className="flex-1 px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-2xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <button
              type="submit"
              className="p-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-all hover:scale-105"
              title="Kirim ke WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full shadow-2xl transition-all hover:scale-105 border-2 border-amber-300"
        title="Hubungi Kami di WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white text-emerald-800 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-extrabold tracking-wide hidden sm:inline">
          Pesan via WhatsApp
        </span>
      </button>

    </div>
  );
};
