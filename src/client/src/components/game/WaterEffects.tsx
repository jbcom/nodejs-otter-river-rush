import React from 'react';
import { AdvancedWater, Rain } from '@jbcom/strata';
import { useBiome } from '../../ecs/biome-system';
import { useGameStore } from '../../hooks/useGameStore';
import { getBiomeConfig } from '../../config/biome-config';

/**
 * Water Effects using @jbcom/strata AdvancedWater
 * Provides advanced water rendering with caustics, foam, and reflections
 */
export function WaterEffects(): React.JSX.Element | null {
  const { status } = useGameStore();
  const biome = useBiome();

  // Get biome config from centralized config
  const biomeConfig = getBiomeConfig(biome.name);
  const waterColor = biomeConfig.deepWaterColor;
  const showRain = biomeConfig.hasRain;
  const rainIntensity = biomeConfig.rainIntensity;

  // Wave speed based on game state
  const waveSpeed = status === 'playing' ? 1.5 : 0.5;

  return (
    <group>
      <AdvancedWater
        position={[0, -0.3, -5]}
        size={[40, 60]}
        segments={64}
        color={waterColor}
        waveHeight={0.08}
        waveSpeed={waveSpeed}
        causticIntensity={0.3}
      />

      {/* Weather effects based on biome config */}
      {showRain && (
        <Rain
          count={500}
          areaSize={40}
          height={20}
          intensity={rainIntensity}
          dropLength={0.5}
        />
      )}
    </group>
  );
}
