import { Station } from './zones/Station'
import { Gallery } from './zones/Gallery'
import { Maintenance } from './zones/Maintenance'
import { Below } from './zones/Below'
import { StationDetails } from './StationDetails'

export function PrototypeWorld() {
  return <>
    <ambientLight intensity={0.35} color="#8eaaa9" />
    <directionalLight position={[8, 18, 10]} intensity={0.7} color="#b6c4d5" />
    <Station /><Gallery /><Maintenance /><Below /><StationDetails />
  </>
}
