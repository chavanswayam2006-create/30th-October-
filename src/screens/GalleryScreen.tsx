import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { PolaroidFrame } from '../components/PolaroidFrame';
import { Icon } from '../components/Icon';
import { soundService } from '../services/sound';
import { saveProgress, loadProgress } from '../services/storage';
import content from '../content/content.json';

/* ── Real video clips for the gallery ── */
const GALLERY_VIDEOS = [
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
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.muted = false;
      v.play().catch(() => {});
    }
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
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-90"
        aria-label="Close"
      >
        <Icon name="close" size={22} />
      </button>

      {/* Label */}
      <div className="absolute top-4 left-4 z-50 px-3 py-1 rounded-full bg-white/10 border border-white/20">
        <span className="text-xs font-sans font-medium text-white/80 tracking-wide">{label}</span>
      </div>

      {/* Video */}
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
      <div className="relative bg-surface-container-high rounded-2xl overflow-hidden border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_30px_rgba(232,201,135,0.1)] transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(232,201,135,0.3)] group-active:scale-[0.97]">
        {/* Video thumbnail */}
        <div className="relative aspect-[9/16] max-h-[260px] overflow-hidden">
          <video
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

          {/* Tap hint */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] font-sans text-white/80 tracking-wide uppercase">
              Tap to watch
            </span>
          </div>
        </div>

        {/* Label bar */}
        <div className="px-3 py-2.5 flex items-center gap-2">
          <Icon name="movie" size={14} className="text-primary shrink-0" />
          <span className="text-xs font-sans text-on-surface-variant truncate">{label}</span>
          <Icon name="fullscreen" size={14} className="text-primary/60 ml-auto shrink-0" />
        </div>
      </div>
    </div>
  );
};

