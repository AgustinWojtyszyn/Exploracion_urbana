import { CanvasTexture, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace } from 'three'

// Small, deterministic textures shared by every instance. One tile represents a metre.
export type Finish = 'concrete' | 'plaster' | 'damp' | 'marble' | 'terrazzo' | 'metal' | 'paint' | 'brass' | 'plastic' | 'wood' | 'rubber' | 'tile' | 'worn' | 'dirt'
let seed = 17
function random() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
function texture(kind: Finish) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256
  const c = canvas.getContext('2d')!
  const bases: Record<Finish, string> = { concrete: '#98958b', plaster: '#d1cbbb', damp: '#c1bfad', marble: '#aba18a', terrazzo: '#a6a094', metal: '#aeb5b5', paint: '#596b66', brass: '#bda36b', plastic: '#c0b9a2', wood: '#67513b', rubber: '#292c2b', tile: '#c7ccc2', worn: '#718075', dirt: '#706959' }
  c.fillStyle = bases[kind]; c.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 16000; i++) {
    const v = random() > .5 ? 255 : 12
    c.fillStyle = `rgba(${v},${v},${v},${random() * .09})`
    const x = random() * 256, y = random() * 256
    c.fillRect(x, y, kind === 'metal' || kind === 'brass' ? random() * 48 : 1.5, .7)
  }
  if (kind === 'terrazzo') for (let i = 0; i < 2300; i++) {
    c.fillStyle = ['#d9d3c4', '#504c46', '#8a7966', '#bab5a8'][i % 4]
    const x = random() * 256, y = random() * 256, r = 1 + random() * 2.6
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + r, y - r); c.lineTo(x + r * 1.8, y + r); c.lineTo(x, y + r); c.fill()
  }
  if (kind === 'marble') {
    const data = c.getImageData(0, 0, 256, 256)
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const turbulence = Math.sin(x * .024 + Math.sin(y * .04)) * 1.8 + Math.sin(y * .064 + x * .035) * .36 + Math.sin(x * .14 + y * .11) * .13
      const vein = Math.pow(1 - Math.abs(Math.sin(x * .027 + y * .018 + turbulence)), 14)
      const cloud = Math.sin(x * .025 + y * .041) * 3
      const i = (y * 256 + x) * 4
      for (let channel = 0; channel < 3; channel++) data.data[i + channel] = data.data[i + channel] - vein * 25 + cloud
    }
    c.putImageData(data, 0, 0)
  }
  if (kind === 'wood') for (let j = 0; j < 50; j++) {
    c.strokeStyle = `rgba(30,24,18,${.03 + random() * .1})`; c.lineWidth = .3 + random() * .6; c.beginPath()
    for (let x = 0; x <= 256; x += 4) {
      const y = j * 5.2 + Math.sin(x / 70 + j) * 5
      if (!x) c.moveTo(x, y); else c.lineTo(x, y)
    } c.stroke()
  }
  if (['damp', 'worn', 'dirt', 'concrete', 'plaster'].includes(kind)) for (let i = 0; i < 36; i++) {
    const x = random() * 256, y = random() * 256, r = 10 + random() * 60
    const g = c.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(48,45,29,${kind === 'damp' ? .055 : .018})`); g.addColorStop(1, 'rgba(48,45,29,0)')
    c.fillStyle = g; c.fillRect(0, 0, 256, 256)
  }
  if (kind === 'tile') {
    c.strokeStyle = '#777b70'; c.lineWidth = 2
    for (let i = 0; i <= 256; i += 64) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, 256); c.moveTo(0, i); c.lineTo(256, i); c.stroke() }
  }
  const map = new CanvasTexture(canvas); map.wrapS = map.wrapT = RepeatWrapping; map.colorSpace = SRGBColorSpace; map.anisotropy = 4
  return map
}
function finish(kind: Finish, roughness: number, metalness = 0) {
  const map = texture(kind)
  // Bump data is linear, unlike albedo; share the underlying canvas, not color-space metadata.
  const bump = map.clone(); bump.colorSpace = ''; bump.needsUpdate = true
  return new MeshStandardMaterial({ map, roughness, metalness, bumpMap: bump, bumpScale: ['metal', 'brass', 'marble'].includes(kind) ? .003 : .012 })
}
export const palette = {
  concrete: finish('concrete', .94), plaster: finish('plaster', .93), damp: finish('damp', .98),
  marble: finish('marble', .29), terrazzo: finish('terrazzo', .52), metal: finish('metal', .31, .82),
  paint: finish('paint', .65, .25), brass: finish('brass', .34, .76), plastic: finish('plastic', .65),
  wood: finish('wood', .58), rubber: finish('rubber', .98), tile: finish('tile', .38),
  worn: finish('worn', .8), dirt: finish('dirt', .99),
  dark: new MeshStandardMaterial({ color: '#141b1c', roughness: .75 }),
  ochre: new MeshStandardMaterial({ color: '#94734c', roughness: .96 }),
  red: new MeshStandardMaterial({ color: '#9f3129', roughness: .43, metalness: .25 }),
  glass: new MeshStandardMaterial({ color: '#9eaca6', transparent: true, opacity: .15, roughness: .14, metalness: .45, depthWrite: false }),
  light: new MeshStandardMaterial({ color: '#dbe8db', emissive: '#dbe8db', emissiveIntensity: 2.2 }),
  warm: new MeshStandardMaterial({ color: '#edcf95', emissive: '#ffc778', emissiveIntensity: 1.7 }),
}
export type MaterialName = keyof typeof palette
