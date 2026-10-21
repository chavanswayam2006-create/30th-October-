import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Crest } from './Crest';
import { Icon } from './Icon';
import { soundService } from '../services/sound';
import { loadProgress, UserProgress, isUnlockAll } from '../services/storage';

interface ShellProps {
  children: React.ReactNode;
  screenTitle: string;
  nextPath?: string;
  skipPath?: string;
  hideNav?: boolean;
}

export const Shell: React.FC<ShellProps> = ({
  children,
  screenTitle,
  nextPath,
  skipPath,
  hideNav = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [isPlaying, setIsPlaying] = useState<boolean>(soundService.isBgPlaying());
  const [isMuted, setIsMuted] = useState<boolean>(soundService.isAudioMuted());
  const [equalizerHeights, setEqualizerHeights] = useState<string[]>(['8px', '16px', '10px', '14px']);

  useEffect(() => {
    setProgress(loadProgress());
    const unsub = soundService.subscribe((playing, muted) => {
      setIsPlaying(playing);
      setIsMuted(muted);
    });
    return unsub;
  }, [location.pathname]);

  // Dancing equalizer animation
  useEffect(() => {
    if (!isPlaying || isMuted) {
      setEqualizerHeights(['4px', '4px', '4px', '4px']);
      return;
    }
    const interval = setInterval(() => {
      const heights = ['5px', '10px', '15px', '20px', '22px', '7px', '16px', '12px'];
      setEqualizerHeights([
        heights[Math.floor(Math.random() * heights.length)],
        heights[Math.floor(Math.random() * heights.length)],
        heights[Math.floor(Math.random() * heights.length)],
        heights[Math.floor(Math.random() * heights.length)]
      ]);
    }, 140);
    return () => clearInterval(interval);
  }, [isPlaying, isMuted]);

  const handleAudioToggle = () => {
    soundService.vibrate([20]);
    if (!isPlaying && !isMuted) {
      soundService.startBackgroundMusic();
    } else {
      soundService.toggleMute();
    }
  };

  const unlocked = isUnlockAll();

  // Milestone dot calculation (8 milestones)
  const isMilestoneMastered = (lvl: number) => {
    if (unlocked) return true;
    return progress.masteredLevels.includes(lvl);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col relative selection:bg-secondary-container selection:text-secondary">
      {/* Fixed Top Bar */}
      {!hideNav && (
        <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl pt-safe shadow-[0_1px_16px_rgba(10,5,20,0.6)] border-b border-primary/10">
          <div className="h-16 px-margin max-w-4xl mx-auto flex items-center justify-between gap-space-sm">
            {/* Left: Crest & Title / Back */}
            <div className="flex items-center gap-space-xs">
              <button
                onClick={() => navigate('/level-map')}
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary transition-all duration-300 hover:bg-surface-container-high hover:scale-105 active:scale-95 shadow-sm border border-primary/20"
                aria-label="Level Map"
                title="Level Map"
              >
                <Crest size={28} />
              </button>

              <button
                onClick={() => navigate('/level-map')}
                className="font-serif text-lg font-medium text-primary tracking-tight ml-1 hover:text-primary-fixed transition-colors truncate max-w-[140px] sm:max-w-none"
              >
                {screenTitle}
              </button>
            </div>

            {/* Center: 8 Milestone Dots */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low/80 rounded-full border border-outline-variant/30">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(lvl => (
                <span
                  key={lvl}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    isMilestoneMastered(lvl)
                      ? 'bg-primary-container shadow-[0_0_8px_rgba(232,201,135,0.7)]'
                      : 'bg-surface-container-highest'
                  }`}
                  title={`Level ${lvl}`}
                />
              ))}
            </div>

            {/* Right: Audio Toggle & Profile */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAudioToggle}
                aria-label="Toggle Lofi Love Soundtrack"
                className="h-10 px-3 rounded-full bg-surface-container-high/80 text-secondary hover:bg-surface-bright active:scale-95 transition-all flex items-center gap-2 shadow-sm border border-outline-variant/20"
              >
                <Icon
                  name={isMuted || !isPlaying ? 'volume_off' : 'music_note'}
                  size={16}
                  className={isPlaying && !isMuted ? 'text-secondary animate-pulse' : 'text-outline'}
                />
                <div className="flex items-end gap-0.5 h-3.5 pr-0.5">
                  {equalizerHeights.map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-secondary rounded-full transition-all duration-150"
                      style={{ height: h }}
                    />
                  ))}
                </div>
                <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-secondary-fixed hidden min-[400px]:inline">
                  LOFI
                </span>
              </button>

              <div
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center shadow-[0_0_12px_rgba(232,201,135,0.4)] text-xs font-serif font-bold"
                title="Isha & Swayam"
              >
                I✦S
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col relative w-full ${
          hideNav ? '' : 'pt-16 pb-28'
        }`}
      >
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          {children}
        </div>
      </main>

      {/* Fixed Bottom Navigation Dock */}
      {!hideNav && (
        <nav
          className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-8px_24px_rgba(10,5,20,0.7)] border-t border-primary/15"
          role="navigation"
          aria-label="Level navigation"
        >
          <div className="h-16 px-margin flex items-center justify-between gap-space-sm max-w-md mx-auto">
            {/* Skip Button (never stuck!) */}
            <button
              onClick={() => {
                soundService.vibrate([20]);
                navigate(skipPath || '/finale');
              }}
              className="h-10 px-4 rounded-full flex items-center justify-center text-secondary hover:text-secondary-fixed font-sans text-xs font-semibold uppercase tracking-wider transition-all active:scale-95"
            >
              Skip
            </button>

            {/* Quick Access Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundService.vibrate([15]);
                  navigate('/level-map');
                }}
                aria-label="Journey Map"
                title="Journey Map"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  location.pathname === '/level-map'
                    ? 'text-primary bg-surface-container-high shadow-[0_0_16px_rgba(232,201,135,0.25)]'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Icon name="explore" size={20} />
              </button>

              <button
                onClick={() => {
                  soundService.vibrate([15]);
                  navigate('/songs-of-us');
                }}
                aria-label="Songs of Us"
                title="Songs of Us"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  location.pathname === '/songs-of-us'
                    ? 'text-primary bg-surface-container-high shadow-[0_0_16px_rgba(232,201,135,0.25)]'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Icon name="album" size={20} />
              </button>
            </div>

            {/* Next Gold Pill Button */}
            {nextPath ? (
              <button
                onClick={() => {
                  soundService.vibrate([25, 40]);
                  soundService.playClickTone('tap');
                  navigate(nextPath);
                }}
                className="h-10 px-5 rounded-full bg-gradient-to-r from-primary-container via-primary to-primary-container text-on-primary-container font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_20px_rgba(232,201,135,0.4)] transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                <span>Next</span>
                <Icon name="arrow_forward" size={15} />
              </button>
            ) : (
              <button
                onClick={() => {
                  soundService.vibrate([25, 40]);
                  soundService.playClickTone('tap');
                  navigate('/level-map');
                }}
                className="h-10 px-5 rounded-full bg-gradient-to-r from-primary-container via-primary to-primary-container text-on-primary-container font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_20px_rgba(232,201,135,0.4)] transition-all hover:scale-[1.03] active:scale-95"
              >
                <span>Map</span>
                <Icon name="map" size={15} />
              </button>
            )}
          </div>
        </nav>
      )}
    </div>
  );
};
