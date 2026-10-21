import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Icon } from '../components/Icon';
import { soundService } from '../services/sound';
import { saveProgress, loadProgress } from '../services/storage';
import content from '../content/content.json';

export const SongsScreen: React.FC = () => {
  const navigate = useNavigate();
  const progress = loadProgress();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playlist = content.songs.playlist;
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set([1, 5]));

  const currentTrack = playlist[currentTrackIndex];

  // Sync with HTML5 Audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setDuration(audio.duration);
    };

    const onEnded = () => {
      // Auto-advance to next track
      handleNextTrack();
    };

    const onPlay = () => {
      setIsPlaying(true);
      soundService.pauseBgForMedia();
    };

    const onPause = () => {
      setIsPlaying(false);
      soundService.resumeBgAfterMedia();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      soundService.resumeBgAfterMedia();
    };
  }, [currentTrackIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    soundService.vibrate([20]);
    if (audio.paused) {
      audio.play().catch(e => console.log('Audio playback error:', e));
    } else {
      audio.pause();
    }
  };

  const handlePrevTrack = () => {
    soundService.vibrate([15]);
    const prev = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prev);
    setCurrentTime(0);
    setTimeout(() => {
      if (audioRef.current) audioRef.current.play().catch(() => {});
    }, 50);
  };

  const handleNextTrack = () => {
    soundService.vibrate([15]);
    const next = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(next);
    setCurrentTime(0);
    setTimeout(() => {
      if (audioRef.current) audioRef.current.play().catch(() => {});
    }, 50);
  };

  const handleSelectTrack = (idx: number) => {
    soundService.vibrate([20]);
    soundService.playClickTone('tap');
    setCurrentTrackIndex(idx);
    setCurrentTime(0);
    setTimeout(() => {
      if (audioRef.current) audioRef.current.play().catch(() => {});
    }, 50);
  };

  const toggleLike = (trackId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    soundService.vibrate([25]);
    soundService.playClickTone('match');
    setLikedTracks(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return next;
    });
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newRatio = Math.max(0, Math.min(1, clickX / rect.width));
    audio.currentTime = newRatio * duration;
    setCurrentTime(newRatio * duration);
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
      screenTitle="Songs of Us"
      nextPath="/games-hub"
      skipPath="/games-hub"
    >
      <div className="flex flex-col w-full relative pb-12 max-w-xl mx-auto space-y-6">
        {/* Hidden Audio Player */}
        <audio
          ref={audioRef}
          src={currentTrack.audioSrc}
          preload="metadata"
        />

        {/* Header & Level Indicator */}
        <header className="flex flex-col items-center text-center space-y-1 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface-container-high shadow-sm border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="text-[11px] font-sans font-bold text-primary tracking-widest uppercase">
              {content.songs.badge}
            </span>
            <span className="text-secondary text-xs">✦</span>
            <span className="text-[11px] font-sans text-secondary tracking-wider">
              {content.songs.sideBadge}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-primary tracking-tight font-medium">
            {content.songs.title}
          </h1>

          <p className="font-sans text-sm text-on-surface-variant max-w-xs">
            {content.songs.subtitle}
          </p>
        </header>

        {/* Interactive Turntable & Sound Sanctuary Deck */}
        <div className="relative w-full rounded-2xl bg-surface-container-low p-4 sm:p-6 shadow-xl overflow-hidden flex flex-col items-center border border-primary/20">
          {/* Subtle Golden Glow Backlight */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

          {/* Turntable Deck Platter */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
            {/* Outer Turntable Ring */}
            <div className="absolute inset-0 rounded-full bg-surface-container-highest shadow-inner flex items-center justify-center">
              {/* Metallic Rim */}
              <div className="w-[94%] h-[94%] rounded-full bg-surface-container-lowest flex items-center justify-center shadow-2xl relative">
                {/* Vinyl Record Disc (Spinning when playing) */}
                <div
                  className={`w-[92%] h-[92%] rounded-full bg-[#0d071a] flex items-center justify-center shadow-lg relative transition-transform duration-700 ease-out ${
                    isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''
                  }`}
                >
                  {/* Vinyl Micro-grooves */}
                  <div className="absolute inset-2 rounded-full opacity-35 bg-[radial-gradient(circle,transparent_20%,rgba(232,201,135,0.15)_21%,transparent_22%,rgba(255,255,255,0.06)_40%,transparent_41%,rgba(232,201,135,0.12)_60%,transparent_61%,rgba(255,255,255,0.08)_80%,transparent_81%)]" />

                  {/* Reflection Highlights */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-primary/10 to-transparent pointer-events-none" />

                  {/* Center Vinyl Label */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-container via-primary to-primary-fixed flex flex-col items-center justify-center text-on-primary-container shadow-md text-center p-2 relative z-10">
                    <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-on-primary-container/80">
                      ISHA · SIDE A
                    </span>
                    <Icon name="favorite" size={14} className="text-on-primary-container fill-on-primary-container my-0.5" />
                    <span className="text-[8px] font-sans font-bold uppercase tracking-tight text-on-primary-container">
                      LEVEL 20
                    </span>
                    <div className="w-3.5 h-3.5 rounded-full bg-surface-container-lowest shadow-inner mt-1" />
                  </div>
                </div>

                {/* Golden Tonearm Assembly */}
                <div
                  className={`absolute -top-3 -right-2 w-24 h-36 pointer-events-none z-20 origin-top-right transition-transform duration-700 ease-in-out ${
                    isPlaying ? 'rotate-[26deg]' : 'rotate-6'
                  }`}
                >
                  {/* Pivot Base */}
                  <div className="absolute top-1 right-2 w-6 h-6 rounded-full bg-primary-container shadow-md flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-container-lowest" />
                  </div>
                  {/* Arm Bar */}
                  <div className="absolute top-5 right-4 w-1.5 h-24 bg-gradient-to-b from-primary-container via-primary-fixed-dim to-primary rounded-full shadow-sm" />
                  {/* Cartridge */}
                  <div className="absolute bottom-6 right-2 w-4 h-6 rounded-sm bg-secondary-container shadow flex items-center justify-center rotate-[-18deg]">
                    <div className="w-1 h-2 bg-primary-fixed rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Equalizer Wave Bars */}
          <div className="flex items-end justify-center gap-1.5 h-7 w-full my-3 px-4">
            {[3, 6, 4, 7, 5, 8, 3, 7, 5, 6, 4, 2].map((height, i) => (
              <span
                key={i}
                className={`w-1 rounded-full bg-gradient-to-t from-primary-container to-secondary transition-all duration-200 ${
                  isPlaying ? 'animate-pulse' : 'h-1.5 opacity-40'
                }`}
                style={{
                  height: isPlaying ? `${height * 3.5}px` : '4px',
                  animationDelay: `${(i % 4) * 0.15}s`
                }}
              />
            ))}
          </div>

          {/* Active Track Bar */}
          <div className="w-full bg-surface-container/90 rounded-xl p-4 shadow-lg space-y-3 mt-1 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full bg-primary ${isPlaying ? 'animate-ping' : ''}`} />
                  <p className="font-serif text-base text-primary font-medium truncate">
                    {currentTrack.title}
                  </p>
                </div>
                <p className="text-xs font-sans text-on-surface-variant truncate">
                  {currentTrack.artist} · Chapter 0{currentTrack.id}
                </p>
              </div>

              <button
                onClick={e => toggleLike(currentTrack.id, e)}
                className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-secondary active:scale-90 transition-transform"
                aria-label="Favorite track"
              >
                <Icon
                  name="favorite"
                  size={18}
                  className={likedTracks.has(currentTrack.id) ? 'fill-secondary text-secondary' : 'text-outline'}
                />
              </button>
            </div>

            {/* Scrubber Line */}
            <div className="space-y-1">
              <div
                onClick={handleScrub}
                className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden relative cursor-pointer"
              >
                <div
                  className="bg-gradient-to-r from-primary via-primary-container to-secondary h-full rounded-full transition-all duration-100"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-on-surface-variant">
                <span>{formatTime(currentTime)}</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            {/* Transport Controls */}
            <div className="flex items-center justify-center gap-6 pt-1">
              <button
                onClick={handlePrevTrack}
                aria-label="Previous Track"
                className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center transition-all hover:bg-surface-bright active:scale-95 cursor-pointer"
              >
                <Icon name="skip_previous" size={20} />
              </button>

              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_0_20px_rgba(232,201,135,0.4)] transition-all hover:bg-primary active:scale-90 cursor-pointer"
              >
                <Icon name={isPlaying ? 'pause' : 'play'} size={28} className={isPlaying ? '' : 'ml-0.5'} />
              </button>

              <button
                onClick={handleNextTrack}
                aria-label="Next Track"
                className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center transition-all hover:bg-surface-bright active:scale-95 cursor-pointer"
              >
                <Icon name="skip_next" size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Curated Playlist: The 5 Chapters */}
        <section className="flex flex-col space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Icon name="queue_music" size={18} className="text-primary" />
              <h2 className="font-serif text-lg text-on-surface font-medium">The 5 Chapters</h2>
            </div>
            <span className="text-[10px] font-sans font-bold text-secondary-fixed-dim bg-secondary-container/50 px-2.5 py-0.5 rounded-full">
              5 MEMORIES UNLOCKED
            </span>
          </div>

          {/* Track List */}
          <div className="flex flex-col space-y-2.5">
            {playlist.map((track, idx) => {
              const isActive = idx === currentTrackIndex;
              const isLiked = likedTracks.has(track.id);

              return (
                <div
                  key={track.id}
                  onClick={() => handleSelectTrack(idx)}
                  className={`track-card relative w-full rounded-xl p-3.5 shadow-md transition-all duration-300 cursor-pointer border ${
                    isActive
                      ? 'bg-surface-container-high border-primary/40 shadow-[0_0_16px_rgba(232,201,135,0.2)]'
                      : 'bg-surface-container hover:bg-surface-container-high border-transparent'
                  }`}
                >
                  {/* Special Dedication Ribbon */}
                  {track.isSpecial && (
                    <div className="absolute -top-2.5 right-4 bg-primary text-on-primary text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-primary-fixed">
                      <Icon name="auto_awesome" size={11} />
                      <span>SPECIAL DEDICATION</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Chapter Disc Badge */}
                      <div className="w-11 h-11 rounded-lg bg-surface-container-highest shadow-inner shrink-0 relative overflow-hidden flex items-center justify-center border border-primary/20">
                        <img
                          src={`media/photos/song-${track.id}.webp`}
                          alt={track.title}
                          className="w-full h-full object-cover opacity-85"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Icon
                            name={isActive && isPlaying ? 'equalizer' : 'music_note'}
                            size={16}
                            className={isActive ? 'text-primary animate-pulse' : 'text-white/80'}
                          />
                        </div>
                        <span className="absolute bottom-0.5 right-1 text-[8px] font-sans font-bold text-white drop-shadow">
                          0{track.id}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className={`text-sm font-sans font-semibold truncate ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                          {track.title}
                        </p>
                        <p className="text-xs font-sans text-on-surface-variant truncate">
                          {track.artist} · {track.duration}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={e => toggleLike(track.id, e)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-secondary active:scale-90 shrink-0"
                      aria-label="Like track"
                    >
                      <Icon
                        name="favorite"
                        size={16}
                        className={isLiked ? 'fill-secondary text-secondary' : 'text-outline'}
                      />
                    </button>
                  </div>

                  {/* Handwritten Marginalia Note */}
                  <div className="mt-2.5 pt-2 flex items-start gap-2 bg-surface-container-lowest/60 rounded-lg p-2.5 border border-outline-variant/20">
                    <Icon name="stylus_note" size={14} className="text-secondary shrink-0 mt-0.5" />
                    <p className="text-xs font-serif italic text-secondary-fixed leading-relaxed">
                      {track.dedication}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Progression Gateway */}
        <section className="mt-8 text-center flex flex-col items-center">
          <button
            onClick={() => {
              soundService.vibrate([25, 40]);
              soundService.playClickTone('match');
              saveProgress({
                masteredLevels: [...new Set([...progress.masteredLevels, 4])],
                currentLevel: Math.max(progress.currentLevel, 5)
              });
              navigate('/games-hub');
            }}
            className="w-full max-w-sm py-4 px-6 rounded-full bg-gradient-to-r from-primary-container via-primary to-primary-container text-on-primary-container font-sans text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(232,201,135,0.45)] transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            <span>Next Level: The Games Hub</span>
            <Icon name="arrow_forward" size={16} />
          </button>
        </section>
      </div>
    </Shell>
  );
};
