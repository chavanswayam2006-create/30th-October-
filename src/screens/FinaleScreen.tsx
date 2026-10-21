import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Shell } from '../components/Shell';
import { Crest } from '../components/Crest';
import { Icon } from '../components/Icon';
import { soundService } from '../services/sound';
import { resetProgress, saveProgress, loadProgress } from '../services/storage';
import content from '../content/content.json';

export const FinaleScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isBoxOpen, setIsBoxOpen] = useState<boolean>(true);
  const [sfxOn, setSfxOn] = useState<boolean>(soundService.isSFXEnabled());
  const fireworksCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const heartsContainerRef = useRef<HTMLDivElement | null>(null);

  // Mark Finale completed in progress
  useEffect(() => {
    const cur = loadProgress();
    saveProgress({
      masteredLevels: [...new Set([...cur.masteredLevels, 8])],
      currentLevel: 8
    });
  }, []);

  // Continuous floating hearts rising animation
  useEffect(() => {
    const container = heartsContainerRef.current;
    if (!container) return;

    const heartSymbols = ['♥', '💖', '✨', '🌸', '✦', '💫'];
    const heartColors = ['#F472B6', '#E8C987', '#C084FC', '#FB923C', '#E0E7FF', '#FB7185'];

    const spawnHeart = () => {
      if (!container) return;
      const el = document.createElement('div');
      const symbol = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      const color = heartColors[Math.floor(Math.random() * heartColors.length)];
      const left = Math.random() * 90 + 5;
      const duration = Math.random() * 6 + 7;
      const size = Math.random() * 10 + 12;

      el.innerText = symbol;
      el.style.position = 'absolute';
      el.style.left = `${left}%`;
      el.style.bottom = '-30px';
      el.style.color = color;
      el.style.fontSize = `${size}px`;
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
      el.style.animation = `floatUpHeart ${duration}s cubic-bezier(0.25, 1, 0.5, 1) forwards`;

      container.appendChild(el);
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, duration * 1000);
    };

    const interval = setInterval(spawnHeart, 1200);
    for (let i = 0; i < 5; i++) {
      setTimeout(spawnHeart, i * 300);
    }

    return () => clearInterval(interval);
  }, []);

  // Fireworks canvas simulation
  useEffect(() => {
    const canvas = fireworksCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const colors = ['#ffe6b5', '#ffdf9b', '#f4b6c2', '#e8c987', '#ede5ff', '#ffd9df', '#ffffff'];

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
    }

    const sparks: Spark[] = [];

    const triggerBurst = (x: number, y: number, count = 40) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 1.5;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2.5 + 1.5
        });
      }
    };

    // Initial celebratory bursts
    setTimeout(() => triggerBurst(width * 0.25, height * 0.2, 45), 300);
    setTimeout(() => triggerBurst(width * 0.75, height * 0.22, 45), 650);
    setTimeout(() => triggerBurst(width * 0.5, height * 0.16, 55), 1100);

    // Periodic fireworks bursts
    const periodicInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        const rx = width * (0.15 + Math.random() * 0.7);
        const ry = height * (0.12 + Math.random() * 0.25);
        triggerBurst(rx, ry, Math.floor(Math.random() * 20 + 30));
      }
    }, 2800);

    const update = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05; // gravity
        s.alpha -= 0.018;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(periodicInterval);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const triggerCelebration = () => {
    soundService.vibrate([35, 60, 45]);
    soundService.playMagicalCelebrationChime();
    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.55 }
    });
  };

  const handleToggleBox = (openState?: boolean) => {
    const nextState = openState !== undefined ? openState : !isBoxOpen;
    setIsBoxOpen(nextState);
    if (nextState) {
      triggerCelebration();
    } else {
      soundService.vibrate([20]);
      soundService.playClickTone('tap');
    }
  };

  const handleToggleSFX = () => {
    const next = soundService.toggleSFX();
    setSfxOn(next);
    soundService.vibrate([15]);
  };

  const handleReplayJourney = () => {
    soundService.vibrate([30, 40]);
    resetProgress();
    navigate('/');
  };

  return (
    <Shell
      screenTitle="The Finale"
      nextPath="/"
      skipPath="/"
    >
      <div className="flex flex-col w-full relative pb-12 max-w-xl mx-auto space-y-6">
        {/* Full-screen Celebratory Fireworks Canvas */}
        <canvas
          ref={fireworksCanvasRef}
          className="fixed inset-0 pointer-events-none z-10"
        />

        {/* Floating Hearts Rising Container */}
        <div
          ref={heartsContainerRef}
          className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
        />

        {/* Celebration Header */}
        <header className="flex flex-col items-center text-center space-y-2 pt-2 relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high/90 shadow-lg border border-primary/20">
            <span className="text-primary text-xs animate-spin" style={{ animationDuration: '8s' }}>
              ✦
            </span>
            <span className="text-[11px] font-sans font-bold text-primary-fixed tracking-widest uppercase">
              {content.finale.badge}
            </span>
            <span className="text-primary text-xs animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}>
              ✦
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-primary tracking-tight font-medium drop-shadow-[0_2px_12px_rgba(232,201,135,0.35)]">
            {content.finale.title}
          </h1>

          <p className="font-sans text-sm text-secondary-fixed-dim flex items-center justify-center gap-1.5">
            <span>{content.finale.subtitle}</span>
          </p>
        </header>

        {/* Centered Golden Crest with Rotating Rays */}
        <div className="relative flex flex-col items-center justify-center my-2 py-2 z-20">
          <div className="relative flex items-center justify-center">
            <Crest size={150} showRays={true} />
          </div>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary-container to-transparent mt-3 opacity-70" />
        </div>

        {/* Swayam's Handwritten Letter Parchment Card */}
        <section className="relative z-20 w-full max-w-md mx-auto my-2">
          {/* Washi Tape Strips */}
          <div className="absolute -top-3 left-6 w-16 h-5 bg-secondary/50 rounded-sm -rotate-6 backdrop-blur-sm shadow-sm z-30 pointer-events-none border border-white/20" />
          <div className="absolute -top-3 right-6 w-16 h-5 bg-secondary/50 rounded-sm rotate-6 backdrop-blur-sm shadow-sm z-30 pointer-events-none border border-white/20" />

          {/* Cream Paper Body (#FFF6EA) */}
          <div className="bg-[#FFF6EA] text-[#33261D] rounded-2xl p-6 sm:p-7 relative shadow-2xl parchment-glow border border-[#E8DFC8]">
            {/* Monogram Postmark Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E8DFC8]">
              <div className="flex items-center gap-2">
                <span className="text-[#8C6D37] text-base">❧</span>
                <span className="text-[10px] font-sans font-bold tracking-widest text-[#8C6D37] uppercase">
                  {content.finale.letterHeader}
                </span>
              </div>
              <span className="text-[11px] font-sans text-[#A89880]">
                {content.finale.letterDate}
              </span>
            </div>

            {/* Letter Body */}
            <div className="pt-4 space-y-3.5 text-left">
              <h2 className="font-serif italic text-lg sm:text-xl text-[#251A00] font-semibold">
                {content.finale.letterSalutation}
              </h2>

              <p className="font-serif text-sm sm:text-base text-[#3E2E20] leading-relaxed">
                {content.finale.letterParagraph1}
              </p>

              <p className="font-serif text-sm sm:text-base text-[#3E2E20] leading-relaxed">
                {content.finale.letterParagraph2}
              </p>

              <p className="font-serif italic text-xs sm:text-sm text-[#59440E] leading-relaxed">
                {content.finale.letterParagraph3}
              </p>

              <div className="pt-3 flex flex-col items-end border-t border-[#E8DFC8]/60">
                <p className="font-serif italic text-sm text-[#4C242E]">
                  {content.finale.letterSignoff}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-serif text-lg font-medium text-[#251A00]">
                    {content.finale.letterAuthor}
                  </span>
                  <span className="text-secondary-container text-base">♥</span>
                </div>
              </div>
            </div>

            {/* Tactile Wax Seal Corner Accent */}
            <div className="absolute -bottom-4 right-6 w-11 h-11 rounded-full bg-primary-container shadow-[0_4px_12px_rgba(106,83,29,0.35)] flex items-center justify-center text-on-primary-container font-serif font-bold text-sm select-none border border-[#FFF0D0]/60">
              {content.finale.sealMonogram}
            </div>
          </div>
        </section>

        {/* The Interactive 3D Gift Box Opening Card */}
        <section className="relative z-20 w-full max-w-md mx-auto my-4">
          <div
            onClick={() => handleToggleBox()}
            className="relative rounded-2xl bg-gradient-to-b from-surface-container-high/90 to-surface-container/95 p-6 backdrop-blur-xl shadow-2xl border border-primary/25 overflow-hidden transition-all duration-500 cursor-pointer text-center"
          >
            {/* Golden Header Glow Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-80" />

            {/* Top State Preview & SFX Toggle Buttons */}
            <div className="flex items-center justify-between w-full mb-4 gap-2 flex-wrap">
              {/* Closed / Opened State Switcher */}
              <div
                className="flex items-center gap-1 p-1 rounded-full bg-surface-container-low/80 border border-primary-container/30 shadow-sm"
                onClick={e => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => handleToggleBox(false)}
                  className={`px-3 py-1 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
                    !isBoxOpen
                      ? 'bg-primary-container text-on-primary-container shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Closed
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleBox(true)}
                  className={`px-3 py-1 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    isBoxOpen
                      ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(232,201,135,0.4)]'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span>Opened</span>
                  <span className="text-[10px]">✦</span>
                </button>
              </div>

              {/* SFX Chime Sound Toggle */}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleToggleSFX();
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-sans font-semibold flex items-center gap-1.5 transition-all shadow-sm border cursor-pointer ${
                  sfxOn
                    ? 'bg-surface-container-high/90 border-primary-container/40 text-primary shadow-[0_0_14px_rgba(232,201,135,0.25)]'
                    : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 opacity-70'
                }`}
              >
                <Icon name={sfxOn ? 'notifications_active' : 'notifications_off'} size={14} />
                <span>{sfxOn ? 'SFX: Chime On' : 'SFX: Chime Off'}</span>
                {sfxOn && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />}
              </button>
            </div>

            {/* 3D Animated Gift Box Icon */}
            <div className="relative w-28 h-28 mx-auto my-3 cursor-pointer group">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:scale-110 transition-transform" />

              {/* Lid */}
              <div
                className={`gift-lid absolute left-2 right-2 h-9 rounded-t-xl bg-gradient-to-b from-secondary-fixed to-secondary shadow-[0_4px_16px_rgba(244,182,194,0.4)] flex items-center justify-center z-20 border-b border-[#330F19]/20 transition-transform duration-500 ${
                  isBoxOpen ? '-translate-y-4 -rotate-6' : '-top-1'
                }`}
              >
                <div className="w-7 h-4 rounded-full bg-primary-container shadow-sm border border-primary -mt-2" />
                <div className="absolute w-3 h-full bg-primary-container" />
              </div>

              {/* Box Base */}
              <div className="absolute bottom-2 left-3 right-3 h-16 rounded-b-xl bg-gradient-to-b from-[#7A3F4C] to-[#50242D] border border-secondary/30 shadow-lg flex items-center justify-center overflow-hidden z-10">
                <div className="absolute w-3.5 h-full bg-gradient-to-b from-primary-container to-primary-fixed shadow-[0_0_8px_rgba(232,201,135,0.6)]" />
                <div className="absolute h-3 w-full bg-gradient-to-r from-primary-container via-primary-fixed to-primary-container shadow-[0_0_8px_rgba(232,201,135,0.6)]" />
                <Icon name="lock_open" size={24} className="text-primary-fixed z-10" />
              </div>
            </div>

            <span className="text-[10px] font-sans uppercase tracking-widest text-primary-fixed font-bold mb-1 block">
              Final Quest Unlock
            </span>

            <h3 className="font-serif text-xl sm:text-2xl text-on-surface mb-2 font-medium">
              {content.finale.giftCardTitle}
            </h3>

            <p className="text-xs font-sans text-on-surface-variant max-w-xs mx-auto mb-4 leading-relaxed">
              {content.finale.giftCardDescription}
            </p>

            {/* Shimmering CTA Button */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                handleToggleBox(true);
              }}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-primary-container via-primary to-primary-container text-on-primary-container text-xs sm:text-sm font-sans font-bold tracking-wide shadow-[0_0_24px_rgba(232,201,135,0.45)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isBoxOpen ? content.finale.giftUnlockedBadge : 'Open Your Birthday Gift'}</span>
              <span>✨</span>
            </button>

            {/* Secret Reward Card (Unveils giftHint) */}
            {isBoxOpen && (
              <div
                className="mt-4 p-4 rounded-xl bg-surface-container-highest/95 border border-primary-container/40 text-on-surface shadow-xl text-left relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
                onClick={e => {
                  e.stopPropagation();
                  triggerCelebration();
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping" />
                  <p className="text-[10px] font-sans text-primary tracking-widest uppercase font-bold">
                    Secret Keepsake Coordinates ✦
                  </p>
                </div>

                <p className="font-serif text-sm sm:text-base text-[#FFF6EA] leading-relaxed">
                  “{content.finale.giftHint}”
                </p>

                <div className="mt-3 pt-2.5 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span className="flex items-center gap-1 text-secondary font-medium">
                    <Icon name="favorite" size={12} className="fill-secondary" />
                    <span>Real World Quest</span>
                  </span>
                  <span className="text-primary font-serif italic">
                    Hugs guaranteed upon arrival 🧸✨
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Commemorative Inscription */}
        <div className="relative z-20 text-center my-4 flex flex-col items-center justify-center gap-1 px-4">
          <div className="flex items-center gap-2 opacity-50 mb-1">
            <span className="h-px w-8 bg-outline-variant" />
            <span className="text-primary text-xs">✦</span>
            <span className="h-px w-8 bg-outline-variant" />
          </div>
          <p className="text-xs font-sans text-on-surface-variant tracking-wider uppercase">
            Isha · 30 October 2026 · Level 20 Edition
          </p>
        </div>

        {/* Secondary Actions: Replay Journey & Back to Level Map */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto mt-2 mb-6 px-2">
          <button
            onClick={handleReplayJourney}
            className="w-full sm:w-1/2 py-3 px-4 rounded-full bg-surface-container-high/80 text-on-surface text-xs font-sans font-semibold transition-all hover:bg-surface-bright active:scale-95 flex items-center justify-center gap-2 shadow-sm border border-outline-variant/30 cursor-pointer"
          >
            <Icon name="replay" size={16} className="text-secondary" />
            <span>{content.finale.replayJourneyText}</span>
          </button>

          <button
            onClick={() => {
              soundService.vibrate([20]);
              navigate('/level-map');
            }}
            className="w-full sm:w-1/2 py-3 px-4 rounded-full bg-surface-container-high/80 text-on-surface text-xs font-sans font-semibold transition-all hover:bg-surface-bright active:scale-95 flex items-center justify-center gap-2 shadow-sm border border-outline-variant/30 cursor-pointer"
          >
            <Icon name="explore" size={16} className="text-primary" />
            <span>{content.finale.backToMapText}</span>
          </button>
        </div>
      </div>
    </Shell>
  );
};
