# Legends — reconstrucción de escenas

## Alcance implementado

- Siete juegos de habilidad separados: reacción (cinco objetivos), penal por arrastre con potencia, timing (tres rondas), pase con defensores móviles, regate por gesto (cuatro duelos), memoria progresiva y arquero (cuatro remates).
- Cinco cábalas: moneda 3D de tres rondas, estadio con seis sectores, vasos con siete intercambios animados, mayor/menor de tres predicciones y rueda con seis premios y desaceleración.
- Escena común con previa, pausa, audio y vibración opcionales, HUD, feedback, partículas, resultado y reintento. La pestaña oculta pausa el juego y exige continuar al regresar.
- Jugadores, arquero, pelota, arco, césped, estadio y trofeo vectoriales, sin descargas ni dependencias nuevas.
- Entrada, selección de posición sobre una cancha, filosofía de carrera, centro de carrera, previa de final, resumen de temporada, entrenamiento, mercado, historial y retiro.
- Mercado con scroll horizontal nativo, comparación de condiciones, rechazo individual y presentación de firma. Se conservan las funciones de contratos y transferencias.
- El DT conserva su carrera e incorpora una pizarra de formaciones para explorar roles y cinco desafíos contextuales. La pizarra es una visualización; no modifica el simulador ni promete efectos sobre los resultados.
- Tienda, ranking, decisiones y ficha mantienen sus funciones y reciben tratamiento visual coherente.

## Arquitectura

`App.tsx` conserva navegación, coordinación de la carrera y persistencia. Los juegos ya no viven en él.

- `games/shared`: presentación, sprites, tipos y feedback compartidos.
- `games/virtuoso`: siete mecánicas independientes.
- `games/luck`: cinco rituales independientes.
- `hooks`: reloj de animación, gestos, rondas, audio, vibración y foco de diálogos.
- `systems/gameDifficulty.ts`: dificultad por temporada, edad, OVR, instancia y competición; los atributos otorgan pequeñas ayudas.
- `systems/gameScoring.ts`: medidas de reacción, distancia, precisión y timing; puntuación 0–100 sin sortear el éxito de una acción de habilidad.
- `scenes`: pantallas de carrera y estilos separados por responsabilidad.

El reloj se actualiza dentro del juego activo. Los timeouts y animation frames nuevos tienen cleanup. Los vasos interpolan posiciones mediante `transform`; la barra de timing mueve su cursor mediante `transform`. Se incluyen estilos para movimiento reducido; vuelo de pelota y mezcla conservan la información espacial necesaria para jugar.

## Compatibilidad

- Se mantiene **`leyenda-save-v2` en `sessionStorage`**. No se migra a otro almacenamiento ni se reinician carreras.
- `SeasonRecord.overallBefore` y `overallAfter` son opcionales. Se generan para temporadas nuevas. Los resúmenes viejos omiten la evolución que nunca se registró; no se inventan valores históricos.
- El máximo de OVR mostrado al retirarse es el máximo **registrado**, que incluye el valor actual. No es posible reconstruir el pico real de temporadas antiguas sin esos datos.
- Los IDs antiguos de habilidad conservan rutas hacia las siete mecánicas nuevas.
- Las cábalas retiradas continúan siendo aceptadas en finales guardadas: `dice-seven` → rueda; `lucky-number` y `lucky-shirt` → tribuna; `grid-reveal` → vasos; `boots` → moneda. Las temporadas nuevas eligen entre los cinco rituales principales.
- Se mantienen las fuentes OpenFootball, las ligas verificadas, los servicios de escudos y las referencias existentes a imágenes. No se expandió el sparse checkout ni se eliminaron recursos ausentes.
- No se modificaron `package.json`, lockfiles, configuración TypeScript/Vite ni dependencias. `*.tsbuildinfo` ya estaba ignorado.

## Archivos creados

### Componentes y datos

- `src/components/ClubIdentity.tsx`
- `src/components/Stat.tsx`
- `src/data/careerShop.ts`

### Infraestructura

- `src/hooks/useDialogFocus.ts`
- `src/hooks/useGameAudio.ts`
- `src/hooks/useGameClock.ts`
- `src/hooks/useHaptic.ts`
- `src/hooks/usePointerGesture.ts`
- `src/hooks/useRounds.ts`
- `src/systems/gameDifficulty.ts`
- `src/systems/gameScoring.ts`

### Juegos

