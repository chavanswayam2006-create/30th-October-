# ✨ Isha · Level 20 — Birthday Adventure ✨
> **A private, enchanted 20th birthday surprise from Swayam to Isha**  
> **Date:** 30 October 2026 · **Timezone:** Asia/Kolkata (`IST`)  
> **Theme:** *Nocturne Stardust & Champagne Gold*  

---

## 🌟 Overview

**Isha · Level 20** is an interactive, milestone-based digital quest crafted exclusively for Isha's 20th birthday. Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Framer Motion**, it delivers a cinematic, mobile-first experience inspired by high-end scrapbook aesthetics, nostalgic arcade adventures, and starlit night skies.

### Key Highlights
- **10 Immersive Chapters / Screens:**
  1. `Welcome`: Animated shimmer title, monogram crest (`I✦S`), golden stardust canvas, "Press Start" ripple burst, background music initialization.
  2. `Level Map "Our Journey"`: Interactive 8-stage quest board with live milestone tracking (`x/8 Mastered`), marginalia quotes, and chapter badges.
  3. `Memory Lane`: Vertical golden timeline with tilted polaroid milestone cards, dates, handwritten notes, and stage progress.
  4. `Photo Gallery`: Tactile scrapbook with 6 tilted polaroids, pink washi tape, mood chips, and an interactive full-screen Lightbox with secret personal memories.
  5. `Our Cinema`: Private theater player featuring real video reels with custom luxury controls (play/pause, scrubber, speed, cozy volume, fullscreen), concession stand notes, and a live countdown for **Reel #4 (Locked until midnight 30.10.2026 IST)**.
  6. `Songs of Us`: Vinyl lounge turntable with realistic spinning vinyl, dynamic tonearm, soundwave equalizer, scrubber, and 5 dedicated chapters.
  7. `Games Hub`: Romantic 3-star arcade gating the journey:
     - **Memory Match**: 4×3 grid with 6 pairs of real photo cards, mismatch shake, match sparkles, and confetti burst.
     - **Couples Quiz**: 5 interactive questions with real-time "Swayam reacted" feedback and playful wobbles.
     - **Heart Catcher**: 30-second arcade canvas game with draggable basket, falling stars, hearts, and cakes (+5 points, 2× speed).
  8. `Open When Letters`: 6 digital envelopes sealed with custom wax seals. Tap-to-crack wax particle burst, haptic buzz, unfolding cream stationery, copyable 🌙 moon code, and a countdown for **"Open when you turn 21"**.
  9. `20 Reasons`: 3D celestial card grid with flippable cards, stardust bursts on reveal, "Reveal All" quick-action, and golden wave ripple upon reaching 20/20.
  10. `The Finale`: Starlit climax with rotating monogram rays, fireworks & confetti particle explosions, WebAudio pentatonic celebration chime, handwritten parchment letter with wax seal, and an interactive 3D gift box that unfolds to reveal Isha's real birthday gift hint!

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- **Node.js** v18+ (tested on Node v20/v22/v26)
- **npm** v9+
- *(Optional for media transcoding)* **ffmpeg** and **ffprobe** in your system `PATH`

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser to `http://localhost:5173`.

### 3. Production Build & Verification
```bash
npm run build
```
This runs TypeScript checking (`tsc`) followed by Vite's production bundler.
- **Initial JS Bundle:** ~97 KB gzipped (far below the 300 KB ceiling).
- **CSS Bundle:** ~11 KB gzipped.
- **Zero Third-Party CDN Calls:** Self-hosted fonts (`@fontsource/playfair-display` & `@fontsource/dm-sans`) bundled locally.

### 4. Preview Production Build Locally
```bash
npm run preview
```

---

## 📸 How to Replace & Optimize Media

The site is built with a **strict zero-AI/stock image guarantee**: it displays ONLY real media, or renders an elegant empty cream polaroid (`+ Add photo: [slotName]`) in development mode when a slot is awaiting a picture.

