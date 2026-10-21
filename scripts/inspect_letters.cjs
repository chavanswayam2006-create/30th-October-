const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

const picsDir = path.resolve(__dirname, '../Pics');
const files = fs.readdirSync(picsDir).filter(f => f.startsWith('WhatsApp Image') && f.endsWith('.jpeg'));

console.log(`Found ${files.length} WhatsApp letter screenshots in Pics:`, files);

async function runOCR() {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fullPath = path.join(picsDir, file);
    const stat = fs.statSync(fullPath);
    console.log(`[${i+1}/${files.length}] Processing ${file} (${(stat.size/1024).toFixed(1)} KB)...`);
    
    try {
      const res = await Tesseract.recognize(fullPath, 'eng');
      const text = res.data.text.trim();
      results.push({
        file,
        sizeBytes: stat.size,
        text,
        confidence: res.data.confidence
      });
      console.log(`--- TEXT FOR ${file} (Confidence: ${res.data.confidence}%) ---`);
      console.log(text);
      console.log('--------------------------------------------------\n');
    } catch (err) {
      console.error(`OCR failed for ${file}:`, err.message);
    }
  }

  fs.writeFileSync(path.resolve(__dirname, '../scratch_ocr_results.json'), JSON.stringify(results, null, 2));
  console.log('Saved OCR results to scratch_ocr_results.json');
}

runOCR();