- `src/games/SkillGame.tsx`
- `src/games/LuckGame.tsx`
- `src/games/GamesHub.tsx`
- `src/games/CoachChallenge.tsx`
- `src/games/shared/FootballVisuals.tsx`
- `src/games/shared/GameFeedback.tsx`
- `src/games/shared/GameScene.tsx`
- `src/games/shared/types.ts`
- `src/games/shared/games.css`
- `src/games/virtuoso/ReactionGame.tsx`
- `src/games/virtuoso/PenaltyGame.tsx`
- `src/games/virtuoso/TimingGame.tsx`
- `src/games/virtuoso/PassingGame.tsx`
- `src/games/virtuoso/DribbleGame.tsx`
- `src/games/virtuoso/MemoryGame.tsx`
- `src/games/virtuoso/KeeperGame.tsx`
- `src/games/virtuoso/virtuoso.css`
- `src/games/luck/CoinGame.tsx`
- `src/games/luck/StadiumGame.tsx`
- `src/games/luck/CupsGame.tsx`
- `src/games/luck/HigherLowerGame.tsx`
- `src/games/luck/WheelGame.tsx`
- `src/games/luck/luck-games.css`

### Escenas de carrera

- `src/scenes/CareerFinalScene.tsx`
- `src/scenes/CareerSetup.tsx`
- `src/scenes/CareerOverview.tsx`
- `src/scenes/SeasonSummary.tsx`
- `src/scenes/TrainingScene.tsx`
- `src/scenes/MarketScene.tsx`
- `src/scenes/CareerHistory.tsx`
- `src/scenes/CareerRetirementSummary.tsx`
- `src/scenes/CoachFormationBoard.tsx`
- `src/scenes/career-scenes.css`
- `src/scenes/career-shell.css`
- `src/scenes/career-overview.css`
- `src/scenes/career-finals.css`
- `src/scenes/career-progression.css`
- `src/scenes/career-market.css`
- `src/scenes/game-library.css`
- `src/scenes/career-polish.css`
- `src/scenes/coach.css`
- `docs/LEGENDS_REBUILD.md`

## Archivos existentes modificados

- `src/App.tsx`: integración, extracción de pantallas y juegos, entrada simplificada, conservación de datos nacionales al normalizar saves, inicio que no queda bloqueado por escudos remotos.
- `src/main.tsx`: entrada de los nuevos estilos.
- `src/world/Architecture.tsx`: evolución OVR opcional por temporada y descripciones actualizadas.
- `src/systems/buildingStore.ts`: registro OVR por temporada y selección de las nuevas pruebas en las finales. Se conservan simulación, resultado de finales, contratos, transferencias y premios.

**Archivos eliminados: ninguno.** Se retiraron implementaciones anteriores de minijuegos del interior de `App.tsx`; los IDs de saves siguen soportados.

## Pendiente de revisión manual por el propietario

No se ejecutaron Git, tests, TypeScript, Vite, linters, servidor de desarrollo ni validaciones en navegador, por instrucción expresa. No hay un resultado de build que reportar. La interacción, el aspecto renderizado y el balance necesitan revisión manual.

1. Respaldar la carrera actual y abrir un save anterior en la misma pestaña; revisar que conserve club, estadísticas, historia, contratos y una final pendiente, incluyendo IDs antiguos.
2. Crear carreras en Virtuoso, Al Pálpito y Mixto; recorrer decisión → temporada → previa → juego → resultado → resumen → mercado.
3. Jugar las siete pruebas: aciertos, errores, vencimientos, gestos cortos/cancelados, teclado, toques repetidos, reintento y salida.
4. Pausar durante una jugada y una animación; ocultar la pestaña y regresar. Revisar especialmente los tiempos de moneda y rueda frente a las animaciones CSS.
5. Revisar puntería/potencia del penal, ventanas del pase, reacción del arquero y mezcla de vasos en un dispositivo táctil real. Ajustar dificultad con experiencia de juego, no solo con scores teóricos.
6. Comprobar que cada resultado se aplique una sola vez. En práctica de habilidad, un resultado menor que 45 ya no otorga mejoras; 45–79 da el premio básico, 80+ el mejor premio.
7. Revisar ofertas con scroll, rechazo, renovación, continuidad y fichaje. Confirmar salario, años, prima e historial después de firmar.
8. Revisar entrenamiento sin créditos, atributos altos, fichas anteriores sin OVR histórico, trofeos, ranking, tienda y retiro.
9. Completar una temporada del DT y abrir sus cinco desafíos y la pizarra de formaciones.
10. Revisar 320/390/430 px y desktop, orientación horizontal, tema claro/oscuro, zoom, foco visible y movimiento reducido. El campo usa una paleta nocturna propia en ambos temas.
11. Audio y vibración son optativos y dependen de las capacidades y permisos del navegador/dispositivo.
12. Confirmar consola, TypeScript y build antes de integrar. No hay un script de tests declarado en el `package.json` inspeccionado.

## Comandos sugeridos — no ejecutados

```sh
git status --short
git diff --stat
git diff -- src/App.tsx src/main.tsx src/world/Architecture.tsx src/systems/buildingStore.ts
npm run build
npm run dev
```

Los archivos nuevos no aparecen en un `git diff` normal hasta agregarlos; revisarlos también desde el workspace. Cualquier operación de staging, commit o push queda a cargo del propietario, con rutas explícitas y cuidado del sparse checkout.
