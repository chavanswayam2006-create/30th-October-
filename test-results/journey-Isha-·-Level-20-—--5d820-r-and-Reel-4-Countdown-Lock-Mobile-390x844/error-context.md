# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: journey.spec.ts >> Isha · Level 20 — E2E Suite >> Screen 5: Cinema — Video Player and Reel #4 Countdown Lock
- Location: tests\journey.spec.ts:92:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Locked Mystery').or(locator('text=Unlocks in'))
Expected: visible
Error: strict mode violation: locator('text=Locked Mystery').or(locator('text=Unlocks in')) resolved to 2 elements:
    1) <span class="text-[10px] font-sans font-semibold text-primary tracking-wider uppercase">Locked Mystery</span> aka getByText('Locked Mystery')
    2) <p class="text-xs font-sans text-on-surface-variant truncate">Unlocks in 8d 2h 36m 5s 🔒</p> aka getByText('Unlocks in 8d 2h 36m 5s 🔒')

Call log:
  - Expect "toBeVisible" locator('text=Locked Mystery').or(locator('text=Unlocks in')) with timeout 5000ms
  - waiting for locator('text=Locked Mystery').or(locator('text=Unlocks in'))

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - button "Level Map" [ref=e7] [cursor=pointer]:
          - img [ref=e9]:
            - generic [ref=e18]:
              - generic [ref=e19]: I
              - generic [ref=e20]: ✦
              - generic [ref=e21]: S
            - generic [ref=e22]: LEVEL 20 · ODYSSEY
            - generic [ref=e23]: 30 · 10 · 2026
        - button "Our Cinema" [ref=e24] [cursor=pointer]
      - generic [ref=e25]:
        - button "Toggle Lofi Love Soundtrack" [ref=e26] [cursor=pointer]
        - generic "Isha & Swayam" [ref=e36]: I✦S
  - main [ref=e37]:
    - generic [ref=e39]:
      - generic [ref=e40]:
        - generic [ref=e41]: LEVEL 03 · THEATER
        - heading "Our Cinema" [level=1] [ref=e44]
        - paragraph [ref=e45]: Grab your favorite blanket · Private screening of our story.
      - generic [ref=e46]:
        - generic [ref=e47]:
          - generic: Paused
          - generic: SEAT 01 & 02
          - button "Play Reel" [ref=e50] [cursor=pointer]
        - generic [ref=e53]:
          - generic [ref=e54]:
            - generic [ref=e55]: "Reel #01: The Montage of Us"
            - generic [ref=e56]: 00:00 / 00:48
          - generic [ref=e57] [cursor=pointer]
          - generic [ref=e58]:
            - generic [ref=e59]:
              - button [ref=e60] [cursor=pointer]
              - generic [ref=e63]: Cozy Audio
            - generic [ref=e64]:
              - button "1x" [ref=e65] [cursor=pointer]
              - button [ref=e69] [cursor=pointer]
      - generic [ref=e75]:
        - generic [ref=e76]:
          - heading "Film Strip Reels" [level=2] [ref=e80]
          - generic [ref=e81]: 4 Memories Archived
        - generic [ref=e82]:
          - generic [ref=e83] [cursor=pointer]:
            - 'img "Reel #01: The Montage of Us" [ref=e85]'
            - generic [ref=e89]:
              - generic [ref=e90]: Currently Screening
              - 'heading "Reel #01: The Montage of Us" [level=3] [ref=e93]'
              - paragraph [ref=e94]: 00:48 · 18 months of everyday giggles
          - generic [ref=e97] [cursor=pointer]:
            - 'img "Reel #02: That Day With You" [ref=e99]'
            - generic [ref=e100]:
              - generic [ref=e101]: 00:54
              - 'heading "Reel #02: That Day With You" [level=3] [ref=e103]'
              - paragraph [ref=e104]: 00:54 · Raw cuts & stolen glances
          - generic [ref=e107] [cursor=pointer]:
            - 'img "Reel #03: Your Laugh, 3 AM" [ref=e109]'
            - generic [ref=e110]:
              - generic [ref=e111]: 00:24
              - 'heading "Reel #03: Your Laugh, 3 AM" [level=3] [ref=e113]'
              - paragraph [ref=e114]: 00:24 · Pure unrestrained happiness
          - generic [ref=e123] [cursor=pointer]:
            - generic [ref=e124]: Locked Mystery
            - 'heading "Reel #04: The Secret Birthday Message" [level=3] [ref=e126]'
            - paragraph [ref=e127]: Unlocks in 8d 2h 36m 5s 🔒
      - generic [ref=e136]:
        - generic [ref=e137]:
          - generic [ref=e138]: Concession Stand Note
          - generic [ref=e139]:
            - generic [ref=e140]: ♥
            - text: Swayam
        - paragraph [ref=e141]: “I brought the sweet & salty mix popcorn you like. No talking during our favorite part! ✨”
      - generic [ref=e142]:
        - generic [ref=e143]: Cinema Stamp Ready
        - paragraph [ref=e148]: Finished the reel? The orchestra is ready for you in the music lounge.
        - 'button "Next Level: Songs of Us" [ref=e149] [cursor=pointer]'
  - navigation "Level navigation" [ref=e153]:
    - generic [ref=e154]:
      - button "Skip" [ref=e155] [cursor=pointer]
      - generic [ref=e156]:
        - button "Journey Map" [ref=e157] [cursor=pointer]
        - button "Songs of Us" [ref=e161] [cursor=pointer]
      - button "Next" [ref=e165] [cursor=pointer]
