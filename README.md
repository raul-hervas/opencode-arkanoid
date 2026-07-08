# Juego de Arkanoid

Juego de Arkanoid/Breakout creado con HTML, CSS y Javascript puro, cero dependencias.

## Cómo jugar

Abre `index.html` en tu navegador. No necesita servidor ni build.

- **Flechas ← →** o **A/D** — mover pala
- **Enter** — iniciar / reiniciar / continuar
- **Click** en el icono 🔊 — activar/desactivar sonido

## Características

- 3 niveles de dificultad progresiva (Fácil → Normal → Difícil)
- Pantalla de transición entre niveles
- Explosión de partículas al destruir ladrillos
- Flash visual al golpear ladrillos resistentes
- Vidas representadas con bolitas visuales
- Efectos de sonido (golpe, destrucción, rebote)
- Botón de mute con persistencia en localStorage
- Sistema de puntuación con multiplicador por dificultad

## Estructura

```
index.html          — punto de entrada
game.js             — lógica del juego
assets/
  spritesheet.js    — definición y carga de sprites
  spritesheet-breakout.png — atlas de sprites
  audio/            — efectos de sonido (hit, break, bounce)
specs/              — especificaciones de features
```