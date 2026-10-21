import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Icon } from '../components/Icon';
import { soundService } from '../services/sound';
import { saveProgress, loadProgress, isUnlockAll, getNow } from '../services/storage';
import content from '../content/content.json';

export const CinemaScreen: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progress = loadProgress();
  const unlocked = isUnlockAll();

  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [hasWatchedFull, setHasWatchedFull] = useState<boolean>(false);
  const [countdownText, setCountdownText] = useState<string>('');

  const reels = content.cinema.reels;
  const currentReel = reels[activeReelIndex];

  // Calculate live countdown to 30 Oct 2026 midnight IST for Reel #4
  useEffect(() => {
    const targetDate = new Date('2026-10-30T00:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = getNow().getTime();
      const diff = targetDate - now;
      if (diff <= 0 || unlocked) {
        setCountdownText('Unlocked!');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setCountdownText(`${days}d ${hours}h ${mins}m ${secs}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [unlocked]);

  // Video event listeners & soundtrack coordination
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) setDuration(video.duration);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setHasWatchedFull(true);
      soundService.resumeBgAfterMedia();
      soundService.playMagicalCelebrationChime();
      soundService.vibrate([30, 50, 40]);
      saveProgress({
        watchedReels: [...new Set([...progress.watchedReels, currentReel.id])],
        masteredLevels: [...new Set([...progress.masteredLevels, 3])]
      });
    };

    const onPlay = () => {
      setIsPlaying(true);
      soundService.pauseBgForMedia();
    };

    const onPause = () => {
      setIsPlaying(false);
      soundService.resumeBgAfterMedia();
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      soundService.resumeBgAfterMedia();
    };
  }, [activeReelIndex, currentReel.id]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    soundService.vibrate([20]);
    if (video.paused) {
      video.play().catch(e => console.log('Video play error:', e));
    } else {
      video.pause();
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newRatio = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = newRatio * duration;
    setCurrentTime(newRatio * duration);
  };

  const handleSpeedToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    const speeds = [1.0, 1.25, 1.5, 0.75];
    const currentIdx = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIdx + 1) % speeds.length];
    video.playbackRate = nextSpeed;
    setPlaybackSpeed(nextSpeed);
    soundService.vibrate([15]);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const selectReel = (idx: number) => {
    const target = reels[idx];
    const isTargetLocked = target.isLocked && !unlocked && countdownText !== 'Unlocked!';

    if (isTargetLocked) {
      soundService.vibrate([30, 20, 30]);
      soundService.playClickTone('miss');
      return;
    }

    soundService.vibrate([20]);
    soundService.playClickTone('tap');
    setActiveReelIndex(idx);
    setCurrentTime(0);
    setIsPlaying(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Shell
      screenTitle="Our Cinema"
      nextPath="/songs-of-us"
      skipPath="/songs-of-us"
    >
      <div className="flex flex-col w-full relative pb-12 max-w-xl mx-auto space-y-6">
        {/* Cinema Header */}
        <section className="flex flex-col items-center text-center space-y-1.5 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface-container-high shadow-md border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            <span className="text-[11px] font-sans font-bold text-primary uppercase tracking-widest">
              {content.cinema.badge}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-primary tracking-tight font-medium">
            {content.cinema.title}
          </h1>

          <p className="font-sans text-sm text-on-surface-variant max-w-xs">
            {content.cinema.subtitle}
          </p>
        </section>

        {/* Video Player Frame */}
        <section className="w-full relative rounded-2xl bg-surface-container-low p-3 shadow-2xl overflow-hidden border border-primary/20">
          <div className="relative w-full aspect-video rounded-xl bg-surface-container-lowest overflow-hidden shadow-inner group flex items-center justify-center">
            {/* Real HTML5 Video Player */}
            <video
              ref={videoRef}
              src={currentReel.videoSrc}
              poster={currentReel.posterSrc}
              preload="metadata"
              playsInline
              className="w-full h-full object-cover"
              onClick={togglePlay}
            />

            {/* Now Screening Badge */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md shadow-lg pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
              <span className="text-[10px] font-sans font-bold text-secondary tracking-widest uppercase">
                {isPlaying ? 'Screening' : 'Paused'}
              </span>
            </div>

            {/* Seat Badge */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container-high/80 text-on-surface-variant backdrop-blur-sm pointer-events-none">
              <Icon name="local_activity" size={12} className="text-primary" />
              <span className="text-[10px] font-sans tracking-wider font-semibold">
                SEAT 01 & 02
              </span>
            </div>

            {/* Prominent Play/Pause Central Button Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/25">
                <button
                  onClick={togglePlay}
                  aria-label="Play Reel"
                  className="relative w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_0_28px_rgba(232,201,135,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping pointer-events-none" />
                  <Icon name="play_arrow" size={32} className="ml-0.5" />
                </button>
              </div>
            )}
          </div>

          {/* Custom Controls Dock */}
          <div className="pt-3 px-1 flex flex-col space-y-2">
            <div className="flex items-center justify-between text-on-surface-variant text-xs font-sans">
              <span className="text-primary font-semibold truncate max-w-[220px]">
                {currentReel.title}
              </span>
              <span className="font-mono text-secondary-fixed tracking-wider">
                {formatTime(currentTime)} / {formatTime(duration || 48)}
              </span>
            </div>

            {/* Scrubber Track */}
            <div
              onClick={handleScrub}
              className="relative w-full h-2.5 rounded-full bg-surface-container-highest cursor-pointer overflow-hidden"
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-secondary to-primary-container rounded-full shadow-[0_0_8px_rgba(232,201,135,0.7)] transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Media Controls Dock */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-high active:scale-95 transition-colors"
                >
                  <Icon name={isPlaying ? 'pause' : 'play'} size={18} />
                </button>
                <span className="text-xs text-on-surface-variant font-sans">
                  Cozy Audio
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Speed Button */}
                <button
                  onClick={handleSpeedToggle}
                  className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-xs font-sans hover:bg-surface-container-high transition-colors active:scale-95 flex items-center gap-1"
                >
                  <Icon name="slow_motion_video" size={13} className="text-primary" />
                  <span>{playbackSpeed}x</span>
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={handleFullscreen}
                  className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high active:scale-95 transition-colors"
                >
                  <Icon name="fullscreen" size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Film Strip Reel Selection */}
        <section className="flex flex-col space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Icon name="movie" size={18} className="text-primary" />
              <h2 className="font-serif text-lg text-primary font-medium">Film Strip Reels</h2>
            </div>
            <span className="text-xs font-sans text-on-surface-variant uppercase tracking-wider">
              {reels.length} Memories Archived
            </span>
          </div>

          {/* Reels Stack */}
          <div className="flex flex-col space-y-2">
            {reels.map((reel, idx) => {
              const isActive = idx === activeReelIndex;
              const isLockedReel = reel.isLocked && !unlocked && countdownText !== 'Unlocked!';

              return (
                <div
                  key={reel.id}
                  onClick={() => selectReel(idx)}
                  className={`w-full p-3 rounded-xl transition-all duration-300 shadow-md flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-surface-container-high border border-primary/40'
                      : isLockedReel
                      ? 'bg-surface-container-lowest/60 opacity-80 border border-transparent'
                      : 'bg-surface-container-low hover:bg-surface-container border border-outline-variant/20'
                  }`}
                >
                  {/* Thumbnail / Lock Icon */}
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-container-lowest flex items-center justify-center">
                    {isLockedReel ? (
                      <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                        <Icon name="lock" size={20} className="text-secondary-fixed" />
                      </div>
                    ) : (
                      <>
                        <img
                          src={reel.posterSrc}
                          alt={reel.title}
                          className="w-full h-full object-cover"
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Icon name="play_arrow" size={18} className="text-primary" />
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Reel Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-sans font-semibold text-primary tracking-wider uppercase">
                        {isLockedReel ? 'Locked Mystery' : isActive ? 'Currently Screening' : reel.duration}
                      </span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                    </div>
                    <h3 className="font-serif text-sm text-on-surface truncate font-medium">
                      {reel.title}
                    </h3>
                    <p className="text-xs font-sans text-on-surface-variant truncate">
                      {isLockedReel ? `Unlocks in ${countdownText} 🔒` : reel.subtitle}
                    </p>
                  </div>

                  <Icon
                    name={isLockedReel ? 'lock' : isActive ? 'sparkles' : 'play_arrow'}
                    size={18}
                    className={isActive ? 'text-primary' : 'text-on-surface-variant'}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Concession Stand Keepsake Note */}
        <section className="relative w-full rounded-2xl bg-surface-container-high p-4 shadow-lg overflow-hidden border border-secondary/20">
          <div className="absolute -top-2 right-8 w-16 h-5 bg-secondary-container/70 -rotate-3 rounded-sm shadow-sm pointer-events-none" />
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-secondary flex items-center justify-center shrink-0 shadow-md">
              <Icon name="coffee" size={20} />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-secondary tracking-wider uppercase font-semibold">
                  Concession Stand Note
                </span>
                <span className="text-xs font-sans text-on-surface-variant flex items-center gap-1">
                  <span>♥</span> Swayam
                </span>
              </div>
              <p className="font-serif italic text-sm text-primary leading-snug">
                {content.cinema.concessionNote}
              </p>
            </div>
          </div>
        </section>

        {/* Cinema Stamp Collected Banner */}
        <section className="w-full flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-surface-container to-surface-container-lowest shadow-xl text-center space-y-2 border border-primary/20">
          <div className="flex items-center gap-1.5 text-primary">
            <Icon name="award" size={18} />
            <span className="text-xs font-sans font-bold uppercase tracking-widest">
              {hasWatchedFull || progress.watchedReels.length > 0 ? 'Cinema Stamp Collected ✨' : 'Cinema Stamp Ready'}
            </span>
          </div>
          <p className="text-xs font-sans text-on-surface-variant max-w-xs">
            Finished the reel? The orchestra is ready for you in the music lounge.
          </p>

          <button
            onClick={() => {
              soundService.vibrate([25, 40]);
              soundService.playClickTone('tap');
              saveProgress({
                masteredLevels: [...new Set([...progress.masteredLevels, 3])],
                currentLevel: Math.max(progress.currentLevel, 4)
              });
              navigate('/songs-of-us');
            }}
            className="w-full max-w-xs py-3 px-6 rounded-full bg-primary-container text-on-primary-container font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(232,201,135,0.4)] transition-all hover:scale-[1.03] active:scale-95 cursor-pointer mt-2"
          >
            <span>Next Level: Songs of Us</span>
            <Icon name="arrow_forward" size={15} />
          </button>
        </section>
      </div>
    </Shell>
  );
};
