import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Suspense } from 'react'
import { PrototypeWorld } from '../world/PrototypeWorld'
import { ExplorerRig } from '../player/ExplorerRig'

const controls = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'interact', keys: ['KeyE'] },
  { name: 'map', keys: ['KeyM', 'Tab'] },
]

export function GameCanvas() {
  return (
    <KeyboardControls map={controls}>
      <Canvas
        shadows
        camera={{ position: [0, 2.4, 6], fov: 52, near: 0.05, far: 350 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#0b0d0f']} />
        <fog attach="fog" args={['#0b0d0f', 18, 75]} />

        <Suspense fallback={null}>
          <Physics gravity={[0, -18, 0]}>
            <PrototypeWorld />
            <ExplorerRig />
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}
