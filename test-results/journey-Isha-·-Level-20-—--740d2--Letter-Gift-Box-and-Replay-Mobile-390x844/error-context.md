# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: journey.spec.ts >> Isha · Level 20 — E2E Suite >> Screen 10: Finale — Stardust Climax, Letter, Gift Box, and Replay
- Location: tests\journey.spec.ts:199:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button:has-text("Wax Seal"), button:has-text("Broken"), button:has-text("Intact")').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('button:has-text("Wax Seal"), button:has-text("Broken"), button:has-text("Intact")').first() with timeout 5000ms
  - waiting for locator('button:has-text("Wax Seal"), button:has-text("Broken"), button:has-text("Intact")').first()

```

```yaml
- banner:
  - button "Level Map":
    - img: I ✦ S LEVEL 20 · ODYSSEY 30 · 10 · 2026
  - button "The Finale"
  - button "Toggle Lofi Love Soundtrack":
    - img
  - text: I✦S
- main:
  - text: ✦ ✦ 💫 ✦ ✨ 💫 💖 ♥ ✦ Level 20 Complete · Quest Mastered ✦
  - heading "Happy 20th Birthday, My Love" [level=1]
  - paragraph: The grand finale of your sacred quest ♥
  - img
  - img: I ✦ S LEVEL 20 · ODYSSEY 30 · 10 · 2026
  - text: ❧ Midnight Dispatch · Swayam 30.10.2026
  - heading "Dear Isha," [level=2]
  - paragraph: Watching you step into your twenties is the greatest privilege of my life. You bring so much light, grace, and wild laughter into every single day we share.
  - paragraph: Thank you for being my anchor, my favorite chaos, and my dream come true. Level 20 is just the beginning of your greatest adventure yet.
  - paragraph: Every moment with you feels like discovering a secret constellation meant only for us. Here is to all our chapters ahead.
  - paragraph: Forever yours,
  - text: Swayam ♥ I✦S
  - button "Closed"
  - button "Opened ✦"
  - 'button "SFX: Chime On"':
    - img
    - text: "SFX: Chime On"
  - img
  - text: Final Quest Unlock
  - heading "Your Real Birthday Gift Awaits..." [level=3]
  - paragraph: This digital universe is just the prologue. Look under your desk / behind the door right now!
  - button "Gift Unlocked! 💖 Under Your Desk ✨"
  - paragraph: Secret Keepsake Coordinates ✦
  - paragraph: “Look under your desk / behind the door right now! Swayam hid your physical 20th birthday keepsake! ♥”
  - img
  - text: Real World Quest Hugs guaranteed upon arrival 🧸✨ ✦
  - paragraph: Isha · 30 October 2026 · Level 20 Edition
  - button "Replay Journey":
    - img
    - text: Replay Journey
  - button "Back to Level Map":
    - img
    - text: Back to Level Map
- navigation "Level navigation":
  - button "Skip"
  - button "Journey Map":
    - img
  - button "Songs of Us":
    - img
  - button "Next":
    - text: Next
    - img
