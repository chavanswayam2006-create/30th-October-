import React, { useState } from 'react';
import { Heart, Sparkles, ImagePlus } from 'lucide-react';

interface PolaroidFrameProps {
  src?: string;
  slotName: string;
  title?: string;
  caption?: string;
  dateOrTag?: string;
  authorTag?: string;
  tilt?: number; // degrees, e.g. -2, -1, 1, 2
  aspectRatio?: '4/3' | '1/1' | '3/4';
  washiTapePosition?: 'left' | 'right' | 'center' | 'none';
  onClick?: () => void;
  className?: string;
}

export const PolaroidFrame: React.FC<PolaroidFrameProps> = ({
  src,
  slotName,
  title,
  caption,
  dateOrTag,
  authorTag,
  tilt = 0,
  aspectRatio = '4/3',
  washiTapePosition = 'left',
  onClick,
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isDev = import.meta.env.DEV;

  const aspectClass =
    aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '3/4'
      ? 'aspect-[3/4]'
      : 'aspect-[4/3]';

  const tiltClass =
    tilt === -2
      ? '-rotate-2'
      : tilt === -1
      ? '-rotate-1'
      : tilt === 1
      ? 'rotate-1'
      : tilt === 2
      ? 'rotate-2'
      : tilt === 3
      ? 'rotate-3'
      : '';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`polaroid-card group relative w-full bg-[#FFF6EA] text-[#2B1B3D] rounded-lg p-3 pb-5 shadow-xl transition-all duration-300 transform ${tiltClass} hover:rotate-0 hover:scale-[1.02] cursor-pointer select-none ${className}`}
    >
      {/* Washi Tape Accent */}
      {washiTapePosition === 'left' && (
        <div className="absolute -top-3 left-6 z-20 w-16 h-4 bg-secondary/50 rounded-sm shadow-sm transform -rotate-6 backdrop-blur-sm pointer-events-none border border-white/20" />
      )}
      {washiTapePosition === 'right' && (
        <div className="absolute -top-3 right-6 z-20 w-16 h-4 bg-primary-fixed-dim/60 rounded-sm shadow-sm transform rotate-6 backdrop-blur-sm pointer-events-none border border-white/20" />
      )}
      {washiTapePosition === 'center' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-24 h-4 bg-secondary/50 rounded-sm shadow-sm transform -rotate-1 backdrop-blur-sm pointer-events-none border border-white/20" />
      )}

      {/* Photo Surface */}
      <div
        className={`relative w-full ${aspectClass} rounded overflow-hidden bg-[#201536] flex flex-col items-center justify-center transition-transform`}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={title || slotName}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-95' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            loading="lazy"
          />
        ) : null}

        {/* Empty Cream Dev / Keepsake Placeholder (when no real photo loaded) */}
        {(!src || hasError || !isLoaded) && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a1b42] to-[#1a0e2e] flex flex-col items-center justify-center p-4 text-center">
            {/* Delicate Stardust Glow */}
            <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary mb-2 shadow-[0_0_16px_rgba(232,201,135,0.3)]">
              <Heart size={22} className="text-secondary fill-secondary/20 animate-pulse" />
            </div>

            <p className="font-serif italic text-primary-fixed text-sm mb-1">
              {title || 'Cherished Memory'}
            </p>

            {/* Dev Only: Slot watermark so Swayam knows which slot this is */}
            {isDev ? (
              <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high/90 text-primary border border-primary/30 text-[10px] tracking-wide">
                <ImagePlus size={12} />
                <span>Add photo: {slotName}</span>
              </div>
            ) : (
              <span className="text-[11px] text-on-surface-variant/80 tracking-widest uppercase">
                ✦ Level 20 Keepsake ✦
              </span>
            )}
          </div>
        )}

        {/* Subtle photo badge overlay */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-[#180d2d]/70 backdrop-blur-md text-primary text-[10px] flex items-center gap-1 pointer-events-none">
          <Sparkles size={10} />
          <span>{slotName}</span>
        </div>
      </div>

      {/* Caption & Marginalia Area */}
      {(title || caption || dateOrTag || authorTag) && (
        <div className="pt-3 px-1 flex flex-col">
          {title && (
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <h3 className="font-serif text-sm font-semibold tracking-tight text-[#2B1B3D] truncate">
                {title}
              </h3>
              {dateOrTag && (
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8E5B6A] shrink-0">
                  {dateOrTag}
                </span>
              )}
            </div>
          )}

          {caption && (
            <p className="font-serif italic text-xs leading-relaxed text-[#593946] line-clamp-2">
              {caption}
            </p>
          )}

          {authorTag && (
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#E8DFC8]/60 text-[10px] text-[#8E5B6A]">
              <span className="italic flex items-center gap-1">
                <span>♥</span> {authorTag}
              </span>
              <span className="text-primary-container font-semibold">I✦S</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
