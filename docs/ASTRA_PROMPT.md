# Prompt inicial para Astra

Trabajá directamente sobre este repositorio existente. No reinicies el proyecto ni reemplaces el stack.

Primero leé, en este orden:
1. README.md
2. docs/GAME_VISION.md
3. docs/ASTRA_START_HERE.md
4. src/data/zones.ts
5. src/systems/explorationStore.ts

## Objetivo

Construir el primer vertical slice jugable de **The City Below**, un juego de exploración urbana en primera persona inspirado visual y culturalmente en un conurbano argentino ficticio.

NO es un shooter. NO es un survival crafting. NO es un walking simulator pasivo.

La mecánica principal es:
OBSERVAR → REGISTRAR → CONECTAR → ACCEDER → CARTOGRAFIAR.

El jugador descubre una ciudad subterránea que no aparece en planos oficiales y progresa entendiendo cómo se conectan sus espacios.

## Alcance de esta iteración

Trabajá solo sobre el primer slice, alrededor de una estación ferroviaria ficticia durante la noche.

Implementá:

1. Movimiento FPS sólido y agradable:
   - WASD.
   - mouse look.
   - colisiones.
   - escaleras/rampas utilizables.
   - sensación de peso moderada.
   - sin sprint exagerado, slide, parkour ni mecánicas de shooter.

2. Sistema de interacción reutilizable:
   - raycast o equivalente desde cámara.
   - indicador contextual discreto.
   - tecla E para interactuar.
   - arquitectura extensible mediante componentes/tipos, no condicionales gigantes.

3. Tres hallazgos iniciales:
   - un plano ferroviario incompleto;
   - una numeración repetida en dos sectores;
   - un tablero eléctrico que alimenta algo debajo del andén.

   Cada hallazgo debe registrarse en explorationStore.

4. Cuaderno/mapa diegético:
   - abrir/cerrar con M;
   - mostrar zonas conocidas;
   - mostrar hallazgos;
   - NO usar minimapa GPS tradicional;
   - estética de anotaciones de campo, planos técnicos y papel/documentación usada.

5. Un pequeño puzzle sistémico:
   - los tres hallazgos permiten inferir un acceso;
   - al completar la conexión, habilitar una puerta o pasillo de mantenimiento;
   - evitar texto que diga literalmente la solución.

6. Mundo provisional pero atmosférico:
   - andén;
   - salida/entrada cerrada;
   - pasillo de mantenimiento;
   - galería comercial detrás o debajo de la estación;
   - transición final hacia un túnel inferior.

   Usar geometría procedural/primitivas y materiales propios mientras no haya assets definitivos.
   NO frenar el desarrollo buscando assets perfectos.

7. Dirección de arte:
   - arquitectura ferroviaria suburbana argentina reinterpretada;
   - azulejos, hormigón, chapa, persianas, cableado, pintura gastada;
   - iluminación fluorescente desigual;
   - humedad y reflejos discretos;
   - señalética ficticia en español;
   - nada cyberpunk;
   - nada postapocalíptico;
   - nada estadounidense;
   - evitar caricaturizar pobreza o inseguridad.

8. Sonido preparado por zonas:
   - crear arquitectura de audio aunque inicialmente use placeholders;
   - tren distante;
   - fluorescentes;
   - transformador;
   - agua;
   - viento;
   - vibraciones de infraestructura.

## Arquitectura obligatoria

Mantener:
- src/game
- src/player
- src/world
- src/systems
- src/data
- src/ui

Podés agregar:
- src/interactions
- src/audio
- src/journal
- src/world/zones
- src/components

No meter toda la lógica en App.tsx, GameCanvas.tsx ni PrototypeWorld.tsx.

Crear componentes pequeños y reutilizables.

## Stack existente

- React
- TypeScript
- Vite
- React Three Fiber
- Drei
- React Three Rapier
- Zustand

No agregar un motor diferente.
No agregar backend.
No agregar autenticación.
No agregar base de datos.
No agregar multiplayer.
No agregar IA generativa dentro del juego.

## Restricción importante

Antes de agregar una dependencia nueva, comprobá si la funcionalidad puede resolverse razonablemente con las dependencias existentes.

## Calidad

Priorizar:
1. sensación al moverse;
2. atmósfera;
3. interacción;
4. loop de descubrimiento;
5. claridad de arquitectura;
6. rendimiento.

No priorizar cantidad de contenido.

## Rendimiento

- reutilizar geometrías/materiales cuando corresponda;
- evitar luces dinámicas innecesarias;
- evitar cientos de React components por decoración;
- controlar DPR si hace falta;
- evitar postprocesado pesado en esta etapa;
- mantener el slice viable en una notebook/PC media.

## Criterio de finalización

La iteración termina cuando una persona puede:

1. abrir el juego;
2. caminar por la estación;
3. investigar libremente;
4. encontrar tres pistas sin marcadores invasivos;
5. consultar su registro;
6. deducir/desbloquear un acceso;
7. entrar a una zona nueva;
8. llegar a una revelación final visual que sugiera que existe una ciudad más abajo.

Ese recorrido debe durar aproximadamente 10–20 minutos en primera partida.

## Forma de trabajo

- Inspeccioná primero el repo actual.
- Conservá lo que ya sirve.
- Hacé cambios incrementales.
- Mantené TypeScript estricto.
- Ejecutá build después de cada bloque importante.
- Corregí errores antes de continuar.
- No generes documentación extensa salvo que cambie una decisión arquitectónica.
- No reescribas archivos enteros sin necesidad.
- No gastes tokens explicando planes largos: implementá.

Al terminar:
- asegurá que npm run build pase;
- resumí los archivos creados/modificados;
- explicá cómo probar el slice;
- anotá únicamente los próximos 3 pasos de mayor impacto.
