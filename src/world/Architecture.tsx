import { useEffect, useMemo } from 'react'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { BoxGeometry, CanvasTexture, MeshStandardMaterial, SRGBColorSpace } from 'three'

export type Vec3 = [number, number, number]
const cube = new BoxGeometry(1, 1, 1)
const palette = {
  concrete: new MeshStandardMaterial({ color: '#747c78', roughness: 0.94 }),
  tile: new MeshStandardMaterial({ color: '#74918b', roughness: 0.58 }),
  metal: new MeshStandardMaterial({ color: '#454e4e', metalness: 0.5, roughness: 0.65 }),
  dark: new MeshStandardMaterial({ color: '#252d30', roughness: 0.9 }),
  ochre: new MeshStandardMaterial({ color: '#b09b59', roughness: 0.82 }),
  light: new MeshStandardMaterial({ color: '#d6e5d4', emissive: '#bddac8', emissiveIntensity: 2 }),
}
export function Block({ position, size, material = 'concrete', rotation = [0, 0, 0], solid = true }: {
  position: Vec3; size: Vec3; material?: keyof typeof palette; rotation?: Vec3; solid?: boolean
}) {
  const mesh = <mesh geometry={cube} material={palette[material]} scale={size} receiveShadow castShadow dispose={null} />
  return solid ? <RigidBody type="fixed" colliders={false} position={position} rotation={rotation}>
    <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} />{mesh}
  </RigidBody> : <group position={position} rotation={rotation}>{mesh}</group>
}
export function Sign({ position, lines, width = 2.4, height = 0.8, rotation = [0, 0, 0], paper = false }: {
  position: Vec3; lines: string[]; width?: number; height?: number; rotation?: Vec3; paper?: boolean
}) {
  const text = lines.join('\n')
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = Math.round(1024 * height / width)
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = paper ? '#c4bc9e' : '#193b38'; ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = paper ? '#685f49' : '#a7bbb0'; ctx.lineWidth = 5; ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24)
    ctx.fillStyle = paper ? '#303a37' : '#e2e5d4'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    const rows = text.split('\n'), spacing = canvas.height / (rows.length + 1)
    ctx.font = `500 ${Math.min(65, spacing * 0.58)}px monospace`
    rows.forEach((line, i) => ctx.fillText(line, 512, spacing * (i + 1), 940))
    // Small deterministic stains keep local signs from looking digitally pristine.
    ctx.fillStyle = 'rgba(26, 35, 30, .09)'
    for (let i = 0; i < 45; i++) ctx.fillRect((i * 137) % 1024, (i * 43) % canvas.height, 15 + i % 20, 2)
    const t = new CanvasTexture(canvas); t.colorSpace = SRGBColorSpace; return t
  }, [text, width, height, paper])
  useEffect(() => () => texture.dispose(), [texture])
  return <mesh position={position} rotation={rotation}>
    <planeGeometry args={[width, height]} /><meshStandardMaterial map={texture} roughness={0.85} emissive="#ffffff" emissiveIntensity={0.12} emissiveMap={texture} />
  </mesh>
}
export function Tube({ position }: { position: Vec3 }) {
  return <Block position={position} size={[2.2, 0.06, 0.12]} material="light" solid={false} />
}
