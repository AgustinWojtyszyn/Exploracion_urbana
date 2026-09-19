import { useMemo } from 'react'
import { CanvasTexture, MeshBasicMaterial, SRGBColorSpace } from 'three'
import type { Vec3 } from '../world/Architecture'
// Shared feathered decal: grime belongs at seams and leaks, not across every wall.
let grime: MeshBasicMaterial | undefined
function material() {
  if (grime) return grime
  const c = document.createElement('canvas'); c.width = c.height = 128
  const ctx = c.getContext('2d')!
  for (let i = 0; i < 34; i++) {
    const x = 30 + (Math.sin(i * 17) * .5 + .5) * 70, y = 15 + i * 2.6
    const g = ctx.createRadialGradient(x, y, 0, x, y, 12 + i % 15)
    g.addColorStop(0, 'rgba(47,43,29,.07)'); g.addColorStop(1, 'rgba(47,43,29,0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128)
  }
  const map = new CanvasTexture(c); map.colorSpace = SRGBColorSpace
  grime = new MeshBasicMaterial({ map, transparent: true, depthWrite: false, opacity: .55, polygonOffset: true, polygonOffsetFactor: -1 })
  return grime
}
export function SurfaceWear({ position, size, rotation = [0, 0, 0] }: { position: Vec3; size: [number, number]; rotation?: Vec3 }) {
  const shared = useMemo(material, [])
  return <mesh position={position} rotation={rotation} material={shared} dispose={null} userData={{ ignoreInteraction: true }}><planeGeometry args={size} /></mesh>
}