```

# Test source

```ts
  105 |     // With ?unlock=all, Reel 4 should be accessible
  106 |     await page.goto('/#/our-cinema?unlock=all');
  107 |     await reel4.click();
  108 |     await expect(page.locator('text=Currently Screening')).toBeVisible();
  109 |   });
  110 | 
  111 |   test('Screen 6: Songs of Us — Vinyl Lounge and Real Dedications', async ({ page }) => {
  112 |     await page.goto('/#/songs-of-us');
  113 |     await page.waitForSelector('text=Songs of Us');
  114 | 
  115 |     // Check vinyl record element
  116 |     await expect(page.locator('text=ISHA · SIDE A')).toBeVisible();
  117 | 
  118 |     // Check real song title "Tu Chahiye" exists
  119 |     await expect(page.locator('text=Tu Chahiye')).toBeVisible();
  120 | 
  121 |     // Check 5 tracks with dedications
  122 |     const trackItems = page.locator('text=Dedication:');
  123 |     const count = await trackItems.count();
  124 |     expect(count).toBeGreaterThanOrEqual(5);
  125 |   });
  126 | 
  127 |   test('Screen 7: Games Hub — Memory Match, Quiz, and Heart Catcher', async ({ page }) => {
  128 |     await page.goto('/#/games-hub');
  129 |     await page.waitForSelector('text=The Love Arcade');
  130 | 
  131 |     // Memory Match card grid exists
  132 |     const matchCards = page.locator('.card-inner');
  133 |     expect(await matchCards.count()).toBe(12);
  134 | 
  135 |     // Quiz questions exist
  136 |     const quizOptions = page.locator('button:has-text("A)"), button:has-text("B)")');
  137 |     expect(await quizOptions.count()).toBeGreaterThanOrEqual(2);
  138 | 
  139 |     // Heart Catcher canvas exists
  140 |     const canvas = page.locator('canvas.touch-none');
  141 |     await expect(canvas).toBeVisible();
  142 | 
  143 |     // Skip to letters is always visible
  144 |     const skipToLetters = page.locator('text=Skip to Level 06').or(page.getByRole('button', { name: /Letters/i }));
  145 |     await expect(skipToLetters.first()).toBeVisible();
  146 |   });
  147 | 
  148 |   test('Screen 8: Letters — Real Handwritten Note Lightbox & Countdown', async ({ page }) => {
  149 |     await page.goto('/#/open-when-letters');
  150 |     await page.waitForSelector('text=Open When');
  151 | 
  152 |     // Envelope cards exist
  153 |     const envelopes = page.locator('.envelope-card');
  154 |     expect(await envelopes.count()).toBe(6);
  155 | 
  156 |     // First envelope is unsealed or can be unsealed
  157 |     const firstEnvelope = envelopes.first();
  158 |     const isOpen = await firstEnvelope.locator('text=CURRENTLY UNSEALED').isVisible();
  159 |     if (!isOpen) {
  160 |       await firstEnvelope.click();
  161 |     }
  162 | 
  163 |     // Check "See original note" button
  164 |     const seeNoteBtn = page.getByRole('button', { name: /See original note/i }).first();
  165 |     await expect(seeNoteBtn).toBeVisible();
  166 |     await seeNoteBtn.click();
  167 | 
  168 |     // Lightbox modal with original WhatsApp note screenshot should appear
  169 |     const lightboxModal = page.locator('.fixed.inset-0.z-50');
  170 |     await expect(lightboxModal).toBeVisible();
  171 |     const noteImg = lightboxModal.locator('img');
  172 |     await expect(noteImg.first()).toBeVisible();
  173 | 
  174 |     // Close lightbox
  175 |     await page.getByRole('button', { name: /Close/i }).click();
  176 |     await expect(lightboxModal).toBeHidden();
  177 | 
  178 |     // 21st birthday envelope countdown is visible
  179 |     await expect(page.locator('text=GRAND ARCHIVE VAULT · LOCKED').first()).toBeVisible();
  180 |   });
  181 | 
  182 |   test('Screen 9: 20 Reasons — Celestial Grid and Reveal All', async ({ page }) => {
  183 |     await page.goto('/#/20-reasons');
  184 |     await page.waitForSelector('text=20 Reasons Why');
  185 | 
  186 |     // 20 cards exist
  187 |     const cards = page.locator('.card-perspective');
  188 |     expect(await cards.count()).toBe(20);
  189 | 
  190 |     // Reveal All button
  191 |     const revealAllBtn = page.getByRole('button', { name: /Reveal All/i });
  192 |     await expect(revealAllBtn).toBeVisible();
  193 |     await revealAllBtn.click();
  194 | 
  195 |     // Counter shows 20 of 20
  196 |     await expect(page.locator('text=20 of 20 Reasons Revealed')).toBeVisible();
  197 |   });
  198 | 
  199 |   test('Screen 10: Finale — Stardust Climax, Letter, Gift Box, and Replay', async ({ page }) => {
  200 |     await page.goto('/#/finale');
  201 |     await page.waitForSelector('text=Happy 20th Birthday, My Love');
  202 | 
  203 |     // Wax seal toggle button exists
  204 |     const waxSealToggle = page.locator('button:has-text("Wax Seal"), button:has-text("Broken"), button:has-text("Intact")');
> 205 |     await expect(waxSealToggle.first()).toBeVisible();
      |                                         ^ Error: expect(locator).toBeVisible() failed
  206 | 
  207 |     // 3D Gift Box
  208 |     const giftBox = page.locator('text=Tap to Unwrap Surprise').or(page.locator('text=Your Real Birthday Gift Awaits'));
  209 |     await expect(giftBox.first()).toBeVisible();
  210 |     await giftBox.first().click();
  211 | 
  212 |     // Replay journey button exists and works
  213 |     const replayBtn = page.getByRole('button', { name: /Replay Journey/i });
  214 |     await expect(replayBtn).toBeVisible();
  215 |     await replayBtn.click();
  216 |     await page.waitForURL(/.*\/#\/?$/, { timeout: 5000 });
  217 |   });
  218 | 
  219 |   test('Media Assets Integrity Check — Real Media Loads with 0 HTTP 404s', async ({ page }) => {
  220 |     const failed404s: string[] = [];
  221 |     page.on('response', res => {
  222 |       if (res.status() === 404) failed404s.push(res.url());
  223 |     });
  224 | 
  225 |     await page.goto('/#/memory-lane');
  226 |     await page.waitForSelector('text=Chapters of Us');
  227 |     await page.waitForTimeout(500);
  228 | 
  229 |     await page.goto('/#/photo-gallery');
  230 |     await page.waitForSelector('text=Through My Eyes');
  231 |     await page.waitForTimeout(500);
  232 | 
  233 |     await page.goto('/#/songs-of-us');
  234 |     await page.waitForSelector('text=Songs of Us');
  235 |     await page.waitForTimeout(500);
  236 | 
  237 |     expect(failed404s).toHaveLength(0);
  238 |   });
  239 | });
  240 | 
```