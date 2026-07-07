# SPEC 01 — MVP jugable de Arkanoid

> **Status:** Implementado
> **Depends on:** —
> **Date:** 2026-07-07
> **Objective:** Implementar un juego de Arkanoid jugable con paddle, pelota, ladrillos con HP por color, 1 nivel, sistema de puntuación y 3 vidas.

## Scope

**In:**

- Canvas 2D como motor de rendering.
- Paddle controlado con flechas izquierda/derecha del teclado.
- Pelota con movimiento y rebote en paddle, paredes y ladrillos.
- Ladrillos con HP variable por color (1-3 hits para destruir).
- 1 nivel con layout de ladrillos predefinido.
- Sistema de puntuación: ladrillo destruido = +10 puntos base (varía según HP).
- 3 vidas por partida. Al perder todas: Game Over.
- Pantalla de inicio (presiona Enter para jugar) y pantalla de Game Over.

**Out of scope (for future specs):**

- Power-ups (multi-ball, paddle más grande, etc.).
- Niveles múltiples o sistema de selección de niveles.
- Persistencia de high-scores (localStorage).
- Controles con teclado usando cursores izquierda y derecha. 
- Sonidos o música.
- Efectos visuales avanzados (partículas, animaciones complejas).

## Data model

```js
// Ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 8,
  dx: 4,   // px/frame
  dy: -4,  // px/frame (negative = up)
};

// Paddle
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  width: 80,
  height: 12,
  speed: 7,  // px/frame
};

// Brick
const brick = {
  x: 0,
  y: 0,
  width: 64,
  height: 24,
  hp: 1,      // 1, 2, or 3
  color: 'red', // maps to spritesheet: block_red, block_blue, block_green
};

// Game state
const state = {
  score: 0,
  lives: 3,
  running: false,  // false = paused / menu
};
```

Conventions:

- Origen del canvas: esquina superior izquierda.
- Velocidades en píxeles por frame (60fps target).
- Colores de ladrillos mapean a sprites del spritesheet (`block_red`, `block_blue`, `block_green`).

## Implementation plan

1. Crear `index.html` con canvas y estructura básica. Manual test: abrir en navegador, ver canvas negro.
2. Crear `game.js` con game loop (requestAnimationFrame). Manual test: consola mostrando FPS.
3. Implementar paddle con movimiento de teclado (flechas izquierda/derecha). Manual test: paddle se mueve, respeta límites del canvas.
4. Implementar pelota con movimiento y rebote en paredes. Manual test: pelota rebota en paredes, se pierde por abajo.
5. Implementar sistema de ladrillos con colores/HP. Manual test: ladrillos aparecen en grid, colores correctos.
6. Implementar colisión pelota-paddle. Manual test: pelota rebota al tocar paddle.
7. Implementar colisión pelota-ladrillo con destrucción y puntuación. Manual test: ladrillos desaparecen al ser golpeados, score aumenta.
8. Implementar sistema de vidas y Game Over. Manual test: perder pelota resta vida, 0 vidas = pantalla Game Over.
9. Implementar pantalla de inicio (Enter para jugar). Manual test: juego no empieza hasta presionar Enter.
10. Integrar spritesheet para ladrillos y paddle. Manual test: sprites se muestran correctamente.

## Acceptance criteria

- [ ] El juego carga sin errores en consola.
- [ ] El paddle se mueve con flechas izquierda/derecha y no sale del canvas.
- [ ] La pelota rebota correctamente en paredes, paddle y ladrillos.
- [ ] Ladrillos rojos se destruyen en 1 hit, azules en 2, verdes en 3.
- [ ] Destruir un ladrillo suma puntos (10 × HP del ladrillo).
- [ ] Perder la pelota por abajo resta 1 vida.
- [ ] A 0 vidas se muestra pantalla de Game Over.
- [ ] Presionar Enter en Game Over reinicia el juego.
- [ ] El juego no empieza hasta presionar Enter desde la pantalla de inicio.
- [ ] Los sprites del spritesheet se muestran correctamente en ladrillos y paddle.

## Decisions

- **Yes:** Canvas 2D. Mejor rendimiento para animaciones de juego, control directo del pixel.
- **No:** DOM/divs. Re-renderizado innecesario, menos control de colisiones.
- **Yes:** Solo teclado (flechas). Suficiente para MVP, reduce complejidad de input handling.
- **No:** Mouse. Podría agregarse después sin cambios arquitectónicos.
- **Yes:** Ladrillos con HP variable por color. Más feedback visual que un hit = destruido.
- **No:** Power-ups. Complejidad adicional que no aporta al MVP jugable.
- **Yes:** Un solo nivel predefinido. Demuestra mecánica sin necesidad de generación procedural.
- **No:** Sistema de niveles. Requiere diseño de layouts y lógica de transición, otro spec.
- **Yes:** Puntos = 10 × HP del ladrillo. Recompensa ladrillos más duros.
- **No:** Persistencia de high-scores. localStorage puede agregarse después.

## Risks

| Risk | Mitigation |
| --- | --- |
| Pelota se atasca entre paddle y ladrillo | Limitar ángulo de rebote en paddle (máx 60°). Nunca rebote vertical puro. |
| Spritesheet no carga (ruta relativa incorrecta) | Verificar path relativo al HTML. Fallback a rectángulos de color si falla. |
| Colisión pelota atravesa ladrillo a alta velocidad | Limitar velocidad máxima de pelota. Usar detección de intersección AABB. |
