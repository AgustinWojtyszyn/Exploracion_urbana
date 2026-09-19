import { useLayoutEffect, useRef } from 'react'
import { BoxGeometry, Color, InstancedMesh, MeshStandardMaterial, Object3D } from 'three'
import { Block, Sign } from './Architecture'

const detailGeometry = new BoxGeometry(1, 1, 1)
const detailMaterial = new MeshStandardMaterial({ roughness: 0.9, metalness: 0.15 })
// One draw call for tile joints, shutter slats, sleepers and damp patches.
export function StationDetails() {
  const mesh = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    if (!mesh.current) return
    const object = new Object3D()
    let i = 0
    const add = (x: number, y: number, z: number, sx: number, sy: number, sz: number, color: string) => {
      object.position.set(x, y, z); object.scale.set(sx, sy, sz); object.updateMatrix()
      mesh.current!.setMatrixAt(i, object.matrix)
      objectColor.set(color); mesh.current!.setColorAt(i++, objectColor)
    }
    for (let z = -18; z < 13; z += 0.5) add(-5.98, 0.8, z, 0.02, 1.6, 0.018, '#344743')
    for (let y = 0.2; y < 1.7; y += 0.25) add(-5.97, y, -2.5, 0.025, 0.016, 31, '#344743')
    for (let shop = 0; shop < 3; shop++) for (let y = 0.15; y < 2.5; y += 0.09) add(13.64, y, -5 - shop * 6, 0.025, 0.018, 4.4, '#263334')
    for (let z = -31; z < -26; z += 0.55) add(0, 0.07, z, 5.2, 0.1, 0.2, '#343d38')
    for (let n = 0; n < 35; n++) add(-5.96, 2.5 + (n % 5) * 0.11, -18 + n * 0.9, 0.03, 0.07 + (n % 4) * 0.09, 0.16, '#4e6259')
    mesh.current.count = i; mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
    mesh.current.computeBoundingSphere()
  }, [])
  return <>
    <instancedMesh ref={mesh} args={[detailGeometry, detailMaterial, 220]} dispose={null} />
    <Block position={[-5.8, 3.6, -7]} size={[0.09, 0.09, 39]} material="dark" solid={false} />
    <Block position={[-5.6, 3.5, -7]} size={[0.06, 0.06, 39]} material="dark" solid={false} />
    <Block position={[-9, 2.8, -20.3]} size={[6, 0.12, 0.12]} material="metal" solid={false} />
    <Block position={[-17.7, 2.8, -26]} size={[0.12, 0.12, 12]} material="metal" solid={false} />
    <Sign position={[-5.94, 2.15, -8]} rotation={[0, Math.PI / 2, 0]} width={1.1} height={1.5} paper lines={['CLUB SOCIAL', 'ARROYO NORTE', 'FERIA DEL LIBRO', 'SÁBADO · 16 HS', 'ENTRADA LIBRE']} />
    <Sign position={[9, 1.6, -2.22]} rotation={[0, Math.PI, 0]} width={1.5} height={1.1} paper lines={['SE REPARAN', 'VENTILADORES', 'CONSULTAR HORARIO']} />
    {[[-2, -10], [2, -24], [10, -15]].map(([x, z]) => <mesh key={z} position={[x, 0.008, z]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.5, 0.7, 1]}>
      <circleGeometry args={[1, 24]} /><meshStandardMaterial color="#2b3f3d" roughness={0.23} metalness={0.35} />
    </mesh>)}
  </>
}
const objectColor = new Color()
