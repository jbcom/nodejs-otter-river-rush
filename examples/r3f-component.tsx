import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import { Mesh } from 'three';

/**
 * Example: A decorative water lily component using R3F
 */
export const WaterLily = ({
  position,
}: {
  position: [number, number, number];
}) => {
  const meshRef = useRef<Mesh>(null);

  // Add some gentle rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Base pad */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>

      {/* Flower */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 0.4, 8]} />
        <meshStandardMaterial color="#ffb7c5" />
      </mesh>
    </group>
  );
};
