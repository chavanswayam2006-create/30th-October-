import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { PolaroidFrame } from '../components/PolaroidFrame';
import { Icon } from '../components/Icon';
import { soundService } from '../services/sound';
import { saveProgress, loadProgress } from '../services/storage';
import content from '../content/content.json';

export const MemoryLaneScreen: React.FC = () => {
  const navigate = useNavigate();
  const progress = loadProgress();

  const handleNext = () => {
    soundService.vibrate([25, 40]);
    soundService.playClickTone('match');
    if (!progress.masteredLevels.includes(1)) {
      saveProgress({
        masteredLevels: [...new Set([...progress.masteredLevels, 1])],
        currentLevel: Math.max(progress.currentLevel, 2)
      });
    }
    navigate('/photo-gallery');
  };

  const tilts = [-1, 1.5, -1.5, 2, -1];

  return (
    <Shell
      screenTitle="Memory Lane"
      nextPath="/photo-gallery"
      skipPath="/photo-gallery"
    >
      <div className="flex flex-col w-full relative pb-12 max-w-xl mx-auto">
        {/* Sparkles / Stardust Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-10 left-6 w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_rgba(232,201,135,0.9)] animate-ping opacity-60" />
          <div className="absolute top-48 right-8 w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(244,182,194,0.8)] opacity-70 animate-pulse" />
          <div className="absolute top-96 left-12 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(255,230,181,0.9)] opacity-50" />
        </div>

        {/* Screen Header */}
        <header className="relative z-10 flex flex-col items-center text-center mt-2 mb-8 px-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface-container-high shadow-[0_0_14px_rgba(232,201,135,0.2)] mb-3 border border-primary/20">
            <Icon name="stars" size={14} className="text-primary" />
            <span className="text-[11px] font-sans uppercase tracking-widest text-primary-fixed font-bold">
              {content.memoryLane.badge}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-primary tracking-tight font-medium">
            {content.memoryLane.title}
          </h1>

          <p className="font-sans text-sm text-on-surface-variant max-w-xs mt-1.5">
            {content.memoryLane.subtitle}
          </p>

          {/* Stage Progress HUD */}
          <div className="w-full max-w-xs bg-surface-container-low rounded-full p-1.5 mt-5 shadow-inner flex items-center gap-3 border border-outline-variant/30">
            <div className="flex-1 bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div className="bg-primary-container h-full rounded-full w-full shadow-[0_0_8px_rgba(232,201,135,0.8)]" />
            </div>
            <div className="flex items-center gap-1 pr-1.5">
              <Icon name="favorite" size={12} className="text-secondary fill-secondary" />
              <span className="text-[10px] font-sans font-bold text-primary-fixed tracking-wider">
                STAGE 100%
              </span>
            </div>
          </div>
        </header>

        {/* Vertical Milestone Timeline */}
        <section className="relative z-10 w-full">
          {/* Continuous Champagne Gold Node Line */}
          <div className="absolute left-6 top-8 bottom-12 w-0.5 bg-gradient-to-b from-primary via-primary-container/70 to-secondary opacity-60" />

          <div className="space-y-12">
            {content.memoryLane.milestones.map((m, idx) => {
              const isToday = idx === content.memoryLane.milestones.length - 1;

              return (
                <article key={m.id} className="relative flex items-start gap-4 sm:gap-5 pl-2">
                  {/* Glowing Timeline Pin */}
                  <div className="relative z-20 shrink-0 mt-4">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shadow-[0_0_14px_rgba(232,201,135,0.45)] border border-primary/30">
                      <div
                        className={`w-3.5 h-3.5 rounded-full ${
                          isToday
                            ? 'bg-secondary animate-ping shadow-[0_0_8px_rgba(244,182,194,0.9)]'
                            : 'bg-primary-container shadow-[0_0_8px_rgba(232,201,135,0.8)]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Polaroid Card */}
                  <div className="flex-1 min-w-0">
                    <PolaroidFrame
                      slotName={`Memory #${m.id}`}
                      src={`media/photos/${m.photoSlot}.webp`}
                      title={m.title}
                      caption={m.quote}
                      dateOrTag={m.date}
                      authorTag={m.note}
                      tilt={tilts[idx % tilts.length]}
                      washiTapePosition={idx % 2 === 0 ? 'left' : 'right'}
                      onClick={() => {
                        soundService.vibrate([15]);
                        soundService.playClickTone('tap');
                      }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Next Stage Navigation Card */}
        <section className="mt-12 text-center flex flex-col items-center">
          <button
            onClick={handleNext}
            className="w-full max-w-sm py-4 px-6 rounded-full bg-gradient-to-r from-primary-container via-primary to-primary-container text-on-primary-container font-sans text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(232,201,135,0.45)] transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            <span>Next Level: Photo Gallery</span>
            <Icon name="arrow_forward" size={16} />
          </button>
        </section>
      </div>
    </Shell>
  );
};
