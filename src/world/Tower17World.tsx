import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { PointLight } from 'three'
import { Block, Sign, Tube } from './Architecture'
import { Interactable } from '../interactions/Interactable'
import { useBuildingStore } from '../systems/buildingStore'
import { useSessionStore } from '../systems/sessionStore'

function Fluorescent({ position, phase = 0 }: { position: [number, number, number]; phase?: number }) {
  const light = useRef<PointLight>(null)
  useFrame(({ clock }) => {
    if (!light.current) return
    const t = clock.elapsedTime + phase
    const flicker = Math.sin(t * 17) > 0.985 ? 0.18 : 1
    light.current.intensity = 17 * flicker
  })
  return <>
    <Tube position={position} />
    <pointLight ref={light} position={[position[0], position[1] - .28, position[2]]} intensity={17} distance={11} color="#ddd2b6" />
  </>
}

function ElevatorDisplay() {
  const anomaly = useBuildingStore(s => s.anomaly17Visible)
  return <Sign
    position={[0, 3.25, -13.78]}
    width={1.2}
    height={0.42}
    lines={[anomaly ? '17' : 'PB']}
  />
}

export function Tower17World() {
  const inspectElevator = () => {
    useBuildingStore.getState().inspectElevator()
    useSessionStore.getState().notify('El edificio figura con 16 pisos. El indicador acaba de marcar 17.')
  }
  const inspectCameras = () => {
    useBuildingStore.getState().inspectCameras()
    useSessionStore.getState().notify('Cámara 08: el pasillo no coincide con ningún piso del plano.')
  }

  return <>
    <ambientLight intensity={0.16} color="#8f98a0" />
    <directionalLight position={[8, 16, 10]} intensity={0.35} color="#8ea0b2" castShadow />

    {/* Floor shell */}
    <Block position={[0, -0.28, 0]} size={[22, .56, 32]} material="terrazzo" />
    <Block position={[0, 4.2, 0]} size={[22, .35, 32]} material="dark" />
    <Block position={[-11, 2, 0]} size={[.38, 4.4, 32]} material="plaster" />
    <Block position={[11, 2, 0]} size={[.38, 4.4, 32]} material="plaster" />
    <Block position={[0, 2, -16]} size={[22, 4.4, .4]} material="plaster" />

    {/* Entrance */}
    <Block position={[-5.8, 2, 16]} size={[9.5, 4.4, .35]} material="marble" />
    <Block position={[5.8, 2, 16]} size={[9.5, 4.4, .35]} material="marble" />
    <Block position={[0, 3.7, 16]} size={[2.2, .9, .35]} material="marble" />
    <mesh position={[0, 1.65, 15.96]}>
      <planeGeometry args={[2.1, 3.2]} />
      <meshStandardMaterial color="#40505a" transparent opacity={0.22} metalness={0.15} roughness={0.18} />
    </mesh>
    <Sign position={[0, 3.75, 15.72]} width={2.1} height={.5} lines={['TORRE 17']} />

    {/* Lobby */}
    <Block position={[0, .03, 3]} size={[3.2, .035, 16]} material="marble" solid={false} />
    {[-7.5, 0, 7.5].map((x, i) => <Fluorescent key={x} position={[x, 3.8, 5 - i * 3]} phase={i * .8} />)}
    <Block position={[-9.5, 1.8, 2]} size={[.6, 3.2, 8]} material="marble" />
    <Block position={[9.5, 1.8, 2]} size={[.6, 3.2, 8]} material="marble" />

    {/* Porteria */}
    <Block position={[-7.2, 1.35, 8]} size={[5.5, 2.7, .32]} material="plaster" />
    <Block position={[-7.2, .62, 6.65]} size={[5.5, 1.25, 2.4]} material="marble" />
    <mesh position={[-7.2, 2.05, 7.82]}>
      <planeGeometry args={[4.2, 1.25]} />
      <meshStandardMaterial color="#2d393d" transparent opacity={0.26} roughness={0.22} />
    </mesh>
    <Sign position={[-7.2, 3.05, 7.82]} width={3.3} height={.5} lines={['PORTERÍA · TURNO NOCHE']} />

    <Interactable interaction={{ label: () => 'Revisar cámaras', perform: inspectCameras }}>
      <Block position={[-8.4, 1.35, 6.35]} size={[1.25, .9, .18]} material="dark" solid={false} />
      <Block position={[-6.9, 1.35, 6.35]} size={[1.25, .9, .18]} material="dark" solid={false} />
      <Block position={[-5.4, 1.35, 6.35]} size={[1.25, .9, .18]} material="dark" solid={false} />
      <pointLight position={[-7.1, 1.5, 6.1]} intensity={3} distance={3} color="#6f9d8e" />
    </Interactable>

    <Sign position={[-9.62, 1.7, 9.4]} rotation={[0, Math.PI / 2, 0]} width={2.7} height={1.4} paper lines={['CONSORCIO TORRE 17', 'ADMINISTRACIÓN', 'LUN A VIE 09–13', 'NO DEJAR LLAVES']} />
    <Block position={[-9.58, 1.25, 4.4]} size={[.12, 1.8, 1]} material="red" solid={false} />
    <Sign position={[-9.5, 1.25, 4.39]} rotation={[0, Math.PI / 2, 0]} width={.8} height={.45} lines={['MATAFUEGO']} />

    {/* Mailboxes and intercom */}
    {Array.from({ length: 12 }).map((_, i) => {
      const col = i % 4, row = Math.floor(i / 4)
      return <Block key={i} position={[7.5 + col * .72, 1.1 + row * .55, 9.6]} size={[.62, .45, .15]} material="metal" solid={false} />
    })}
    <Sign position={[8.55, 2.95, 9.7]} width={3} height={.5} lines={['CORRESPONDENCIA / PB']} />

    {/* Elevator hall */}
    <Block position={[0, 2, -14]} size={[10, 4.2, .45]} material="marble" />
    <Block position={[-3.1, 1.7, -13.72]} size={[2.4, 3.3, .15]} material="metal" solid={false} />
    <Block position={[3.1, 1.7, -13.72]} size={[2.4, 3.3, .15]} material="metal" solid={false} />
    <Block position={[0, 1.7, -13.7]} size={[.8, 3.4, .3]} material="marble" />
    <ElevatorDisplay />
    <Sign position={[-3.1, 3.55, -13.72]} width={2.1} height={.4} lines={['ASCENSOR A']} />
    <Sign position={[3.1, 3.55, -13.72]} width={2.1} height={.4} lines={['ASCENSOR B']} />

    <Interactable interaction={{ label: () => 'Revisar tablero del ascensor B', perform: inspectElevator }}>
      <Block position={[4.75, 1.35, -13.48]} size={[.42, 1.35, .22]} material="brass" solid={false} />
      <pointLight position={[4.72, 1.7, -13.15]} intensity={2.2} distance={2} color="#c48e4e" />
    </Interactable>

    <Sign position={[7.8, 2.15, -13.72]} width={3.2} height={1.8} paper lines={['PLAN DE EVACUACIÓN', 'PB + 16 PISOS', 'ESCALERA A / CONTRAFRENTE', 'CAPACIDAD 48 UNIDADES']} />

    {/* Service corridor / depth */}
    <Block position={[8.3, 1.9, -4.5]} size={[5.4, 3.8, .28]} material="plaster" />
    <Block position={[5.7, 1.9, -8.5]} size={[.28, 3.8, 8]} material="plaster" />
    <Sign position={[8.2, 2.4, -4.34]} width={3.4} height={.65} lines={['TABLEROS · GAS · BOMBAS', 'ACCESO RESTRINGIDO']} />
    <Fluorescent position={[8.2, 3.45, -9]} phase={1.7} />

    {/* Everyday clutter */}
    <Block position={[7.9, .38, 4.8]} size={[1.2, .75, .55]} material="ochre" solid={false} />
    <Block position={[8.7, .24, 4.1]} size={[.7, .45, .45]} material="concrete" solid={false} />
    <Sign position={[9.2, 2.7, 15.72]} width={2.6} height={.55} lines={['CERRAR LA PUERTA', 'GRACIAS']} />

    {/* Tiny impossible cue: light where no corridor should be */}
    <pointLight position={[0, 1.4, -20]} intensity={12} distance={10} color="#8c6a49" />
  </>
}