```

# Test source

```ts
  3   | test.describe('Isha · Level 20 — E2E Suite', () => {
  4   | 
  5   |   test('Screen 1: Welcome — Press Start, Skip Prologue, and Audio Initialization', async ({ page }) => {
  6   |     await page.goto('/#/');
  7   |     await expect(page.locator('h1')).toContainText('Isha');
  8   | 
  9   |     // Skip Prologue button navigates to level map
  10  |     const skipBtn = page.getByRole('button', { name: /Skip/i }).first();
  11  |     await expect(skipBtn).toBeVisible();
  12  | 
  13  |     // Verify Press Start CTA
  14  |     const pressStartBtn = page.getByRole('button', { name: /Press Start/i });
  15  |     await expect(pressStartBtn).toBeVisible();
  16  |     await pressStartBtn.click();
  17  | 
  18  |     // Should navigate to level map after start
  19  |     await page.waitForURL(/.*level-map/, { timeout: 5000 });
  20  |   });
  21  | 
  22  |   test('Zero State vs Demo Mode Verification', async ({ page }) => {
  23  |     // Pure zero state
  24  |     await page.goto('/#/level-map');
  25  |     await page.evaluate(() => localStorage.clear());
  26  |     await page.reload();
  27  |     await page.waitForSelector('text=Memory Lane');
  28  | 
  29  |     // Check with ?demo=1
  30  |     await page.goto('/#/level-map?demo=1');
  31  |     await page.waitForSelector('text=Milestones Mastered');
  32  |     await expect(page.locator('text=Milestones Mastered')).toBeVisible();
  33  |   });
  34  | 
  35  |   test('Screen 2: Level Map — States and Milestones', async ({ page }) => {
  36  |     await page.goto('/#/level-map?unlock=all');
  37  |     await page.waitForSelector('text=Milestones Mastered');
  38  |     await expect(page.locator('text=Milestones Mastered')).toBeVisible();
  39  | 
  40  |     // Check level cards exist
  41  |     const memoryLaneCard = page.locator('text=Memory Lane').first();
  42  |     await expect(memoryLaneCard).toBeVisible();
  43  | 
  44  |     // Click Memory Lane
  45  |     await memoryLaneCard.click();
  46  |     await page.waitForURL(/.*memory-lane/, { timeout: 5000 });
  47  |   });
  48  | 
  49  |   test('Screen 3: Memory Lane — 5 Real Polaroids Render', async ({ page }) => {
  50  |     await page.goto('/#/memory-lane');
  51  |     await page.waitForSelector('text=Chapters of Us');
  52  | 
  53  |     // Check images in polaroids
  54  |     const images = page.locator('img');
  55  |     const count = await images.count();
  56  |     expect(count).toBeGreaterThanOrEqual(5);
  57  | 
  58  |     // Verify polaroid images load
  59  |     const firstImg = images.first();
  60  |     await expect(firstImg).toBeVisible();
  61  | 
  62  |     // Click Next Level
  63  |     const nextBtn = page.getByRole('button', { name: /Next Level: Photo Gallery/i });
  64  |     await expect(nextBtn).toBeVisible();
  65  |     await nextBtn.click();
  66  |     await page.waitForURL(/.*photo-gallery/, { timeout: 5000 });
  67  |   });
  68  | 
  69  |   test('Screen 4: Photo Gallery — Scrapbook & Lightbox Secrets', async ({ page }) => {
  70  |     await page.goto('/#/photo-gallery');
  71  |     await page.waitForSelector('text=Through My Eyes');
  72  | 
  73  |     // Check polaroids
  74  |     const polaroidCards = page.locator('.polaroid-card');
  75  |     await expect(polaroidCards.first()).toBeVisible();
  76  | 
  77  |     // Open first polaroid Lightbox
  78  |     await polaroidCards.first().click();
  79  |     const closeBtn = page.getByRole('button', { name: 'Close' });
  80  |     await expect(closeBtn).toBeVisible();
  81  | 
  82  |     // Close modal
  83  |     await closeBtn.click();
  84  | 
  85  |     // Advance to Cinema via Shell next button
  86  |     const nextBtn = page.locator('nav').getByRole('button', { name: /Next/i });
  87  |     await expect(nextBtn).toBeVisible();
  88  |     await nextBtn.click();
  89  |     await page.waitForURL(/.*our-cinema/, { timeout: 5000 });
  90  |   });
  91  | 
  92  |   test('Screen 5: Cinema — Video Player and Reel #4 Countdown Lock', async ({ page }) => {
  93  |     // Before unlock time without unlock flag: Reel 4 should show countdown lock
  94  |     await page.goto('/#/our-cinema?now=2026-10-25T12:00:00+05:30');
  95  |     await page.waitForSelector('text=Our Cinema');
  96  | 
  97  |     const video = page.locator('video');
  98  |     await expect(video).toBeVisible();
  99  | 
  100 |     // Click Reel 4 (locked)
  101 |     const reel4 = page.locator('text=Reel #04');
  102 |     await reel4.click();
> 103 |     await expect(page.locator('text=Locked Mystery').or(page.locator('text=Unlocks in'))).toBeVisible();
      |                                                                                           ^ Error: expect(locator).toBeVisible() failed
  104 | 
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
```