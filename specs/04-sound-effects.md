# SPEC 04 — Efectos de sonido

> **Status:** Implementado
> **Depends on:** SPEC 01
> **Date:** 2026-07-08
> **Objective:** Añadir samples de audio para colisión de bloques, rotura, rebote en paredes y botón de mute.

## Scope

**In:**

- Samples de audio para: golpear ladrillo (hit), romper ladrillo (break), rebote en paredes (bounce).
- Cada evento tiene un sonido diferenciado.
- Botón de mute on/off en pantalla.
- Audio se reproduce en contexto de usuario (requiere interacción previa).

**Out of scope (for future specs):**

- Música de fondo o loop musical.
- Slider de volumen.
- Sonidos de paddle o pelota perdida.
- Sonidos de Game Over o victoria.
- Sons de power-ups.

## Data model

```js
// Audio manager
const audio = {
  muted: false,
  sounds: {
    hit: null,    // HTMLAudioElement — ladrillo golpeado sin destruir
    break: null,  // HTMLAudioElement — ladrillo destruido
    bounce: null, // HTMLAudioElement — rebote en pared
  },
};

// Rutas de samples (archivos .wav o .mp3 en carpeta assets/)
const SOUND_PATHS = {
  hit: 'assets/hit.wav',
  break: 'assets/break.wav',
  bounce: 'assets/bounce.wav',
};

// Mute button config
const MUTE_BTN = {
  x: 10,
  y: canvas.height - 30,
  size: 20,
};
```

Conventions:

- Los samples se cargan al inicio del juego con `new Audio(path)`.
- El volumen base es 1.0; el mute pone `volume = 0` en todos los audios.
- Los archivos de audio se almacenan en `assets/` junto al spritesheet.
- El botón de mute se renderiza en canvas, no es un elemento DOM.

## Implementation plan

1. Crear carpeta `assets/audio/` y añadir 3 samples: `hit.wav`, `break.wav`, `bounce.wav` (samples genéricos de placeholder). Manual test: archivos existen en la ruta correcta.
2. Implementar función `initAudio()` que carga los 3 samples en el objeto `audio.sounds`. Manual test: llamar desde consola, `audio.sounds.hit` es un HTMLAudioElement válido.
3. Implementar `playSound(name)` que reproduce un sample si `audio.muted === false`. Manual test: llamar `playSound('hit')` suena el sample.
4. Añadir botón de mute en canvas (esquina inferior izquierda). Manual test: botón visible durante gameplay.
5. Implementar toggle de mute al hacer click en el botón. Manual test: click alterna icono (altavoz on/off) y silencia/activa sonidos.
6. Conectar eventos del juego: `playSound('hit')` al golpear ladrillo sin destruir, `playSound('break')` al destruir ladrillo, `playSound('bounce')` al rebotar en paredes. Manual test: cada evento suena su sample correspondiente.
7. Guardar estado de mute en `localStorage`. Manual test: recargar página, el mute se mantiene.

## Acceptance criteria

- [ ] Hay 3 samples de audio diferenciados: hit, break, bounce.
- [ ] Golpear un ladrillo sin destruirlo reproduce el sonido `hit`.
- [ ] Destruir un ladrillo reproduce el sonido `break`.
- [ ] Rebotar en paredes reproduce el sonido `bounce`.
- [ ] El botón de mute es visible durante gameplay en la esquina inferior izquierda.
- [ ] Hacer click en el botón alterna el estado de mute (on/off).
- [ ] En mute, ningún sonido se reproduce.
- [ ] El estado de mute persiste al recargar la página.
- [ ] Los sonidos no se solapan de forma anti-natural (máx 1 instancia por tipo a la vez).
- [ ] El juego funciona correctamente con audio desactivado (sin errores en consola).

## Decisions

- **Yes:** Samples pregrabados (.wav/.mp3). Más control sobre el sonido que sintetizar con Web Audio API.
- **No:** Sintetización 8-bit con Web Audio API. Más flexible pero más código y menos consistencia entre samples.
- **Yes:** Botón de mute en canvas. Consistente con el resto de la UI renderizada en canvas.
- **No:** Slider de volumen. Complejidad adicional innecesaria para un juego arcade.
- **No:** Música de fondo. El usuario la descartó, y añadiría latencia de carga y complejidad de loop.
- **Yes:** Persistir mute en `localStorage`. El usuario no quiere re-silenciar cada vez que recarga.
- **No:** Sonidos de Game Over, victoria o power-ups. Va en specs separados si se implementan.
- **Yes:** 1 instancia por tipo de sonido a la vez. Evita overlap caótico al golpear varios ladrillos rápido.

## Risks

| Risk | Mitigation |
| --- | --- |
| Samples no cargan (ruta incorrecta o archivo faltante) | Fallback: si `audio.sounds[name]` es null, `playSound` no hace nada. No crashea el juego. |
| Sonidos se solapan al romper varios ladrillos rápido | Limitar a 1 instancia por tipo. Si ya está sonando, no se reproduce de nuevo. |
| Audio bloqueado por navegador antes de interacción del usuario | Los samples se cargan en `initAudio()` pero solo se reproducen tras el primer click/keypress (Enter). |
| Archivos de audio pesados afectan tiempo de carga | Usar samples .wav cortos (<100KB cada uno). Optimización futura: convertir a .opus. |

## What is **not** in this spec

- Música de fondo o loop musical.
- Slider de volumen.
- Sonidos de paddle, pelota perdida, Game Over o victoria.
- Sonidos de power-ups.
- Efectos de sonido 3D o spatial audio.
