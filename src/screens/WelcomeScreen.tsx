import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crest } from '../components/Crest';
import { DreamyCanvas } from '../components/DreamyCanvas';
import { Icon } from '../components/Icon';
import { soundService } from '../services/sound';
import { saveProgress } from '../services/storage';
import content from '../content/content.json';

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState<boolean>(soundService.isBgPlaying());
  const [isMuted, setIsMuted] = useState<boolean>(soundService.isAudioMuted());
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleAudioToggle = () => {
    soundService.vibrate([20]);
    if (!isPlaying && !isMuted) {
      soundService.startBackgroundMusic();
      setIsPlaying(true);
    } else {
      const muted = soundService.toggleMute();
      setIsMuted(muted);
    }
  };

  const handlePressStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundService.vibrate([35, 50]);
    soundService.playMagicalCelebrationChime();
    soundService.startBackgroundMusic();
    saveProgress({ hasStarted: true });
    setIsPressing(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setBursts(prev => [...prev, { id: Date.now(), x, y }]);

    setTimeout(() => {
      navigate('/level-map');
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-surface text-on-surface font-sans flex flex-col justify-between overflow-x-hidden overflow-y-auto dreamy-bg-ambient selection:bg-secondary-container selection:text-secondary pt-safe pb-safe">
      {/* Background Stardust & Petals Canvas */}
      <DreamyCanvas particleCount={40} />

      {/* Atmospheric Radial Glows */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-64 h-64 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-16 w-72 h-72 bg-tertiary-container/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-md mx-auto px-5 pt-4">
        <div className="flex items-center gap-1.5 bg-surface-container/70 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-outline-variant/30">
          <Icon name="stars" size={14} className="text-primary" />
          <span className="text-[11px] font-sans font-bold text-primary tracking-widest uppercase">
            QUEST 01 / 20
          </span>
        </div>

        <button
          onClick={() => {
            soundService.vibrate([20]);
            soundService.startBackgroundMusic();
            navigate('/level-map');
          }}
          className="flex items-center gap-1 text-xs font-sans text-on-surface-variant hover:text-primary transition-colors bg-surface-container-low/60 px-3.5 py-1.5 rounded-full shadow-sm"
        >
          <span>{content.welcome.skipText}</span>
          <Icon name="chevron_right" size={14} />
        </button>
      </header>

      {/* Central Hero Block */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-6 max-w-md mx-auto w-full">
        {/* Milestone Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high/90 shadow-lg mb-6 backdrop-blur-md border border-primary/20">
          <Icon name="favorite" size={14} className="text-secondary animate-pulse" />
          <span className="text-[11px] font-sans uppercase tracking-widest text-primary-fixed font-semibold">
            {content.welcome.badge}
          </span>
          <span className="text-primary text-xs">★</span>
        </div>

        {/* Monogram Crest with Candlelight Aura */}
        <div className="relative mb-6">
          <Crest size={130} showRays={true} />
          {/* Floating Washi Tape Tag */}
          <div className="absolute -top-2 -right-3 bg-secondary/85 text-on-secondary px-2.5 py-0.5 rounded-sm text-[10px] font-sans tracking-wider uppercase rotate-6 shadow-sm border border-secondary-fixed/40">
            Monogram
          </div>
        </div>

        {/* Editorial Title */}
        <div className="flex flex-col items-center space-y-1 mb-6">
          <p className="text-[11px] font-sans tracking-[0.2em] uppercase text-secondary font-semibold">
            {content.welcome.tagline}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight leading-tight">
            <span className="title-shimmer-sheen inline-block mr-2">
              {content.welcome.titlePrefix}
            </span>
            <span className="title-shimmer-sheen inline-block mr-2">
              {content.welcome.titleAge}
            </span>
            <span className="title-shimmer-sheen inline-block">
              {content.welcome.titleName}
            </span>
          </h1>
          <p className="text-sm font-sans text-on-surface-variant max-w-xs mt-1">
            {content.welcome.subtitle}
          </p>
        </div>

        {/* Swayam's Handwritten Marginalia Note */}
        <div className="relative w-full max-w-xs mb-8">
          {/* Tape Corner */}
          <div className="absolute -top-2.5 left-6 w-14 h-4 bg-secondary-fixed-dim/40 backdrop-blur-sm -rotate-6 rounded-xs z-10 border border-white/20 pointer-events-none" />
          <div className="relative bg-surface-container/85 backdrop-blur-md p-4 rounded-xl shadow-xl text-left border border-outline-variant/30">
            <div className="flex items-start gap-2.5">
              <Icon name="auto_awesome" size={18} className="text-primary shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="font-serif italic text-sm sm:text-base text-tertiary leading-snug">
                  {content.welcome.swayamQuote}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/20">
                  <span className="text-[11px] font-sans font-semibold text-primary tracking-wide">
                    {content.welcome.swayamSignature}
                  </span>
                  <span className="text-[11px] font-sans text-on-surface-variant flex items-center gap-1">
                    <Icon name="lock_open" size={12} className="text-secondary" />
                    <span>Unlocked</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Interactive "Press Start" CTA */}
        <div className="w-full max-w-xs flex flex-col items-center gap-3 relative">
          <button
            onClick={handlePressStart}
            className={`w-full relative group overflow-hidden bg-gradient-to-r from-primary-fixed via-primary to-primary-container text-on-primary text-sm font-sans font-bold uppercase tracking-wider py-4 px-8 rounded-full cta-floating flex items-center justify-center gap-2 select-none active:scale-[0.96] transition-transform shadow-[0_10px_24px_-4px_rgba(232,201,135,0.4)] ${
              isPressing ? 'scale-95' : ''
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {content.welcome.pressStartText}
              <span className="text-xs animate-bounce">★</span>
            </span>
            <div className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Ripple Wave feedback */}
            {bursts.map(b => (
              <span
                key={b.id}
                className="ripple-wave"
                style={{ width: 120, height: 120, left: b.x - 60, top: b.y - 60 }}
              />
            ))}
          </button>

          {/* Audio Capsule Player */}
          <button
            onClick={handleAudioToggle}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-surface-container/70 backdrop-blur-sm hover:bg-surface-container-high transition-colors shadow-sm border border-outline-variant/20 active:scale-98"
          >
            <div className="flex items-center gap-2 text-left">
              <Icon
                name={isMuted || !isPlaying ? 'volume_off' : 'headphones'}
                size={16}
                className="text-secondary"
              />
              <span className="text-xs font-sans text-on-surface truncate">
                {content.welcome.audioTrackTitle}
              </span>
            </div>
            <div className="flex items-end gap-1 h-3.5 pr-1">
              <span className={`w-1 bg-secondary rounded-full transition-all duration-150 ${isPlaying && !isMuted ? 'h-3' : 'h-1'}`} />
              <span className={`w-1 bg-primary rounded-full transition-all duration-150 ${isPlaying && !isMuted ? 'h-4' : 'h-1'}`} />
              <span className={`w-1 bg-secondary-fixed rounded-full transition-all duration-150 ${isPlaying && !isMuted ? 'h-2' : 'h-1'}`} />
              <span className={`w-1 bg-primary-fixed rounded-full transition-all duration-150 ${isPlaying && !isMuted ? 'h-3.5' : 'h-1'}`} />
            </div>
          </button>

          {/* Secondary Progression Link */}
          <button
            onClick={() => {
              soundService.startBackgroundMusic();
              navigate('/memory-lane');
            }}
            className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors mt-1 py-1"
          >
            <span>Begin Chapter 1: Memory Lane</span>
            <Icon name="arrow_downward" size={14} className="animate-bounce" />
          </button>
        </div>
      </main>

      {/* Keepsake Footer */}
      <footer className="relative z-10 text-center pb-6 pt-2 flex flex-col items-center gap-1">
        <div className="w-12 h-0.5 bg-surface-variant rounded-full mb-1 opacity-60" />
        <p className="text-[10px] font-sans tracking-widest uppercase text-outline">
          {content.welcome.footerText}
        </p>
        <p className="text-xs font-serif italic text-on-surface-variant/70">
          {content.welcome.footerSubtext}
        </p>
      </footer>
    </div>
  );
};
