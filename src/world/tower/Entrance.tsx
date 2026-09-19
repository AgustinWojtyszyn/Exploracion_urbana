import { requestSound } from '../../audio/soundscape'
import { invalidateShadows } from '../../environment/shadows'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider } from '@react-three/rapier'
import type { Group } from 'three'
import { Block, Sign } from '../Architecture'
import { Interactable } from '../../interactions/Interactable'
import { Repeated } from './BuildingProps'

export function Entrance() {
  const [open, setOpen] = useState(false)
  const door = useRef<Group>(null)
  useFrame((_, dt) => {
    if (!door.current) return
    const delta = (open ? -1.2 : 0) - door.current.rotation.y
    if (Math.abs(delta) > .001) { door.current.rotation.y += delta * (1 - Math.exp(-4 * dt)); invalidateShadows() }
  })
  return <>
    <CuboidCollider position={[0, 1.7, 10.8]} args={[5.6, 1.7, .08]} />
    <Block position={[0, -.1, 14]} size={[18, .15, 8]} material="concrete" solid={false} />
    <Block position={[0, 3, 18]} size={[20, 6, .2]} material="dark" solid={false} />
    <Repeated items={[-7, -4, -1, 2, 5, 8].map(x => [x, 3.8, 17.84])} size={[1.3, 1.65, .03]} material="paint" />
    <Repeated items={[-7, 2].map(x => [x, 3.8, 17.81])} size={[1.1, 1.45, .015]} material="warm" />
    <Block position={[4, 2.5, 14.3]} size={[.08, 5, .08]} material="metal" solid={false} />
    <Block position={[4, 4.9, 14.3]} size={[.46, .13, .23]} material="warm" solid={false} />
    <Block position={[0, -.06, 10.5]} size={[11.2, .1, 1]} material="concrete" />
    <Block position={[0, 1.7, 10.1]} size={[11.2, 3.4, .035]} material="glass" solid={false} />
    <Repeated items={[-5.5, -3, -1, 1, 3, 5.5].map(x => [x, 1.65, 10])} size={[.055, 3.3, .08]} material="metal" />
    <Repeated items={[.15, 2.45, 3.2].map(y => [0, y, 10])} size={[11, .055, .08]} material="metal" />
    <group position={[-1, 0, 9.95]} ref={door}>
      <Interactable interaction={{ label: () => open ? 'Cerrar puerta de entrada' : 'Abrir puerta de entrada', perform: () => { setOpen(v => !v); requestSound('door') } }}>
        <Block position={[1, 1.2, 0]} size={[1.94, 2.4, .03]} material="glass" solid={false} />
        <Block position={[1.96, 1.2, 0]} size={[.05, 2.4, .08]} material="metal" solid={false} />
        <Block position={[1.65, 1.12, -.09]} size={[.035, .55, .05]} material="brass" solid={false} />
        <Block position={[1, .08, 0]} size={[2, .16, .08]} material="metal" solid={false} />
      </Interactable>
    </group>
    {!open && <CuboidCollider position={[0, 1.2, 9.95]} args={[1, 1.2, .05]} />}
    <Sign position={[0, 2.83, 9.91]} rotation={[0, Math.PI, 0]} width={2.2} height={.38} lines={['T O R R E   1 7']} />
    <Block position={[0, .025, 8.9]} size={[2.1, .035, 1.2]} material="rubber" solid={false} />
    <Sign position={[3.9, 1.7, 9.91]} rotation={[0, Math.PI, 0]} width={.85} height={.55} paper lines={['POR FAVOR', 'CERRAR', 'LA PUERTA']} />
    {/* Street silhouettes beyond the glass; no extra playable exterior. */}
    <Repeated items={[-4.8, -4.4, -4, -3.6, 3.5, 3.9, 4.3, 4.7].map(x => [x, 1.5, 10.6])} size={[.025, 3, .025]} material="metal" />
    <Block position={[-3.8, 2.85, 10.65]} size={[2.1, .16, .1]} material="warm" solid={false} />
  </>
}
