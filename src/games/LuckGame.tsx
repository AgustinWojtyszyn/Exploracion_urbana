import type { CabalaGameId } from '../world/Architecture'
import { GameScene } from './shared/GameScene'
import { CoinGame } from './luck/CoinGame'
import { StadiumGame } from './luck/StadiumGame'
import { CupsGame } from './luck/CupsGame'
import { HigherLowerGame } from './luck/HigherLowerGame'
import { WheelGame } from './luck/WheelGame'
/** Legacy save IDs remain valid; retired rituals route to the new five scenes. */
const aliases:Record<CabalaGameId,'coin'|'stadium'|'cups'|'higher'|'wheel'>={'coin-run':'coin','tower':'stadium','three-cups':'cups','higher-lower':'higher','wheel':'wheel','dice-seven':'wheel','lucky-number':'stadium','lucky-shirt':'stadium','grid-reveal':'cups','boots':'coin'}
const scenes={coin:{Component:CoinGame,title:'Moneda de vestuario',instruction:'ELEGÍ TU CARA · LANZÁ TRES VECES'},stadium:{Component:StadiumGame,title:'La tribuna',instruction:'TOCÁ EL SECTOR QUE TE LLAMA'},cups:{Component:CupsGame,title:'Los tres vasos',instruction:'SEGUÍ LA PELOTA DURANTE LA MEZCLA'},higher:{Component:HigherLowerGame,title:'El pálpito',instruction:'MAYOR O MENOR · TRES PREDICCIONES'},wheel:{Component:WheelGame,title:'Rueda del destino',instruction:'GIRÁ Y DEJÁ QUE EL DESTINO HABLE'}}
export function LuckGame({game,onComplete,forced=false,onBack}:{game:CabalaGameId;onComplete:(won:boolean,score:number)=>void;forced?:boolean;onBack?:()=>void}) {
  const scene=aliases[game]??'coin', {Component,title,instruction}=scenes[scene]
  return <GameScene key={game} id={scene} mode="luck" title={title} instruction={instruction} onBack={onBack} forced={forced} onComplete={score=>onComplete(score>=60,score)}>{finish=><Component onFinish={finish}/>}</GameScene>
}
