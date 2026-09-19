import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { useEffect, useMemo } from 'react'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { BoxGeometry, CanvasTexture, SRGBColorSpace } from 'three'

export type Vec3 = [number, number, number]
import { palette, type MaterialName } from '../environment/materials'
export { palette } from '../environment/materials'
const geometries = new Map<string, BoxGeometry>()
function box(size: Vec3) {
  const key = size.join(',')
  let geometry = geometries.get(key)
  if (!geometry) {
    const bevel = Math.min(...size) > .04 && Math.max(...size) < 3.5
    geometry = bevel ? new RoundedBoxGeometry(...size, 2, Math.min(.014, Math.min(...size) * .16)) : new BoxGeometry(...size)
    const uv = geometry.attributes.uv, p = geometry.attributes.position, n = geometry.attributes.normal
    for (let i = 0; i < uv.count; i++) {
      const nx = Math.abs(n.getX(i)), ny = Math.abs(n.getY(i)), nz = Math.abs(n.getZ(i))
      if (nx > ny && nx > nz) uv.setXY(i, p.getZ(i), p.getY(i))
      else if (ny > nz) uv.setXY(i, p.getX(i), p.getZ(i))
      else uv.setXY(i, p.getX(i), p.getY(i))
    }
    geometries.set(key, geometry)
  }
  return geometry
}

export function Block({ position, size, material = 'concrete', rotation = [0, 0, 0], solid = true }: {
  position: Vec3; size: Vec3; material?: MaterialName; rotation?: Vec3; solid?: boolean
}) {
  const mesh = <mesh geometry={box(size)} material={palette[material]} receiveShadow castShadow={Math.min(...size) > .035} dispose={null} />
  return solid ? <RigidBody type="fixed" colliders={false} position={position} rotation={rotation}>
    <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} />{mesh}
  </RigidBody> : <group position={position} rotation={rotation}>{mesh}</group>
}

export function Sign({ position, lines, width = 2.4, height = 0.8, rotation = [0, 0, 0], paper = false }: {
  position: Vec3; lines: string[]; width?: number; height?: number; rotation?: Vec3; paper?: boolean
}) {
  const text = lines.join('\n')
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = Math.max(64, Math.min(512, Math.round(512 * height / width)))
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = paper ? '#d1c7ad' : '#18201f'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = paper ? '#756b57' : '#a99a7b'
    ctx.lineWidth = 4
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24)
    ctx.fillStyle = paper ? '#2d302d' : '#e8e0cb'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const rows = text.split('\n')
    const spacing = canvas.height / (rows.length + 1)
    const longest = Math.max(...rows.map(line => line.length), 1)
    const fontSize = Math.min(rows.length === 1 ? canvas.height * .68 : spacing * .65, 470 / (longest * .61))
    ctx.font = `600 ${fontSize}px monospace`
    rows.forEach((line, i) => ctx.fillText(line, 256, spacing * (i + 1), 480))
    ctx.fillStyle = 'rgba(20,18,12,.08)'
    for (let i = 0; i < 34; i++) ctx.fillRect((i * 139) % 1024, (i * 53) % canvas.height, 20 + i % 31, 2)
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    return texture
  }, [text, width, height, paper])
  useEffect(() => () => texture.dispose(), [texture])
  return <mesh position={position} rotation={rotation}>
    <planeGeometry args={[width, height]} />
    <meshStandardMaterial map={texture} roughness={0.8} emissive="#ffffff" emissiveIntensity={0.08} emissiveMap={texture} />
  </mesh>
}

export function Tube({ position, rotation = [0, 0, 0] }: { position: Vec3; rotation?: Vec3 }) {
  return <Block position={position} rotation={rotation} size={[2.15, 0.055, 0.11]} material="light" solid={false} />
}
