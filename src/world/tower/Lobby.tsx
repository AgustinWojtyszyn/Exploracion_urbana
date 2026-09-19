import { Block, Sign, type Vec3 } from '../Architecture'
import { Plant, Repeated, Extinguisher, ServiceDoor, SecurityCamera } from './BuildingProps'

const floorTiles: Vec3[] = []
for (let x = -5.25; x < 5.6; x += .7) for (let z = -10.15; z < 10; z += .7) floorTiles.push([x, -.014, z])
export function Lobby() {
  return <>
    <Block position={[0, -.2, 0]} size={[11.4, .35, 22]} material="dark" />
    <Repeated items={floorTiles} size={[.692, .024, .692]} material="terrazzo" />
    <Block position={[0, .005, 0]} size={[2.35, .014, 20]} material="marble" solid={false} />
    <Repeated items={[-1.22, 1.22].map(x => [x, .016, 0])} size={[.045, .014, 20]} material="dark" />
    <Block position={[0, 3.45, 0]} size={[11.4, .22, 22]} material="plaster" />
    {[-5.65, 5.65].map(x => <group key={x}>
      <Block position={[x, 1.7, 0]} size={[.24, 3.5, 22]} material="plaster" />
      <Block position={[x - Math.sign(x) * .14, .7, 0]} size={[.06, 1.4, 22]} material="marble" solid={false} />
      <Block position={[x - Math.sign(x) * .18, .09, 0]} size={[.07, .18, 22]} material="dark" solid={false} />
      <Block position={[x - Math.sign(x) * .18, 1.42, 0]} size={[.06, .035, 22]} material="brass" solid={false} />
      <Block position={[x - Math.sign(x) * .2, 3.24, 0]} size={[.18, .14, 22]} material="plaster" solid={false} />
    </group>)}
    {[-3, -6.5, 7].map(z => <group key={z}>
      <Block position={[0, 3.15, z]} size={[11.2, .38, .32]} material="plaster" solid={false} />
      {[-5.32, 5.32].map(x => <group key={x}>
        <Block position={[x, 1.55, z]} size={[.4, 3.1, .46]} material="marble" />
        <Block position={[x, .12, z]} size={[.48, .24, .54]} material="dark" solid={false} />
      </group>)}
    </group>)}
    <Block position={[0, 1.7, -10.7]} size={[11.4, 3.5, .3]} material="damp" />
    <Plant position={[4.8, 0, 7.9]} />
    <Plant position={[-4.8, 0, -5.5]} />
    <group position={[5.35, 0, 1]} rotation={[0, -Math.PI / 2, 0]}>
      <Block position={[0, .46, .25]} size={[2.1, .1, .55]} material="wood" />
      <Block position={[0, .79, -.02]} size={[2.1, .52, .06]} material="wood" solid={false} />
      <Repeated items={[[-.8, .23, .25], [.8, .23, .25]]} size={[.07, .46, .45]} material="metal" />
      <Sign position={[0, 1.95, 0]} width={1.65} height={.8} paper lines={['CONSORCIO TORRE 17', 'Reunión · jueves 19:30', 'Mantener libre el acceso', 'Administración · interno 100']} />
    </group>
    <group position={[-5.38, 0, -.8]} rotation={[0, Math.PI / 2, 0]}><Extinguisher position={[0, 1.1, 0]} /></group>
    <SecurityCamera position={[4.9, 2.95, -6.2]} rotation={[.25, -.45, 0]} />
    <ServiceDoor position={[-4.45, 0, -10.5]} label="ESCALERA A" />
    <Sign position={[-4.45, 2.65, -10.47]} width={1.25} height={.28} lines={['SALIDA  ←']} />
    <Block position={[-4.45, 2.92, -10.4]} size={[.45, .1, .08]} material="light" solid={false} />
  </>
}
