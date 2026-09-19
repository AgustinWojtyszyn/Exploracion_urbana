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

Primer vertical slice jugable: estación Arroyo de noche, tres hallazgos, cuaderno de campo, conexión manual y descenso a un mirador inferior. Geometría y audio procedural provisionales; sin assets remotos ni dependencias nuevas.

## Probar

`npm run dev` y abrir la dirección de Vite en un navegador de escritorio con WebGL2. Hacer clic en **Entrar a la estación** para capturar el mouse. WASD / flechas: caminar; mouse: mirar; E: examinar; M: cuaderno; Esc: pausa. La pausa permite silenciar el audio. El cuaderno libera el mouse; cerrar y pulsar **Volver al recorrido** para continuar.

El progreso dura hasta recargar la página. Las notas personales permanecen en la pestaña. No hay salto ni sprint: escalones y rampas se recorren caminando.

<details>
<summary>Recorrido de verificación (contiene la solución)</summary>

1. Subir los escalones y examinar con E el plano a la izquierda del andén.
2. Registrar el 14 del pilar a la derecha y el 14 del fondo de la galería.
3. Pasar por la abertura de mantenimiento al fondo a la izquierda, rodear el tabique y leer el tablero técnico.
4. Abrir M, seleccionar los tres registros y relacionar el circuito **14** con **un nivel bajo el andén**. Una combinación incorrecta no abre el acceso.
5. Cerrar el cuaderno, retomar el control y accionar con E el enclavamiento a la derecha de la compuerta.
6. Descender por la rampa hasta la baranda. El volumen iluminado debajo es el final visual; no es otra zona transitable.

</details>

## Verificación

- `npm run build`: TypeScript estricto y build de producción.
- `npm test`: invariantes de progresión (registro idempotente, marcas separadas, deducción, acceso y cartografía).

La interacción se resuelve desde la cámara en `src/interactions`; los hallazgos y conexiones viven en `explorationStore`. El controlador cinemático de Rapier resuelve colisiones, escalones y pendientes. `src/world/zones` compone el nivel; `src/audio` mezcla perfiles ambientales por zona.

Pendiente de playtest: calibrar la duración objetivo de 10–20 minutos, validar rendimiento en una notebook media y reemplazar el audio sintetizado por grabaciones.
