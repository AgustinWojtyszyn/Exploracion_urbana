import { invalidateShadows } from '../../environment/shadows'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider } from '@react-three/rapier'
import type { Group } from 'three'
import { Block, Sign } from '../Architecture'
import { Interactable } from '../../interactions/Interactable'
import { useBuildingStore } from '../../systems/buildingStore'
import { useSessionStore } from '../../systems/sessionStore'
import { Repeated } from './BuildingProps'

function Elevator({ x, name }: { x: number; name: 'A' | 'B' }) {
  const leaves = useRef<Group>(null)
  const state = useBuildingStore(s => s.elevator)
  const floor = useBuildingStore(s => s.floor)
  useFrame((_, dt) => {
    if (!leaves.current || name !== 'B') return
    const amount = state === 'opening' || state === 'held' ? .19 : 0
    leaves.current.children.forEach((leaf, i) => { const target = (i === 0 ? -1 : 1) * amount; if (Math.abs(target - leaf.position.x) > .001) { leaf.position.x += (target - leaf.position.x) * (1 - Math.exp(-.32 * dt)); invalidateShadows() } })
  })
  return <group position={[x, 0, -8.8]}>
    <Block position={[0, 1.45, -.65]} size={[2.5, 2.9, .1]} material="dark" solid={false} />
    <Block position={[0, .012, -.18]} size={[2.05, .024, 1.1]} material="metal" solid={false} />
    <Repeated items={[-.3, -.2, -.1, 0, .1].map(z => [0, .027, z])} size={[1.9, .008, .01]} material="dark" />
    <Repeated items={[-1.08, 1.08].map(v => [v, 1.28, 0])} size={[.14, 2.56, .23]} material="metal" />
    <Block position={[0, 2.6, 0]} size={[2.3, .15, .23]} material="metal" solid={false} />
    <Block position={[0, 2.5, .13]} size={[1.9, .03, .04]} material="warm" solid={false} />
    <group ref={leaves}>
      {[-1, 1].map(side => <group key={side}>
        <Block position={[side * .482, 1.24, .005]} size={[.958, 2.46, .06]} material="metal" solid={false} />
        <Block position={[side * .91, 1.24, .044]} size={[.022, 2.43, .012]} material="dark" solid={false} />
        <Block position={[side * .08, 1.24, .045]} size={[.012, 2.43, .012]} material="metal" solid={false} />
      </group>)}
    </group>
    <CuboidCollider args={[1.05, 1.3, .08]} position={[0, 1.3, .1]} />
    <Sign position={[0, 2.91, .13]} width={.66} height={.29} lines={[name === 'B' ? floor : 'PB']} />
    <Sign position={[0, 3.2, .13]} width={1.5} height={.17} lines={[`ASCENSOR ${name}  ·  450 kg`]} />
    <Block position={[0, 1.8, -.57]} size={[.025, 1.7, .03]} material="warm" solid={false} />
  </group>
}
export function ElevatorHall() {
  const stage = useBuildingStore(s => s.stage)
  const floor = useBuildingStore(s => s.floor)
  return <>
    <Block position={[-.65, 3, -9]} size={[7.7, .85, .4]} material="marble" />
    <Repeated items={[-3.75, -.9, 2.5].map(x => [x, 1.4, -9])} size={[.55, 2.8, .4]} material="marble" />
    <Elevator x={-2.3} name="A" /><Elevator x={.8} name="B" />
    <Interactable interaction={{ label: () => 'Llamar / inspeccionar ascensor B', perform: () => {
      const before = useBuildingStore.getState().stage
      useBuildingStore.getState().inspectElevator()
      useSessionStore.getState().notify(before === 'cameras' ? 'El relé responde. El coche está bajando.' : before === 'arrival' || before === 'complaint' ? 'Primero tengo que revisar el reclamo y las cámaras de portería.' : floor === '17' ? 'Diecisiete. No puede ser. El plano está junto al portero.' : 'PB. La botonera y el cierre parecen normales.')
    } }}>
      <Block position={[2.12, 1.28, -8.7]} size={[.23, .65, .06]} material="brass" solid={false} />
      <Block position={[2.12, 1.32, -8.661]} size={[.09, .09, .025]} material={stage === 'testing' ? 'warm' : 'plastic'} solid={false} />
      <Sign position={[2.12, 1.51, -8.66]} width={.16} height={.09} lines={['B']} />
    </Interactable>
    <group position={[-5.42, 0, -7.1]} rotation={[0, Math.PI / 2, 0]}>
      <Interactable interaction={{ label: () => 'Leer plano de evacuación', perform: () => { useBuildingStore.getState().readPlan(); useSessionStore.getState().notify('Plano aprobado: planta baja y pisos 1 a 16. Cuarenta y ocho unidades. No existe un piso 17.') } }}>
        <Block position={[0, 1.8, 0]} size={[1.65, 1.22, .04]} material="metal" solid={false} />
        <Sign position={[0, 1.8, .027]} width={1.55} height={1.12} paper lines={['PLAN DE EVACUACIÓN', '┌─────┬──────┬─────┐', '│ A   │ HALL │   B │', '└─────┴──┬───┴─────┘', 'ESCALERA A → SALIDA', 'PB + 16 PISOS · 48 UNIDADES', 'PLANO APROBADO · 1984']} />
      </Interactable>
      <Interactable interaction={{ label: () => stage === 'ringing' ? 'Responder llamada · 17 B' : 'Inspeccionar portero eléctrico', perform: () => {
        useBuildingStore.getState().answerPhone()
        useSessionStore.getState().notify(stage === 'ringing' ? '17 B · «… ¿me abre? …» El relé del ascensor acaba de responder.' : 'Portero interno. Las unidades están numeradas del 1 al 16.')
      } }}>
        <Block position={[1.3, 1.5, 0]} size={[.32, .65, .09]} material="plastic" solid={false} />
        <Block position={[1.2, 1.51, .07]} size={[.08, .5, .1]} material="dark" solid={false} />
        <Sign position={[1.36, 1.64, .051]} width={.17} height={.13} lines={[stage === 'ringing' || stage === 'answered' ? '17 B' : '—']} />
      </Interactable>
    </group>
  </>
}
