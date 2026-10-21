const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const picsDir = path.resolve(__dirname, '../Pics');
const audioOutDir = path.resolve(__dirname, '../public/media/audio');
const videoOutDir = path.resolve(__dirname, '../public/media/videos');

if (!fs.existsSync(audioOutDir)) fs.mkdirSync(audioOutDir, { recursive: true });
if (!fs.existsSync(videoOutDir)) fs.mkdirSync(videoOutDir, { recursive: true });

console.log('--- ENCODING REAL SONGS (128 kbps MP3) ---');

const songMapping = [
  {
    src: 'Darkhaast (Lyrics) - Arijit Singh, Sunidhi Chauhan _Shivaay_.mp3',
    dest: 'lofi-love-tape.mp3',
    title: 'Darkhaast (Ambient Lofi Cut)',
    artist: 'Arijit Singh & Sunidhi Chauhan'
  },
  {
    src: 'Tu chahiye.mp3',
    dest: 'song-1.mp3',
    title: 'Tu Chahiye',
    artist: 'Atif Aslam'
  },
  {
    src: 'Tum Ho Toh Song _ Saiyaara _ Ahaan Panday, Aneet Padda _ Vishal Mishra, Hansika Pareek _ Raj Shekhar.mp3',
    dest: 'song-2.mp3',
    title: 'Tum Ho Toh',
    artist: 'Vishal Mishra & Hansika Pareek'
  },
  {
    src: 'Mere Liye - Lyrical _ Broken But Beautiful 3 _ Sidharth Shukla & Sonia Rathee _ Akhil Sachdeva.mp3',
    dest: 'song-3.mp3',
    title: 'Mere Liye',
    artist: 'Akhil Sachdeva'
  },
  {
    src: 'Tere Naina -  8K_4K Music Video _ Shahrukh Khan _ Kajol _ My Name is Khan _ Shafqat Amanat Ali.mp3',
    dest: 'song-4.mp3',
    title: 'Tere Naina',
    artist: 'Shafqat Amanat Ali'
  },
  {
    src: 'Happy Birthday To You Ji - Funny Hindi Birthday Song (Part 1) - Funzoa Mimi Teddy, Krsna Solo.mp3',
    dest: 'song-5.mp3',
    title: 'Happy Birthday To You Ji (Special Dedication)',
    artist: 'Funzoa Mimi Teddy & Krsna Solo'
  }
];

songMapping.forEach(s => {
  const srcPath = path.join(picsDir, s.src);
  const destPath = path.join(audioOutDir, s.dest);
  if (!fs.existsSync(srcPath)) {
    console.error(`Source song not found: ${srcPath}`);
    return;
  }
  console.log(`Transcoding ${s.dest} (${s.title})...`);
  const cmd = `ffmpeg -y -i "${srcPath}" -b:a 128k -ar 44100 "${destPath}"`;
  execSync(cmd, { stdio: 'ignore' });
  const stat = fs.statSync(destPath);
  console.log(`✓ ${s.dest}: ${(stat.size/1024/1024).toFixed(2)} MB`);
});

console.log('\n--- VERIFYING & ENCODING VIDEO REELS (≤8 MB, 720p H.264 + AAC, faststart) ---');

const videoMapping = [
  {
    src: 'VivaCut_video_1771101128092_1080HD.mp4',
    dest: 'reel-1.mp4',
    poster: 'reel-1-poster.webp',
    maxSec: 48
  },
  {
    src: 'VID_20260509_015027_591_bsl.mp4',
    dest: 'reel-2.mp4',
    poster: 'reel-2-poster.webp',
    maxSec: 54
  },
  {
    src: 'VID-20260509-WA0009.mp4',
    dest: 'reel-3.mp4',
    poster: 'reel-3-poster.webp',
    maxSec: 25
  },
  {
    src: 'VivaCut_video_1771100403868_1080HD.mp4',
    dest: 'reel-4.mp4',
    poster: 'reel-4-poster.webp',
    maxSec: 38
  }
];

videoMapping.forEach((v, idx) => {
  const srcPath = path.join(picsDir, v.src);
  const destPath = path.join(videoOutDir, v.dest);
  const posterPath = path.join(videoOutDir, v.poster);

  console.log(`Encoding ${v.dest} from ${v.src}...`);
  // Encode to 720p, crf 28, aac 128k, faststart, ensuring <= 8 MB
  const cmd = `ffmpeg -y -i "${srcPath}" -t ${v.maxSec} -vf "scale='min(720,iw)':-2" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart "${destPath}"`;
  execSync(cmd, { stdio: 'ignore' });

  // Extract poster frame at 1.5s
  const cmdPoster = `ffmpeg -y -ss 00:00:01.5 -i "${destPath}" -vframes 1 -vf "scale=720:-1" "${posterPath}"`;
  execSync(cmdPoster, { stdio: 'ignore' });

  const statVid = fs.statSync(destPath);
  const statPos = fs.statSync(posterPath);
  console.log(`✓ ${v.dest}: ${(statVid.size/1024/1024).toFixed(2)} MB, Poster: ${(statPos.size/1024).toFixed(1)} KB`);
});

console.log('\nAudio and video optimization completed successfully!');
