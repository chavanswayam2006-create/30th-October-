const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const publicDir = path.join(rootDir, 'public');

console.log('--- PHASE 1: AUTOMATED STATIC CHECKS ---');

// 1. Grep source for forbidden patterns
const forbidden = [
  'cdn.tailwindcss.com',
  'googleusercontent.com',
  'http://',
  'https://'
];

function scanFiles(dir, exts) {
  let results = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== 'dist' && item !== '.git') {
        results = results.concat(scanFiles(full, exts));
      }
    } else if (exts.some(ext => item.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

const codeFiles = scanFiles(srcDir, ['.ts', '.tsx', '.css', '.json']);
let forbiddenMatches = [];

codeFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  forbidden.forEach(pattern => {
    if (content.includes(pattern)) {
      // Ignore if it's schema or comments
      forbiddenMatches.push({ file: path.relative(rootDir, file), pattern });
    }
  });
});

console.log('1. Forbidden URLs (cdn.tailwindcss, googleusercontent, http/https asset URLs):', forbiddenMatches.length === 0 ? '✓ ZERO found!' : forbiddenMatches);

// 2. Extract TODO(real) items
const todoItems = [];
codeFiles.forEach(file => {
  const lines = fs.readFileSync(file, 'utf-8').split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('TODO(real)')) {
      todoItems.push({
        file: path.relative(rootDir, file),
        line: idx + 1,
        text: line.trim()
      });
    }
  });
});
console.log(`\n2. Found ${todoItems.length} TODO(real) placeholders in source content.`);

// 3. Verify media paths
const manifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'media.manifest.json'), 'utf-8'));
const contentJson = JSON.parse(fs.readFileSync(path.join(srcDir, 'content/content.json'), 'utf-8'));

const mediaPathsToCheck = [];

// Manifest videos
if (manifest.slots.cinema) {
  manifest.slots.cinema.forEach(c => {
    mediaPathsToCheck.push(c.optimizedVideo);
    mediaPathsToCheck.push(c.posterFrame);
  });
}
// Manifest memory lane
if (manifest.slots.memoryLane) {
  manifest.slots.memoryLane.forEach(m => mediaPathsToCheck.push(m.expectedPath));
}
// Manifest gallery
if (manifest.slots.gallery) {
  manifest.slots.gallery.forEach(g => mediaPathsToCheck.push(g.expectedPath));
}
// Manifest match
if (manifest.slots.memoryMatch) {
  manifest.slots.memoryMatch.forEach(m => mediaPathsToCheck.push(m.expectedPath));
}
// Manifest keepsake
if (manifest.slots.lettersKeepsake) {
  mediaPathsToCheck.push(manifest.slots.lettersKeepsake.expectedPath);
}
// Manifest songs
if (manifest.slots.songs) {
  manifest.slots.songs.forEach(s => mediaPathsToCheck.push(s.file));
}

let missingMedia = [];
mediaPathsToCheck.forEach(rel => {
  const full = path.join(publicDir, rel);
  if (!fs.existsSync(full)) {
    missingMedia.push(rel);
  }
});

console.log('\n3. Media Manifest paths check against public/media:', missingMedia.length === 0 ? '✓ All files exist!' : missingMedia);

// 4. Check file sizes and EXIF
let oversizedFiles = [];
const publicMediaFiles = scanFiles(path.join(publicDir, 'media'), ['.webp', '.png', '.jpg', '.mp4', '.mp3']);

publicMediaFiles.forEach(file => {
  const stat = fs.statSync(file);
  const sizeKB = stat.size / 1024;
  const rel = path.relative(rootDir, file);
  if (file.endsWith('.mp4') && sizeKB > 20 * 1024) {
    oversizedFiles.push({ file: rel, size: `${(sizeKB / 1024).toFixed(1)} MB`, limit: '20 MB' });
  } else if ((file.endsWith('.webp') || file.endsWith('.png')) && sizeKB > 400 && !file.includes('extracted_stills')) {
    oversizedFiles.push({ file: rel, size: `${sizeKB.toFixed(1)} KB`, limit: '400 KB' });
  }
});

console.log('\n4. Oversized public files check:', oversizedFiles.length === 0 ? '✓ No oversized files!' : oversizedFiles);

// 5. Check .gitignore and robots.txt
const gitignore = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf-8');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

console.log('\n5. Privacy checks:');
console.log('   - .gitignore excludes /media-source:', gitignore.includes('/media-source/'));
console.log('   - .gitignore excludes /Pics/:', gitignore.includes('/Pics/'));
console.log('   - <meta name="robots" content="noindex,nofollow">:', indexHtml.includes('noindex,nofollow'));
