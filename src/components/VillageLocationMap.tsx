import React, { useState } from 'react';
import { Village } from '../types';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  ExternalLink, 
  Clock, 
  Building2, 
  Navigation, 
  ShieldCheck, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { formatWhatsAppUrl } from '../utils/whatsapp';

interface VillageLocationMapProps {
  villages: Village[];
  initialVillageId?: string;
  onVillageChange?: (villageId: string) => void;
  className?: string;
  showTitle?: boolean;
}

export const VillageLocationMap: React.FC<VillageLocationMapProps> = ({
  villages,
  initialVillageId,
  onVillageChange,
  className = '',
  showTitle = true
}) => {
  const [activeVillageId, setActiveVillageId] = useState<string>(
    initialVillageId || (villages.length > 0 ? villages[0].id : 'des-01')
  );

  // Sync if initialVillageId changes from outside
  React.useEffect(() => {
    if (initialVillageId && initialVillageId !== activeVillageId) {
      setActiveVillageId(initialVillageId);
    }
  }, [initialVillageId]);

  const currentVillage = villages.find(v => v.id === activeVillageId) || villages[0];

  const handleSelectVillage = (id: string) => {
    setActiveVillageId(id);
    if (onVillageChange) {
      onVillageChange(id);
    }
  };

  if (!currentVillage) return null;

  // Prepare map query and embed
  const defaultEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(
    currentVillage.officeAddress || `${currentVillage.name}, Lembang, Bandung Barat`
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const mapEmbedSrc = currentVillage.officeMapEmbedUrl || defaultEmbed;
  
  const googleMapsExternalUrl = currentVillage.googleMapsUrl || 
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      currentVillage.officeAddress || `${currentVillage.name}, Lembang, Kabupaten Bandung Barat`
    )}`;

  const cleanPhone = currentVillage.contactPhone ? currentVillage.contactPhone.replace(/[^0-9]/g, '') : '';
  const waContactUrl = cleanPhone 
    ? formatWhatsAppUrl(cleanPhone, `Halo Admin ${currentVillage.name}, saya ingin bertanya seputar informasi desa dan layanan wisata.`)
    : '';

  return (
    <div className={`bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden ${className}`}>
      
      {showTitle && (
        <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white border-b border-emerald-800/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Peta & Kontak Resmi Kantor Desa</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-serif-title text-white">
                Lokasi Kantor Desa & Kontak di Kawasan Lembang
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
                Pilih salah satu desa wisata di bawah untuk melihat lokasi kantor desa secara presisi di peta serta nomor kontak/CP resmi pengelola desa.
              </p>
            </div>

            {/* Dropdown Selector on Header (Desktop/Mobile) */}
            <div className="w-full md:w-72 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
              <label className="block text-[10px] uppercase font-extrabold text-amber-300 tracking-wider mb-1 px-1">
                Pilih Desa:
              </label>
              <div className="relative">
                <select
                  value={activeVillageId}
                  onChange={(e) => handleSelectVillage(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 bg-white text-stone-900 rounded-xl text-xs sm:text-sm font-bold shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer appearance-none"
                >
                  {villages.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.villageAltitude || '1.250 mdpl'})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Village Quick Selector Pills */}
      <div className="p-4 bg-stone-50 border-b border-stone-200/80 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-xs font-bold text-stone-700 shrink-0 flex items-center gap-1 mr-1">
          <Navigation className="w-3.5 h-3.5 text-emerald-800" />
          <span>Pilih Cepat:</span>
        </span>
        {villages.map((v) => {
          const isActive = v.id === activeVillageId;
          return (
            <button
              key={v.id}
              onClick={() => handleSelectVillage(v.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-800 text-amber-200 shadow-xs scale-102'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              {v.name.replace('Desa Wisata ', 'Desa ')}
            </button>
          );
        })}
      </div>

      {/* Main Content Area: Maps + Village Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left Side: Interactive Map Embed (7 Cols) */}
        <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] bg-stone-100 border-b lg:border-b-0 lg:border-r border-stone-200">
          <iframe
            title={`Peta Kantor ${currentVillage.name}`}
            src={mapEmbedSrc}
            width="100%"
            height="100%"
            className="w-full h-full min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] border-0"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Right Side: Village Info & CP Contact Details (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
          
          <div className="space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-[11px] font-bold border border-emerald-200">
                  {currentVillage.province || 'Jawa Barat'}
                </span>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-950 rounded-full text-[11px] font-bold border border-amber-200">
                  {currentVillage.villageAltitude || '1.250 mdpl'}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold font-serif-title text-stone-900">
                {currentVillage.name}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Kecamatan Lembang, Kabupaten Bandung Barat
              </p>
            </div>

            {/* Office Address Card */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 text-stone-800 text-xs font-bold">
                <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Alamat Kantor Desa:</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-medium pl-6">
                {currentVillage.officeAddress || currentVillage.mapLocation || 'Jl. Raya Lembang, Kab. Bandung Barat'}
              </p>
              
              <div className="pt-2 border-t border-stone-200/60 pl-6 flex items-center gap-2 text-[11px] text-stone-500">
                <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Jam Pelayanan: Senin - Jumat (08.00 - 15.00 WIB)</span>
              </div>
            </div>

            {/* CP / Kontak Desa */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Kontak & Layanan Admin Desa:</span>
              </h4>

              {currentVillage.contactPhone ? (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                          CP / Admin Desa Resmi:
                        </p>
                        <p className="text-xs sm:text-sm font-extrabold text-stone-900">
                          {currentVillage.contactPhone}
                        </p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 bg-emerald-200/80 text-emerald-900 text-[10px] font-extrabold rounded-md">
                      Aktif
                    </span>
                  </div>

                  {waContactUrl && (
                    <a
                      href={waContactUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Hubungi via WhatsApp</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500 italic">
                  Kontak resmi desa sedang dalam proses sinkronisasi data final.
                </div>
              )}
            </div>

          </div>

          {/* External Action Button */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-2.5">
            <a
              href={googleMapsExternalUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-amber-200 font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>Buka Petunjuk Arah di Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
