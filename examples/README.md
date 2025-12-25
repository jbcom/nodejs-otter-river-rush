# 🛠️ Otter River Rush Examples

This directory contains reference examples for extending the game. These are intended to demonstrate the data structures and patterns used in the game engine.

## 📂 Example Contents

- **[Achievements](./achievements/super-otter.ts)**: Examples of defining new player achievements.
- **[Levels](./levels/stormy-passage.ts)**: Examples of creating custom level segments with specific obstacle patterns.
- **[Obstacles](./obstacles/floating-log.ts)**: Examples of defining new hazards and enemies.
- **[Power-Ups](./powerups/custom-powerup.ts)**: Examples of defining new temporary benefits for the player.

## 🚀 How to Use

1. **Reference Only**: These files are provided as reference examples. To use them in the game, you would typically add them to the corresponding definition file in `src/client/src/game/data/`.
2. **Type Definitions**: Most examples reference types like `EnemyDefinition`, `AchievementDef`, or `ObstaclePattern`. You can find the full definitions in the `src/client/src/types/` and the data files themselves.
3. **Path Adjustments**: If you copy these files directly, ensure you update the import paths to match your project structure (e.g., using `@/` aliases if configured).

## 🔒 Security Note

The achievement system uses a string-based condition evaluation (`checkCondition`). When implementing your own systems, always ensure that you are not evaluating untrusted input to avoid code injection vulnerabilities.
