# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: journey.spec.ts >> Isha · Level 20 — E2E Suite >> Screen 1: Welcome — Press Start, Skip Prologue, and Audio Initialization
- Location: tests\journey.spec.ts:5:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Press Start/i })
    - locator resolved to <button class="w-full relative group overflow-hidden bg-gradient-to-r from-primary-fixed via-primary to-primary-container text-on-primary text-sm font-sans font-bold uppercase tracking-wider py-4 px-8 rounded-full cta-floating flex items-center justify-center gap-2 select-none active:scale-[0.96] transition-transform shadow-[0_10px_24px_-4px_rgba(232,201,135,0.4)] ">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 100ms
    49 × waiting for element to be visible, enabled and stable
       - element is not stable
     - retrying click action
       - waiting 500ms
    - waiting for element to be visible, enabled and stable

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]: QUEST 01 / 20
    - button "Skip Prologue" [ref=e9] [cursor=pointer]
  - main [ref=e13]:
    - generic [ref=e14]:
      - generic [ref=e17]: Level 20 Unlocked · Oct 30, 2026
      - generic [ref=e18]: ★
    - generic [ref=e19]:
      - img [ref=e21]:
        - generic [ref=e30]:
          - generic [ref=e31]: I
          - generic [ref=e32]: ✦
          - generic [ref=e33]: S
        - generic [ref=e34]: LEVEL 20 · ODYSSEY
        - generic [ref=e35]: 30 · 10 · 2026
      - generic [ref=e36]: Monogram
    - generic [ref=e37]:
      - paragraph [ref=e38]: A Dedicated Odyssey
      - heading "Happy 20th, Isha" [level=1] [ref=e39]:
        - generic [ref=e40]: Happy
        - generic [ref=e41]: 20th,
        - generic [ref=e42]: Isha
      - paragraph [ref=e43]: A little enchanted world I built just for you.
    - generic [ref=e49]:
      - paragraph [ref=e50]: “Ready for your adventure, my favorite human?”
      - generic [ref=e51]:
        - generic [ref=e52]: — Swayam
        - generic [ref=e53]: Unlocked
    - generic [ref=e58]:
      - button "Press Start ★" [ref=e59] [cursor=pointer]:
        - generic [ref=e60]:
          - text: Press Start
          - generic [ref=e61]: ★
      - button "Lofi Love Tape (Our Song)" [ref=e62] [cursor=pointer]
      - 'button "Begin Chapter 1: Memory Lane" [ref=e74] [cursor=pointer]'
  - contentinfo [ref=e78]:
    - paragraph [ref=e80]: Made with love by Swayam · 30.10.2026
    - paragraph [ref=e81]: A 20-chapter digital memory chest
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
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
> 16  |     await pressStartBtn.click();
      |                         ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
```