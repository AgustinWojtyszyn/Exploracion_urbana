import { Block, Sign, Tube } from '../Architecture'
import { Interactable } from '../../interactions/Interactable'
import { useExplorationStore } from '../../systems/explorationStore'
import { useSessionStore } from '../../systems/sessionStore'
import { evidence } from '../../data/discoveries'

export function Maintenance() {
  const open = useExplorationStore(s => s.accessOpen)
  return <>
    <Block position={[-12, -0.25, -26]} size={[12, 0.5, 12]} />
    <Block position={[-12, 1.75, -19.8]} size={[12, 3.5, 0.4]} />
    <Block position={[-18, 1.75, -26]} size={[0.4, 3.5, 12]} />
    <Block position={[-12, 3.5, -26]} size={[12, 0.3, 12]} material="dark" />
    <Block position={[-8.5, 1.75, -32]} size={[5, 3.5, 0.4]} />
    <Block position={[-17.5, 1.75, -32]} size={[1, 3.5, 0.4]} />
    <Block position={[-14, 3.15, -32]} size={[6, 0.7, 0.4]} />
    <Block position={[-12, 1.2, -24]} size={[0.4, 2.4, 7]} material="metal" />
    <Block position={[-17.7, 0.7, -24]} size={[0.16, 0.09, 8]} material="tile" solid={false} />
    <Sign position={[-12.25, 2.7, -28]} rotation={[0, -Math.PI / 2, 0]} lines={['SECTOR TÉCNICO', 'TABLEROS / BOMBAS']} />
    <Interactable interaction={{ label: () => 'Leer el tablero eléctrico', perform: () => {
      useExplorationStore.getState().recordDiscovery(evidence.power)
      useSessionStore.getState().notify('El circuito inferior sigue alimentado. Copié las referencias. [M] Registro')
    } }}>
      <Block position={[-17.65, 1.6, -28]} size={[0.35, 1.8, 2]} material="metal" />
      <Sign position={[-17.46, 1.65, -28]} rotation={[0, Math.PI / 2, 0]} width={1.8} height={1.5} paper lines={['ALIMENTACIÓN / 220 V', '03 BOLETERÍA · OFF', '08 GALERÍA · OFF', '14 INFERIOR · ACTIVO', 'ENCLAVAMIENTO MANUAL']} />
    </Interactable>
    {!open && <Block position={[-14, 1.4, -32]} size={[6, 2.8, 0.25]} material="metal" />}
    <Interactable interaction={{ label: () => open ? 'El enclavamiento está abierto' : 'Examinar el enclavamiento', perform: () => {
      const opened = useExplorationStore.getState().openAccess()
      useSessionStore.getState().notify(opened ? 'Circuito 14 aislado. El contrapeso libera el paso.' : 'Tres derivaciones, sin rótulo. Necesito reconstruir qué circuito alimenta este acceso. [M] Registro')
    } }}>
      <Block position={[-11.25, 1.4, -31.65]} size={[0.5, 0.65, 0.35]} material="ochre" />
      <Sign position={[-11.25, 1.4, -31.46]} width={0.46} height={0.55} lines={['03 08 14', open ? 'LIBRE' : 'AISLAR']} />
    </Interactable>
    <Sign position={[-14.5, 2.9, -31.76]} lines={['SERVICIO / ACCESO INFERIOR', 'NO OPERAR CON CARGA']} width={4} height={0.5} />
    <Tube position={[-9, 3.2, -25]} /><Tube position={[-15, 3.2, -28]} />
    <pointLight position={[-14, 2.9, -28]} intensity={42} distance={14} color="#d2d9b4" />
  </>
}
