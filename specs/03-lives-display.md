# SPEC 03 — Vidas visuales con bolitas

> **Status:** Implementado
> **Depends on:** SPEC 01
> **Date:** 2026-07-08
> **Objective:** Reemplazar el contador numérico de vidas por bolitas visuales que se apagan al perder una vida.

## Scope

**In:**

- Bolitas sólidas de color en esquina superior derecha que representan vidas.
- Animación de fade a gris al perder una vida (la bolita se apaga gradualmente).
- El número de bolitas coincide con las vidas actuales (máx 3).
- Ocultar bolitas cuando la vida llega a 0.
- Solo visible durante gameplay, no en pantallas de inicio ni Game Over.

**Out of scope (for future specs):**

- Sonidos de pérdida de vida (SPEC 04).
- Animación de caída de bolitas.
- Power-ups que añadan vidas.
- Pantalla de Game Over mostrando vidas restantes.

## Data model

```js
// Lives display config
const LIVES_DISPLAY = {
  count: 3,           // max lives
  radius: 6,          // dot radius in px
  gap: 18,            // spacing between dots
  x: canvas.width - 20,  // right edge offset
  y: 20,              // top edge offset
  activeColor: '#e74c3c', // red when alive
  fadedColor: '#555',     // grey when lost
  fadeSpeed: 8,       // frames to fully fade out
};

// Existing state.lives (from SPEC 01) — no new fields needed.
// Lives display reads state.lives and renders accordingly.
```

Conventions:

- Coordenadas relativas a la esquina superior derecha del canvas.
- La bolita más a la derecha es la primera vida, la más a la izquierda es la última.
- El fade se anima con opacidad decreciente durante `fadeSpeed` frames.

## Implementation plan

1. Añadir objeto `LIVES_DISPLAY` al game state con las constantes de posición, colores y fadeSpeed. Manual test: constante disponible en consola.
2. Implementar `drawLives(ctx)` que dibuja `state.lives` círculos sólidos en la esquina superior derecha. Manual test: 3 bolitas rojas visibles durante gameplay.
3. Integrar `drawLives()` en el game loop después del render de partículas. Manual test: bolitas se mantienen en posición correcta mientras el juego avanza.
4. Añadir lógica de fade: al perder una vida, la bolita desapareciente pasa de `activeColor` a `fadedColor` en `fadeSpeed` frames. Manual test: perder pelota provoca fade gradual de la bolita derecha.
5. Ocultar bolitas a 0 vidas. Manual test: a 0 vidas no se dibuja ninguna bolita, Game Over se muestra correctamente.

## Acceptance criteria

- [ ] Se muestran 3 bolitas rojas en la esquina superior derecha durante gameplay.
- [ ] Perder una vida provoca que la bolita más a la derecha se apague gradualmente (fade a gris).
- [ ] El fade dura aproximadamente 100-150ms (6-8 frames a 60fps).
- [ ] Quedan 2 bolitas visibles tras perder 1 vida, 1 tras perder 2, 0 a Game Over.
- [ ] Las bolitas no interfieren con el score ni con otros elementos del HUD.
- [ ] Las bolitas no se muestran en pantalla de inicio ni en Game Over.
- [ ] La posición de las bolitas se mantiene estable sin parpadeo.

## Decisions

- **Yes:** Fade a gris para indicar pérdida de vida. Más sutil que una animación de caída, no interrumpe el gameplay.
- **No:** Animación de caída de bolitas. Complejidad innecesaria para un feedback que ya es claro con el fade.
- **Yes:** Esquina superior derecha. Separado del score (izquierda), zona típica de vidas en juegos clásicos.
- **No:** Mostrar bolitas en Game Over. El usuario ya sabe cuántas vidas perdió, no aporta información nueva.
- **Yes:** 3 bolitas máximo. Consistente con SPEC 01 (3 vidas por partida).
- **No:** Power-ups de vidas extra. Va en otro spec si se implementa.

## Risks

| Risk | Mitigation |
| --- | --- |
| Bolitas se solapan con el borde del canvas en pantallas pequeñas | Coordenadas con margen de 20px. Si el canvas es muy pequeño, se reduce `radius` proporcionalmente. |
| Fade no se percibe si es demasiado rápido | `fadeSpeed: 8` (~133ms) es suficiente. Ajustar si el usuario reporta que no se ve. |
| Número de vidas > 3 causa desbordamiento horizontal | Limitar `LIVES_DISPLAY.count` a 3. Si se añaden vidas extra, re-diseñar el layout. |

## What is **not** in this spec

- Sonidos de pérdida de vida (SPEC 04).
- Power-ups de vidas extra.
- Animación de caída de bolitas.
- Mostrar bolitas en Game Over.
- Pantalla de inicio con indicador de vidas.
