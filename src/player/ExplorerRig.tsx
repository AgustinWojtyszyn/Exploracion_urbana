import { CapsuleCollider, RigidBody } from '@react-three/rapier'
import { PointerLockControls } from '@react-three/drei'

export function ExplorerRig() {
  return (
    <>
      <RigidBody
        name="player"
        colliders={false}
        enabledRotations={[false, false, false]}
        position={[0, 1.2, 5]}
        friction={0}
      >
        <CapsuleCollider args={[0.55, 0.35]} />
      </RigidBody>

      <PointerLockControls />
    </>
  )
}
