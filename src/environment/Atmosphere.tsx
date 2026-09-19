import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { useSessionStore } from '../systems/sessionStore'

// Existing Three addons: no postprocessing dependency. AO at half resolution;
// Q disables the additional normal/depth pass on slower machines.
export function Atmosphere() {
  const { gl, scene, camera, size } = useThree()
  const enhanced = useSessionStore(s => s.enhanced)
  const pipeline = useMemo(() => {
    const composer = new EffectComposer(gl)
    composer.renderTarget1.samples = 2; composer.renderTarget2.samples = 2
    const render = new RenderPass(scene, camera)
    const ao = new SSAOPass(scene, camera, 512, 512, 12)
    ao.kernelRadius = .28; ao.minDistance = .0003; ao.maxDistance = .012
    const output = new OutputPass()
    composer.addPass(render); composer.addPass(ao); composer.addPass(output)
    return { composer, render, ao, output }
  }, [gl, scene, camera])
  useEffect(() => {
    pipeline.composer.setPixelRatio(Math.min(gl.getPixelRatio(), 1.5))
    pipeline.composer.setSize(size.width, size.height)
    pipeline.ao.setSize(Math.ceil(size.width * .65), Math.ceil(size.height * .65))
  }, [pipeline, size, gl])
  useEffect(() => () => { pipeline.composer.dispose(); pipeline.ao.dispose(); pipeline.output.dispose(); pipeline.render.dispose() }, [pipeline])
  useFrame((_, dt) => {
    if (enhanced) pipeline.composer.render(dt)
    else gl.render(scene, camera)
  }, 1)
  return null
}
