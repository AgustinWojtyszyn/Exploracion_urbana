import { useFrame } from '@react-three/fiber'
import { useBuildingStore } from '../systems/buildingStore'
import { useSessionStore } from '../systems/sessionStore'

export function BuildingDirector() {
  useFrame((_, dt) => {
    const session = useSessionStore.getState()
    if (session.locked && !useBuildingStore.getState().cctvOpen) useBuildingStore.getState().tick(Math.min(dt, .1))
  })
  return null
}
