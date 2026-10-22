import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { PolaroidFrame } from '../components/PolaroidFrame';
import { Icon } from '../components/Icon';
import { soundService } from '../services/sound';
import { saveProgress, loadProgress } from '../services/storage';
import content from '../content/content.json';

/* ── video clips mapped to milestones ── */
const MEMORY_VIDEOS = [
  { src: 'media/videos/memory-lane-1.mp4', label: 'Our Moment #1' },
  { src: 'media/videos/memory-lane-2.mp4', label: 'Our Moment #2' },
  { src: 'media/videos/memory-lane-3.mp4', label: 'Our Moment #3' },
  { src: 'media/videos/memory-lane-4.mp4', label: 'Our Moment #4' },
  { src: 'media/videos/memory-lane-5.mp4', label: 'Our Moment #5' },
];

/* ── Fullscreen Video Lightbox ── */
const VideoLightbox: React.FC<{
  src: string;
  label: string;
  onClose: () => void;
}> = ({ src, label, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Play with sound when lightbox opens
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.muted = false;
      v.play().catch(() => {});
    }
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-90"
        aria-label="Close"
      >
        <Icon name="close" size={22} />
      </button>

      {/* Label */}
      <div className="absolute top-4 left-4 z-50 px-3 py-1 rounded-full bg-white/10 border border-white/20">
        <span className="text-xs font-sans font-medium text-white/80 tracking-wide">
          {label}
        </span>
      </div>

      {/* Video Container — fills the screen with proper aspect ratio */}
      <div className="relative w-full h-full max-w-[95vw] max-h-[90vh] flex items-center justify-center p-4">
        <video
          ref={videoRef}
          src={src}
          controls
          playsInline
          autoPlay
          className="w-full h-full object-contain rounded-2xl shadow-2xl"
          style={{ maxHeight: '85vh' }}
        />
      </div>
    </div>
  );
};

/* ── Inline Video Thumbnail Card ── */
const VideoThumbnailCard: React.FC<{
  src: string;
  label: string;
  tilt: number;
  onExpand: () => void;
}> = ({ src, label, tilt, onExpand }) => {
  const thumbRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      className="polaroid-card group relative cursor-pointer"
      style={{ transform: `rotate(${tilt}deg)` }}
      onClick={() => {
        soundService.vibrate([15]);
        soundService.playClickTone('tap');
        onExpand();
      }}
    >
      {/* Card wrapper styled like Polaroid */}
      <div className="relative bg-surface-container-high rounded-2xl overflow-hidden border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_30px_rgba(232,201,135,0.1)] transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(232,201,135,0.3)] group-active:scale-[0.97]">
        {/* Video thumbnail — muted autoplay loop for preview */}
        <div className="relative aspect-[9/16] max-h-[280px] overflow-hidden">
          <video
            ref={thumbRef}
            src={src}
            muted
            autoPlay
            loop
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-[0_0_20px_rgba(232,201,135,0.4)] group-hover:scale-110 transition-transform">
              <Icon name="play_arrow" size={28} className="text-white ml-0.5" />
            </div>
          </div>

          {/* Tap to expand hint */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] font-sans text-white/80 tracking-wide uppercase">
              Tap to watch
            </span>
          </div>
        </div>

        {/* Label bar */}
        <div className="px-3 py-2.5 flex items-center gap-2">
          <Icon name="movie" size={14} className="text-primary shrink-0" />
          <span className="text-xs font-sans text-on-surface-variant truncate">
            {label}
          </span>
          <Icon name="fullscreen" size={14} className="text-primary/60 ml-auto shrink-0" />
        </div>
      </div>
    </div>
  );
};

/* ── Main Screen ── */
export const MemoryLaneScreen: React.FC = () => {
  const navigate = useNavigate();
  const progress = loadProgress();
  const [expandedVideo, setExpandedVideo] = useState<number | null>(null);

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

  const closeLightbox = useCallback(() => setExpandedVideo(null), []);

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
              const video = MEMORY_VIDEOS[idx];

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

                  {/* Milestone Content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Polaroid Photo Card */}
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

                    {/* Video Clip Card */}
                    {video && (
                      <VideoThumbnailCard
                        src={video.src}
                        label={video.label}
                        tilt={tilts[(idx + 2) % tilts.length]}
                        onExpand={() => setExpandedVideo(idx)}
                      />
                    )}
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

      {/* Fullscreen Video Lightbox */}
      {expandedVideo !== null && MEMORY_VIDEOS[expandedVideo] && (
        <VideoLightbox
          src={MEMORY_VIDEOS[expandedVideo].src}
          label={MEMORY_VIDEOS[expandedVideo].label}
          onClose={closeLightbox}
        />
      )}
    </Shell>
  );
};
