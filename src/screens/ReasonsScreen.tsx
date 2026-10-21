import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Shell } from '../components/Shell';
import { Icon } from '../components/Icon';
import { soundService } from '../services/sound';
import { saveProgress, loadProgress } from '../services/storage';
import content from '../content/content.json';

export const ReasonsScreen: React.FC = () => {
  const navigate = useNavigate();
  const progress = loadProgress();

  const [revealedIds, setRevealedIds] = useState<Set<number>>(
    new Set(progress.revealedReasons || [1, 2, 7])
  );

  const reasons = content.reasons20.reasons;
  const isAllRevealed = revealedIds.size === reasons.length;

  const handleCardClick = (id: number) => {
    soundService.vibrate([20]);
    soundService.playClickTone('flip');

    setRevealedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      if (next.size === reasons.length) {
        soundService.playMagicalCelebrationChime();
        soundService.vibrate([35, 60, 45]);
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      saveProgress({
        revealedReasons: Array.from(next),
        masteredLevels: [...new Set([...progress.masteredLevels, 7])]
      });
      return next;
    });
  };

  const handleRevealAll = () => {
    soundService.vibrate([30, 50]);
    soundService.playMagicalCelebrationChime();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 }
    });
    const all = new Set(reasons.map(r => r.id));
    setRevealedIds(all);
    saveProgress({
      revealedReasons: Array.from(all),
      masteredLevels: [...new Set([...progress.masteredLevels, 7])]
    });
  };

  const handleNextLevel = () => {
    soundService.vibrate([25, 40]);
    soundService.playClickTone('match');
    saveProgress({
      masteredLevels: [...new Set([...progress.masteredLevels, 7])],
      currentLevel: 8
    });
    navigate('/finale');
  };

  return (
    <Shell
      screenTitle="20 Reasons"
      nextPath="/finale"
      skipPath="/finale"
    >
      <div className="flex flex-col w-full relative pb-12 max-w-xl mx-auto space-y-6">
        {/* Milestone Header */}
        <header className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface-container-high shadow-md border border-primary/20">
            <span className="text-primary text-xs">✦</span>
            <span className="text-[11px] font-sans font-bold text-primary tracking-widest uppercase">
              {content.reasons20.badge}
            </span>
            <span className="text-primary text-xs">✦</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-primary tracking-tight font-medium">
            {content.reasons20.title}
          </h1>

          <p className="font-sans text-sm text-on-surface-variant max-w-sm px-2">
            {content.reasons20.subtitle}
          </p>

          {/* Progress Tracker HUD with Reveal All Button */}
          <div className="w-full mt-2 p-3 rounded-xl bg-surface-container-low shadow-sm flex items-center justify-between gap-3 border border-outline-variant/30">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(232,201,135,0.45)]">
                <Icon name="auto_awesome" size={16} className="text-on-primary-container" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[10px] font-sans font-bold text-primary tracking-wider uppercase truncate">
                  Constellation Level
                </span>
                <span className="text-xs font-sans text-on-surface truncate">
                  {revealedIds.size} of {reasons.length} Reasons Revealed
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleRevealAll}
                className="px-3 py-1 rounded-full bg-primary/20 hover:bg-primary-container hover:text-on-primary-container text-primary text-xs font-sans font-semibold transition-all flex items-center gap-1 border border-primary/30 active:scale-95 cursor-pointer"
              >
                <Icon name="magic_button" size={13} />
                <span>Reveal All</span>
              </button>

              <div
                className={`px-3 py-1 rounded-full text-xs font-sans font-bold transition-colors ${
                  isAllRevealed
                    ? 'bg-primary text-on-primary shadow-[0_0_12px_rgba(232,201,135,0.5)]'
                    : 'bg-surface-container-highest text-secondary'
                }`}
              >
                {Math.round((revealedIds.size / reasons.length) * 100)}%
              </div>
            </div>
          </div>
        </header>

        {/* 4x5 Interactive 3D Cards Grid */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full select-none ${
            isAllRevealed ? 'wave-ripple' : ''
          }`}
        >
          {reasons.map(item => {
            const isFlipped = revealedIds.has(item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                className="card-perspective relative h-32 rounded-xl cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <div
                  className={`card-inner relative w-full h-full transition-transform duration-500 rounded-xl preserve-3d shadow-md ${
                    isFlipped
                      ? 'card-flipped shadow-[0_0_14px_rgba(232,201,135,0.35)] ring-1 ring-primary/40'
                      : 'hover:shadow-[0_0_12px_rgba(232,201,135,0.2)]'
                  }`}
                >
                  {/* Card Front (Unflipped) */}
                  <div className="card-front absolute inset-0 w-full h-full rounded-xl bg-surface-container-high flex flex-col items-center justify-center p-2 backface-hidden border border-outline-variant/30 hover:bg-surface-bright transition-colors">
                    <span className="text-[10px] text-primary/70 mb-0.5">✦</span>
                    <span className="font-serif text-xl text-primary font-semibold tracking-wider">
                      {item.id < 10 ? `0${item.id}` : item.id}
                    </span>
                    <span className="text-[8px] font-sans text-on-surface-variant uppercase tracking-widest mt-1">
                      TAP
                    </span>
                  </div>

                  {/* Card Back (Flipped / Revealed) */}
                  <div className="card-back absolute inset-0 w-full h-full p-2.5 rounded-xl bg-surface-container-highest flex flex-col justify-between overflow-hidden shadow-inner backface-hidden rotate-y-180 border border-primary/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-sans font-bold text-primary">
                        #{item.id < 10 ? `0${item.id}` : item.id}
                      </span>
                      <Icon name="favorite" size={12} className="text-secondary fill-secondary" />
                    </div>

                    <p className="font-serif italic text-[11px] leading-snug text-on-surface text-center px-1 line-clamp-4">
                      "{item.text}"
                    </p>

                    <div className="w-3 h-0.5 mx-auto rounded-full bg-primary/50" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Golden Ripple Celebration when 20/20 Revealed */}
        {isAllRevealed && (
          <div className="p-4 rounded-xl bg-primary/20 border border-primary/50 text-center space-y-1 animate-pulse">
            <p className="font-serif text-base text-primary font-semibold">
              ✨ All 20 Constellations Revealed ✨
            </p>
            <p className="text-xs font-sans text-on-surface-variant">
              Every reason is true, every chapter is real. The Grand Finale is now waiting for you!
            </p>
          </div>
        )}

        {/* Progression Gateway */}
        <section className="mt-8 text-center flex flex-col items-center">
          <button
            onClick={handleNextLevel}
            className={`w-full max-w-sm py-4 px-6 rounded-full font-sans text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(232,201,135,0.45)] transition-all hover:scale-[1.03] active:scale-95 cursor-pointer ${
              isAllRevealed
                ? 'bg-gradient-to-r from-primary-fixed via-primary to-primary-container text-on-primary finale-glow-active'
                : 'bg-primary-container text-on-primary-container'
            }`}
          >
            <span>Level 8: The Grand Finale</span>
            <Icon name="arrow_forward" size={16} />
          </button>
        </section>
      </div>
    </Shell>
  );
};
