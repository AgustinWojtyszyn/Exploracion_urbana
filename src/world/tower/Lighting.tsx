import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import type { PointLight, SpotLight } from 'three'
import { invalidateShadows, shadowRevision } from '../../environment/shadows'
import { Block, Tube } from '../Architecture'
export function Lighting() {
  const keyLight = useRef<SpotLight>(null)
  const cachedRevision = useRef(-1)
  useEffect(invalidateShadows, [])
  const service = useRef<PointLight>(null)
  useFrame(({ clock }) => {
    if (keyLight.current && cachedRevision.current !== shadowRevision) {
      keyLight.current.shadow.needsUpdate = true
      cachedRevision.current = shadowRevision
    }
    if (service.current) service.current.intensity = Math.sin(clock.elapsedTime * .7) > .994 ? .8 : 6
  })
  return <>
    <hemisphereLight args={['#c2cfcd', '#574c3c', .4]} />
    <ambientLight intensity={.09} color="#b5bdb1" />
    <Environment resolution={64} frames={1} environmentIntensity={.35}>
      <Lightformer position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[9, 12, 1]} intensity={1.3} color="#c4d3ce" />
      <Lightformer position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[2, 12, 1]} intensity={.65} color="#cdb78e" />
      <Lightformer position={[0, 2, 10]} scale={[8, 3, 1]} intensity={1.8} color="#859eb5" />
    </Environment>
    {[6, .5, -5.8].map(z => <group key={z}>
      <Block position={[0, 3.27, z]} size={[2.5, .13, .48]} material="metal" solid={false} />
      <Tube position={[0, 3.19, z - .13]} /><Tube position={[0, 3.19, z + .13]} />
      <pointLight position={[0, 2.95, z]} intensity={19} distance={9} decay={2} color="#d5e1d8" />
    </group>)}
    <spotLight ref={keyLight} shadow-autoUpdate={false} shadow-needsUpdate position={[-.8, 3.1, 4]} target-position={[-2.7, 0, 1]} intensity={55} angle={1.1} penumbra={.8} color="#d4ded5" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-.0002} shadow-normalBias={.03} />
    <pointLight position={[-4, 2.4, 3.3]} intensity={9} distance={4.5} color="#edbc79" />
    <Block position={[-4, 2.83, 3.3]} size={[.8, .045, .3]} material="warm" solid={false} />
    <pointLight position={[0, 2, 9.5]} intensity={21} distance={7} color="#829fbc" />
    <pointLight position={[-.5, 2.65, -8.35]} intensity={14} distance={5} color="#e4c18a" />
    <pointLight ref={service} position={[4.7, 2.7, -7]} intensity={6} distance={5} color="#a1bdad" />
    <Tube position={[4.7, 2.9, -7]} rotation={[0, Math.PI / 2, 0]} />
  </>
}
