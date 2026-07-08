# SPEC 02 — Animaciones de rotura de bloques

> **Status:** Implementado
> **Depends on:** SPEC 01
> **Date:** 2026-07-08
> **Objective:** Añadir explosión de partículas al destruir un ladrillo y flash blanco al recibir un hit no letal.

## Scope

**In:**

- Sistema de partículas con física básica (gravedad + rebote en suelo).
- Explosión de fragmentos al destruir un ladrillo (HP llega a 0).
- Flash blanco momentáneo al recibir un hit sin destruir (HP > 1).
- Colores de partículas heredados del color del ladrillo.
- Límite de partículas activas para no saturar rendimiento.

**Out of scope (for future specs):**

- Sonidos de destrucción/hit (SPEC 04).
- Sprite de explosión usando EXPLOSION_FRAMES del spritesheet.
- Animaciones de paddle o pelota.
- Niveles múltiples (SPEC 05).

## Data model

```js
// Particle
const particle = {
  x: 0,
  y: 0,
  dx: 0,       // px/frame
  dy: 0,       // px/frame (positive = down)
  size: 4,     // px
  color: '#f00',
  life: 60,    // frames remaining
};

// Particle system config
const PARTICLES = {
  count: 8,        // fragments per brick
  gravity: 0.15,   // px/frame²
  bounce: 0.4,     // velocity multiplier on floor hit
  maxLife: 60,     // frames before disappear
  maxActive: 100,  // hard cap to prevent lag
};

// Flash config
const FLASH = {
  duration: 6,     // frames of white overlay
};

// Brick state (existing, no new fields)
// hp and color already exist — particle system reads them at destroy time.
```

Conventions:

- Las partículas se almacenan en un array `particles` en el game state.
- El array se actualiza y renderiza en cada frame del game loop.
- No se persiste nada — las partículas mueren al cerrar la pestaña.

## Implementation plan

1. Añadir array `particles: []` al game state y función `spawnParticles(x, y, color)` que genera 8 partículas con velocidades aleatorias. Manual test: llamar a `spawnParticles` desde consola, ver que se crean objetos.
2. Implementar `updateParticles()` con gravedad, rebote en suelo y decaimiento de vida. Manual test: partículas caen y rebotan en la parte inferior del canvas.
3. Implementar `drawParticles(ctx)` que dibuja cada partícula como cuadrado de color. Manual test: partículas visibles en canvas.
4. Integrar en game loop: `updateParticles()` + `drawParticles()` después del render de ladrillos. Manual test: partículas se dibujan encima de los ladrillos.
5. Conectar destrucción de ladrillo a `spawnParticles(brick.x, brick.y, brick.color)`. Manual test: romper ladrillo genera explosión de fragmentos.
6. Añadir flash blanco: al recibir hit sin destruir, superponer rectángulo blanco semitransparente durante 6 frames sobre el ladrillo. Manual test: ladrillo parpadea al ser golpeado sin destruirse.
7. Añadir cap de `maxActive` partículas. Manual test: romper muchos ladrillos rápido no genera lag perceptible.

## Acceptance criteria

- [ ] Romper un ladrillo genera entre 4 y 12 fragmentos de colores que salen disparados.
- [ ] Los fragmentos caen con gravedad y rebotan en el suelo del canvas.
- [ ] Los fragmentos desaparecen después de约60 frames.
- [ ] Golpear un ladrillo con HP > 1 produce un flash blanco de 6 frames.
- [ ] Las partículas se dibujan encima de ladrillos y pelota.
- [ ] Romper muchos ladrillos a la vez no causa caída de FPS perceptible.
- [ ] El gameplay no se pausa ni se ralentiza durante las animaciones.
- [ ] Las partículas no interfieren con la colisión pelota-ladrillo ni pelota-paddle.

## Decisions

- **Yes:** Partículas con física propia (gravedad + rebote). Más realista que solo visual, diferencia clara del spec de sonido.
- **No:** Sprite de explosión (EXPLOSION_FRAMES). Podría añadirse después como mejora visual sin cambiar la arquitectura.
- **Yes:** Flash blanco para hits no letales. Muy低成本, alta feedback visual.
- **No:** Pausa momentánea al destruir ladrillo. Rompe fluidez del gameplay.
- **Yes:** Cap de 100 partículas activas. Prevención de lag en escenarios extremos.
- **No:** Partículas con colisión contra paddle/ladrillos. Complejidad innecesaria, las partículas son decorativas.
- **Yes:** Colores heredados del ladrillo. Consistencia visual sin definir paleta nueva.

## Risks

| Risk | Mitigation |
| --- | --- |
| Muchas partículas activas causan lag | Cap de 100 partículas. Si se alcanza, las más viejas se eliminan antes. |
| Flash blanco no se percibe si es muy corto | 6 frames (~100ms) es suficiente. Si se necesita más, ajustar `FLASH.duration`. |
| Partículas se mezclan visualmente con ladrillos de mismo color | Usar tonos ligeramente distintos oadding varianza al color base. |

## What is **not** in this spec

- Sonidos de destrucción y hit (SPEC 04).
- Sprite de explosión (EXPLOSION_FRAMES del spritesheet).
- Partículas de paddle o pelota.
- Niveles de dificultad (SPEC 05).
- Persistencia de datos.
