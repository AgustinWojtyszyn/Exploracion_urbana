# LEYENDA

Juego web de carrera futbolera y decisiones, diseñado **mobile-first**.

## Modos

- **Jugador**: 9, 10, 7, 5, 2 · Leñador y 1 · Arquero.
- **Entrenador**: gestión de club, táctica, vestuario, juveniles, presupuesto y presión de directiva/hinchas.
- **Desafío diario**: misma semilla para comparar carreras.
- **Minijuegos**: penales, tiros libres, pases, reflejos, duelo defensivo y scouting.
- **Ranking**: local sin configuración y global cuando se conecta Supabase.

## Identidad visual

- sistema visual azul;
- tema oscuro y claro persistente;
- Barlow Condensed para títulos;
- Manrope para interfaz;
- UI táctil y responsive desde 320 px;
- navegación inferior en juego;
- escudos geométricos **originales generados por LEYENDA**, no escudos oficiales.

## Datos de fútbol

LEYENDA no usa nombres de jugadores reales ni marcas comerciales.

Los nombres de clubes del catálogo se obtienen de datasets públicos de OpenFootball. Las ligas se muestran con nombres genéricos por país y división, por ejemplo:

- Liga Española · 1ª División
- Liga Francesa · 2ª División
- Liga Inglesa · 1ª División

No se incluyen nombres comerciales/patrocinados de ligas ni escudos oficiales.

### Actualizar datos

```bash
npm run sync:data
```

El script `scripts/sync-football-data.mjs` descubre archivos de divisiones disponibles en `openfootball/football.json`, toma la versión más reciente verificable y genera `src/data/verifiedLeagues.ts`.

Nunca inventa pertenencia de un club a una división: si la fuente no lo verifica, no se incorpora automáticamente.

## Desarrollo

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Ranking global

La app funciona sin backend usando ranking local.

Para ranking global:

1. crear/configurar un proyecto Supabase;
2. ejecutar `supabase/migrations/20260919_leyenda_global_rankings.sql`;
3. configurar:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

La app detecta automáticamente esas variables y cambia de ranking local a global.

## Principios de contenido

- sin jugadores reales;
- sin marcas comerciales;
- sin escudos oficiales;
- clubes reales solamente cuando provienen de fuentes verificables;
- ligas con nombres genéricos por país/división;
- carreras finitas y puntuables;
- decisiones con consecuencias;
- mobile-first como prioridad de producto.
