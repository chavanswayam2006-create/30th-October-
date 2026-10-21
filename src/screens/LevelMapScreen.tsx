import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Icon } from '../components/Icon';
import { soundService } from '../services/sound';
import { loadProgress, isUnlockAll } from '../services/storage';
import content from '../content/content.json';

export const LevelMapScreen: React.FC = () => {
  const navigate = useNavigate();
  const progress = loadProgress();
  const unlocked = isUnlockAll();

  const masteredCount = unlocked
    ? 8
    : progress.masteredLevels.length;

  const percentMastered = Math.round((masteredCount / 8) * 100);

  const getLevelState = (lvlId: number): 'mastered' | 'current' | 'next' | 'locked' => {
    if (unlocked) return 'mastered';
    if (progress.masteredLevels.includes(lvlId)) return 'mastered';
    if (progress.currentLevel === lvlId) return 'current';
    if (progress.currentLevel + 1 === lvlId) return 'next';
    return 'locked';
  };

  const handleLevelClick = (path: string, state: string) => {
    if (state === 'locked' && !unlocked) {
      soundService.playClickTone('miss');
      soundService.vibrate([40, 20, 40]);
      return;
    }
    soundService.playClickTone('tap');
    soundService.vibrate([25]);
    navigate(`/${path}`);
  };

  return (
    <Shell
      screenTitle="Level Map"
      nextPath="/memory-lane"
      skipPath="/finale"
    >
      <div className="flex flex-col w-full relative pb-12">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-primary-container/10 blur-3xl" />
        <div className="pointer-events-none absolute top-96 -right-16 w-64 h-64 rounded-full bg-secondary-container/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-48 -left-12 w-72 h-72 rounded-full bg-tertiary-container/10 blur-3xl" />

        {/* Header Banner & Quest Intro */}
        <header className="flex flex-col items-center text-center pt-2 pb-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-surface-container-high/90 shadow-sm mb-3 border border-outline-variant/30">
            <span className="text-primary text-xs">★</span>
            <span className="font-sans text-[11px] font-bold text-primary tracking-widest uppercase">
              {content.levelMap.chapterBadge}
            </span>
            <span className="text-primary text-xs">★</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-medium tracking-tight mb-2">
            {content.levelMap.title}
          </h1>

          <p className="font-sans text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            {content.levelMap.subtitle}
          </p>

          {/* Master Progress HUD */}
          <div className="w-full max-w-md mt-5 p-4 rounded-xl bg-surface-container-high/70 backdrop-blur-md shadow-md flex flex-col gap-2.5 border border-primary/20">
            <div className="flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
                  <Icon name="military_tech" size={18} />
                </div>
                <div>
                  <p className="font-sans text-sm font-bold text-primary leading-none">
                    {masteredCount}/8 {content.levelMap.progressLabel}
                  </p>
                  <p className="font-sans text-xs text-secondary tracking-normal mt-1">
                    {percentMastered}% {content.levelMap.progressSubtext}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest font-sans text-[10px] font-semibold text-primary-fixed-dim uppercase tracking-wider">
                {content.levelMap.actLabel}
              </span>
            </div>

            {/* Segmented Track Bar */}
            <div className="w-full h-2 rounded-full bg-surface-container-lowest overflow-hidden flex gap-1 p-0.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-full transition-all duration-700 ${
                    i <= masteredCount
                      ? 'bg-primary shadow-[0_0_8px_rgba(232,201,135,0.7)]'
                      : 'bg-surface-variant/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </header>

        {/* Winding Path Level Nodes */}
        <div className="relative w-full max-w-md mx-auto my-2 flex flex-col gap-5 z-10">
          {/* Curved Golden Stardust Spine (SVG) */}
          <svg
            className="absolute top-8 left-1/2 -translate-x-1/2 w-full h-[calc(100%-4rem)] pointer-events-none opacity-30 z-0"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 340 1380"
          >
            <path
              className="text-primary-container"
              d="M 60,40 C 220,110 300,190 280,260 C 250,340 80,410 70,510 C 60,610 280,680 270,780 C 255,870 70,950 65,1050 C 60,1140 280,1210 170,1320"
              stroke="currentColor"
              strokeDasharray="6 6"
              strokeWidth="2.5"
            />
            <circle cx="170" cy="150" r="3" className="fill-primary" />
            <circle cx="270" cy="380" r="2.5" className="fill-primary-fixed" />
            <circle cx="160" cy="650" r="3.5" className="fill-primary" />
            <circle cx="260" cy="910" r="2.5" className="fill-secondary" />
            <circle cx="120" cy="1180" r="3" className="fill-primary-container" />
          </svg>

          {/* Level Cards 1 through 8 */}
          {content.levelMap.levels.map(lvl => {
            const state = getLevelState(lvl.id);
            const isMastered = state === 'mastered';
            const isCurrent = state === 'current';
            const isNext = state === 'next';
            const isLocked = state === 'locked';

            return (
              <article
                key={lvl.id}
                onClick={() => handleLevelClick(lvl.path, state)}
                className={`relative z-10 w-full group cursor-pointer transition-all ${
                  isCurrent ? 'transform scale-[1.02]' : ''
                }`}
              >
                <div
                  className={`p-4 rounded-xl shadow-md transition-all ${
                    isCurrent
                      ? 'bg-surface-container-highest shadow-[0_0_28px_rgba(232,201,135,0.25)] border border-primary/40 relative overflow-hidden'
                      : isMastered
                      ? 'bg-surface-container-high/85 hover:bg-surface-bright border border-outline-variant/30'
                      : isNext
                      ? 'bg-surface-container-high/80 hover:bg-surface-bright border border-secondary/20'
                      : 'bg-surface-container/60 opacity-75 hover:opacity-90 border border-transparent'
                  }`}
                >
                  {/* Floating Active Ribbon for Current Level */}
                  {isCurrent && (
                    <div className="absolute -top-1 -right-1 px-3 py-1 rounded-bl-xl bg-primary text-on-primary text-[10px] font-sans font-bold flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest animate-ping" />
                      CURRENT STAGE
                    </div>
                  )}

                  <div className="flex items-start gap-3.5">
                    {/* Node Icon Hub */}
                    <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md ${
                          isCurrent
                            ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(255,230,181,0.65)] animate-pulse'
                            : isMastered
                            ? 'bg-primary-container text-on-primary-container shadow-[0_0_14px_rgba(232,201,135,0.45)]'
                            : isNext
                            ? 'bg-surface-container-highest text-primary'
                            : 'bg-surface-container-low text-outline'
                        }`}
                      >
                        <Icon
                          name={
                            lvl.id === 1
                              ? 'favorite'
                              : lvl.id === 2
                              ? 'photocamera'
                              : lvl.id === 3
                              ? 'movie'
                              : lvl.id === 4
                              ? 'music_note'
                              : lvl.id === 5
                              ? 'sports_esports'
                              : lvl.id === 6
                              ? 'mail'
                              : lvl.id === 7
                              ? 'auto_awesome'
                              : 'castle'
                          }
                          size={lvl.id === 8 ? 24 : 20}
                        />
                      </div>
                      <span
                        className={`text-[10px] font-sans font-bold ${
                          isCurrent || isMastered ? 'text-primary' : 'text-outline'
                        }`}
                      >
                        LVL {lvl.id}
                      </span>
                    </div>

                    {/* Node Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h2
                          className={`font-serif text-base truncate font-medium ${
                            isCurrent
                              ? 'text-primary'
                              : isLocked
                              ? 'text-on-surface-variant'
                              : 'text-on-surface'
                          }`}
                        >
                          {lvl.title}
                        </h2>

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold flex items-center gap-1 shrink-0 ${
                            isMastered
                              ? 'bg-primary/20 text-primary'
                              : isCurrent
                              ? 'bg-primary text-on-primary'
                              : isNext
                              ? 'bg-secondary-container/60 text-secondary-fixed'
                              : 'bg-surface-container-highest text-outline'
                          }`}
                        >
                          <Icon
                            name={
                              isMastered
                                ? 'check_circle'
                                : isCurrent
                                ? 'play_arrow'
                                : isNext
                                ? 'star'
                                : 'lock'
                            }
                            size={11}
                          />
                          <span>
                            {isMastered
                              ? 'Mastered'
                              : isCurrent
                              ? 'Active'
                              : isNext
                              ? 'Up Next'
                              : 'Locked'}
                          </span>
                        </span>
                      </div>

                      <p className="text-xs font-sans text-on-surface-variant line-clamp-2 mb-2 leading-relaxed">
                        {lvl.description}
                      </p>

                      {/* Marginalia Note */}
                      <div className="p-2 rounded-lg bg-surface-container-lowest/80 flex items-center gap-2">
                        <Icon name="draw" size={13} className="text-secondary shrink-0" />
                        <p className="text-xs font-serif italic text-on-surface-variant truncate">
                          {lvl.marginalia}
                        </p>
                      </div>

                      {/* Special unlock hint for Level 8 Finale */}
                      {lvl.id === 8 && isLocked && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-lowest/90 text-primary-fixed-dim text-[10px] font-sans">
                          <Icon name="key" size={12} />
                          <span>Unlocks after Level 7 is complete</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Objective Callout Card */}
        <section className="mt-6 w-full max-w-md mx-auto z-10">
          <div className="p-4 rounded-xl bg-surface-container-high/90 backdrop-blur-xl shadow-xl flex flex-col gap-3 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-sans font-bold text-secondary-fixed uppercase tracking-wider">
                  Active Objective
                </span>
                <p className="font-serif text-lg text-primary">
                  {content.levelMap.levels[progress.currentLevel - 1]?.title || 'Continue Quest'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                <Icon name="play_arrow" size={20} />
              </div>
            </div>

            <button
              onClick={() => {
                soundService.vibrate([25]);
                const targetLvl = content.levelMap.levels[progress.currentLevel - 1];
                navigate(`/${targetLvl ? targetLvl.path : 'memory-lane'}`);
              }}
              className="w-full h-12 rounded-full bg-primary-container text-on-primary-container font-sans text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(232,201,135,0.4)] transition-all hover:bg-primary active:scale-95 cursor-pointer"
            >
              <span>{content.levelMap.continueQuestBtn}</span>
              <Icon name="play_arrow" size={18} />
            </button>
          </div>
        </section>
      </div>
    </Shell>
  );
};
