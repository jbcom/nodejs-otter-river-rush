import { ASSET_URLS } from '../src/client/src/config/game-constants';
import { spawn, world } from '../src/client/src/ecs/world';

/**
 * Example: Defining and spawning a custom Obstacle
 */
export const spawnCustomObstacle = (x: number, y: number) => {
  return world.add({
    obstacle: true,
    position: { x, y, z: 0 },
    velocity: { x: 0, y: -5, z: 0 },
    model: {
      url: '/models/custom-obstacle.glb',
      scale: 1.5,
    },
    collider: { width: 2, height: 2, depth: 2 },
    // Custom property
    ...({
      metadata: {
        difficulty: 'hard',
        pointsOnDodge: 100,
      },
    } as object),
  } as never);
};

/**
 * Example: Spawning a "Golden Otter" (Special Player variant)
 */
export const spawnGoldenOtter = () => {
  const player = spawn.otter(0);

  // Modify components after spawn
  world.addComponent(player, 'invincible', true);
  world.addComponent(player, 'scoreMultiplier' as never, 2 as never);

  return player;
};
