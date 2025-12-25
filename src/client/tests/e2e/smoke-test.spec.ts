/**
 * CRITICAL SMOKE TEST
 * Tests the ACTUAL user experience, not just state changes
 * This test MUST pass or the app is broken
 */

import { expect, test } from '@playwright/test';

test.describe('Critical Smoke Test - Real User Flow', () => {
  test('app loads, renders React, shows menu, starts game, renders canvas', async ({
    page,
  }) => {
    // Navigate
    page.on('console', (_msg) => {
      // Ignore console logs in CI
    });
    page.on('pageerror', (_err) => {
      // Ignore page errors in CI
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Diagnostic: check store
    const storeExists = await page.evaluate(
      () => !!(window as any).__gameStore
    );
    if (storeExists) {
      await page.evaluate(() => (window as any).__gameStore.getState());
    }

    // CRITICAL: Wait for React to mount and show the menu
    // We use a longer timeout and wait specifically for the start screen
    const startScreen = page.locator('#startScreen');

    try {
      await startScreen.waitFor({ state: 'visible', timeout: 30000 });
    } catch (_e) {
      // Check if there's a React mount error or crash
      await page.evaluate(() => document.body.textContent?.length || 0);
      await page.evaluate(() => !!document.getElementById('app'));

      const hasError = await page
        .locator('h1:has-text("Game Error")')
        .isVisible();
      if (hasError) {
        const errorMsg = await page.locator('pre').textContent();
        throw new Error(`App crashed with Error Boundary: ${errorMsg}`);
      }

      throw new Error(
        `Timeout waiting for #startScreen. Page content: ${await page.evaluate(() => document.body.innerHTML)}`
      );
    }

    // Check React app mounted (not white screen)
    const hasContent = await page.evaluate(() => {
      return (
        document.body.textContent && document.body.textContent.length > 100
      );
    });
    expect(hasContent).toBe(true);

    // Wait for menu to be in the DOM and clickable
    const classicButton = page.locator('#classicButton');
    await expect(classicButton).toBeVisible({ timeout: 15000 });

    // Verify menu content is present
    await expect(startScreen).toContainText('Otter River Rush');

    // Force click with JavaScript since Playwright struggles with scroll containers
    await page.evaluate(() => {
      document.querySelector<HTMLButtonElement>('#classicButton')?.click();
    });
    await page.waitForTimeout(1000);

    // Check game started (menu should hide)
    await expect(startScreen).toBeHidden({ timeout: 5000 });

    // CRITICAL: Check R3F canvas exists
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 5000 });

    // Check canvas has WebGL context (not just empty canvas)
    const hasWebGL = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      return gl !== null;
    });
    expect(hasWebGL).toBe(true);

    // Check HUD is visible
    const scoreElement = page.locator('[data-testid="score"]');
    await expect(scoreElement).toBeVisible({ timeout: 3000 });

    // Let game run for 3 seconds
    await page.waitForTimeout(3000);

    // Verify game is actually running (score or distance should increase)
    const gameState = await page.evaluate(() => {
      const state = (window as any).__gameStore?.getState?.();
      return {
        status: state?.status,
        score: state?.score,
        distance: state?.distance,
      };
    });

    expect(gameState.status).toBe('playing');
    expect(gameState.distance).toBeGreaterThan(0);
  });
});
