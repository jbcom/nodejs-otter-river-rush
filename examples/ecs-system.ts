import { useFrame } from '@react-three/fiber';
import { queries, world } from '../src/client/src/ecs/world';

/**
 * Example: A simple Floating System
 * Makes all entities with a 'floating' component bob up and down.
 */
export function FloatingSystem() {
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Query entities that have 'position' and 'floating' components
    // (You would need to add 'floating' to the Entity type in world.ts)
    const floatingEntities = world.with('position', 'floating' as never);

    for (const entity of floatingEntities) {
      // Apply sinusoidal vertical movement
      entity.position.z += Math.sin(time * 2) * 0.01;
    }
  });

  return null;
}

/**
 * Usage in your Game component:
 *
 * <Canvas>
 *   <FloatingSystem />
 *   ...
 * </Canvas>
 */
