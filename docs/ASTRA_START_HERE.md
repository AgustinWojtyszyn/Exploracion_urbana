# Astra — punto de entrada

Antes de tocar código leer:
1. README.md
2. docs/GAME_VISION.md
3. src/data/zones.ts
4. src/systems/explorationStore.ts

## Lo que ya está decidido

- Stack: React + TypeScript + Vite.
- Render 3D: React Three Fiber.
- Helpers: Drei.
- Física: React Three Rapier.
- Estado global: Zustand.
- Primera persona, pero NO shooter.
- Progresión basada en exploración y cartografía.
- Inspiración visual: conurbano argentino ficticio.
- El primer vertical slice ocurre alrededor de una estación nocturna ficticia.

## Lo que NO hay que hacer

- No reemplazar el stack.
- No introducir backend todavía.
- No agregar armas.
- No convertirlo en survival crafting.
- No generar un mundo abierto enorme.
- No meter veinte sistemas antes de que exista un slice jugable.
- No romper la división world/player/systems/data/ui.
- No copiar assets o código con licencia incompatible.

## Primera meta técnica

Crear un slice jugable pequeño:
- movimiento FPS sólido;
- colisiones;
- interacción contextual;
- 3 hallazgos registrables;
- mapa diegético simple;
- una puerta/acceso que se desbloquee al conectar pistas;
- ambiente nocturno convincente;
- una transición hacia un nivel inferior.

Mantener todos los sistemas desacoplados y reemplazables.
