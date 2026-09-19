import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Raycaster, Vector2, type Object3D } from 'three'
import type { Interaction } from './Interactable'
import { useSessionStore } from '../systems/sessionStore'

export function InteractionSystem() {
  const { camera, scene } = useThree()
  const ray = useRef(new Raycaster())
  const center = useRef(new Vector2())
  const target = useRef<Interaction | null>(null)
  const elapsed = useRef(0)
  const scan = () => {
    const state = useSessionStore.getState()
    target.current = null
    if (state.locked && !state.journalOpen) {
      ray.current.setFromCamera(center.current, camera); ray.current.far = 2.8
      // First opaque surface wins: clues cannot be read through walls.
      const hit = ray.current.intersectObjects(scene.children, true).find(h => !h.object.userData.ignoreInteraction)
      let object: Object3D | null = hit?.object ?? null
      while (object) {
        if (object.userData.interaction) { target.current = object.userData.interaction as Interaction; break }
        object = object.parent
      }
    }
    const prompt = target.current?.label() ?? ''
    if (state.prompt !== prompt) useSessionStore.setState({ prompt })
  }
  useFrame((_, dt) => { elapsed.current += dt; if (elapsed.current > 0.08) { scan(); elapsed.current = 0 } })
  useEffect(() => {
    const interact = (event: KeyboardEvent) => {
      if (event.code !== 'KeyE' || event.repeat) return
      scan(); target.current?.perform()
    }
    window.addEventListener('keydown', interact)
    return () => window.removeEventListener('keydown', interact)
  })
  return null
}
