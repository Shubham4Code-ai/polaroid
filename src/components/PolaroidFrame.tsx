import React, { useState } from 'react';
import { PolaroidSize, BorderColor, PaperFinish, CaptionFont, PhotoFilter } from '../types';
import { Image as ImageIcon } from 'lucide-react';

interface PolaroidFrameProps {
  imageUrl: string;
  caption?: string;
  captionFont?: CaptionFont;
  size?: PolaroidSize;
  border?: BorderColor;
  finish?: PaperFinish;
  showDateStamp?: boolean;
  dateStampText?: string;
  roundedCorners?: boolean;
  tiltDegree?: number;
  interactiveLift?: boolean;
  className?: string;
  adjustments?: {
    zoom?: number;
    panX?: number;
    panY?: number;
    rotation?: number;
    brightness?: number;
    contrast?: number;
    filter?: PhotoFilter;
  };
  onClick?: () => void;
}

export const PolaroidFrame: React.FC<PolaroidFrameProps> = ({
  imageUrl,
  caption = '',
  captionFont = 'caveat',
  size = 'classic',
  border = 'white',
  finish = 'matte',
  showDateStamp = false,
  dateStampText = 'OCT 26',
  roundedCorners = false,
  tiltDegree = 0,
  interactiveLift = true,
  className = '',
  adjustments = {},
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const {
    zoom = 1,
    panX = 0,
    panY = 0,
    rotation = 0,
    brightness = 100,
    contrast = 100,
    filter = 'original',
  } = adjustments;

  // Background tones for the authentic polaroid frame
  const borderBackgrounds: Record<BorderColor, string> = {
    white: 'bg-[#FCFCFC] border-[#E8E4DC] text-[#222222]',
    cream: 'bg-[#FAF6EC] border-[#E4DEC9] text-[#2A2621]',
    noir: 'bg-[#18181A] border-[#2C2C30] text-[#EDE8DF]',
    sage: 'bg-[#EFF3EE] border-[#D2DDD0] text-[#243324]',
    rose: 'bg-[#FAF0EE] border-[#EAD3CE] text-[#3D2624]',
  };

  // Dimensions based on iconic polaroid ratios
  const frameDimensions: Record<PolaroidSize, { widthClass: string; photoAspect: string; photoHeight: string }> = {
    classic: {
      widthClass: 'w-[240px] sm:w-[260px]',
      photoAspect: 'aspect-square',
      photoHeight: 'h-[200px] sm:h-[216px]',
    },
    mini: {
      widthClass: 'w-[190px] sm:w-[210px]',
      photoAspect: 'aspect-[3/4]',
      photoHeight: 'h-[210px] sm:h-[235px]',
    },
    square: {
      widthClass: 'w-[230px] sm:w-[250px]',
      photoAspect: 'aspect-square',
      photoHeight: 'h-[190px] sm:h-[210px]',
    },
    wide: {
      widthClass: 'w-[280px] sm:w-[310px]',
      photoAspect: 'aspect-[4/3]',
      photoHeight: 'h-[175px] sm:h-[195px]',
    },
  };

  // Filter styles
  const filterStyles: Record<PhotoFilter, string> = {
    original: '',
    bw: 'grayscale contrast-125',
    sepia: 'sepia contrast-110 saturate-125',
    vintage: 'sepia-[0.35] saturate-110 hue-rotate-[-5deg] contrast-105',
    faded: 'contrast-90 brightness-105 saturate-75',
  };

  const currentDim = frameDimensions[size] || frameDimensions.classic;
  const borderStyle = borderBackgrounds[border] || borderBackgrounds.white;

  // Caption font classes
  const fontClasses: Record<CaptionFont, string> = {
    caveat: 'font-polaroid-hand text-xl tracking-wide',
    homemade: 'font-polaroid-cursive text-sm tracking-normal',
    sans: 'font-sans text-xs uppercase tracking-wider font-semibold',
    serif: 'font-serif-display text-sm tracking-wide italic',
  };

  return (
    <div
      onClick={onClick}
      style={{
        transform: `rotate(${tiltDegree}deg)`,
      }}
      className={`relative select-none border transition-all duration-300 ${
        interactiveLift ? 'hover:-translate-y-2 hover:rotate-0 hover:z-20 cursor-pointer polaroid-lift-shadow' : 'polaroid-shadow'
      } ${currentDim.widthClass} ${borderStyle} ${
        roundedCorners ? 'rounded-xl p-3 pb-6 sm:p-3.5 sm:pb-8' : 'rounded-[2px] p-3 pb-7 sm:p-3.5 sm:pb-9'
      } ${className}`}
    >
      {/* Photo Frame Container */}
      <div
        className={`relative overflow-hidden w-full ${currentDim.photoAspect} bg-[#121212] ${
          roundedCorners ? 'rounded-lg' : 'rounded-[1px]'
        } shadow-inner border border-black/10`}
      >
        {!imageError ? (
          <img
            src={imageUrl}
            alt={caption || 'Custom Polaroid Print'}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            style={{
              transform: `scale(${zoom}) translate(${panX}%, ${panY}%) rotate(${rotation}deg)`,
              filter: `brightness(${brightness}%) contrast(${contrast}%)`,
            }}
            className={`w-full h-full object-cover transition-transform duration-200 ${filterStyles[filter]}`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#2A2724] text-[#C9A66B] p-4 text-center">
            <ImageIcon className="w-8 h-8 mb-2 opacity-60" />
            <span className="text-[11px] uppercase tracking-wider font-medium text-stone-300">
              Archival Print
            </span>
          </div>
        )}

        {/* Paper Finish Layer: Glossy Sheen or Matte Fine Grain */}
        {finish === 'glossy' && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/15 to-white/30 mix-blend-overlay" />
        )}
        {finish === 'matte' && (
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:4px_4px]" />
        )}

        {/* Vintage Date Stamp in corner if enabled */}
        {showDateStamp && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-xs text-[#FF8533] font-mono text-[9px] tracking-widest uppercase font-bold border border-[#FF8533]/30">
            {dateStampText}
          </div>
        )}
      </div>

      {/* Thick Bottom Caption Area */}
      <div className="pt-3 text-center min-h-[36px] flex items-center justify-center px-1">
        {caption ? (
          <p
            className={`truncate max-w-full leading-tight ${fontClasses[captionFont]} ${
              border === 'noir' ? 'text-amber-100/90' : 'text-stone-800'
            }`}
          >
            {caption}
          </p>
        ) : (
          <span className="text-[10px] tracking-widest uppercase opacity-25 font-mono">
            atelier print
          </span>
        )}
      </div>

      {/* Tiny subtle watermark dot on corner indicating artisanal paper weight */}
      <div
        className={`absolute bottom-1 right-2 text-[8px] tracking-tighter opacity-20 uppercase font-mono ${
          border === 'noir' ? 'text-white' : 'text-stone-600'
        }`}
      >
        350 GSM
      </div>
    </div>
  );
};
