import React from 'react';

interface CrestProps {
  className?: string;
  size?: number;
  showRays?: boolean;
}

export const Crest: React.FC<CrestProps> = ({
  className = '',
  size = 140,
  showRays = false
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Rotating Stardust Halo Rays (optional) */}
      {showRays && (
        <div className="absolute -inset-4 ray-glow opacity-60 pointer-events-none">
          <svg className="w-full h-full" fill="none" viewBox="0 0 120 120">
            <line x1="60" y1="2" x2="60" y2="16" stroke="#FFE6B5" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="60" y1="104" x2="60" y2="118" stroke="#FFE6B5" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="2" y1="60" x2="16" y2="60" stroke="#FFE6B5" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="104" y1="60" x2="118" y2="60" stroke="#FFE6B5" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18.97" y1="18.97" x2="28.87" y2="28.87" stroke="#F4B6C2" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="91.13" y1="91.13" x2="101.03" y2="101.03" stroke="#F4B6C2" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="18.97" y1="101.03" x2="28.87" y2="91.13" stroke="#F4B6C2" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="91.13" y1="28.87" x2="101.03" y2="18.97" stroke="#F4B6C2" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Atmospheric Ambient Glow behind seal */}
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl pointer-events-none animate-pulse" />

      <svg
        viewBox="0 0 160 160"
        className="w-full h-full drop-shadow-[0_8px_24px_rgba(10,5,20,0.8)] relative z-10"
        fill="none"
      >
        <defs>
          <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF0D0" />
            <stop offset="50%" stopColor="#E8C987" />
            <stop offset="100%" stopColor="#8C6D37" />
          </linearGradient>
          <linearGradient id="crestDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2F2445" />
            <stop offset="100%" stopColor="#1B1030" />
          </linearGradient>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Filigree Ring */}
        <circle cx="80" cy="80" r="74" stroke="url(#crestGold)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
        <circle cx="80" cy="80" r="69" stroke="url(#crestGold)" strokeWidth="2.5" />
        <circle cx="80" cy="80" r="64" fill="url(#crestDark)" stroke="url(#crestGold)" strokeWidth="1" />

        {/* Inner Stardust Ring */}
        <circle cx="80" cy="80" r="54" stroke="#FFE6B5" strokeWidth="1" strokeDasharray="1 4" opacity="0.6" />

        {/* Four Cardinal Star Diamond Accents */}
        <polygon points="80,18 82,23 87,23 83,26 85,31 80,28 75,31 77,26 73,23 78,23" fill="#FFE6B5" />
        <polygon points="80,142 82,137 87,137 83,134 85,129 80,132 75,129 77,134 73,137 78,137" fill="#FFE6B5" />
        <circle cx="24" cy="80" r="2.5" fill="#F4B6C2" />
        <circle cx="136" cy="80" r="2.5" fill="#F4B6C2" />

        {/* Central Monogram */}
        <g filter="url(#goldGlow)">
          {/* Letter I */}
          <text
            x="58"
            y="94"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="42"
            fontWeight="600"
            fontStyle="italic"
            fill="url(#crestGold)"
            textAnchor="middle"
          >
            I
          </text>
          {/* Stardust Sparkle Divider */}
          <text
            x="80"
            y="87"
            fontFamily="system-ui"
            fontSize="20"
            fill="#FFE6B5"
            textAnchor="middle"
          >
            ✦
          </text>
          {/* Letter S */}
          <text
            x="102"
            y="94"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="42"
            fontWeight="600"
            fontStyle="italic"
            fill="url(#crestGold)"
            textAnchor="middle"
          >
            S
          </text>
        </g>

        {/* Micro Arch Text: LEVEL 20 · OCT 30 */}
        <text
          x="80"
          y="44"
          fontFamily="'DM Sans', sans-serif"
          fontSize="7.5"
          fontWeight="600"
          letterSpacing="0.18em"
          fill="#FFE6B5"
          textAnchor="middle"
        >
          LEVEL 20 · ODYSSEY
        </text>
        <text
          x="80"
          y="124"
          fontFamily="'DM Sans', sans-serif"
          fontSize="7"
          fontWeight="600"
          letterSpacing="0.2em"
          fill="#F4B6C2"
          textAnchor="middle"
        >
          30 · 10 · 2026
        </text>
      </svg>
    </div>
  );
};
