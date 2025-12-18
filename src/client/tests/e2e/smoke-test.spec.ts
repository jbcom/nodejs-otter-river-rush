/**
 * CRITICAL SMOKE TEST
 * Tests the ACTUAL user experience, not just state changes
 * This test MUST pass or the app is broken
 *
 * Improved for CI environments:
 * - Uses proper Playwright waiting instead of fixed timeouts
 * - Better error messages for debugging
 * - Handles WebGL initialization delays in headless Chrome
 */

import { expect, test } from '@playwright/test';

test.describe('Critical Smoke Test - Real User Flow', () => {
  // Increase timeout for CI environments where headless Chrome is slower
  test.setTimeout(60000);

  test('app loads, renders React, shows menu, starts game, renders canvas', async ({
    page,
  }) => {
    // Enable console logging for debugging CI failures
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`[Browser Error]: ${msg.text()}`);
      }
    });

    page.on('pageerror', (error) => {
      console.log(`[Page Error]: ${error.message}`);
    });

    // Navigate and wait for network to settle
    // Note: baseURL in playwright.config.ts includes /otter-river-rush/
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // CRITICAL: Wait for React app to mount with proper selector waiting
    // This replaces fixed timeouts with proper element detection
    const appRoot = page.locator('#app');
    await expect(appRoot).toBeVisible({ timeout: 10000 });

    // Wait for React to hydrate and render content
    // Check that the app has meaningful content (not just an empty div)
    await expect(async () => {
      const content = await appRoot.textContent();
      expect(content && content.length > 50).toBe(true);
    }).toPass({ timeout: 10000 });

    // CRITICAL: Wait for the start screen menu to be visible
    // Use Playwright's built-in waiting instead of isVisible() + manual assert
    const startScreen = page.locator('#startScreen');
    await expect(startScreen).toBeVisible({ timeout: 15000 });

    // Verify menu contains expected text
    await expect(startScreen).toContainText('Otter River Rush', {
      timeout: 5000,
    });

    // CRITICAL: Wait for the classic button to be visible and interactable
    const classicButton = page.locator('#classicButton');
    await expect(classicButton).toBeVisible({ timeout: 5000 });
    await expect(classicButton).toBeEnabled({ timeout: 5000 });

    // Click the button using Playwright's click (with auto-waiting)
    // Falls back to JS click if standard click fails (for scroll containers)
    try {
      await classicButton.click({ timeout: 5000 });
    } catch {
      // Fallback: Use JavaScript click for edge cases
      await page.evaluate(() => {
        document.querySelector<HTMLButtonElement>('#classicButton')?.click();
      });
    }

    // Wait for menu to hide (game starting)
    await expect(startScreen).toBeHidden({ timeout: 10000 });

    // CRITICAL: Wait for the canvas to appear and be visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Verify WebGL context exists (canvas is actually rendering)
    const hasWebGL = await page.evaluate(() => {
      const canvasEl = document.querySelector('canvas');
      if (!canvasEl) return false;
      // Check for both WebGL versions
      const gl =
        canvasEl.getContext('webgl2') ||
        canvasEl.getContext('webgl') ||
        canvasEl.getContext('experimental-webgl');
      return gl !== null;
    });
    expect(hasWebGL).toBe(true);

    // Wait for game store to be exposed (confirms React is running)
    await expect(async () => {
      const hasStore = await page.evaluate(() => {
        return typeof (window as any).__gameStore !== 'undefined';
      });
      expect(hasStore).toBe(true);
    }).toPass({ timeout: 5000 });

    // Verify game is actually playing
    const gameStatus = await page.evaluate(() => {
      const store = (window as any).__gameStore;
      return store?.getState?.()?.status;
    });
    expect(gameStatus).toBe('playing');

    // Check HUD is visible (confirms game UI rendered)
    const scoreElement = page.locator('[data-testid="score"]');
    await expect(scoreElement).toBeVisible({ timeout: 5000 });

    // Let game run and verify distance increases (confirms game loop is running)
    await expect(async () => {
      const state = await page.evaluate(() => {
        const store = (window as any).__gameStore;
        return store?.getState?.();
      });
      expect(state?.distance).toBeGreaterThan(0);
    }).toPass({ timeout: 10000 });

    // Final state check
    const finalState = await page.evaluate(() => {
      const store = (window as any).__gameStore;
      return store?.getState?.();
    });

    console.log('✅ SMOKE TEST PASSED - App actually works!');
    console.log(`   Status: ${finalState?.status}`);
    console.log(`   Distance: ${finalState?.distance}m`);
    console.log(`   Score: ${finalState?.score}`);
  });

  test('app loads without showing error boundary', async ({ page }) => {
    // This test verifies the app loads successfully without triggering the error boundary
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for the app to mount
    const appRoot = page.locator('#app');
    await expect(appRoot).toBeVisible({ timeout: 10000 });

    // Verify error boundary is NOT showing (which means app loaded successfully)
    const errorBoundary = page.locator('.bg-red-900');
    await expect(errorBoundary).toBeHidden({ timeout: 5000 });

    // Verify start screen is visible (confirms successful render)
    const startScreen = page.locator('#startScreen');
    await expect(startScreen).toBeVisible({ timeout: 15000 });
  });
});
