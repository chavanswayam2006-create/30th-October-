const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const picsDir = path.resolve(__dirname, '../Pics');
const outDir = path.resolve(__dirname, '../public/media/letters');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const letterImages = [
  { id: '1-1', file: 'WhatsApp Image 2026-10-21 at 8.00.57 PM.jpeg' },
  { id: '1-2', file: 'WhatsApp Image 2026-10-21 at 8.00.57 PM (1).jpeg' },
  { id: '2-1', file: 'WhatsApp Image 2026-10-21 at 8.00.56 PM.jpeg' },
  { id: '2-2', file: 'WhatsApp Image 2026-10-21 at 8.00.56 PM (1).jpeg' },
  { id: '2-3', file: 'WhatsApp Image 2026-10-21 at 8.00.56 PM (2).jpeg' },
  { id: '3-1', file: 'WhatsApp Image 2026-10-21 at 8.00.55 PM.jpeg' },
  { id: '4-1', file: 'WhatsApp Image 2026-10-21 at 8.00.57 PM (2).jpeg' },
  { id: '5-1', file: 'WhatsApp Image 2026-10-21 at 8.00.58 PM.jpeg' }
];

console.log('--- PROCESSING LETTER SCREENSHOTS ---');

letterImages.forEach(item => {
  const src = path.join(picsDir, item.file);
  const dest = path.join(outDir, `letter-${item.id}.webp`);
  
  if (!fs.existsSync(src)) {
    console.error(`Missing file: ${src}`);
    return;
  }

  // Get dimensions
  const dims = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${src}"`).toString().trim();
  const [w, h] = dims.split('x').map(Number);
  console.log(`${item.id} (${item.file}): ${w}x${h}`);

  // Crop top 100px (status bar) and bottom 90px (nav buttons) if standard full screenshot,
  // or keep full if already cropped
  // Let's do a safe crop: crop=in_w:in_h-180:0:100 if h > 1000
  let cropFilter = '';
  if (h > 1000) {
    cropFilter = 'crop=in_w:in_h-180:0:90,';
  }

  // Encode to WebP <= 250 KB
  const cmd = `ffmpeg -y -i "${src}" -vf "${cropFilter}scale='min(1080,iw)':-1" -c:v libwebp -quality 85 "${dest}"`;
  execSync(cmd, { stdio: 'ignore' });

  const stat = fs.statSync(dest);
  console.log(`✓ letter-${item.id}.webp: ${(stat.size / 1024).toFixed(1)} KB`);
});

console.log('All letter screenshots processed successfully!');
