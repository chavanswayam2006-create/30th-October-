# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: journey.spec.ts >> Isha · Level 20 — E2E Suite >> Screen 6: Songs of Us — Vinyl Lounge and Real Dedications
- Location: tests\journey.spec.ts:111:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Tu Chahiye')
Expected: visible
Error: strict mode violation: locator('text=Tu Chahiye') resolved to 2 elements:
    1) <p class="font-serif text-base text-primary font-medium truncate">Tu Chahiye</p> aka getByText('Tu Chahiye').first()
    2) <p class="text-sm font-sans font-semibold truncate text-primary">Tu Chahiye</p> aka getByText('Tu Chahiye').nth(1)

Call log:
  - Expect "toBeVisible" locator('text=Tu Chahiye') with timeout 5000ms
  - waiting for locator('text=Tu Chahiye')

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
        - button "Songs of Us" [ref=e24] [cursor=pointer]
      - generic [ref=e25]:
        - button "Toggle Lofi Love Soundtrack" [ref=e26] [cursor=pointer]
        - generic "Isha & Swayam" [ref=e36]: I✦S
  - main [ref=e37]:
    - generic [ref=e39]:
      - generic [ref=e40]:
        - generic [ref=e41]:
          - generic [ref=e43]: LEVEL 04 · SOUNDTRACK
          - generic [ref=e44]: ✦
          - generic [ref=e45]: SIDE A
        - heading "Songs of Us" [level=1] [ref=e46]
        - paragraph [ref=e47]: The soundtrack that scored our late-night drives, midnight confessions, and quiet kitchen waltzes.
      - generic [ref=e48]:
        - generic [ref=e54]:
          - generic [ref=e55]: ISHA · SIDE A
          - generic [ref=e58]: LEVEL 20
        - generic [ref=e73]:
          - generic [ref=e74]:
            - generic [ref=e75]:
              - paragraph [ref=e78]: Tu Chahiye
              - paragraph [ref=e79]: Atif Aslam · Chapter 01
            - button "Favorite track" [ref=e80] [cursor=pointer]
          - generic [ref=e83]:
            - generic [ref=e84] [cursor=pointer]
            - generic [ref=e85]:
              - generic [ref=e86]: 00:00
              - generic [ref=e87]: 04:33
          - generic [ref=e88]:
            - button "Previous Track" [ref=e89] [cursor=pointer]
            - button "Play" [ref=e92] [cursor=pointer]
            - button "Next Track" [ref=e95] [cursor=pointer]
      - generic [ref=e98]:
        - generic [ref=e99]:
          - heading "The 5 Chapters" [level=2] [ref=e103]
          - generic [ref=e104]: 5 MEMORIES UNLOCKED
        - generic [ref=e105]:
          - generic [ref=e106] [cursor=pointer]:
            - generic [ref=e107]:
              - generic [ref=e108]:
                - generic [ref=e109]:
                  - img "Tu Chahiye" [ref=e110]
                  - generic [ref=e116]: "01"
                - generic [ref=e117]:
                  - paragraph [ref=e118]: Tu Chahiye
                  - paragraph [ref=e119]: Atif Aslam · 04:33
              - button "Like track" [ref=e120]
            - paragraph [ref=e126]: “One of our special songs that always reminds me of you.”
          - generic [ref=e127] [cursor=pointer]:
            - generic [ref=e128]:
              - generic [ref=e129]:
                - generic [ref=e130]:
                  - img "Tum Ho Toh" [ref=e131]
                  - generic [ref=e137]: "02"
                - generic [ref=e138]:
                  - paragraph [ref=e139]: Tum Ho Toh
                  - paragraph [ref=e140]: Vishal Mishra & Hansika Pareek · 03:17
              - button "Like track" [ref=e141]
            - paragraph [ref=e147]: “Because with you, everything in life feels complete.”
          - generic [ref=e148] [cursor=pointer]:
            - generic [ref=e149]:
              - generic [ref=e150]:
                - generic [ref=e151]:
                  - img "Mere Liye" [ref=e152]
                  - generic [ref=e158]: "03"
                - generic [ref=e159]:
                  - paragraph [ref=e160]: Mere Liye
                  - paragraph [ref=e161]: Akhil Sachdeva · 04:59
              - button "Like track" [ref=e162]
            - paragraph [ref=e168]: “Every lyric hits straight in the heart.”
          - generic [ref=e169] [cursor=pointer]:
            - generic [ref=e170]:
              - generic [ref=e171]:
                - generic [ref=e172]:
                  - img "Tere Naina" [ref=e173]
                  - generic [ref=e179]: "04"
                - generic [ref=e180]:
                  - paragraph [ref=e181]: Tere Naina
                  - paragraph [ref=e182]: Shafqat Amanat Ali · 04:44
              - button "Like track" [ref=e183]
            - paragraph [ref=e189]: “Those eyes of yours... MASHALLAH, I could get lost in them forever.”
          - generic [ref=e190] [cursor=pointer]:
            - generic [ref=e191]: SPECIAL DEDICATION
            - generic [ref=e195]:
              - generic [ref=e196]:
                - generic [ref=e197]:
                  - img "Happy Birthday To You Ji" [ref=e198]
                  - generic [ref=e204]: "05"
                - generic [ref=e205]:
                  - paragraph [ref=e206]: Happy Birthday To You Ji
                  - paragraph [ref=e207]: Funzoa Mimi Teddy & Krsna Solo · 03:03
              - button "Like track" [ref=e208]
            - paragraph [ref=e214]: “Dedicated to the cutest birthday girl in the world! Happy Level 20, Ishuuuu!”
      - 'button "Next Level: The Games Hub" [ref=e216] [cursor=pointer]'
  - navigation "Level navigation" [ref=e220]:
    - generic [ref=e221]:
      - button "Skip" [ref=e222] [cursor=pointer]
      - generic [ref=e223]:
        - button "Journey Map" [ref=e224] [cursor=pointer]
        - button "Songs of Us" [ref=e228] [cursor=pointer]
      - button "Next" [ref=e232] [cursor=pointer]
```

# Test source

```ts
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
  103 |     await expect(page.locator('text=Locked Mystery').or(page.locator('text=Unlocks in'))).toBeVisible();
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
> 119 |     await expect(page.locator('text=Tu Chahiye')).toBeVisible();
      |                                                   ^ Error: expect(locator).toBeVisible() failed
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
  205 |     await expect(waxSealToggle.first()).toBeVisible();
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
```