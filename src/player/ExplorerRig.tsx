import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { CapsuleCollider, RigidBody, useBeforePhysicsStep, useRapier, type RapierRigidBody } from '@react-three/rapier'
import { Vector3 } from 'three'
import { useSessionStore } from '../systems/sessionStore'
import { useExplorationStore } from '../systems/explorationStore'

const spawn = { x: 0, y: 0.32, z: 18 }
export function ExplorerRig() {
  const body = useRef<RapierRigidBody>(null)
  const { world } = useRapier()
  const { camera } = useThree()
  const keys = useRef(new Set<string>())
  const velocity = useRef(new Vector3())
  const forward = useRef(new Vector3())
  const right = useRef(new Vector3())
  const desired = useRef(new Vector3())
  const vertical = useRef(0)
  const controller = useRef<ReturnType<typeof world.createCharacterController> | null>(null)
  const setLocked = useSessionStore(s => s.setLocked)

  useEffect(() => {
    const c = world.createCharacterController(0.015)
    c.enableAutostep(0.24, 0.15, false)
    c.enableSnapToGround(0.35)
    c.setMaxSlopeClimbAngle(Math.PI / 4)
    c.setMinSlopeSlideAngle(Math.PI / 3)
    controller.current = c
    useSessionStore.getState().setReady()
    const down = (e: KeyboardEvent) => {
      const target = e.target
      if (e.code !== 'Escape' && target instanceof HTMLElement && (target.matches('input, textarea, select') || target.isContentEditable)) return
      if (e.code === 'KeyM' && !e.repeat && useSessionStore.getState().started) {
        e.preventDefault(); useSessionStore.getState().toggleJournal()
      }
      if (e.code === 'Escape' && useSessionStore.getState().journalOpen) { e.preventDefault(); useSessionStore.getState().toggleJournal() }
      if (useSessionStore.getState().locked) { keys.current.add(e.code); if (e.code.startsWith('Arrow')) e.preventDefault() }
    }
    const up = (e: KeyboardEvent) => keys.current.delete(e.code)
    const clear = () => { keys.current.clear(); velocity.current.set(0, 0, 0) }
    window.addEventListener('keydown', down); window.addEventListener('keyup', up)
    window.addEventListener('blur', clear); document.addEventListener('pointerlockchange', clear)
    return () => {
      window.removeEventListener('keydown', down); window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear); document.removeEventListener('pointerlockchange', clear)
      world.removeCharacterController(c); controller.current = null
    }
  }, [world])

  useBeforePhysicsStep(() => {
    const b = body.current, c = controller.current
    if (!b || !c) return
    const dt = Math.min(world.timestep, 1 / 30)
    const active = useSessionStore.getState().locked && !useSessionStore.getState().journalOpen
    const k = keys.current
    camera.getWorldDirection(forward.current); forward.current.y = 0; forward.current.normalize()
    right.current.crossVectors(forward.current, camera.up).normalize()
    const z = active ? Number(k.has('KeyW') || k.has('ArrowUp')) - Number(k.has('KeyS') || k.has('ArrowDown')) : 0
    const x = active ? Number(k.has('KeyD') || k.has('ArrowRight')) - Number(k.has('KeyA') || k.has('ArrowLeft')) : 0
    desired.current.copy(forward.current).multiplyScalar(z).addScaledVector(right.current, x).normalize().multiplyScalar(2.5)
    velocity.current.lerp(desired.current, 1 - Math.exp(-12 * dt))
    vertical.current = c.computedGrounded() ? -0.5 : Math.max(-15, vertical.current - 18 * dt)
    c.computeColliderMovement(b.collider(0), { x: velocity.current.x * dt, y: vertical.current * dt, z: velocity.current.z * dt })
    const movement = c.computedMovement(), p = b.translation()
    if (p.y < -16) { b.setNextKinematicTranslation(spawn); vertical.current = 0; return }
    b.setNextKinematicTranslation({ x: p.x + movement.x, y: p.y + movement.y, z: p.z + movement.z })
  })
  useFrame(() => {
    if (!body.current) return
    const p = body.current.translation()
    camera.position.set(p.x, p.y + 0.68, p.z)
    const zone = p.y < -2 ? 'nodo-14' : p.x < -12 ? 'sector-tecnico' : p.x < -6 ? 'mantenimiento' : p.x > 6 ? 'galeria-san-jorge' : 'linea-cero-anden'
    const s = useExplorationStore.getState()
    if (s.currentZoneId !== zone) s.setCurrentZone(zone)
    if (p.z < -56 && p.y < -4 && !s.reachedBelow) { s.reachBelow(); s.markZoneMapped('nodo-14') }
  })
  return <>
    <RigidBody ref={body} type="kinematicPosition" colliders={false} position={[spawn.x, spawn.y, spawn.z]}>
      <CapsuleCollider args={[0.55, 0.3]} />
    </RigidBody>
    <PointerLockControls selector="#enter-station" onLock={() => setLocked(true)} onUnlock={() => setLocked(false)} />
  </>
}
