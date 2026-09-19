import { Atmosphere } from '../environment/Atmosphere'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { ACESFilmicToneMapping } from 'three'
import { Suspense } from 'react'
import { Tower17World } from '../world/Tower17World'
import { ExplorerRig } from '../player/ExplorerRig'
import { InteractionSystem } from '../interactions/InteractionSystem'
import { ZoneAudio } from '../audio/ZoneAudio'

export function GameCanvas() {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.65, 8.7], fov: 58, near: 0.05, far: 180 }}
        gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
      >
        <color attach="background" args={['#080a0b']} />
        <fog attach="fog" args={['#080a0b', 24, 65]} />
        <Suspense fallback={null}>
          <Physics gravity={[0, -18, 0]}>
            <Tower17World />
            <ExplorerRig />
            <InteractionSystem />
            <Atmosphere />
          </Physics>
        </Suspense>
      </Canvas>
      <ZoneAudio />
    </>
  )
}
