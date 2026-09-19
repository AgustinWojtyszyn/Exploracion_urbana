import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, WebGLRenderTarget, Vector4, type Mesh } from 'three'
import { useBuildingStore } from '../systems/buildingStore'
import { Block, Sign } from '../world/Architecture'

export const feedLabels = ['01 · ACCESO', '02 · ASCENSORES', '03 · SERVICIOS', '08 · SIN SEÑAL']
export function CctvMonitor() {
  const screen = useRef<Mesh>(null)
  const time = useRef(0), index = useRef(0)
  const target = useMemo(() => new WebGLRenderTarget(640, 360, { depthBuffer: true }), [])
  const cameras = useMemo(() => [
    { p: [-4.9, 3, 6], t: [0, 1, 10] }, { p: [-3, 3, -4], t: [0, 1.3, -8.8] },
    { p: [4.8, 2.9, -3.4], t: [4.7, 1, -10] }, { p: [30, 2.2, 2], t: [30, 1.4, -6] },
  ].map(({ p, t }) => { const c = new PerspectiveCamera(64, 320 / 180, .1, 45); c.position.set(p[0], p[1], p[2]); c.lookAt(t[0], t[1], t[2]); return c }), [])
  const pixels = useMemo(() => new Uint8Array(640 * 360 * 4), [])
  const flipped = useMemo(() => new Uint8ClampedArray(640 * 360 * 4), [])
  const viewport = useMemo(() => new Vector4(), [])
  const scissor = useMemo(() => new Vector4(), [])
  useEffect(() => () => target.dispose(), [target])
  useFrame(({ gl, scene, clock }, dt) => {
    time.current += dt
    if (time.current < .25 || !screen.current) return
    time.current = 0
    const i = index.current++ % 4, anomaly = useBuildingStore.getState().anomaly17Visible
    const previous = gl.getRenderTarget(), auto = gl.autoClear, scissorTest = gl.getScissorTest(), shadows = gl.shadowMap.autoUpdate
    gl.getViewport(viewport); gl.getScissor(scissor)
    screen.current.visible = false
    gl.shadowMap.autoUpdate = false
    // Render-target rectangles are physical pixels. Renderer.setViewport would
    // multiply by canvas DPR and crop feeds on Retina/high-DPI displays.
    target.viewport.set((i % 2) * 320, i < 2 ? 180 : 0, 320, 180)
    target.scissor.copy(target.viewport); target.scissorTest = true
    gl.setRenderTarget(target)
    if (i === 3 && (!anomaly || Math.sin(clock.elapsedTime * .43) > .985)) gl.clear(); else gl.render(scene, cameras[i])
    if (useBuildingStore.getState().cctvOpen) {
      const canvas = document.getElementById('cctv-feed') as HTMLCanvasElement | null
      if (canvas) {
        gl.readRenderTargetPixels(target, 0, 0, 640, 360, pixels)
        for (let y = 0; y < 360; y++) flipped.set(pixels.subarray(y * 2560, (y + 1) * 2560), (359 - y) * 2560)
        canvas.getContext('2d')?.putImageData(new ImageData(flipped, 640, 360), 0, 0)
      }
    }
    gl.setRenderTarget(previous); gl.setViewport(viewport); gl.setScissor(scissor); gl.setScissorTest(scissorTest)
    gl.autoClear = auto; gl.shadowMap.autoUpdate = shadows; screen.current.visible = true
  })
  return <>
    <Block position={[-3.45, 1.48, 4.27]} size={[1.48, .88, .12]} material="dark" solid={false} />
    <mesh ref={screen} position={[-3.45, 1.48, 4.339]}><planeGeometry args={[1.35, .76]} /><meshBasicMaterial map={target.texture} toneMapped={false} /></mesh>
    <Block position={[-3.45, 1.03, 4.22]} size={[.09, .26, .09]} material="metal" solid={false} />
    <Block position={[-3.45, .94, 4.3]} size={[.48, .025, .3]} material="dark" solid={false} />
    <Sign position={[-3.45, 1.01, 4.36]} width={.58} height={.07} lines={['VIGÍA · DVR / 2009']} />
  </>
}
