import { WeatherType } from '../config/biome-config';
import { useBiome } from '../ecs/biome-system';

/**
 * Hook to get the current weather based on the active biome
 */
export function useWeather(): WeatherType {
  const biome = useBiome();
  return biome.weather;
}
