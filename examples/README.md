# 🛠️ Otter River Rush Examples

This directory contains reference examples for extending the game and using its core technologies. These are intended to demonstrate the data structures and patterns used in the game engine.

## 📂 Example Contents

### Game Data Definitions
- **[Achievements](./achievements/super-otter.ts)**: Examples of defining new player achievements.
- **[Levels](./levels/stormy-passage.ts)**: Examples of creating custom level segments with specific obstacle patterns.
- **[Obstacles](./obstacles/floating-log.ts)**: Examples of defining new hazards and enemies.
- **[Power-Ups](./powerups/custom-powerup.ts)**: Examples of defining new temporary benefits for the player.

### Technical Patterns
- **[ECS System](./ecs-system.ts)**: How to create a new game system using Miniplex ECS.
- **[Entity Definition](./entity-definition.ts)**: How to define and spawn new game entities.
- **[R3F Component](./r3f-component.tsx)**: A React Three Fiber component for the game.

## 🚀 How to Use

1. **Reference Only**: These files are provided as reference examples. To use them in the game, you would typically add them to the corresponding definition file in `src/client/src/game/data/`.
2. **Type Definitions**: Most examples reference types like `EnemyDefinition`, `AchievementDef`, or `ObstaclePattern`. You can find the full definitions in the `src/client/src/types/` and the data files themselves.
3. **Path Adjustments**: If you copy these files directly, ensure you update the import paths to match your project structure (e.g., using `@/` aliases if configured).

## 🧠 Core Architecture

The game uses a strictly decoupled ECS (Entity-Component System) architecture:

1.  **Entities**: Simple data objects (POJOs) in the `world`.
2.  **Components**: Properties on the entity objects.
3.  **Systems**: Logic that runs every frame, querying for entities with specific components.

The rendering is handled by **React Three Fiber**, which maps ECS entities to 3D objects in the scene.

## 🔒 Security Note

The achievement system uses a string-based condition evaluation (`checkCondition`). When implementing your own systems, always ensure that you are not evaluating untrusted input to avoid code injection vulnerabilities.
