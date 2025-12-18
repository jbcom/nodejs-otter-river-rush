/**
 * Unit tests for biome-config.ts
 * Tests getBiomeConfig function and validates all biome configurations
 */

import { describe, expect, it } from 'vitest';
import {
  BIOME_CONFIGS,
  type BiomeConfig,
  DEFAULT_BIOME_CONFIG,
  getBiomeConfig,
} from '../../src/config/biome-config';

describe('biome-config', () => {
  describe('getBiomeConfig', () => {
    it('returns correct config for Forest Stream biome', () => {
      const config = getBiomeConfig('Forest Stream');
      expect(config.cloudCoverage).toBe(0.3);
      expect(config.waterColor).toBe('#1e5a8a');
      expect(config.ambientType).toBe('forest');
      expect(config.hasRain).toBe(false);
    });

    it('returns correct config for Mountain Rapids biome', () => {
      const config = getBiomeConfig('Mountain Rapids');
      expect(config.cloudCoverage).toBe(0.5);
      expect(config.hasRain).toBe(true);
      expect(config.rainIntensity).toBe(0.6);
      expect(config.ambientType).toBe('mountain');
    });

    it('returns correct config for Canyon River biome', () => {
      const config = getBiomeConfig('Canyon River');
      expect(config.cloudCoverage).toBe(0.2);
      expect(config.ambientType).toBe('desert');
      expect(config.hasRain).toBe(false);
    });

    it('returns correct config for Crystal Falls biome', () => {
      const config = getBiomeConfig('Crystal Falls');
      expect(config.cloudCoverage).toBe(0.6);
      expect(config.ambientType).toBe('waterfall');
      expect(config.hasRain).toBe(false);
    });

    it('returns default config for unknown biome', () => {
      const config = getBiomeConfig('Unknown Biome');
      expect(config).toEqual(DEFAULT_BIOME_CONFIG);
    });

    it('returns default config for empty string', () => {
      const config = getBiomeConfig('');
      expect(config).toEqual(DEFAULT_BIOME_CONFIG);
    });
  });

  describe('BiomeConfig structure', () => {
    const requiredFields: (keyof BiomeConfig)[] = [
      'cloudCoverage',
      'waterColor',
      'deepWaterColor',
      'grassColor',
      'groundColor',
      'fogColor',
      'ambientType',
      'hasRain',
      'rainIntensity',
    ];

    it('all biome configs have required fields', () => {
      for (const [biomeName, config] of Object.entries(BIOME_CONFIGS)) {
        for (const field of requiredFields) {
          expect(config[field], `${biomeName} missing ${field}`).toBeDefined();
        }
      }
    });

    it('default config has all required fields', () => {
      for (const field of requiredFields) {
        expect(
          DEFAULT_BIOME_CONFIG[field],
          `DEFAULT missing ${field}`
        ).toBeDefined();
      }
    });

    it('cloud coverage values are between 0 and 1', () => {
      for (const [biomeName, config] of Object.entries(BIOME_CONFIGS)) {
        expect(
          config.cloudCoverage,
          `${biomeName} cloudCoverage out of range`
        ).toBeGreaterThanOrEqual(0);
        expect(
          config.cloudCoverage,
          `${biomeName} cloudCoverage out of range`
        ).toBeLessThanOrEqual(1);
      }
    });

    it('rain intensity values are between 0 and 1', () => {
      for (const [biomeName, config] of Object.entries(BIOME_CONFIGS)) {
        expect(
          config.rainIntensity,
          `${biomeName} rainIntensity out of range`
        ).toBeGreaterThanOrEqual(0);
        expect(
          config.rainIntensity,
          `${biomeName} rainIntensity out of range`
        ).toBeLessThanOrEqual(1);
      }
    });

    it('color values are valid hex colors', () => {
      const hexPattern = /^#[0-9A-Fa-f]{6}$/;
      const colorFields: (keyof BiomeConfig)[] = [
        'waterColor',
        'deepWaterColor',
        'grassColor',
        'groundColor',
        'fogColor',
      ];

      for (const [biomeName, config] of Object.entries(BIOME_CONFIGS)) {
        for (const field of colorFields) {
          expect(
            config[field],
            `${biomeName}.${field} is not valid hex`
          ).toMatch(hexPattern);
        }
      }
    });
  });

  describe('BIOME_CONFIGS completeness', () => {
    it('has exactly 4 biome configurations', () => {
      expect(Object.keys(BIOME_CONFIGS)).toHaveLength(4);
    });

    it('contains all expected biome names', () => {
      const expectedBiomes = [
        'Forest Stream',
        'Mountain Rapids',
        'Canyon River',
        'Crystal Falls',
      ];
      for (const biome of expectedBiomes) {
        expect(BIOME_CONFIGS[biome], `Missing biome: ${biome}`).toBeDefined();
      }
    });
  });
});
