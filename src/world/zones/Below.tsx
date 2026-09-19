import { Block, Sign, Tube } from '../Architecture'
import { CuboidCollider, RigidBody } from '@react-three/rapier'

export function Below() {
  return <>
    {/* 16 m run, 6 m descent. Floor top meets each landing at the same height. */}
    <Block position={[-14, -3.23, -40]} size={[6, 0.44, Math.sqrt(292)]} rotation={[-Math.atan(6 / 16), 0, 0]} />
    <Block position={[-17, -1, -40]} size={[0.35, 12, 16]} />
    <Block position={[-11, -1, -40]} size={[0.35, 12, 16]} />
    <Block position={[-14, 0.2, -40]} size={[6, 0.25, Math.sqrt(292)]} rotation={[-Math.atan(6 / 16), 0, 0]} material="dark" />
    <Tube position={[-14, -0.2, -39]} /><pointLight position={[-14, -0.8, -39]} intensity={23} distance={12} color="#c6d4ba" />
    <Block position={[-14, -6.25, -54]} size={[6, 0.5, 12]} />
    <Block position={[-17, -4, -54]} size={[0.35, 4, 12]} />
    <Block position={[-11, -4, -54]} size={[0.35, 4, 12]} />
    <Block position={[-14, -2, -52]} size={[6, 0.3, 8]} material="dark" />
    <Sign position={[-16.78, -4.4, -52]} rotation={[0, Math.PI / 2, 0]} width={2.3} lines={['COTA −6', 'LÍMITE DE RELEVAMIENTO']} />
    <RigidBody type="fixed" colliders={false} position={[-14, -5.35, -60]}>
      <CuboidCollider args={[3, 0.65, 0.1]} />
    </RigidBody>
    <Block position={[-14, -4.75, -60]} size={[6, 0.1, 0.12]} material="metal" solid={false} />
    <Block position={[-14, -5.65, -60]} size={[6, 0.07, 0.1]} material="metal" solid={false} />
    {[-17, -15.5, -14, -12.5, -11].map(x => <Block key={x} position={[x, -5.35, -60]} size={[0.07, 1.3, 0.1]} material="metal" solid={false} />)}
    <pointLight position={[-14, -3.5, -54]} intensity={15} distance={10} color="#8bafac" />
    {/* The inaccessible volume is a view, not another playable zone. */}
    <Block position={[-14, -22, -84]} size={[66, 1, 52]} material="dark" solid={false} />
    <Block position={[-14, -4, -108]} size={[66, 36, 1]} material="dark" solid={false} />
    {[-35, -21, -7, 7].map(x => <group key={x}>
      <Block position={[x, -11, -84]} size={[1.6, 26, 2]} solid={false} />
      <Block position={[x, -14, -82]} size={[8, 0.6, 39]} solid={false} />
      {[-69, -82, -95].map(z => <group key={z}>
        <Block position={[x, -11.5, z]} size={[5, 0.09, 0.16]} material="light" solid={false} />
        <Block position={[x, -17.5, z]} size={[5, 0.09, 0.16]} material="light" solid={false} />
      </group>)}
    </group>)}
    <pointLight position={[-20, -10, -73]} intensity={160} distance={50} color="#8aafaa" />
  </>
}
