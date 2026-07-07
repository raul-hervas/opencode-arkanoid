# AGENTS.md

## Project

Arkanoid/Breakout game. Vanilla HTML + CSS + JS, zero dependencies. Open `index.html` in browser to run.

## Current state

Game not yet implemented. Only assets exist: spritesheet image + `assets/spritesheet.js` (sprite definitions + loader).

## Spritesheet API

`assets/spritesheet.js` exports globals: `SPRITES`, `EXPLOSION_FRAMES`, `loadSpritesheet(cb)`, `drawSprite(ctx, name, x, y, w, h)`, `drawFrame(ctx, frame, x, y, w, h)`. Block sprites accessed via `drawSprite(ctx, 'block_red', ...)`. Spritesheet loads from `assets/spritesheet-breakout.png` relative to HTML file.

## Workflow: spec-driven

Use `/spec` skill to define features before coding. Specs go in `specs/` as `NN-slug.md`. Use `/spec-impl NN-slug` to implement approved specs. Config: `specs/.spec-config.yml` (AutoCreateBranch defaults true).

## Conventions

- Language: Spanish (README, prompts). Code comments: follow existing.
- No build step, no bundler, no transpiler. Raw browser JS.
- Keep files minimal. Prefer single-file game logic until size demands splitting.
