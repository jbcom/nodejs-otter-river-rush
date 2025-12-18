import { type Entity, queries, world } from '../ecs/world';

export const debugTools = {
  // Entity inspection
  logAllEntities() {
    for (const _entity of world) {
    }
  },

  logEntityCounts() {},

  logPlayer() {
    const [_player] = queries.player.entities;
  },

  clearAllEntities() {
    world.clear();
  },

  spawnTestEntities() {
    const { spawn } = require('../ecs/world');
    spawn.otter(0);
    spawn.rock(-2, 5, 0);
    spawn.rock(0, 8, 1);
    spawn.rock(2, 11, 2);
    spawn.coin(-2, 6);
    spawn.gem(2, 9);
  },

  freezeGame() {
    for (const entity of queries.moving) {
      if (entity.velocity) {
        entity.velocity.x = 0;
        entity.velocity.y = 0;
        entity.velocity.z = 0;
      }
    }
  },

  teleportPlayer(x: number, y: number) {
    const [player] = queries.player.entities;
    if (player) {
      player.position.x = x;
      player.position.y = y;
    }
  },

  godMode(enable: boolean = true) {
    const [player] = queries.player.entities;
    if (player) {
      if (enable) {
        world.addComponent(player, 'invincible', true);
        world.addComponent(player, 'ghost', true);
      } else {
        world.removeComponent(player, 'invincible');
        world.removeComponent(player, 'ghost');
      }
    }
  },

  setHealth(health: number) {
    const [player] = queries.player.entities;
    if (player && player.health !== undefined) {
      player.health = health;
    }
  },

  triggerAnimation(animationName: string) {
    const [player] = queries.player.entities;
    if (player && player.animation) {
      player.animation.current = animationName;
    }
  },

  getPerformanceStats() {
    return {
      totalEntities: world.entities.length,
      obstacles: queries.obstacles.entities.length,
      collectibles: queries.collectibles.entities.length,
      particles: queries.particles.entities.length,
      movingEntities: queries.moving.entities.length,
      renderableEntities: queries.renderable.entities.length,
    };
  },

  exportGameState() {
    const state = {
      entities: world.entities.map((e) => ({
        position: e.position,
        velocity: e.velocity,
        health: e.health,
        type: e.player
          ? 'player'
          : e.obstacle
            ? 'obstacle'
            : e.collectible
              ? 'collectible'
              : 'unknown',
      })),
      queries: {
        player: queries.player.entities.length,
        obstacles: queries.obstacles.entities.length,
        collectibles: queries.collectibles.entities.length,
      },
    };
    return state;
  },
};

// Expose to window for console access
if (typeof window !== 'undefined') {
  (window as any).debug = debugTools;
}
