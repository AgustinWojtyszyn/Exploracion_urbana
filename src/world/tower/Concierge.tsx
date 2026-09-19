import { Block, Sign, type Vec3 } from '../Architecture'
import { Interactable } from '../../interactions/Interactable'
import { useBuildingStore } from '../../systems/buildingStore'
import { useSessionStore } from '../../systems/sessionStore'
import { CctvMonitor } from '../../cctv/CctvMonitor'
import { Repeated, SecurityCamera } from './BuildingProps'
const notify = (text: string) => useSessionStore.getState().notify(text)
export function Concierge() {
  return <>
    <Block position={[-3.85, .43, 3.8]} size={[3.25, .86, 1.1]} material="wood" />
    <Block position={[-3.85, .9, 3.8]} size={[3.45, .09, 1.25]} material="marble" />
    <Block position={[-3.85, .1, 4.38]} size={[3.25, .16, .035]} material="dark" solid={false} />
    <Block position={[-3.85, 1.7, 2]} size={[3.3, 3.4, .12]} material="plaster" />
    <Sign position={[-3.85, 2.73, 4.43]} width={2.65} height={.3} lines={['P O R T E R Í A']} />
    <Repeated items={[-5.45, -2.2].map(x => [x, 1.85, 4.4])} size={[.045, 1.8, .05]} material="brass" />
    <Block position={[-3.85, 2.45, 4.4]} size={[3.25, .68, .018]} material="glass" solid={false} />
    <Block position={[-3.85, 2.1, 4.4]} size={[3.3, .035, .05]} material="brass" solid={false} />
    <Interactable interaction={{ label: () => 'Revisar cámaras', perform: () => useBuildingStore.getState().inspectCameras() }}><CctvMonitor /></Interactable>
    <Interactable interaction={{ label: () => 'Leer libro de novedades', perform: () => {
      useBuildingStore.getState().readLog()
      notify('01:54 · 6 B: «El ascensor B no baja. Se escucha el motor». Revisar cámaras y probar la llamada en PB.')
    } }}>
      <Block position={[-4.63, .974, 4.13]} size={[.62, .045, .43]} material="dark" solid={false} />
      <Sign position={[-4.63, 1, 4.13]} rotation={[-Math.PI / 2, 0, 0]} width={.58} height={.39} paper lines={['NOVEDADES · NOCHE', '024 / 01:54 / 6 B', 'ASCENSOR B DETENIDO', '023 / humedad en bombas', '022 / luz escalera 3 A']} />
    </Interactable>
    <Block position={[-2.5, .99, 4.1]} size={[.36, .09, .24]} material="plastic" solid={false} />
    <Block position={[-2.5, 1.06, 4.1]} size={[.39, .07, .09]} material="dark" solid={false} />
    <Repeated items={Array.from({ length: 12 }, (_, i) => [-2.6 + i % 3 * .055, 1.04, 4.14 + Math.floor(i / 3) * .027] as Vec3)} size={[.032, .015, .015]} material="dark" />
    <Block position={[-3.42, .97, 4.28]} size={[.68, .025, .22]} material="plastic" solid={false} />
    <Repeated items={Array.from({ length: 36 }, (_, i) => [-3.71 + i % 12 * .053, .988, 4.22 + Math.floor(i / 12) * .05] as Vec3)} size={[.042, .012, .035]} material="dark" />
    <Block position={[-3.6, .48, 2.9]} size={[.46, .09, .45]} material="rubber" solid={false} />
    <Block position={[-3.6, .81, 2.68]} size={[.46, .56, .06]} material="rubber" solid={false} />
    <Repeated items={[[-3.78, .23, 2.75], [-3.42, .23, 2.75], [-3.78, .23, 3.07], [-3.42, .23, 3.07]]} size={[.025, .46, .025]} material="metal" />
    <Block position={[-4.7, 1.8, 2.09]} size={[.75, .9, .04]} material="wood" solid={false} />
    <Repeated items={Array.from({ length: 12 }, (_, i) => [-4.95 + i % 4 * .17, 1.56 + Math.floor(i / 4) * .23, 2.14] as Vec3)} size={[.024, .12, .022]} material="brass" />
    <Sign position={[-3.15, 2.04, 2.08]} width={.84} height={.67} paper lines={['RELEVO · 06:00', 'BOMBAS: automático', 'NO PUENTEAR TÉRMICAS', 'Guardia: interno 100']} />
    <SecurityCamera position={[-5.15, 3, 7]} rotation={[.25, 1, 0]} />
    <group position={[5.4, 0, 5.2]} rotation={[0, -Math.PI / 2, 0]}>
      <Block position={[0, 1.48, 0]} size={[2.6, 1.4, .1]} material="dark" solid={false} />
      <Repeated items={Array.from({ length: 24 }, (_, i) => [-1.05 + i % 6 * .42, 1 + Math.floor(i / 6) * .32, .07] as Vec3)} size={[.4, .3, .08]} material="brass" />
      <Repeated items={Array.from({ length: 24 }, (_, i) => [-1.05 + i % 6 * .42, 1.07 + Math.floor(i / 6) * .32, .117] as Vec3)} size={[.26, .018, .008]} material="dark" />
      <Sign position={[0, 2.45, .07]} width={2.5} height={.25} lines={['CORRESPONDENCIA · A / B / C']} />
    </group>
    <Block position={[-5, .23, 5.25]} size={[.66, .46, .53]} material="ochre" />
    <Block position={[-4.95, .54, 5.22]} size={[.48, .15, .36]} material="plastic" solid={false} />
    <Sign position={[-5, .27, 5.523]} width={.32} height={.17} paper lines={['8° A', 'ENTREGAR']} />
  </>
}
