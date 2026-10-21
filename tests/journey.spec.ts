import { test, expect } from '@playwright/test';

test.describe('Isha · Level 20 — E2E Suite', () => {

  test('Screen 1: Welcome — Press Start, Skip Prologue, and Audio Initialization', async ({ page }) => {
    await page.goto('/#/');
    await expect(page.locator('h1')).toContainText('Isha');

    // Skip Prologue button navigates to level map
    const skipBtn = page.getByRole('button', { name: /Skip/i }).first();
    await expect(skipBtn).toBeVisible();

    // Verify Press Start CTA
    const pressStartBtn = page.getByRole('button', { name: /Press Start/i });
    await expect(pressStartBtn).toBeVisible();
    await pressStartBtn.click();

    // Should navigate to level map after start
    await page.waitForURL(/.*level-map/, { timeout: 5000 });
  });

  test('Zero State vs Demo Mode Verification', async ({ page }) => {
    // Pure zero state
    await page.goto('/#/level-map');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('text=Memory Lane');

    // Check with ?demo=1
    await page.goto('/#/level-map?demo=1');
    await page.waitForSelector('text=Milestones Mastered');
    await expect(page.locator('text=Milestones Mastered')).toBeVisible();
  });

  test('Screen 2: Level Map — States and Milestones', async ({ page }) => {
    await page.goto('/#/level-map?unlock=all');
    await page.waitForSelector('text=Milestones Mastered');
    await expect(page.locator('text=Milestones Mastered')).toBeVisible();

    // Check level cards exist
    const memoryLaneCard = page.locator('text=Memory Lane').first();
    await expect(memoryLaneCard).toBeVisible();

    // Click Memory Lane
    await memoryLaneCard.click();
    await page.waitForURL(/.*memory-lane/, { timeout: 5000 });
  });

  test('Screen 3: Memory Lane — 5 Real Polaroids Render', async ({ page }) => {
    await page.goto('/#/memory-lane');
    await page.waitForSelector('text=Chapters of Us');

    // Check images in polaroids
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(5);

    // Verify polaroid images load
    const firstImg = images.first();
    await expect(firstImg).toBeVisible();

    // Click Next Level
    const nextBtn = page.getByRole('button', { name: /Next Level: Photo Gallery/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await page.waitForURL(/.*photo-gallery/, { timeout: 5000 });
  });

  test('Screen 4: Photo Gallery — Scrapbook & Lightbox Secrets', async ({ page }) => {
    await page.goto('/#/photo-gallery');
    await page.waitForSelector('text=Through My Eyes');

    // Check polaroids
    const polaroidCards = page.locator('.polaroid-card');
    await expect(polaroidCards.first()).toBeVisible();

    // Open first polaroid Lightbox
    await polaroidCards.first().click();
    const closeBtn = page.getByRole('button', { name: 'Close' });
    await expect(closeBtn).toBeVisible();

    // Close modal
    await closeBtn.click();

    // Advance to Cinema via Shell next button
    const nextBtn = page.locator('nav').getByRole('button', { name: /Next/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await page.waitForURL(/.*our-cinema/, { timeout: 5000 });
  });

  test('Screen 5: Cinema — Video Player and Reel #4 Countdown Lock', async ({ page }) => {
    // Before unlock time without unlock flag: Reel 4 should show countdown lock
    await page.goto('/#/our-cinema?now=2026-10-25T12:00:00+05:30');
    await page.waitForSelector('text=Our Cinema');

    const video = page.locator('video');
    await expect(video).toBeVisible();

    // Click Reel 4 (locked)
    const reel4 = page.locator('text=Reel #04');
    await reel4.click();
    await expect(page.locator('text=Locked Mystery').or(page.locator('text=Unlocks in'))).toBeVisible();

    // With ?unlock=all, Reel 4 should be accessible
    await page.goto('/#/our-cinema?unlock=all');
    await reel4.click();
    await expect(page.locator('text=Currently Screening')).toBeVisible();
  });

  test('Screen 6: Songs of Us — Vinyl Lounge and Real Dedications', async ({ page }) => {
    await page.goto('/#/songs-of-us');
    await page.waitForSelector('text=Songs of Us');

    // Check vinyl record element
    await expect(page.locator('text=ISHA · SIDE A')).toBeVisible();

    // Check real song title "Tu Chahiye" exists
    await expect(page.locator('text=Tu Chahiye')).toBeVisible();

    // Check 5 tracks with dedications
    const trackItems = page.locator('text=Dedication:');
    const count = await trackItems.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('Screen 7: Games Hub — Memory Match, Quiz, and Heart Catcher', async ({ page }) => {
    await page.goto('/#/games-hub');
    await page.waitForSelector('text=The Love Arcade');

    // Memory Match card grid exists
    const matchCards = page.locator('.card-inner');
    expect(await matchCards.count()).toBe(12);

    // Quiz questions exist
    const quizOptions = page.locator('button:has-text("A)"), button:has-text("B)")');
    expect(await quizOptions.count()).toBeGreaterThanOrEqual(2);

    // Heart Catcher canvas exists
    const canvas = page.locator('canvas.touch-none');
    await expect(canvas).toBeVisible();

    // Skip to letters is always visible
    const skipToLetters = page.locator('text=Skip to Level 06').or(page.getByRole('button', { name: /Letters/i }));
    await expect(skipToLetters.first()).toBeVisible();
  });

  test('Screen 8: Letters — Real Handwritten Note Lightbox & Countdown', async ({ page }) => {
    await page.goto('/#/open-when-letters');
    await page.waitForSelector('text=Open When');

    // Envelope cards exist
    const envelopes = page.locator('.envelope-card');
    expect(await envelopes.count()).toBe(6);

    // First envelope is unsealed or can be unsealed
    const firstEnvelope = envelopes.first();
    const isOpen = await firstEnvelope.locator('text=CURRENTLY UNSEALED').isVisible();
    if (!isOpen) {
      await firstEnvelope.click();
    }

    // Check "See original note" button
    const seeNoteBtn = page.getByRole('button', { name: /See original note/i }).first();
    await expect(seeNoteBtn).toBeVisible();
    await seeNoteBtn.click();

    // Lightbox modal with original WhatsApp note screenshot should appear
    const lightboxModal = page.locator('.fixed.inset-0.z-50');
    await expect(lightboxModal).toBeVisible();
    const noteImg = lightboxModal.locator('img');
    await expect(noteImg.first()).toBeVisible();

    // Close lightbox
    await page.getByRole('button', { name: /Close/i }).click();
    await expect(lightboxModal).toBeHidden();

    // 21st birthday envelope countdown is visible
    await expect(page.locator('text=GRAND ARCHIVE VAULT · LOCKED').first()).toBeVisible();
  });

  test('Screen 9: 20 Reasons — Celestial Grid and Reveal All', async ({ page }) => {
    await page.goto('/#/20-reasons');
    await page.waitForSelector('text=20 Reasons Why');

    // 20 cards exist
    const cards = page.locator('.card-perspective');
    expect(await cards.count()).toBe(20);

    // Reveal All button
    const revealAllBtn = page.getByRole('button', { name: /Reveal All/i });
    await expect(revealAllBtn).toBeVisible();
    await revealAllBtn.click();

    // Counter shows 20 of 20
    await expect(page.locator('text=20 of 20 Reasons Revealed')).toBeVisible();
  });

  test('Screen 10: Finale — Stardust Climax, Letter, Gift Box, and Replay', async ({ page }) => {
    await page.goto('/#/finale');
    await page.waitForSelector('text=Happy 20th Birthday, My Love');

    // Wax seal toggle button exists
    const waxSealToggle = page.locator('button:has-text("Wax Seal"), button:has-text("Broken"), button:has-text("Intact")');
    await expect(waxSealToggle.first()).toBeVisible();

    // 3D Gift Box
    const giftBox = page.locator('text=Tap to Unwrap Surprise').or(page.locator('text=Your Real Birthday Gift Awaits'));
    await expect(giftBox.first()).toBeVisible();
    await giftBox.first().click();

    // Replay journey button exists and works
    const replayBtn = page.getByRole('button', { name: /Replay Journey/i });
    await expect(replayBtn).toBeVisible();
    await replayBtn.click();
    await page.waitForURL(/.*\/#\/?$/, { timeout: 5000 });
  });

  test('Media Assets Integrity Check — Real Media Loads with 0 HTTP 404s', async ({ page }) => {
    const failed404s: string[] = [];
    page.on('response', res => {
      if (res.status() === 404) failed404s.push(res.url());
    });

    await page.goto('/#/memory-lane');
    await page.waitForSelector('text=Chapters of Us');
    await page.waitForTimeout(500);

    await page.goto('/#/photo-gallery');
    await page.waitForSelector('text=Through My Eyes');
    await page.waitForTimeout(500);

    await page.goto('/#/songs-of-us');
    await page.waitForSelector('text=Songs of Us');
    await page.waitForTimeout(500);

    expect(failed404s).toHaveLength(0);
  });
});
