import { useLayoutEffect, useRef } from 'react'
import { BoxGeometry, InstancedMesh, Object3D } from 'three'
import { Block, Sign, type Vec3 } from '../Architecture'
import { palette, type MaterialName } from '../../environment/materials'

const unit = new BoxGeometry(1, 1, 1)
export function Repeated({ items, size, material }: { items: Vec3[]; size: Vec3; material: MaterialName }) {
  const ref = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    const object = new Object3D()
    items.forEach((p, i) => { object.position.set(...p); object.scale.set(...size); object.updateMatrix(); ref.current!.setMatrixAt(i, object.matrix) })
    ref.current!.instanceMatrix.needsUpdate = true; ref.current!.computeBoundingSphere()
  }, [items, size])
  return <instancedMesh ref={ref} args={[unit, palette[material], items.length]} castShadow receiveShadow dispose={null} />
}
export function Extinguisher({ position }: { position: Vec3 }) {
  return <group position={position}>
    <Block position={[0, .2, -.12]} size={[.44, 1.05, .025]} material="red" solid={false} />
    <mesh position={[0, 0, .02]} castShadow material={palette.red}><cylinderGeometry args={[.105, .105, .48, 16]} /></mesh>
    <Block position={[0, .31, .02]} size={[.2, .06, .09]} material="metal" solid={false} />
    <Block position={[.15, .1, .03]} size={[.025, .42, .03]} material="rubber" solid={false} />
    <Sign position={[0, .01, .129]} width={.14} height={.21} paper lines={['ABC', '5 kg']} />
    <Sign position={[0, .58, -.09]} width={.38} height={.19} lines={['MATAFUEGO']} />
  </group>
}
export function Plant({ position }: { position: Vec3 }) {
  return <group position={position}>
    <mesh position={[0, .23, 0]} material={palette.ochre} castShadow><cylinderGeometry args={[.29, .21, .46, 16]} /></mesh>
    <mesh position={[0, .465, 0]} material={palette.dirt}><cylinderGeometry args={[.265, .265, .025, 16]} /></mesh>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[Math.sin(i * 2.4) * .15, .83 + (i % 3) * .13, Math.cos(i * 2.4) * .15]} rotation={[.15 * Math.sin(i), i * 2.4, .3 * Math.cos(i)]} material={palette.paint} scale={[.07, .43, .035]} castShadow><sphereGeometry args={[1, 6, 6]} /></mesh>)}
  </group>
}
export function SecurityCamera({ position, rotation = [0, 0, 0] }: { position: Vec3; rotation?: Vec3 }) {
  return <group position={position} rotation={rotation}>
    <Block position={[0, .08, -.12]} size={[.08, .22, .3]} material="metal" solid={false} />
    <Block position={[0, 0, .05]} size={[.22, .15, .34]} material="plastic" solid={false} />
    <Block position={[0, 0, .226]} size={[.12, .08, .015]} material="dark" solid={false} />
  </group>
}
export function ServiceDoor({ position, label, rotation = [0, 0, 0] }: { position: Vec3; label: string; rotation?: Vec3 }) {
  return <group position={position} rotation={rotation}>
    <Block position={[0, 1.13, 0]} size={[1.2, 2.26, .13]} material="metal" />
    <Block position={[0, 1.1, .075]} size={[1.08, 2.15, .04]} material="worn" solid={false} />
    <Block position={[.39, 1.02, .13]} size={[.16, .035, .04]} material="brass" solid={false} />
    <Sign position={[0, 1.64, .105]} width={.64} height={.21} lines={[label]} />
    <Repeated items={Array.from({ length: 9 }, (_, i) => [0, .25 + i * .045, .103] as Vec3)} size={[.62, .017, .015]} material="dark" />
  </group>
}