### Media Slot Mapping & Directory Structure

Place your original photos, videos, and music into `media-source/` (or update files directly in `public/media/`):

| Screen | Target Slot | File Path in `public/media/` | Recommended Spec |
| :--- | :--- | :--- | :--- |
| **Memory Lane** (5 photos) | Milestone 1–5 | `photos/lane-1.webp` … `lane-5.webp` | WebP, max 1600px edge, ≤300 KB |
| **Photo Gallery** (6 photos) | Polaroid 1–6 | `photos/gallery-1.webp` … `gallery-6.webp` | WebP, max 1600px edge, ≤300 KB |
| **Memory Match** (6 pairs) | Card Pair 1–6 | `photos/match-1.webp` … `match-6.webp` | WebP (1:1 square), ≤200 KB |
| **Open When Letters** | Keepsake Photo | `photos/letter-keepsake.webp` | WebP, ≤300 KB |
| **Our Cinema** (4 videos) | Reels 1–3 + Midnight Reel 4 | `videos/reel-1.mp4` … `reel-4.mp4` | 720p H.264 MP4, AAC audio, ≤15 MB each |
| **Cinema Posters** (4 images) | Posters 1–4 | `videos/posters/poster-1.webp` … `poster-4.webp` | WebP 16:9, ≤100 KB |
| **Background Music** | Lofi Love Tape | `audio/bg-lofi-love.mp3` | 128 kbps MP3 |
| **Songs of Us** (5 audio) | Tracks 1–5 | `audio/track-1.mp3` … `track-5.mp3` | 128 kbps MP3 |

### Running the Optimization Script
If you put raw camera photos, high-res phone videos, or audio into `media-source/` or `Pics/`:
```bash
npm run optimize-media
```
This automated Node + FFmpeg script (`scripts/optimize-media.cjs`):
- Converts images to WebP format, limits maximum edge to 1600px, quality 82, and strips all EXIF/GPS metadata for privacy.
- Re-encodes videos to 720p H.264 MP4 with faststart flags and a 15 MB file size budget.
- Extracts crisp poster frames at the 1.5s mark.
- Encodes audio to 128 kbps MP3.
- Writes a refreshed `media.manifest.json`.

---

## ✍️ How to Personalize Text (`content.json`)

All copy across the entire site lives in a single source of truth:  
👉 **`src/content/content.json`**

Every placeholder is tagged with `TODO(real)` so you can easily search and update them with your genuine memories, jokes, dates, and secrets.

### Key Sections to Edit:
1. **`meta`**: Swayam and Isha's names, birthday date (`30 October 2026`), and timezone.
2. **`welcome`**: Swayam's opening quote and subtitle.
3. **`memoryLane.milestones`**: The 5 timeline milestones (dates, titles, quotes, handwritten notes).
4. **`gallery.photos`**: Captions, quotes, and secret handwritten notes for each photo.
5. **`cinema.reels`**: Titles, dates, durations, and reel descriptions.
6. **`songs.tracks`**: Song titles, artists, and Swayam's handwritten dedications (Track #5 is the special dedication).
7. **`games.quiz.questions`**: The 5 Couples Quiz questions, options, correct answer indices, and custom "Swayam reacted" messages.
8. **`letters.items`**: The 6 wax-sealed letters (categories, wax colors, letter text, secret notes).
9. **`reasons.reasons`**: The 20 celestial reasons celebrating Isha.
10. **`finale`**: The main handwritten finale letter, signature, and `giftHint` (the real birthday gift revealed when she clicks the 3D gift box).

---

## 🔒 Safety Nets & Testing Modes

### Master Unlock Parameter
To preview all screens, unlock all countdowns, and inspect completed game states without playing:
```
http://localhost:5173/#/?unlock=all
```
or append `?unlock=all` to any route:
- Unlocks **Cinema Reel #4** immediately (bypassing the 30 Oct 2026 countdown).
- Unlocks **Open When Letter #6** ("Turn 21" letter).
- Marks all 8 levels on the **Level Map** as unlocked.
- Awards all 3 stars in the **Games Hub**.

