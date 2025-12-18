/**
 * Centralized Biome Configuration
 *
 * Single source of truth for all biome-specific settings.
 * Used by environment, effects, audio, and visual components.
 */

export interface BiomeConfig {
  /** Cloud coverage (0-1) */
  cloudCoverage: number;
  /** Water color */
  waterColor: string;
  /** Advanced water color (deeper) */
  deepWaterColor: string;
  /** Grass/vegetation color */
  grassColor: string;
  /** Ground/terrain color */
  groundColor: string;
  /** Fog color */
  fogColor: string;
  /** Ambient audio type */
  ambientType: string;
  /** Whether to show rain */
  hasRain: boolean;
  /** Rain intensity (0-1) */
  rainIntensity: number;
}

/**
 * Biome configurations keyed by biome name
 * These names match the actual biome names from the biome system
 */
export const BIOME_CONFIGS: Record<string, BiomeConfig> = {
  'Forest Stream': {
    cloudCoverage: 0.3,
    waterColor: '#1e5a8a',
    deepWaterColor: '#1a4a6e',
    grassColor: '#3d6b35',
    groundColor: '#4a7c4e',
    fogColor: '#87CEEB',
    ambientType: 'forest',
    hasRain: false,
    rainIntensity: 0,
  },
  'Mountain Rapids': {
    cloudCoverage: 0.5,
    waterColor: '#2a6a9a',
    deepWaterColor: '#2668a0',
    grassColor: '#5a6b5a',
    groundColor: '#5a6b5a',
    fogColor: '#9ca3af',
    ambientType: 'mountain',
    hasRain: true,
    rainIntensity: 0.6,
  },
  'Canyon River': {
    cloudCoverage: 0.2,
    waterColor: '#3a7aaa',
    deepWaterColor: '#3a5a6e',
    grassColor: '#8b7355',
    groundColor: '#a0826d',
    fogColor: '#d4a574',
    ambientType: 'desert',
    hasRain: false,
    rainIntensity: 0,
  },
  'Crystal Falls': {
    cloudCoverage: 0.6,
    waterColor: '#1ecfcf',
    deepWaterColor: '#1a8a8a',
    grassColor: '#4a9c6e',
    groundColor: '#4a9c6e',
    fogColor: '#b0e0e6',
    ambientType: 'waterfall',
    hasRain: false,
    rainIntensity: 0,
  },
};

/**
 * Default biome config for unknown biomes
 */
export const DEFAULT_BIOME_CONFIG: BiomeConfig = {
  cloudCoverage: 0.4,
  waterColor: '#1e40af',
  deepWaterColor: '#1a3a8f',
  grassColor: '#4a7c4e',
  groundColor: '#4a7c4e',
  fogColor: '#87CEEB',
  ambientType: 'forest',
  hasRain: false,
  rainIntensity: 0,
};

/**
 * Get biome config by name with fallback to defaults
 */
export function getBiomeConfig(biomeName: string): BiomeConfig {
  return BIOME_CONFIGS[biomeName] || DEFAULT_BIOME_CONFIG;
}
