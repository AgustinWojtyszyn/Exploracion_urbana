# TORRE 17

Juego de terror sobrenatural argentino en primera persona.

Sos el encargado nocturno de una torre de departamentos del conurbano bonaerense. Durante el turno resolvés reclamos reales de consorcio —ascensores, agua, portero eléctrico, cortes, cámaras y puertas— hasta que el edificio empieza a mostrar pisos, pasillos y habitantes que no deberían existir.

## Identidad

No es un shooter y no es survival crafting.

El terror nace de tareas cotidianas y reconocibles:

- revisar un ascensor que quedó clavado;
- atender el portero eléctrico;
- mirar cámaras;
- subir por una pérdida de agua;
- recibir un reclamo de un departamento vacío;
- descubrir que el ascensor muestra 17 aunque el edificio tenga 16 pisos.

Estética argentina concreta: consorcio, portería, mármol, baldosas, matafuegos, tableros eléctricos, señalética en español, correspondencia, humedad, luces fluorescentes y ascensores antiguos.

## Stack

React + TypeScript + Vite + React Three Fiber + Drei + React Three Rapier + Zustand.

## Arranque

    npm install
    npm run dev

## Estado actual

Planta baja con portería, CCTV de la escena, materiales procedurales, iluminación por sectores y oclusión ambiental opcional. El primer reclamo conecta libro de novedades, prueba del ascensor B, indicador 17, plano, llamada y apertura parcial.

Controles: **WASD** caminar, **mouse** mirar, **E** interactuar, **Esc** pausar, **M** silenciar, **Q** alternar oclusión ambiental. Teclado y mouse; el turno se reinicia al recargar.

    npm test
    npm run build

Recorrido completo, arquitectura y límites: [notas de la iteración](docs/ITERATION_NOTES.md).
