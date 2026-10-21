// Sound service providing WebAudio synthesis and background soundtrack coordination

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private bgAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private sfxEnabled: boolean = true;
  private isBgPausedForScreenAudio: boolean = false;
  private listeners: Set<(isPlaying: boolean, isMuted: boolean) => void> = new Set();

  constructor() {
    // Lazy audio setup
  }

  private initContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public subscribe(fn: (isPlaying: boolean, isMuted: boolean) => void) {
    this.listeners.add(fn);
    fn(this.isBgPlaying(), this.isMuted);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.isBgPlaying(), this.isMuted));
  }

  public isBgPlaying(): boolean {
    return Boolean(this.bgAudio && !this.bgAudio.paused && !this.isMuted);
  }

  public isAudioMuted(): boolean {
    return this.isMuted;
  }

  public startBackgroundMusic() {
    this.initContext();
    if (typeof window === 'undefined') return;

    if (!this.bgAudio) {
      this.bgAudio = new Audio('media/audio/lofi-love-tape.mp3');
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0.45;
    }

    if (this.isMuted || this.isBgPausedForScreenAudio) return;

    this.bgAudio.play().catch(e => {
      console.log('Background music autoplay prevented, awaiting user gesture:', e.message);
    });
    this.notify();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgAudio) {
      this.bgAudio.muted = this.isMuted;
      if (!this.isMuted && !this.isBgPausedForScreenAudio) {
        this.bgAudio.play().catch(() => {});
      }
    }
    this.notify();
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgAudio) {
      this.bgAudio.muted = muted;
      if (!muted && !this.isBgPausedForScreenAudio) {
        this.bgAudio.play().catch(() => {});
      }
    }
    this.notify();
  }

  public toggleSFX(): boolean {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  public isSFXEnabled(): boolean {
    return this.sfxEnabled;
  }

  public pauseBgForMedia() {
    this.isBgPausedForScreenAudio = true;
    if (this.bgAudio && !this.bgAudio.paused) {
      this.bgAudio.pause();
    }
    this.notify();
  }

  public resumeBgAfterMedia() {
    this.isBgPausedForScreenAudio = false;
    if (this.bgAudio && !this.isMuted) {
      this.bgAudio.play().catch(() => {});
    }
    this.notify();
  }

  public vibrate(pattern: number[] = [25]) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Fallback
      }
    }
  }

  // Pure bell tone generator with harmonic decays
  private playBellTone(freq: number, time: number, duration: number = 1.3, peakGain: number = 0.22) {
    if (!this.audioCtx || this.isMuted || !this.sfxEnabled) return;

    const osc = this.audioCtx.createOscillator();
    const overtone = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2.756, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4800, time);
    filter.frequency.exponentialRampToValueAtTime(1400, time + duration);

    gainNode.gain.setValueAtTime(0.0001, time);
    gainNode.gain.exponentialRampToValueAtTime(peakGain, time + 0.022);
    gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.45, time + 0.18);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    const overtoneGain = this.audioCtx.createGain();
    overtoneGain.gain.setValueAtTime(0.0001, time);
    overtoneGain.gain.exponentialRampToValueAtTime(peakGain * 0.28, time + 0.015);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.5);

    osc.connect(gainNode);
    overtone.connect(overtoneGain);
    overtoneGain.connect(filter);
    gainNode.connect(filter);
    filter.connect(this.audioCtx.destination);

    osc.start(time);
    overtone.start(time);
    osc.stop(time + duration);
    overtone.stop(time + duration);
  }

  // Cascading celestial fanfare in E Major Pentatonic (Stardust Pentatonic)
  public playMagicalCelebrationChime() {
    this.initContext();
    if (!this.audioCtx || this.isMuted || !this.sfxEnabled) return;

    try {
      const now = this.audioCtx.currentTime;
      const chimeNotes = [
        { freq: 659.25, offset: 0.00, dur: 1.2, gain: 0.22 }, // E5
        { freq: 830.61, offset: 0.09, dur: 1.3, gain: 0.24 }, // G#5
        { freq: 987.77, offset: 0.18, dur: 1.4, gain: 0.25 }, // B5
        { freq: 1318.51, offset: 0.28, dur: 1.8, gain: 0.28 }, // E6
        { freq: 1661.22, offset: 0.38, dur: 2.0, gain: 0.22 }, // G#6
        { freq: 1975.53, offset: 0.48, dur: 2.4, gain: 0.26 }  // B6
      ];

      chimeNotes.forEach(note => {
        this.playBellTone(note.freq, now + note.offset, note.dur, note.gain);
      });

      this.playBellTone(329.63, now + 0.24, 2.8, 0.15); // E4 root
    } catch (e) {
      console.warn('Audio chime warning:', e);
    }
  }

  // Interactive arcade feedback tones
  public playClickTone(type: 'flip' | 'match' | 'miss' | 'tap' = 'flip') {
    this.initContext();
    if (!this.audioCtx || this.isMuted || !this.sfxEnabled) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'flip' || type === 'tap') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'match') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.09);
        osc.frequency.setValueAtTime(783.99, now + 0.18);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'miss') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(190, now + 0.15);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // safe fallback
    }
  }
}

export const soundService = new SoundManager();
