# Otter River Rush Examples

This directory contains code examples and snippets demonstrating how to extend and use the Otter River Rush game engine.

## Contents

- [ECS System](./ecs-system.ts): How to create a new game system using Miniplex ECS.
- [Entity Definition](./entity-definition.ts): How to define and spawn new game entities.
- [R3F Component](./r3f-component.tsx): A React Three Fiber component for the game.
- [Custom Power-up](./custom-powerup.ts): Implementing a new power-up type.

## Getting Started

To use these examples, you can copy the code into your own project or use them as a reference for your own implementations.

### ECS Pattern

The game uses a strictly decoupled ECS (Entity-Component System) architecture:

1.  **Entities**: Simple data objects (POJOs) in the `world`.
2.  **Components**: Properties on the entity objects.
3.  **Systems**: Logic that runs every frame, querying for entities with specific components.

### React Three Fiber

The rendering is handled by React Three Fiber, which maps ECS entities to 3D objects in the scene.
