// src/components/TicketQRCode.tsx
// Visual Vector QR Code generator for Saba Lembang E-Tickets & Gatekeeper Check-In
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ExternalLink, Check, Copy } from 'lucide-react';

interface TicketQRCodeProps {
  orderId: string;
  size?: number;
  showUrlText?: boolean;
  className?: string;
}

export const TicketQRCode: React.FC<TicketQRCodeProps> = ({
  orderId,
  size = 160,
  showUrlText = true,
  className = '',
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate target verification URL
  const verificationUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/cek-pesanan?orderId=${encodeURIComponent(orderId)}`
      : `https://sabalembang.id/cek-pesanan?orderId=${encodeURIComponent(orderId)}`;

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(
      verificationUrl,
      {
        width: size * 2, // 2x for retina / sharp printing
        margin: 1,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#1c1917', // stone-900
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && isMounted && url) {
          setDataUrl(url);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, [verificationUrl, size]);

  const handleCopyUrl = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(verificationUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div 
        className="p-2.5 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-center print:border-stone-800 print:shadow-none"
        style={{ width: size + 20, height: size + 20 }}
      >
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={`QR Code Verifikasi E-Ticket ${orderId}`}
            width={size}
            height={size}
            className="rounded-lg object-contain print:w-full print:h-full"
            style={{ imageRendering: 'crisp-edges' }}
          />
        ) : (
          <div 
            className="flex items-center justify-center text-stone-400 text-xs animate-pulse"
            style={{ width: size, height: size }}
          >
            Memuat QR...
          </div>
        )}
      </div>

      {showUrlText && (
        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 print:text-black">
          <span className="font-mono font-medium text-stone-700 print:text-black">
            ID: <strong className="text-emerald-900 print:text-black">{orderId}</strong>
          </span>
          <button
            type="button"
            onClick={handleCopyUrl}
            title="Salin Tautan Verifikasi"
            className="p-1 text-stone-400 hover:text-emerald-700 transition-colors print:hidden"
            aria-label="Salin Tautan Verifikasi"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka Halaman Verifikasi"
            className="p-1 text-stone-400 hover:text-emerald-700 transition-colors print:hidden"
            aria-label="Buka Halaman Verifikasi"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
};
