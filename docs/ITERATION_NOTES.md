# TORRE 17 — planta baja / primer incidente

## Recorrido

`npm run dev`, abrir la URL de Vite y elegir **Empezar turno**. WASD y mouse; E interactúa a un máximo de 2,8 m. Esc pausa/libera el mouse; M silencia; Q alterna oclusión ambiental.

1. Acercarse al mostrador a la izquierda. Mirar hacia abajo al libro y pulsar E: reclamo 024, ascensor B detenido (6 B).
2. Mirar el monitor y pulsar E. El DVR muestra tres cámaras reales de planta baja y un canal sin señal. E vuelve; Esc también cierra, liberando el mouse.
3. Ir al fondo, al ascensor B (derecha). Pulsar E sobre la botonera de bronce. El indicador baja de 6 a PB en cinco segundos.
4. Esperar junto al indicador: permanece normal durante otros 18 segundos de juego activo antes de mostrar 17.
5. Leer con E el plano de la pared izquierda del hall de ascensores. El edificio termina en 16. Puede leerse antes sin romper la secuencia.
6. Siete segundos después de la anomalía, y habiendo leído el plano, suena el portero junto al plano. Responder con E: origen 17 B.
7. Mirar el ascensor B. Tras cuatro segundos responde el relé y comienza una apertura lenta, limitada. No se puede entrar al hueco. El evento termina nueve segundos después.
8. Es posible regresar al CCTV después de aparecer el 17: el canal 08 muestra un pequeño escenario imposible, separado del espacio navegable.

El tiempo narrativo se detiene al pausar y al revisar el DVR. No hay guardado: recargar reinicia el turno. Los incidentes secundarios aparecen en el libro y en los datos, sin ramificaciones jugables en esta iteración.

## Sistemas

- `src/world/tower/`: composición por sectores; `Tower17World` sólo los reúne.
- `src/environment/materials.ts`: texturas deterministas de 256 px, albedo sRGB, bump lineal, materiales y geometrías compartidos. Microdetalle repetido por `InstancedMesh`.
- `src/environment/Atmosphere.tsx`: ACES en el renderer, oclusión de 12 muestras a resolución reducida y OutputPass de Three. Sombras estáticas cacheadas e invalidadas por las puertas. Sin dependencias adicionales, bloom ni aberración cromática. Q permite evitar el pase extra de normales.
- `src/cctv/`: cuatro vistas de escena en un render target de 640 × 360; se actualiza un canal cada 250 ms. Sólo se lee a CPU cuando el panel está abierto.
- `src/systems/buildingStore.ts`: secuencia determinista y estados del ascensor. `BuildingDirector` aporta tiempo activo; las piezas visuales no deciden el progreso.
- `src/incidents/incidents.ts`: datos de tres incidentes con prioridad, pasos, consecuencias y asociación sobrenatural.
- `src/audio/`: fuentes Web Audio con HRTF, bus de volumen y eventos. Las capas están identificadas para sustituir los osciladores por samples.

## Verificación y límites

`npm test` prueba orden, esperas, condiciones, lectura anticipada del plano y repetición de interacciones. `npm run build` verifica TypeScript y producción. La prueba integrada en Chromium también verificó movimiento con W, los cinco objetos con raycast + E, cierre del DVR y final del evento, sin errores de JavaScript. Las esperas narrativas se adelantaron desde el estado durante esa prueba; las pruebas unitarias comprueban sus umbrales.

El audio es procedural: la frase del llamado se presenta como subtítulo, sin grabación de voz. El ascensor vende una llegada y apertura parcial; no transporta entre pisos. El exterior y el escenario CCTV son fondos limitados. La puerta de entrada permite abrir/cerrar, con límite de movimiento en la vereda.

La validación en Chromium con renderizado por software sirve para errores, capturas e interacción; no permite afirmar 60 FPS en una GPU de gama media. En la vista de control se contaron 205 meshes, 657 instancias y unas 30.200 caras triangulares. Cachear sombras redujo el cuadro medido de 514–598 a 312–396 draw calls, incluyendo oclusión y CCTV intermitente. Hace falta medir CPU/GPU en hardware real. El bundle conserva el peso de Three/Rapier; Vite avisa que excede 500 kB.

## Próximos tres pasos

1. Medir la escena en una GPU de gama media; ajustar luz, oclusión y agrupación de geometrías según tiempos reales.
2. Reemplazar las capas procedurales y el subtítulo de 17 B por grabaciones originales, con mezcla y reverberación de interiores.
3. Refinar los objetos protagonistas (ascensores, portero y puesto de vigilancia) con modelos propios y mapas de desgaste específicos, conservando la planta baja actual.
