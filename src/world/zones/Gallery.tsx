import { Block, Sign, Tube } from '../Architecture'
import { Interactable } from '../../interactions/Interactable'
import { numberInteraction } from './Station'

export function Gallery() {
  return <>
    <Block position={[10, -0.25, -12]} size={[8, 0.5, 20]} />
    <Block position={[14, 1.75, -12]} size={[0.4, 3.5, 20]} material="tile" />
    <Block position={[10, 1.75, -2]} size={[8, 3.5, 0.4]} />
    <Block position={[10, 1.75, -22]} size={[8, 3.5, 0.4]} />
    <Block position={[10, 3.5, -12]} size={[8, 0.2, 20]} material="dark" />
    {['REPARACIONES / RADIO · TV', 'MERCERÍA EL HILO', 'KIOSCO SAN JORGE'].map((name, i) => <group key={name}>
      <Block position={[13.72, 1.3, -5 - i * 6]} size={[0.12, 2.4, 4.5]} material="metal" />
      <Sign position={[13.63, 2.85, -5 - i * 6]} rotation={[0, -Math.PI / 2, 0]} width={4.5} height={0.6} lines={[name]} />
    </group>)}
    <Interactable interaction={numberInteraction('gallery')}>
      <Sign position={[10.5, 1.5, -21.77]} width={0.7} height={0.9} paper lines={['14', '━━']} />
    </Interactable>
    <Sign position={[10, 2.7, -21.76]} lines={['NO ANULAR VENTILACIÓN', 'El motor funciona de noche.']} width={3.5} />
    <Tube position={[10, 3.25, -8]} /><pointLight position={[10, 2.9, -10]} intensity={36} distance={16} color="#e7c28a" />
    <Block position={[11.5, 0.5, -20]} size={[1.2, 1, 0.7]} material="dark" />
  </>
}