/* ── Main Gallery Screen ── */
export const GalleryScreen: React.FC = () => {
  const navigate = useNavigate();
  const progress = loadProgress();
  const [activeModal, setActiveModal] = useState<number | null>(null);
  const [expandedVideo, setExpandedVideo] = useState<number | null>(null);
  const [discovered, setDiscovered] = useState<Set<number>>(new Set([1, 2, 3]));

  const polaroids = content.gallery.polaroids;
  const tilts = [-2, 2.5, -1.5, 2, -2, 1.5];

  const handleOpenModal = (index: number) => {
    soundService.vibrate([20]);
    soundService.playClickTone('tap');
    setActiveModal(index);
    setDiscovered(prev => new Set([...prev, index + 1]));
  };

  const handleNextLevel = () => {
    soundService.vibrate([25, 40]);
    soundService.playClickTone('match');
    if (!progress.masteredLevels.includes(2)) {
      saveProgress({
        masteredLevels: [...new Set([...progress.masteredLevels, 2])],
        currentLevel: Math.max(progress.currentLevel, 3)
      });
    }
    navigate('/our-cinema');
  };

  const closeLightbox = useCallback(() => setExpandedVideo(null), []);

  const selectedItem = activeModal !== null ? polaroids[activeModal] : null;

  return (
    <Shell
      screenTitle="Photo Gallery"
      nextPath="/our-cinema"
      skipPath="/our-cinema"
    >
      <div className="flex flex-col w-full relative pb-12 max-w-xl mx-auto">
        {/* Header */}
        <header className="flex flex-col items-center text-center space-y-1.5 pt-2 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface-container-high/90 shadow-md border border-primary/20">
            <Icon name="favorite" size={12} className="text-secondary fill-secondary" />
            <span className="text-[11px] font-sans uppercase tracking-widest text-primary font-bold">
              {content.gallery.badge}
            </span>
            <span className="text-primary text-xs">✦</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-primary tracking-tight font-medium">
            {content.gallery.title}
          </h1>

          <p className="font-sans text-sm text-on-surface-variant max-w-xs leading-relaxed">
            {content.gallery.subtitle}
          </p>

          {/* Discovered Counter & Hint */}
          <div className="flex items-center gap-2 mt-2">
            <div className="px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-sans font-semibold border border-primary/20 shadow-sm">
              {discovered.size} of {polaroids.length} Discovered
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] text-secondary-fixed-dim">
              <Icon name="auto_awesome" size={12} className="animate-pulse" />
              <span>{content.gallery.hint}</span>
            </div>
          </div>
        </header>

        {/* Polaroid Scrapbook Cascade Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full px-2 mt-2">
          {polaroids.map((p, idx) => (
            <div key={p.id} className="w-full">
              <PolaroidFrame
                slotName={`Photo 0${p.id}`}
                src={`media/photos/${p.photoSlot}.webp`}
                title={p.title}
                caption={p.caption}
                dateOrTag={p.moodChip}
                authorTag="Swayam's Secret"
                tilt={tilts[idx % tilts.length]}
                washiTapePosition={idx % 2 === 0 ? 'left' : 'right'}
                onClick={() => handleOpenModal(idx)}
              />
            </div>
          ))}
        </div>

        {/* ── Our Video Moments Section ── */}
        <section className="mt-14 w-full px-2">
          {/* Section header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/90 shadow-md border border-secondary/20 mb-3">
              <Icon name="movie" size={12} className="text-secondary" />
              <span className="text-[11px] font-sans uppercase tracking-widest text-secondary font-bold">
                VIDEO REEL
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-primary tracking-tight font-medium">
              Our Video Moments
            </h2>
            <p className="font-sans text-xs text-on-surface-variant max-w-xs mt-1">
              Tap any clip to watch it fullscreen with sound
            </p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-2 gap-4">
            {GALLERY_VIDEOS.map((vid, idx) => (
              <VideoThumbnailCard
                key={idx}
                src={vid.src}
                label={vid.label}
                tilt={tilts[idx % tilts.length] * 0.5}
                onExpand={() => setExpandedVideo(idx)}
              />
            ))}
          </div>
        </section>

        {/* Next Stage Gateway */}
        <section className="mt-12 text-center flex flex-col items-center">
          <button
            onClick={handleNextLevel}
            className="w-full max-w-sm py-4 px-6 rounded-full bg-gradient-to-r from-primary-container via-primary to-primary-container text-on-primary-container font-sans text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(232,201,135,0.45)] transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            <span>Next Level: Our Cinema</span>
            <Icon name="arrow_forward" size={16} />
          </button>
        </section>

        {/* Lightbox Modal with Handwritten Secret */}
        {selectedItem && activeModal !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 selection:bg-secondary"
            onClick={() => setActiveModal(null)}
          >
            <div
              className="relative w-full max-w-md bg-[#FFF6EA] text-[#2B1B3D] rounded-2xl p-5 shadow-2xl border border-primary/40 transform transition-all animate-in fade-in zoom-in-95 duration-200"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#180d2d]/10 hover:bg-[#180d2d]/20 text-[#2B1B3D] flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                ✕
              </button>

              {/* Photo Area */}
              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#201536] relative mb-4 shadow-md">
                <PolaroidFrame
                  slotName={`Photo 0${selectedItem.id}`}
                  src={`media/photos/${selectedItem.photoSlot}.webp`}
                  title={selectedItem.title}
                  aspectRatio="4/3"
                  tilt={0}
                  washiTapePosition="none"
                />
              </div>

              {/* Secret Handwritten Note */}
              <div className="space-y-2 pt-1 border-t border-[#E8DFC8]">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold text-[#2B1B3D]">
                    {selectedItem.title}
                  </h3>
                  <span className="text-xs uppercase font-bold text-[#8E5B6A]">
                    {selectedItem.dateLocation}
                  </span>
                </div>

                <p className="font-serif italic text-sm text-[#593946] leading-relaxed">
                  "{selectedItem.secretNote}"
                </p>

                <div className="flex items-center justify-between pt-3 text-xs text-[#8E5B6A]">
                  <span className="italic flex items-center gap-1">
                    <span>♥</span> Forever Swayam
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const prev = (activeModal - 1 + polaroids.length) % polaroids.length;
                        setActiveModal(prev);
                        soundService.playClickTone('tap');
                      }}
                      className="px-2.5 py-1 rounded-full bg-[#2B1B3D]/10 hover:bg-[#2B1B3D]/20 text-[#2B1B3D] font-sans text-xs"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => {
                        const next = (activeModal + 1) % polaroids.length;
                        setActiveModal(next);
                        soundService.playClickTone('tap');
                      }}
                      className="px-2.5 py-1 rounded-full bg-[#2B1B3D] text-[#FFF6EA] font-sans text-xs font-semibold"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Video Lightbox */}
      {expandedVideo !== null && GALLERY_VIDEOS[expandedVideo] && (
        <VideoLightbox
          src={GALLERY_VIDEOS[expandedVideo].src}
          label={GALLERY_VIDEOS[expandedVideo].label}
          onClose={closeLightbox}
        />
      )}
    </Shell>
  );
};
