import React, { useCallback, useEffect, useRef } from 'react';
import { useBiome } from '../../ecs/biome-system';
import { useGameStore } from '../../hooks/useGameStore';
import { useWeather } from '../../hooks/useWeather';
import { audio } from '../../utils/audio';

const MIN_THUNDER_DELAY_MS = 5000;
const MAX_THUNDER_DELAY_MS = 15000;

/**
 * AudioEnvironment component
 * Manages ambient loops and weather SFX based on game state
 */
export function AudioEnvironment(): React.JSX.Element {
  const biome = useBiome();
  const { status } = useGameStore();
  const weather = useWeather();

  const lastBiomeRef = useRef<string>('');
  const lastWeatherRef = useRef<string>('');
  const thunderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to map biome name to ambient ID
  const getAmbientId = useCallback((biomeName: string): string => {
    switch (biomeName) {
      case 'Forest Stream':
        return 'ambient-forest';
      case 'Mountain Rapids':
        return 'ambient-mountain';
      case 'Canyon River':
        return 'ambient-desert';
      case 'Crystal Falls':
        return 'ambient-waterfall';
      default:
        return 'ambient-forest';
    }
  }, []);

  // Handle Biome Ambience
  useEffect(() => {
    if (status !== 'playing') {
      audio.stopAllAmbient();
      lastBiomeRef.current = '';
      lastWeatherRef.current = '';
      if (thunderTimeoutRef.current) {
        clearTimeout(thunderTimeoutRef.current);
        thunderTimeoutRef.current = null;
      }
      return;
    }

    if (biome.name !== lastBiomeRef.current) {
      // Transition biome audio
      if (lastBiomeRef.current) {
        audio.stopAmbient(getAmbientId(lastBiomeRef.current));
      }

      audio.playAmbient(getAmbientId(biome.name));
      lastBiomeRef.current = biome.name;
    }
  }, [biome.name, status, getAmbientId]);

  // Handle Weather SFX
  useEffect(() => {
    if (status !== 'playing') return;

    if (weather !== lastWeatherRef.current) {
      // Stop previous weather loops
      if (
        lastWeatherRef.current === 'rain' ||
        lastWeatherRef.current === 'storm'
      ) {
        audio.stopWeather('rain');
      }
      if (
        lastWeatherRef.current === 'fog' ||
        lastWeatherRef.current === 'storm'
      ) {
        audio.stopWeather('wind');
      }

      // Start new weather loops
      if (weather === 'rain' || weather === 'storm') {
        audio.playWeather('rain');
      }
      if (weather === 'fog' || weather === 'storm') {
        audio.playWeather('wind');
      }

      lastWeatherRef.current = weather;
    }
  }, [weather, status]);

  // Handle Thunder SFX for Storms
  useEffect(() => {
    if (status === 'playing' && weather === 'storm') {
      const scheduleThunder = () => {
        const delay =
          MIN_THUNDER_DELAY_MS +
          Math.random() * (MAX_THUNDER_DELAY_MS - MIN_THUNDER_DELAY_MS);
        thunderTimeoutRef.current = setTimeout(() => {
          if (status === 'playing' && weather === 'storm') {
            audio.thunder();
            scheduleThunder();
          }
        }, delay);
      };

      scheduleThunder();
    } else if (thunderTimeoutRef.current) {
      clearTimeout(thunderTimeoutRef.current);
      thunderTimeoutRef.current = null;
    }

    return () => {
      if (thunderTimeoutRef.current) {
        clearTimeout(thunderTimeoutRef.current);
        thunderTimeoutRef.current = null;
      }
    };
  }, [weather, status]);

  return <></>;
}
