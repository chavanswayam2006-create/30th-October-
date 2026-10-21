import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Icon } from '../components/Icon';
import { soundService } from '../services/sound';
import { saveProgress, loadProgress, isUnlockAll, getNow } from '../services/storage';
import content from '../content/content.json';

export const LettersScreen: React.FC = () => {
  const navigate = useNavigate();
  const progress = loadProgress();
  const unlocked = isUnlockAll();

  const [openedLetters, setOpenedLetters] = useState<Set<number>>(new Set(progress.openedLetters || [1]));
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [copiedMoon, setCopiedMoon] = useState<boolean>(false);
  const [daysTo21, setDaysTo21] = useState<number>(365);
  const [lockWobble, setLockWobble] = useState<boolean>(false);
  const [activeLightbox, setActiveLightbox] = useState<{ title: string; images: string[] } | null>(null);

  // Live countdown to 30.10.2027 for 21st birthday envelope
  useEffect(() => {
    const target21 = new Date('2027-10-30T00:00:00+05:30').getTime();
    const now = getNow().getTime();
    const diff = target21 - now;
    const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    setDaysTo21(days);
  }, [unlocked]);

  const handleToggleLetter = (letterId: number, isLockedSpecial?: boolean) => {
    if (isLockedSpecial && !unlocked) {
      soundService.vibrate([40, 20, 40]);
      soundService.playClickTone('miss');
      setLockWobble(true);
      setTimeout(() => setLockWobble(false), 700);
      return;
    }

    soundService.vibrate([25, 40]);
    soundService.playClickTone('match');

    setOpenedLetters(prev => {
      const next = new Set(prev);
      if (next.has(letterId)) {
        next.delete(letterId);
      } else {
        next.add(letterId);
      }
      saveProgress({
        openedLetters: Array.from(next),
        masteredLevels: [...new Set([...progress.masteredLevels, 6])]
      });
      return next;
    });
  };

  const copyMoonSecret = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundService.vibrate([30]);
    soundService.playClickTone('tap');
    if (navigator.clipboard) {
      navigator.clipboard.writeText('🌙').catch(() => {});
    }
    setCopiedMoon(true);
    setTimeout(() => setCopiedMoon(false), 2500);
  };

  const letters = content.letters.envelopes;
  const filteredLetters = filterCategory === 'all'
    ? letters
    : letters.filter(l => l.category === filterCategory);

  const handleNextLevel = () => {
    soundService.vibrate([25, 40]);
    soundService.playClickTone('match');
    saveProgress({
      masteredLevels: [...new Set([...progress.masteredLevels, 6])],
      currentLevel: Math.max(progress.currentLevel, 7)
    });
    navigate('/20-reasons');
  };

  return (
    <Shell
      screenTitle="Open When"
      nextPath="/20-reasons"
      skipPath="/20-reasons"
    >
      <div className="flex flex-col w-full relative pb-12 max-w-xl mx-auto space-y-6">
        {/* Quest Progress Banner */}
        <div className="w-full bg-surface-container-low rounded-xl p-3 shadow-md flex items-center justify-between gap-3 border border-primary/20">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
              <Icon name="mail" size={18} className="text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-sans font-bold text-primary tracking-widest uppercase">
                {content.letters.badge}
              </span>
              <span className="text-xs font-sans text-on-surface truncate">
                Archive of Little Solaces
              </span>
            </div>
          </div>

          <span className="text-xs font-sans font-semibold text-secondary-fixed bg-surface-container-high px-3 py-1 rounded-full border border-secondary/30 shrink-0">
            {openedLetters.size} of {letters.length} Opened
          </span>
        </div>

        {/* Header Intro Banner */}
        <header className="w-full bg-gradient-to-b from-surface-container-high/60 via-surface-container to-surface-container-low rounded-2xl p-5 shadow-lg relative overflow-hidden border border-outline-variant/30">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-secondary/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container-highest shadow-sm border border-primary/20">
              <span className="text-primary text-[10px]">✦</span>
              <span className="text-[10px] font-sans font-bold text-primary tracking-widest uppercase">
                LEVEL 06 · KEEPSAKES
              </span>
            </div>
            <span className="text-xs font-sans text-on-surface-variant flex items-center gap-1">
              <Icon name="favorite" size={12} className="text-secondary fill-secondary" />
              <span>For Isha</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-primary tracking-tight font-medium mb-1.5">
            {content.letters.title}
          </h1>

          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            {content.letters.subtitle}
          </p>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Letters' },
              { id: 'late-nights', label: 'Late Nights' },
              { id: 'big-hugs', label: 'Big Hugs' },
              { id: 'milestones', label: 'Milestones' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  soundService.vibrate([15]);
                  setFilterCategory(tab.id);
                }}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
                  filterCategory === tab.id
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Envelopes List / Grid */}
        <div className="grid grid-cols-1 gap-4 w-full">
          {filteredLetters.map(letter => {
            const isOpen = openedLetters.has(letter.id);
            const is21 = letter.isLockedSpecial;

            return (
              <div
                key={letter.id}
                onClick={() => handleToggleLetter(letter.id, is21)}
                className={`envelope-card relative rounded-2xl p-4 sm:p-5 shadow-xl overflow-hidden flex flex-col transition-all cursor-pointer border select-none ${
                  isOpen
                    ? 'bg-surface-container-high border-primary/40 is-open'
                    : is21
                    ? `bg-surface-container-lowest/70 border-outline-variant/30 ${lockWobble ? 'animate-wiggle' : ''}`
                    : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/20 hover:border-secondary/40'
                }`}
              >
                {/* Envelope Flap Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOpen
                          ? 'bg-secondary animate-ping'
                          : is21
                          ? 'bg-red-400'
                          : 'bg-primary-container'
                      }`}
                    />
                    <span className="text-[10px] font-sans font-bold text-secondary tracking-wider uppercase">
                      {is21
                        ? 'GRAND ARCHIVE VAULT · LOCKED'
                        : isOpen
                        ? 'CURRENTLY UNSEALED'
                        : `LETTER NO. 0${letter.id}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-primary-fixed-dim bg-surface-container-lowest px-2.5 py-0.5 rounded-full text-[11px] font-sans">
                    <Icon name={isOpen ? 'lock_open' : is21 ? 'lock' : 'mail'} size={13} />
                    <span>{isOpen ? 'Tap to Fold' : is21 ? 'Locked Vault' : 'Break Seal'}</span>
                  </div>
                </div>

                {/* Envelope Title & Seal Icon */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-serif text-lg sm:text-xl text-primary font-medium">
                    {letter.title}
                  </h3>

                  {/* Wax Seal Badge */}
                  <div
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg shrink-0 transition-transform ${
                      letter.sealColor === 'rose'
                        ? 'bg-secondary-container text-secondary'
                        : letter.sealColor === 'lavender'
                        ? 'bg-tertiary-container text-on-tertiary-container'
                        : letter.sealColor === 'locked'
                        ? 'bg-surface-container-highest text-primary-fixed'
                        : 'bg-primary-container text-on-primary-container'
                    }`}
                  >
                    <Icon
                      name={
                        is21
                          ? 'key'
                          : letter.sealColor === 'rose'
                          ? 'favorite'
                          : letter.sealColor === 'lavender'
                          ? 'moon'
                          : 'star'
                      }
                      size={18}
                    />
                  </div>
                </div>

                {/* Unopened Summary */}
                {!isOpen && (
                  <p className="text-xs font-sans text-on-surface-variant line-clamp-2 mb-3 leading-relaxed">
                    {letter.summary}
                  </p>
                )}

                {/* Special 21st Countdown Indicator */}
                {is21 && !isOpen && (
                  <div className="mt-2 bg-surface-container-highest/60 rounded-lg p-2.5 flex items-center justify-between text-xs font-sans">
                    <div className="flex items-center gap-1.5 text-primary">
                      <Icon name="schedule" size={14} />
                      <span className="font-semibold">
                        {unlocked ? 'Unlocked for testing!' : `${daysTo21} Days of Level 20 Magic First`}
                      </span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                      Key Safe With Swayam
                    </span>
                  </div>
                )}

                {/* Tactile Letter Paper Slide-out (Cream Paper #FFF6EA) */}
                {isOpen && (
                  <div className="letter-paper-content relative bg-[#FFF6EA] text-[#2B1B3D] rounded-xl p-4 sm:p-5 shadow-inner mt-2 border border-[#E8DFC8] space-y-3">
                    {/* Postmark Header */}
                    <div className="flex items-start justify-between border-b border-[#E8DFC8] pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#180d2d]/10 flex items-center justify-center text-[#2B1B3D]">
                          <Icon name="moon" size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-sans font-bold text-[#8C6D37] uppercase tracking-wider">
                            COZY FREQUENCY · LVL 20
                          </p>
                          <p className="text-xs font-serif text-[#593946]">
                            To: My Favorite Girl in the World
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-sans font-semibold text-[#8C6D37] bg-[#E8C987]/20 px-2 py-0.5 rounded-full">
                        {letter.sealLabel}
                      </span>
                    </div>

                    {/* Letter Body */}
                    <div className="space-y-2 pt-1">
                      <p className="font-serif italic text-base text-[#6A3C46] leading-snug">
                        "{letter.quote}"
                      </p>
                      <p className="font-sans text-xs sm:text-sm text-[#3E2E20] leading-relaxed">
                        {letter.body}
                      </p>

                      {/* Secret Moon Tap-to-Copy Chip for Letter 1 */}
                      {letter.secretEmoji && (
                        <div
                          className="pt-2 flex items-center gap-2 flex-wrap"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            onClick={copyMoonSecret}
                            className="px-3 py-1.5 rounded-lg bg-[#2B1B3D] text-[#FFF6EA] hover:bg-[#3f2a58] flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm text-xs font-sans font-semibold cursor-pointer"
                          >
                            <span className="text-sm">🌙</span>
                            <span>{copiedMoon ? 'Copied 🌙 to clipboard!' : 'Tap to copy secret moon'}</span>
                          </button>
                          <span className="text-xs font-serif italic text-[#8E5B6A]">
                            (I will answer instantly, guaranteed)
                          </span>
                        </div>
                      )}

                      {/* See Original WhatsApp Screenshot Button */}
                      {(letter as any).images && (letter as any).images.length > 0 && (
                        <div
                          className="pt-2 flex items-center gap-2 flex-wrap"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              soundService.vibrate([20]);
                              soundService.playClickTone('tap');
                              setActiveLightbox({
                                title: letter.title,
                                images: (letter as any).images || []
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#2B1B3D]/10 hover:bg-[#2B1B3D]/20 text-[#2B1B3D] border border-[#2B1B3D]/20 flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm text-xs font-sans font-semibold cursor-pointer"
                          >
                            <Icon name="camera" size={13} className="text-[#8C6D37]" />
                            <span>See original note ({((letter as any).images || []).length} {((letter as any).images || []).length > 1 ? 'parts' : 'page'})</span>
                          </button>
                        </div>
                      )}

                      {/* Swayam Signature */}
                      <div className="pt-3 flex items-end justify-between border-t border-[#E8DFC8]/60 mt-3">
                        <div>
                          <span className="text-[10px] font-sans uppercase tracking-wider text-[#8E5B6A] block">
                            With infinite devotion,
                          </span>
                          <span className="font-serif italic text-base font-semibold text-[#251A00]">
                            Swayam ✦
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#8E4154] bg-[#F4B6C2]/20 px-2 py-0.5 rounded-full text-xs">
                          <span>♥</span>
                          <span className="font-serif text-[11px]">Safe with you</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Keepsake Visual Accent */}
        <div className="w-full bg-surface-container-low rounded-xl p-4 shadow-md flex items-center gap-4 border border-outline-variant/20">
          <div className="w-16 h-20 rounded bg-surface-container-highest shrink-0 overflow-hidden shadow -rotate-2 border border-primary/20 relative">
            <img
              src="media/photos/letter-keepsake.webp"
              alt="Keeper's Keepsake"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 text-primary mb-1">
              <Icon name="auto_awesome" size={13} />
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider">
                Keeper's Note
              </span>
            </div>
            <p className="text-xs font-serif italic text-on-surface leading-snug">
              {content.letters.keepersNote}
            </p>
          </div>
        </div>

        {/* Progression Gateway */}
        <section className="mt-8 text-center flex flex-col items-center">
          <button
            onClick={handleNextLevel}
            className="w-full max-w-sm py-4 px-6 rounded-full bg-gradient-to-r from-primary-container via-primary to-primary-container text-on-primary-container font-sans text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(232,201,135,0.45)] transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            <span>Next Level: 20 Reasons Why</span>
            <Icon name="arrow_forward" size={16} />
          </button>
        </section>

        {/* Lightbox Modal for Original WhatsApp Note Screenshots */}
        {activeLightbox && (
          <div
            className="fixed inset-0 z-50 bg-[#0d071a]/95 backdrop-blur-md flex flex-col items-center justify-between p-4 overflow-y-auto"
            onClick={() => setActiveLightbox(null)}
          >
            <div className="w-full max-w-lg flex items-center justify-between py-2 text-primary-fixed border-b border-primary/20 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-secondary text-sm">✦</span>
                <h3 className="font-serif text-sm sm:text-base font-semibold truncate text-on-surface">
                  {activeLightbox.title}
                </h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightbox(null);
                }}
                className="p-1.5 rounded-full bg-surface-container-highest hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer text-xs flex items-center gap-1.5 px-3 border border-outline-variant/30 shrink-0"
              >
                <span>Close</span>
                <span className="font-bold text-sm leading-none">✕</span>
              </button>
            </div>

            <div
              className="w-full max-w-md my-auto py-4 flex flex-col gap-4 items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {activeLightbox.images.map((imgSrc, idx) => (
                <div key={idx} className="w-full rounded-2xl overflow-hidden shadow-2xl border border-primary/30 bg-surface-container-lowest flex flex-col">
                  {activeLightbox.images.length > 1 && (
                    <div className="bg-surface-container-high px-3 py-1.5 text-xs text-primary font-sans font-semibold border-b border-outline-variant/20 flex items-center justify-between">
                      <span>Part {idx + 1} of {activeLightbox.images.length}</span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Original Note</span>
                    </div>
                  )}
                  <img
                    src={imgSrc}
                    alt={`${activeLightbox.title} Part ${idx + 1}`}
                    className="w-full h-auto object-contain max-h-[75vh]"
                    loading="eager"
                  />
                </div>
              ))}
              <p className="text-on-surface-variant text-xs font-sans text-center">
                Pinch to zoom or scroll • Verbatim handwritten notes from Swayam
              </p>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
};
