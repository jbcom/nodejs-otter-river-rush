import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ParticleBurst } from '@jbcom/strata';
import { queries } from '../../ecs/world';

interface Burst {
  id: number;
  position: [number, number, number];
  color: string;
}

/**
 * Collection Burst Effect using @jbcom/strata ParticleBurst
 * Creates particle explosions when items are collected
 */
export function CollectionBurst(): React.JSX.Element {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextIdRef = useRef(0);
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  // Cleanup function for removing a burst after animation
  const removeBurstAfterDelay = useCallback((burstId: number) => {
    const timeoutId = setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burstId));
      timeoutIdsRef.current.delete(timeoutId);
    }, 1500);
    timeoutIdsRef.current.add(timeoutId);
  }, []);

  useEffect(() => {
    const unsubscribe = queries.collected.onEntityAdded.subscribe((entity) => {
      if (entity.collectible) {
        const color =
          entity.collectible.type === 'coin' ? '#ffd700' : '#ff1493';
        const burst: Burst = {
          id: nextIdRef.current++,
          position: [entity.position.x, entity.position.y, entity.position.z],
          color,
        };

        setBursts((prev) => [...prev, burst]);
        removeBurstAfterDelay(burst.id);
      }
    });

    // Cleanup: clear all pending timeouts on unmount
    return () => {
      unsubscribe();
      timeoutIdsRef.current.forEach((id) => clearTimeout(id));
      timeoutIdsRef.current.clear();
    };
  }, [removeBurstAfterDelay]);

  return (
    <group>
      {bursts.map((burst) => (
        <ParticleBurst
          key={burst.id}
          trigger={burst.id}
          position={burst.position}
          count={20}
          velocity={[0, 2, 0]}
          velocityVariance={[2, 2, 2]}
          lifetime={1}
          startColor={burst.color}
          endColor={burst.color}
          startSize={0.1}
          endSize={0.02}
          startOpacity={1}
          endOpacity={0}
        />
      ))}
    </group>
  );
}