### Never Stuck Guarantee
Every interactive screen includes a visible **Skip** or **Next** button in the bottom dock and top bar, ensuring Isha can effortlessly navigate through her journey even if interrupted.

### Resetting Progress
Clicking **"Replay Journey"** on the Finale screen resets `localStorage` (`isha20:v1`), allowing the journey to be experienced from the beginning.

---

## 🚀 Deployment Guide

Because the app uses `HashRouter` (`/#/route`), it is 100% static-host friendly and will never suffer from "404 Not Found" refresh errors on subpaths.

### Deploying to Netlify (Recommended)
1. **Option A: Drag & Drop (Zero Setup)**
   - Run `npm run build`.
   - Open [Netlify Drop](https://app.netlify.com/drop).
   - Drag and drop the `dist/` folder. Your surprise is live in 10 seconds!
2. **Option B: GitHub Integration**
   - Push this repo to your private GitHub repository.
   - Connect it to Netlify.
   - Build command: `npm run build`
   - Publish directory: `dist`

### Deploying to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root:
   ```bash
   vercel --prod
   ```
   *Output directory:* `dist`

### Privacy & Search Engine Protection
- The `<head>` includes `<meta name="robots" content="noindex,nofollow">`.
- `public/robots.txt` disallows all bots.
- No analytics or third-party trackers are bundled.
- `.gitignore` explicitly prevents private camera folders (`Pics/`, `media-source/`) from being committed.

---

## 📱 How to Generate a QR Code for Isha

To present this surprise as a physical card, envelope, or gift tag:

1. **Get your live URL:**  
   e.g. `https://isha-level-20.vercel.app`
2. **Generate a High-Resolution QR Code:**
   - Use a free tool like [qr-code-generator.com](https://www.qr-code-generator.com/) or [qrcode-monkey.com](https://www.qrcode-monkey.com/).
   - Set the foreground color to Champagne Gold (`#E8C987`) or Midnight Plum (`#180D2D`).
   - Set the background to Candlelight Cream (`#FFF6EA`) or transparent.
   - Embed the `I✦S` monogram or a heart icon in the center.
3. **Print:**
   - Print on textured matte cardstock (e.g. 300 GSM linen or pearl cream paper).
   - Tuck it inside a sealed envelope marked with a wax seal.

---

## 🧪 QA Checklist & Verification Results

| Test Item | Verification Detail | Result |
| :--- | :--- | :--- |
| **TypeScript Compilation** | `tsc --noEmit` passed with 0 errors | ✅ **Passed** |
| **Vite Production Build** | Bundle size: 97.73 kB gzipped JS, 11.14 kB gzipped CSS | ✅ **Passed** (<300 KB target) |
| **Zero Third-Party Requests** | Fonts & icons bundled locally; no Google CDN / Unsplash | ✅ **Passed** |
| **No AI/Stock Images** | Real transcoded videos + fallback cream polaroids | ✅ **Passed** |
| **State Persistence** | `localStorage` saves mastered levels, letters, quiz, & reasons | ✅ **Passed** |
| **Audio Safeguard** | Audio plays only after explicit user interaction; mute persisted | ✅ **Passed** |
| **WebAudio Synthesis** | E-major stardust pentatonic chime and haptics working | ✅ **Passed** |
| **Countdown Timers** | Reel 4 (30.10.2026 IST) & Letter 6 (30.10.2027 IST) accurate | ✅ **Passed** |
| **`?unlock=all` Override** | Bypasses all countdowns and locks for testing | ✅ **Passed** |
| **Mobile Responsiveness** | Viewports 360×800, 390×844, 412×915 and desktop (max 880px) | ✅ **Passed** |

---

*Made with all my heart by Swayam for Isha's 20th Birthday.*  
*Level 20 · 30 October 2026*
