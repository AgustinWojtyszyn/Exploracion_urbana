import { Block, Sign, Tube } from '../Architecture'
import { Interactable } from '../../interactions/Interactable'
import { useExplorationStore } from '../../systems/explorationStore'
import { useSessionStore } from '../../systems/sessionStore'
import { evidence } from '../../data/discoveries'

const readPlan = {
  label: () => 'Examinar el plano ferroviario',
  perform: () => { useExplorationStore.getState().recordDiscovery(evidence.plan); useSessionStore.getState().notify('Plano copiado. Hay una línea debajo de la cota cero. [M] Registro') },
}
export function numberInteraction(id: string) {
  return { label: () => 'Registrar la numeración', perform: () => {
    useExplorationStore.getState().observeMark(id)
    useSessionStore.getState().notify(useExplorationStore.getState().observedMarkIds.length === 2
      ? 'La misma plantilla. El mismo número, en dos lugares. [M] Registro' : '14, subrayado. Lo anoté en el cuaderno.')
  } }
}
export function Station() {
  return <>
    <Block position={[0, -0.85, 18]} size={[12, 0.5, 8]} />
    <Block position={[0, -0.25, -9]} size={[12, 0.5, 46]} />
    {[0, 1, 2, 3].map(i => <Block key={i} position={[0, -0.6 + (i + 1) * 0.075, 15.75 - i * 0.5]} size={[12, (i + 1) * 0.15, 0.5]} />)}
    <Block position={[0, 2, 22]} size={[12, 5, 0.4]} material="metal" />
    <Sign position={[0, 2.1, 21.77]} rotation={[0, Math.PI, 0]} lines={['ACCESO PRINCIPAL', 'CERRADO · 23:40 — 05:10']} />
    <Block position={[-6.2, 2, 1]} size={[0.4, 5, 42]} />
    <Block position={[-6.2, 2, -28]} size={[0.4, 5, 8]} />
    <Block position={[6.2, 2, 10]} size={[0.4, 5, 24]} />
    <Block position={[6.2, 2, -27]} size={[0.4, 5, 10]} />
    <Block position={[0, 2, -32]} size={[12, 5, 0.4]} />
    <Block position={[0, 4.5, -7]} size={[12.4, 0.22, 37]} material="dark" />
    <Sign position={[0, 3.3, -31.76]} width={5} height={1} lines={['ESTACIÓN ARROYO', 'LÍNEA CERO · ANDÉN 2']} />
    <Sign position={[-3.7, 2.4, 5]} width={3.4} lines={['MUNICIPIO DE ARROYO', 'Conservar también es cuidar.']} />
    <Interactable interaction={readPlan}>
      <Block position={[-4.8, 1.55, -4]} size={[1.8, 1.5, 0.16]} material="metal" />
      <Sign position={[-4.8, 1.55, -3.9]} width={1.65} height={1.35} paper lines={['FERROCARRIL / SECCIÓN B', 'ANDÉN ━━━━━ COTA 0', '┊  SERVICIO 14', '└ ┄ ┄ ┄ ┄ COTA −6', 'DESTINO: ▒▒▒▒▒▒']} />
    </Interactable>
    <Interactable interaction={numberInteraction('platform')}>
      <Block position={[3.8, 1.65, -12]} size={[0.6, 3.3, 0.6]} />
      <Sign position={[3.8, 1.6, -11.69]} width={0.5} height={0.65} paper lines={['14', '━━']} />
    </Interactable>
    {[-3, -15, -27].map(z => <group key={z}>
      <Tube position={[0, 4.3, z]} /><pointLight position={[0, 3.9, z]} intensity={40} distance={17} color="#c1d9ca" />
      <Block position={[-5.6, 0.95, z]} size={[0.18, 1.8, 6]} material="tile" />
      <Block position={[4.8, 0.04, z]} size={[0.14, 0.025, 9]} material="ochre" solid={false} />
    </group>)}
    <Block position={[0, 0.45, -19]} size={[3, 0.16, 0.65]} material="metal" />
    {[-1, 1].map(x => <Block key={x} position={[x, 0.2, -19]} size={[0.12, 0.4, 0.5]} material="metal" />)}
    <Sign position={[-5.96, 2.7, -20]} rotation={[0, Math.PI / 2, 0]} lines={['← MANTENIMIENTO', 'PERSONAL AUTORIZADO']} />
    <Sign position={[5.95, 2.7, -1]} rotation={[0, -Math.PI / 2, 0]} lines={['GALERÍA SAN JORGE →', 'SALIDA POR ANDÉN']} />
    {/* Rails survive beneath the end wall; the city carries on outside this sector. */}
    {[-2, 2].map(x => <Block key={x} position={[x, 0.06, -29]} size={[0.08, 0.12, 5]} material="metal" solid={false} />)}
  </>
}
