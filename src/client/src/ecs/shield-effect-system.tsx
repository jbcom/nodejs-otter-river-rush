import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../hooks/useGameStore';
import { queries } from './world';

export function ShieldEffectSystem() {
  const { status } = useGameStore();

  useFrame((state) => {
    if (status !== 'playing') return;

    const [player] = queries.player.entities;
    if (!player || !player.invincible) return;

    // Shield visual effect handled by renderer
    // Just manage expiration here
    const now = Date.now();
    const endTime = (player as any).powerUpEndTime;

    if (endTime && now > endTime) {
      world.removeComponent(player, 'invincible');
      delete (player as any).powerUpEndTime;
      delete (player as any).powerUpType;
    }
  });

  return null;
}

import { world } from './world';
