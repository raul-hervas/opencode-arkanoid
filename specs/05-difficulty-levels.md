# SPEC 05 — Niveles de dificultad

> **Status:** Implementado
> **Depends on:** SPEC 01
> **Date:** 2026-07-08
> **Objective:** Implementar 3 niveles de dificultad progresivos (Fácil/Normal/Difícil) que ajustan la velocidad de la pelota y la puntuación.

## Scope

**In:**

- 3 niveles de dificultad: Fácil, Normal, Difícil.
- Dificultad sube al completar un nivel de ladrillos.
- La dificultad controla la velocidad de la pelota.
- Multiplicador de puntuación por dificultad.
- Reset a Fácil al hacer Game Over.
- Indicador de nivel/dificultad visible en HUD.

**Out of scope (for future specs):**

- Cambios en tamaño de paddle por dificultad.
- Cambios en HP de ladrillos por dificultad.
- Cambios en número de vidas por dificultad.
- Menú de selección de dificultad manual.
- Niveles generados proceduralmente.

## Data model

```js
// Difficulty levels
const DIFFICULTY = {
  easy: {
    name: 'Fácil',
    ballSpeed: 4,      // px/frame
    scoreMultiplier: 1,
  },
  normal: {
    name: 'Normal',
    ballSpeed: 6,      // px/frame
    scoreMultiplier: 1.5,
  },
  hard: {
    name: 'Difícil',
    ballSpeed: 8,      // px/frame
    scoreMultiplier: 2,
  },
};

// Level progression
const LEVELS = [
  { difficulty: 'easy',   layout: 'level1' },
  { difficulty: 'normal', layout: 'level2' },
  { difficulty: 'hard',   layout: 'level3' },
];

// Game state additions
const state = {
  // ... existing fields from SPEC 01
  currentLevel: 0,     // index into LEVELS (0=easy, 1=normal, 2=hard)
};

// HUD display config
const HUD = {
  levelX: 10,
  levelY: 20,
};
```

Conventions:

- `state.currentLevel` empieza en 0 (Fácil) y sube +1 al completar nivel.
- Al Game Over, `state.currentLevel` vuelve a 0.
- La velocidad de la pelota se aplica al inicio de cada nivel.
- El multiplicador se aplica al score al destruir ladrillos.

## Implementation plan

1. Añadir objetos `DIFFICULTY` y `LEVELS` al game state. Manual test: constantes disponibles en consola.
2. Añadir `currentLevel: 0` al state existente. Manual test: `state.currentLevel` es 0 al inicio.
3. Implementar `getDifficulty()` que devuelve la config de dificultad según `state.currentLevel`. Manual test: con level 0 devuelve easy, level 1 devuelve normal.
4. Modificar la inicialización de la pelota para usar `getDifficulty().ballSpeed` como velocidad base. Manual test: pelota se mueve más rápido al subir de nivel.
5. Conectar final de nivel a incremento de `currentLevel` (máx 2). Manual test: al romper todos los ladrillos, difficulty sube y pelota acelera.
6. Aplicar `scoreMultiplier` al destruir ladrillos. Manual test: en Normal se ganan 1.5x puntos, en Difícil 2x.
7. Reset `state.currentLevel = 0` en Game Over. Manual test: al perder todas las vidas, siguiente partida empieza en Fácil.
8. Añadir indicador de dificultad en HUD (esquina superior izquierda, bajo el score). Manual test: se muestra "Fácil", "Normal" o "Difícil" según nivel actual.

## Acceptance criteria

- [ ] El juego empieza en Fácil con pelota a 4px/frame.
- [ ] Al completar el primer nivel, la dificultad sube a Normal (6px/frame).
- [ ] Al completar el segundo nivel, la dificultad sube a Difícil (8px/frame).
- [ ] Destruir un ladrillo en Normal suma 1.5x puntos, en Difícil 2x.
- [ ] El indicador de dificultad se muestra en el HUD durante gameplay.
- [ ] Al hacer Game Over, la dificultad se resetea a Fácil.
- [ ] La velocidad de la pelota cambia al inicio de cada nivel, no durante el juego.
- [ ] El juego es completable desde Fácil hasta Difícil sin errores.

## Decisions

- **Yes:** Solo velocidad de pelota como parámetro de dificultad. Simple, efectivo, no rompe balance existente.
- **No:** Cambios en paddle, HP de ladrillos o vidas. Complejidad innecesaria para un primer sistema de dificultad.
- **Yes:** Progresivo automático. Flujo natural del juego, el usuario no tiene que elegir.
- **No:** Menú de selección de dificultad. El usuario lo descartó. Podría añadirse después como opción.
- **Yes:** Multiplicador de puntuación. Incentiva jugar en dificultad alta sin cambiar la mecánica.
- **No:** Niveles proceduralmente generados. Requiere otro spec con diseño de algoritmo de generación.
- **Yes:** 3 niveles = 3 dificultads. Un nivel por dificultad, limpio y directo.
- **No:** Más de 3 dificultads. El usuario pidió 3 explícitamente.
- **Yes:** Reset a Fácil en Game Over. Progresión clara: cada partida nueva empieza desde cero.

## Risks

| Risk | Mitigation |
| --- | --- |
| Pelota a 8px/frame atraviesa ladrillos (tunneling) | Limitar velocidad máxima. Usar detección de intersección AABB en vez de punto. |
| Transición de nivel no se detecta correctamente | Verificar que `state.bricks` está vacío antes de incrementar `currentLevel`. |
| ScoreMultiplier acumula decimales que desbordan UI | Redondear score a entero al mostrar, mantener decimales internamente. |
| Difícil es demasiado dura para usuarios casuales | Los usuarios juegan en Fácil/Normal la mayoría de veces. Difícil es para desafío. |

## What is **not** in this spec

- Menú de selección manual de dificultad.
- Cambios en paddle, HP de ladrillos o vidas por dificultad.
- Niveles proceduralmente generados.
- Más de 3 niveles de dificultad.
- Dificultad dinámica que cambia durante el juego.
