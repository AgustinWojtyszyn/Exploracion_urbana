import { listenerPose, requestSound } from '../audio/soundscape'
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { CapsuleCollider, RigidBody, useBeforePhysicsStep, useRapier, type RapierRigidBody } from '@react-three/rapier'
import { Vector3 } from 'three'
import { useSessionStore } from '../systems/sessionStore'
import { useBuildingStore } from '../systems/buildingStore'

const spawn = { x: 0, y: 0.9, z: 8.7 }

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
  const gait = useRef(0)
  const bob = useRef(0)
  const step = useRef(0)
  const controller = useRef<ReturnType<typeof world.createCharacterController> | null>(null)
  const cctvOpen = useBuildingStore(s => s.cctvOpen)
  const setLocked = useSessionStore(s => s.setLocked)

  useEffect(() => {
    const c = world.createCharacterController(0.015)
    c.enableAutostep(0.28, 0.16, false)
    c.enableSnapToGround(0.35)
    c.setMaxSlopeClimbAngle(Math.PI / 4)
    controller.current = c
    useSessionStore.getState().setReady()

    const down = (e: KeyboardEvent) => {
      const target = e.target
      if (target instanceof HTMLElement && (target.matches('input, textarea, select') || target.isContentEditable)) return
      if (useSessionStore.getState().locked) keys.current.add(e.code)
    }
    const up = (e: KeyboardEvent) => keys.current.delete(e.code)
    const clear = () => { keys.current.clear(); velocity.current.set(0, 0, 0) }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    document.addEventListener('pointerlockchange', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
      document.removeEventListener('pointerlockchange', clear)
      world.removeCharacterController(c)
    }
  }, [world])

  useBeforePhysicsStep(() => {
    const b = body.current, c = controller.current
    if (!b || !c) return
    const dt = Math.min(world.timestep, 1 / 30)
    const active = useSessionStore.getState().locked && !useBuildingStore.getState().cctvOpen
    const k = keys.current
    camera.getWorldDirection(forward.current)
    forward.current.y = 0
    forward.current.normalize()
    right.current.crossVectors(forward.current, camera.up).normalize()
    const z = active ? Number(k.has('KeyW') || k.has('ArrowUp')) - Number(k.has('KeyS') || k.has('ArrowDown')) : 0
    const x = active ? Number(k.has('KeyD') || k.has('ArrowRight')) - Number(k.has('KeyA') || k.has('ArrowLeft')) : 0
    desired.current.copy(forward.current).multiplyScalar(z).addScaledVector(right.current, x).normalize().multiplyScalar(2.25)
    velocity.current.lerp(desired.current, 1 - Math.exp(-(x || z ? 9 : 18) * dt))
    vertical.current = c.computedGrounded() ? -0.4 : Math.max(-14, vertical.current - 18 * dt)
    c.computeColliderMovement(b.collider(0), { x: velocity.current.x * dt, y: vertical.current * dt, z: velocity.current.z * dt })
    const m = c.computedMovement(), p = b.translation()
    b.setNextKinematicTranslation({ x: p.x + m.x, y: p.y + m.y, z: p.z + m.z })
  })

  useFrame((_, dt) => {
    if (!body.current) return
    const p = body.current.translation()
    const speed = velocity.current.length()
    gait.current += Math.min(dt, .05) * speed * 3.5
    const stepIndex = Math.floor(gait.current / Math.PI)
    if (stepIndex !== step.current && speed > .3 && controller.current?.computedGrounded()) requestSound('step')
    step.current = stepIndex
    const targetBob = controller.current?.computedGrounded() ? Math.sin(gait.current * 2) * .012 * Math.min(speed / 2.25, 1) : 0
    bob.current += (targetBob - bob.current) * (1 - Math.exp(-12 * dt))
    camera.position.set(p.x, p.y + 0.76 + bob.current, p.z)
    listenerPose.position[0] = camera.position.x; listenerPose.position[1] = camera.position.y; listenerPose.position[2] = camera.position.z
    camera.getWorldDirection(forward.current)
    listenerPose.forward[0] = forward.current.x; listenerPose.forward[1] = forward.current.y; listenerPose.forward[2] = forward.current.z
    const zone = p.z < -5 && p.x < 3.5 ? 'ascensores' : p.x < -2 && p.z > 1 ? 'porteria' : p.x > 3.5 && p.z < -3 ? 'servicios' : 'lobby'
    if (useBuildingStore.getState().currentZone !== zone) useBuildingStore.getState().setZone(zone)
  })

  return <>
    <RigidBody ref={body} type="kinematicPosition" colliders={false} position={[spawn.x, spawn.y, spawn.z]}>
      <CapsuleCollider args={[0.55, 0.3]} />
    </RigidBody>
    <PointerLockControls enabled={!cctvOpen} selector="#enter-tower" onLock={() => setLocked(true)} onUnlock={() => setLocked(false)} />
  </>
}
