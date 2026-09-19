# The City Below

Base inicial para un juego 3D de exploración urbana y cartografía inspirado en el conurbano argentino.

La premisa: debajo de una ciudad cotidiana existe una red de espacios que no figura en ningún plano oficial. El jugador progresa observando, registrando y conectando señales del entorno.

## Stack

- React + TypeScript + Vite
- React Three Fiber
- Drei
- React Three Rapier
- Zustand

## Arranque

```bash
npm install
npm run dev
```

## Estructura

```text
src/
  data/       contenido y definición de zonas
  game/       composición principal del runtime
  player/     locomoción y cámara
  systems/    estado y mecánicas globales
  ui/         HUD e interfaces diegéticas
  world/      geometría, iluminación y escenas
docs/
  GAME_VISION.md
  ASTRA_START_HERE.md
```

## Arquitectura de referencia

La base sigue patrones de proyectos del ecosistema Poimandres:
- pmndrs/react-three-fiber
- pmndrs/drei
- pmndrs/react-three-rapier
- pmndrs/zustand

Todos esos proyectos usan licencia MIT. Esta base toma decisiones de arquitectura y composición del ecosistema; no incluye código propietario ni assets premium.

## Estado

Scaffold técnico + dirección de producto. Todavía no es un juego completo, intencionalmente.

El siguiente paso es construir un vertical slice de 15–25 minutos alrededor de una estación nocturna ficticia.
