import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Suspense } from 'react'
import { PrototypeWorld } from '../world/PrototypeWorld'
import { ExplorerRig } from '../player/ExplorerRig'
import { InteractionSystem } from '../interactions/InteractionSystem'
import { ZoneAudio } from '../audio/ZoneAudio'

export function GameCanvas() {
  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1, 18], fov: 65, near: 0.05, far: 350 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#0b0d0f']} />
        <fog attach="fog" args={['#0b0d0f', 28, 125]} />

        <Suspense fallback={null}>
          <Physics gravity={[0, -18, 0]}>
            <PrototypeWorld />
            <ExplorerRig />
            <InteractionSystem />
          </Physics>
        </Suspense>
      </Canvas>
      <ZoneAudio />
    </>
  )
}
