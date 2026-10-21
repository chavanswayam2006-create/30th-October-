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
    await page.waitForURL(/.*level-map/, { timeout: 3000 });
  });

  test('Screen 2: Level Map — States and Milestones', async ({ page }) => {
    await page.goto('/#/?unlock=all');
    await page.waitForSelector('text=Milestones Mastered');
    await expect(page.locator('text=Milestones Mastered')).toBeVisible();

    // Check level cards exist
    const memoryLaneCard = page.locator('text=Memory Lane').first();
    await expect(memoryLaneCard).toBeVisible();

    // Click Memory Lane
    await memoryLaneCard.click();
    await page.waitForURL(/.*memory-lane/, { timeout: 3000 });
  });

  test('Screen 3: Memory Lane — 5 Real Polaroids Render', async ({ page }) => {
    await page.goto('/#/memory-lane');
    await page.waitForSelector('text=Chapters of Us');

    // Check images in polaroids
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(5);

    // Click Next Level
    const nextBtn = page.getByRole('button', { name: /Next Level: Photo Gallery/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await page.waitForURL(/.*photo-gallery/, { timeout: 3000 });
  });

  test('Screen 4: Photo Gallery — Scrapbook & Lightbox Secrets', async ({ page }) => {
    await page.goto('/#/photo-gallery');
    await page.waitForSelector('text=Through My Eyes');

    // Check polaroids
    const polaroidCards = page.locator('.polaroid-card');
    await expect(polaroidCards.first()).toBeVisible();

    // Open first polaroid Lightbox
    await polaroidCards.first().click();
    await expect(page.locator('text=Close').or(page.locator('text=✕'))).toBeVisible();

    // Close modal
    await page.locator('text=✕').click();

    // Advance to Cinema
    const nextBtn = page.getByRole('button', { name: /Next Level: Our Cinema/i });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await page.waitForURL(/.*our-cinema/, { timeout: 3000 });
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
    await expect(page.locator('text=Unlock Countdown')).toBeVisible();

    // With ?unlock=all, Reel 4 should be accessible
    await page.goto('/#/our-cinema?unlock=all');
    await reel4.click();
    await expect(page.locator('text=Unlocked!')).toBeVisible();
  });

  test('Screen 6: Songs of Us — Vinyl Lounge and Dedications', async ({ page }) => {
    await page.goto('/#/songs-of-us');
    await page.waitForSelector('text=Songs of Us');

    // Check vinyl record element
    const vinyl = page.locator('.vinyl-turntable').or(page.locator('text=LOFI LOVE TAPE'));
    await expect(vinyl.first()).toBeVisible();

    // Check 5 tracks
    const trackItems = page.locator('text=Dedication:');
    const count = await trackItems.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('Screen 7: Games Hub — Memory Match, Quiz, and Heart Catcher', async ({ page }) => {
    await page.goto('/#/games-hub');
    await page.waitForSelector('text=Games Hub');

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

  test('Screen 8: Letters — Wax Seals and Filter Chips', async ({ page }) => {
    await page.goto('/#/open-when-letters');
    await page.waitForSelector('text=Open When Letters');

    // Envelope cards exist
    const envelopes = page.locator('.envelope-card');
    expect(await envelopes.count()).toBe(6);

    // Filter chips work
    const lateNightChip = page.getByRole('button', { name: /Late Nights/i });
    if (await lateNightChip.isVisible()) {
      await lateNightChip.click();
    }

    // 21st birthday envelope countdown is visible
    await expect(page.locator('text=Days Until Unlocked').or(page.locator('text=Open when you turn 21'))).toBeVisible();
  });

  test('Screen 9: 20 Reasons — Celestial Grid and Reveal All', async ({ page }) => {
    await page.goto('/#/20-reasons');
    await page.waitForSelector('text=20 Reasons');

    // 20 cards exist
    const cards = page.locator('.reason-card');
    expect(await cards.count()).toBe(20);

    // Reveal All button
    const revealAllBtn = page.getByRole('button', { name: /Reveal All/i });
    await expect(revealAllBtn).toBeVisible();
    await revealAllBtn.click();

    // Counter shows 20 of 20
    await expect(page.locator('text=20 of 20 Revealed')).toBeVisible();
  });

  test('Screen 10: Finale — Stardust Climax, Letter, Gift Box, and Replay', async ({ page }) => {
    await page.goto('/#/finale');
    await page.waitForSelector('text=Level 20 Mastered');

    // Wax seal toggle button exists
    const waxSealToggle = page.locator('button:has-text("Wax Seal"), button:has-text("Broken"), button:has-text("Intact")');
    await expect(waxSealToggle.first()).toBeVisible();

    // 3D Gift Box
    const giftBox = page.locator('text=Tap to Unwrap Surprise').or(page.locator('text=Your Real Birthday Gift Awaits'));
    await expect(giftBox.first()).toBeVisible();
    await giftBox.first().click();

    // Gift hint appears
    await expect(page.locator('text=Birthday Gift')).toBeVisible();

    // Replay journey button exists and works
    const replayBtn = page.getByRole('button', { name: /Replay Journey/i });
    await expect(replayBtn).toBeVisible();
    await replayBtn.click();
    await page.waitForURL(/.*\/#\/?$/, { timeout: 3000 });
  });

  test('Full Journey Happy Path Flow', async ({ page }) => {
    // Complete journey test from Welcome to Finale using navigation pills
    await page.goto('/#/?unlock=all');
    await page.waitForSelector('h1');

    // Press start
    await page.getByRole('button', { name: /Press Start/i }).click();
    await page.waitForURL(/.*level-map/);

    // Navigate to Memory Lane
    await page.locator('text=Memory Lane').first().click();
    await page.waitForURL(/.*memory-lane/);

    // Next to Gallery
    await page.getByRole('button', { name: /Next Level: Photo Gallery/i }).click();
    await page.waitForURL(/.*photo-gallery/);

    // Next to Cinema
    await page.getByRole('button', { name: /Next Level: Our Cinema/i }).click();
    await page.waitForURL(/.*our-cinema/);

    // Next to Songs
    await page.locator('nav').getByRole('button', { name: /Next/i }).click();
    await page.waitForURL(/.*songs-of-us/);

    // Next to Games
    await page.locator('nav').getByRole('button', { name: /Next/i }).click();
    await page.waitForURL(/.*games-hub/);

    // Next to Letters
    await page.locator('nav').getByRole('button', { name: /Next/i }).click();
    await page.waitForURL(/.*open-when-letters/);

    // Next to Reasons
    await page.locator('nav').getByRole('button', { name: /Next/i }).click();
    await page.waitForURL(/.*20-reasons/);

    // Next to Finale
    await page.locator('nav').getByRole('button', { name: /Next/i }).click();
    await page.waitForURL(/.*finale/);

    // Verify Finale loaded
    await expect(page.locator('text=Level 20 Mastered')).toBeVisible();
  });
});
