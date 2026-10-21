const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const picsDir = fs.existsSync(path.join(rootDir, 'Pics'))
  ? path.join(rootDir, 'Pics')
  : path.join(rootDir, 'media-source');

const outputDir = path.join(rootDir, 'public', 'media');
const videoOutDir = path.join(outputDir, 'videos');
const photoOutDir = path.join(outputDir, 'photos');
const audioOutDir = path.join(outputDir, 'audio');

[outputDir, videoOutDir, photoOutDir, audioOutDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

console.log('🎬 Running media optimization pipeline...');

// 1. Process Cinema Videos
const cinemaReels = [
  {
    name: 'reel-1',
    src: 'VivaCut_video_1771101128092_1080HD.mp4',
    title: 'The Montage of Us'
  },
  {
    name: 'reel-2',
    src: 'VID_20260509_015027_591_bsl.mp4',
    title: 'That Day With You'
  },
  {
    name: 'reel-3',
    src: 'VID-20260509-WA0009.mp4',
    title: 'Your Laugh, 3 AM'
  },
  {
    name: 'reel-4',
    src: 'VivaCut_video_1771100403868_1080HD.mp4',
    title: 'The Secret Birthday Message'
  }
];

cinemaReels.forEach((reel, idx) => {
  const srcPath = path.join(picsDir, reel.src);
  const outVideo = path.join(videoOutDir, `${reel.name}.mp4`);
  const outPoster = path.join(videoOutDir, `${reel.name}-poster.webp`);

  if (!fs.existsSync(srcPath)) {
    console.warn(`[Video] Source missing: ${reel.src}`);
    return;
  }

  // 1a. Optimize Video (720p H.264, AAC 128k, <= 15MB, faststart for fast streaming)
  if (!fs.existsSync(outVideo) || fs.statSync(outVideo).size === 0) {
    console.log(`[Video] Encoding ${reel.name} (${reel.src})...`);
    try {
      const cmd = `ffmpeg -y -i "${srcPath}" -vf "scale=-2:720" -c:v libx264 -crf 26 -preset fast -maxrate 2500k -bufsize 5000k -c:a aac -b:a 128k -movflags +faststart "${outVideo}"`;
      execSync(cmd, { stdio: 'inherit' });
      const stats = fs.statSync(outVideo);
      console.log(`✓ ${reel.name}.mp4 ready (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
    } catch (err) {
      console.error(`Error encoding ${reel.name}:`, err.message);
    }
  } else {
    console.log(`✓ ${reel.name}.mp4 already exists.`);
  }

  // 1b. Extract Poster Frame
  if (!fs.existsSync(outPoster) || fs.statSync(outPoster).size === 0) {
    try {
      const posterCmd = `ffmpeg -y -ss 00:00:01 -i "${srcPath}" -vframes 1 -vf "scale=-2:720" -q:v 80 "${outPoster}"`;
      execSync(posterCmd, { stdio: 'inherit' });
      console.log(`✓ ${reel.name}-poster.webp generated`);
    } catch (err) {
      console.error(`Error generating poster for ${reel.name}:`, err.message);
    }
  }
});

// 2. Generate or Transcode Audio Tracks
// Create gentle, warm synthesized ambient lofi audio files using ffmpeg if audio tracks aren't already present
const audioFiles = [
  { name: 'lofi-love-tape.mp3', title: 'Lofi Love Tape (Our Song)', chord: '329.63' },
  { name: 'song-1.mp3', title: 'Until I Found You', chord: '261.63' },
  { name: 'song-2.mp3', title: 'Yellow', chord: '293.66' },
  { name: 'song-3.mp3', title: 'Late Night Talking', chord: '349.23' },
  { name: 'song-4.mp3', title: 'Strawberries & Cigarettes', chord: '392.00' },
  { name: 'song-5.mp3', title: "Isha's 20th Birthday Waltz", chord: '440.00' }
];

audioFiles.forEach(a => {
  const outPath = path.join(audioOutDir, a.name);
  if (!fs.existsSync(outPath) || fs.statSync(outPath).size === 0) {
    console.log(`[Audio] Generating warm ambient melody for ${a.title}...`);
    try {
      // Synthesize a soft 15-second loopable ambient chime chord
      const cmd = `ffmpeg -y -f lavfi -i "sine=frequency=${a.chord}:duration=15,volume=0.08,afade=t=in:ss=0:d=2,afade=t=out:st=13:d=2" -c:a libmp3lame -b:a 128k "${outPath}"`;
      execSync(cmd, { stdio: 'inherit' });
      console.log(`✓ ${a.name} generated`);
    } catch (err) {
      console.warn(`Could not synthesize ${a.name}:`, err.message);
    }
  } else {
    console.log(`✓ ${a.name} already exists.`);
  }
});

console.log('\n🎉 Media optimization pipeline completed!');
console.log(`Files located in: ${outputDir}`);
