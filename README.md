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

El repositorio fue remodelado desde el prototipo anterior hacia TORRE 17.

La base actual incluye:

- lobby/portería/ascensores como escena de presentación;
- primera persona y colisiones reutilizadas;
- interacción contextual reutilizada;
- audio procedural por sector;
- estado de edificio e incidentes;
- primer evento sobrenatural preparado alrededor del piso 17;
- nueva dirección visual y de producto.

El objetivo inmediato NO es crear el edificio entero: es hacer que planta baja + primer incidente se sientan premium.
