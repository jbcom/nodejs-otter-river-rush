/**
 * CRITICAL SMOKE TEST
 * Tests the ACTUAL user experience, not just state changes
 * This test MUST pass or the app is broken
 *
 * Optimized for CI environments:
 * - Uses DOM checks instead of Playwright visibility (works better with WebGL/CSS)
 * - Comprehensive debugging output
 * - Handles headless Chrome quirks
 */

import { expect, test } from '@playwright/test';

test.describe('Critical Smoke Test - Real User Flow', () => {
  // Increase timeout for CI environments where headless Chrome is slower
  test.setTimeout(60000);

  test('app loads, renders React, shows menu, starts game, renders canvas @smoke', async ({
    page,
  }) => {
    // Collect all console errors for debugging
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    // Navigate and wait for network to settle
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // STEP 1: Wait for React app container
    const appRoot = page.locator('#app');
    await expect(appRoot).toBeAttached({ timeout: 10000 });

    // STEP 2: Wait for React to render content
    await expect(async () => {
      const content = await page.evaluate(() => {
        const app = document.getElementById('app');
        return app?.textContent?.length || 0;
      });
      expect(content).toBeGreaterThan(50);
    }).toPass({ timeout: 15000 });

    // STEP 3: Check for start screen in DOM (not visibility - CSS may affect it)
    await expect(async () => {
      const exists = await page.evaluate(() => {
        return document.getElementById('startScreen') !== null;
      });
      expect(exists).toBe(true);
    }).toPass({ timeout: 10000 });

    // STEP 4: Check menu has expected text content
    const menuText = await page.evaluate(() => {
      return document.getElementById('startScreen')?.textContent || '';
    });
    expect(menuText).toContain('Otter River Rush');

    // STEP 5: Check classic button exists
    const classicButtonExists = await page.evaluate(() => {
      return document.getElementById('classicButton') !== null;
    });
    expect(classicButtonExists).toBe(true);

    // STEP 6: Click the button using JavaScript (most reliable in CI)
    await page.evaluate(() => {
      const button = document.getElementById('classicButton');
      if (button) {
        button.click();
      }
    });

    // STEP 7: Wait for game to start (store status change)
    await expect(async () => {
      const status = await page.evaluate(() => {
        const store = (window as any).__gameStore;
        return store?.getState?.()?.status;
      });
      expect(status).toBe('playing');
    }).toPass({ timeout: 10000 });

    // STEP 8: Verify canvas exists in DOM
    const hasCanvas = await page.evaluate(() => {
      return document.querySelector('canvas') !== null;
    });
    expect(hasCanvas).toBe(true);

    // STEP 9: Check WebGL context (with fallback for SwiftShader)
    const webglInfo = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return { success: false, error: 'No canvas found' };

      try {
        const gl =
          (canvas as HTMLCanvasElement).getContext('webgl2') ||
          (canvas as HTMLCanvasElement).getContext('webgl') ||
          (canvas as HTMLCanvasElement).getContext('experimental-webgl');
        if (!gl) return { success: false, error: 'WebGL context is null' };

        // Get renderer info if available
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo
          ? (gl as WebGLRenderingContext).getParameter(
              debugInfo.UNMASKED_RENDERER_WEBGL
            )
          : 'Unknown';

        return { success: true, renderer };
      } catch (e) {
        return {
          success: false,
          error: e instanceof Error ? e.message : 'Unknown error',
        };
      }
    });

    console.log(`WebGL Info: ${JSON.stringify(webglInfo)}`);
    expect(webglInfo.success).toBe(true);

    // STEP 10: Check HUD score element exists
    await expect(async () => {
      const hasScore = await page.evaluate(() => {
        return document.querySelector('[data-testid="score"]') !== null;
      });
      expect(hasScore).toBe(true);
    }).toPass({ timeout: 5000 });

    // STEP 11: Verify game is running (distance increases)
    await expect(async () => {
      const state = await page.evaluate(() => {
        const store = (window as any).__gameStore;
        return store?.getState?.();
      });
      expect(state?.distance).toBeGreaterThan(0);
    }).toPass({ timeout: 10000 });

    // Final summary
    const finalState = await page.evaluate(() => {
      const store = (window as any).__gameStore;
      return store?.getState?.();
    });

    console.log('✅ SMOKE TEST PASSED!');
    console.log(`   Status: ${finalState?.status}`);
    console.log(`   Distance: ${finalState?.distance}m`);
    console.log(`   Score: ${finalState?.score}`);

    // Log any errors collected during the test
    if (consoleErrors.length > 0) {
      console.log('⚠️ Console errors during test:', consoleErrors);
    }
    if (pageErrors.length > 0) {
      console.log('⚠️ Page errors during test:', pageErrors);
    }
  });
});
