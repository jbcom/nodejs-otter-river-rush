/**
 * @jbcom/otter-river-rush
 *
 * Fast-paced river racing game with procedural level generation.
 * Built with React Three Fiber and @jbcom/strata.
 *
 * @example
 * ```tsx
 * import { OtterRiverRush } from '@jbcom/otter-river-rush';
 *
 * <OtterRiverRush
 *   width="100%"
 *   height={600}
 *   onGameOver={(score) => console.log('Score:', score)}
 * />
 * ```
 */

// Game state management
export { useGameStore } from './hooks/useGameStore';
// Main embeddable component
export {
  OtterRiverRush,
  OtterRiverRush as default,
  type OtterRiverRushProps,
} from './OtterRiverRush';
// Types
export type { GameState, GameStatus } from './types/game-types';
// Audio controls
export { audio } from './utils/audio';
