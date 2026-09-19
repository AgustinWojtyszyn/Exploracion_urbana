import { CuboidCollider, RigidBody } from '@react-three/rapier'

function Platform({
  position,
  scale,
}: {
  position: [number, number, number]
  scale: [number, number, number]
}) {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[scale[0] / 2, scale[1] / 2, scale[2] / 2]} position={position} />
      <mesh position={position} receiveShadow>
        <boxGeometry args={scale} />
        <meshStandardMaterial color="#343835" roughness={0.94} />
      </mesh>
    </RigidBody>
  )
}

export function PrototypeWorld() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 12, 4]} intensity={1.4} castShadow />

      <Platform position={[0, -0.5, 0]} scale={[24, 1, 42]} />
      <Platform position={[-8.5, 2.2, -7]} scale={[1, 5.4, 18]} />
      <Platform position={[8.5, 2.2, -7]} scale={[1, 5.4, 18]} />

      <mesh position={[0, 2.6, -15]} castShadow receiveShadow>
        <boxGeometry args={[10, 5, 1.2]} />
        <meshStandardMaterial color="#5b5a52" roughness={1} />
      </mesh>

      <mesh position={[0, 0.04, -6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 14]} />
        <meshStandardMaterial color="#202522" roughness={0.9} />
      </mesh>

      <pointLight position={[0, 3.1, -9]} intensity={32} distance={16} color="#e5d3aa" />
      <pointLight position={[6, 2.4, 2]} intensity={12} distance={10} color="#b9d7c8" />
    </>
  )
}
