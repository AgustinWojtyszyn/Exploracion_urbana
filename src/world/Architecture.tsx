import { useEffect, useMemo } from 'react'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { BoxGeometry, CanvasTexture, MeshStandardMaterial, SRGBColorSpace } from 'three'

export type Vec3 = [number, number, number]
const cube = new BoxGeometry(1, 1, 1)
const palette = {
  concrete: new MeshStandardMaterial({ color: '#696b68', roughness: 0.95 }),
  plaster: new MeshStandardMaterial({ color: '#b7ad9e', roughness: 0.98 }),
  tile: new MeshStandardMaterial({ color: '#8f8b78', roughness: 0.64 }),
  terrazzo: new MeshStandardMaterial({ color: '#6e695f', roughness: 0.52, metalness: 0.03 }),
  marble: new MeshStandardMaterial({ color: '#918a7d', roughness: 0.38 }),
  metal: new MeshStandardMaterial({ color: '#3e4242', metalness: 0.62, roughness: 0.48 }),
  dark: new MeshStandardMaterial({ color: '#1d2021', roughness: 0.92 }),
  ochre: new MeshStandardMaterial({ color: '#9f7c45', roughness: 0.82 }),
  brass: new MeshStandardMaterial({ color: '#8f7243', metalness: 0.72, roughness: 0.35 }),
  red: new MeshStandardMaterial({ color: '#7f2826', roughness: 0.7 }),
  light: new MeshStandardMaterial({ color: '#e8e0cb', emissive: '#d4c59f', emissiveIntensity: 2.8 }),
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
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = Math.max(180, Math.round(1024 * height / width))
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
    ctx.font = `600 ${Math.min(62, spacing * 0.55)}px monospace`
    rows.forEach((line, i) => ctx.fillText(line, 512, spacing * (i + 1), 940))
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
