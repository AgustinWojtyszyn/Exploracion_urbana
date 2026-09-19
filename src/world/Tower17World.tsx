import { Lobby } from './tower/Lobby'
import { Entrance } from './tower/Entrance'
import { Concierge } from './tower/Concierge'
import { ElevatorHall } from './tower/ElevatorHall'
import { ServiceCorridor } from './tower/ServiceCorridor'
import { Lighting } from './tower/Lighting'
import { BuildingDirector } from '../elevator/BuildingDirector'
import { Block, Sign } from './Architecture'

export function Tower17World() {
  return <>
    <Lighting /><Lobby /><Entrance /><Concierge /><ElevatorHall /><ServiceCorridor /><BuildingDirector />
    {/* A tiny CCTV-only set. Deliberately conflicting door axes; never a playable floor. */}
    <group position={[30, 0, 0]}>
      <Block position={[0, 0, -3]} size={[3, .1, 12]} material="tile" solid={false} />
      <Block position={[-1.5, 1.6, -3]} size={[.1, 3.2, 12]} material="damp" solid={false} />
      <Block position={[1.5, 1.6, -3]} size={[.1, 3.2, 12]} material="damp" solid={false} />
      <Block position={[0, 1.6, -8]} size={[3, 3.2, .1]} material="dark" solid={false} />
      {[-1, -4, -6].map((z, i) => <group key={z} rotation={[0, 0, i * .025]}>
        <Block position={[.3 * i, 2.8 - i * .17, z]} size={[2.8, .22, .16]} material="plaster" solid={false} />
        <Block position={[0, 2.65 - i * .17, z]} size={[.75, .04, .08]} material="light" solid={false} />
      </group>)}
      <Sign position={[0, 1.8, -7.9]} width={.6} height={.2} lines={['17 B']} />
      <pointLight position={[0, 2.3, -3]} intensity={12} distance={9} color="#9da88c" />
    </group>
  </>
}
