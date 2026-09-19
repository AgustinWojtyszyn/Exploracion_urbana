import { SurfaceWear } from '../../environment/SurfaceWear'
import { Block, Sign, type Vec3 } from '../Architecture'
import { Repeated, ServiceDoor } from './BuildingProps'
export function ServiceCorridor() {
  return <>
    <Block position={[3.6, 1.5, -6.4]} size={[.2, 3, 6.5]} material="plaster" />
    <Block position={[4.7, 2.85, -3.2]} size={[2.2, .3, .2]} material="plaster" />
    <Sign position={[4.65, 2.86, -3.08]} width={1.75} height={.23} lines={['SERVICIOS · BOMBAS']} />
    <ServiceDoor position={[4.65, 0, -10.45]} label="SALA DE BOMBAS" />
    <group position={[5.45, 0, -6]} rotation={[0, -Math.PI / 2, 0]}>
      <Block position={[0, 1.5, 0]} size={[1.5, 1.4, .12]} material="paint" solid={false} />
      <Repeated items={Array.from({ length: 12 }, (_, i) => [-.52 + (i % 4) * .34, 1.05 + Math.floor(i / 4) * .4, .08] as Vec3)} size={[.23, .28, .09]} material="plastic" />
      <Sign position={[0, 2.4, .08]} width={1.4} height={.23} lines={['TABLERO GENERAL · 220 V']} />
    </group>
    <Repeated items={[3.88, 4.02, 4.16].map(x => [x, 2.68, -6.8])} size={[.045, .045, 7.3]} material="metal" />
    <SurfaceWear position={[3.495, .65, -6.3]} rotation={[0, -Math.PI / 2, 0]} size={[2.2, 1.8]} />
    <Block position={[4.5, .016, -8.8]} size={[1.8, .016, 1.4]} material="dirt" solid={false} />
    <Block position={[4.5, .04, -9.5]} size={[.65, .04, .4]} material="metal" solid={false} />
  </>
}
