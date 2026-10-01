import React, { useState } from 'react';

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
  sizeClassName?: string;
}

/**
 * WhatsApp-style "No Profile Picture" avatar component.
 * Displays an authentic WhatsApp silhouette placeholder if no image is provided,
 * if image load fails, or if a legacy dummy stock face was assigned.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = 'Profil Pengguna',
  className = '',
  sizeClassName = 'w-8 h-8'
}) => {
  const [hasError, setHasError] = useState(false);

  // Check if src is dummy unsplash face or empty
  const isDummyFace = !src || src.includes('/images/unsplash/photo-') || src.includes('default-avatar.svg');

  if (isDummyFace || hasError) {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none bg-[#DFE5E7] ${sizeClassName} ${className}`}
        aria-label={alt}
        title={alt}
      >
        <svg
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* WhatsApp Silhouette Head */}
          <circle cx="64" cy="46" r="23" fill="#FFFFFF" />
          {/* WhatsApp Silhouette Torso */}
          <path
            d="M64 76 c-26 0 -47 16 -49 40 11 9 24 14 37 14 4 0 8 0 12 0 13 0 26 -5 37 -14 -2 -24 -23 -40 -49 -40 z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative inline-block rounded-full overflow-hidden shrink-0 ${sizeClassName} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
      />
    </div>
  );
};
