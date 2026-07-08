# AGENTS.md

## Project

Arkanoid/Breakout game. Vanilla HTML + CSS + JS, zero dependencies. Canvas: 480×640. Open `index.html` in browser to run (no build, no server).

## Structure

- `index.html` — minimal HTML, loads scripts in order
- `game.js` — all game logic (single file, ~460 lines)
- `assets/spritesheet.js` — sprite definitions + loader (globals)
- `assets/spritesheet-breakout.png` — sprite atlas
- `assets/audio/` — hit.wav, break.wav, bounce.wav

## Spritesheet API

Global functions from `assets/spritesheet.js`:
- `loadSpritesheet(callback)` — load atlas, call cb when ready
- `drawSprite(ctx, name, x, y, w, h)` — draw named sprite (e.g. `'block_red'`, `'paddle'`, `'ball'`)

## Run

Open `index.html` directly in browser. No npm, no build, no dev server.

## Conventions

- Language: Spanish (README, prompts). Code comments: follow existing style.
- No bundler, no transpiler. Raw browser JS with globals.
- Single-file game logic preferred until size demands splitting.
- All specs implemented (01-05). Use spec workflow for new features.
