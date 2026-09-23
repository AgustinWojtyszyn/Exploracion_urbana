import type { MiniGameId } from '../world/Architecture'
import { GameScene,type FinishGame } from './shared/GameScene'
import { Actor,FootballPitch,FootballPlayerSprite } from './shared/FootballVisuals'
import { GameHUD,RoundFeedback } from './shared/GameFeedback'
import { useRounds } from '../hooks/useRounds'
type Scenario={context:string;options:Array<{label:string;score:number;reason:string}>}
const situations:Record<string,Scenario>={
  tactics:{context:'El rival adelanta su defensa. Tus extremos son más rápidos que sus centrales.',options:[{label:'Atacar la espalda',score:100,reason:'Usaste la velocidad en el espacio libre.'},{label:'Circular en corto',score:65,reason:'Conservaste la pelota; faltó profundidad.'},{label:'Enviar centros frontales',score:30,reason:'El rival defendió de frente.'}]},
  scouting:{context:'Buscás un juvenil para desarrollar, con poco presupuesto y dos años de margen.',options:[{label:'18 años · potencial 90 · OVR 61',score:100,reason:'Tiempo y proyección encajan con el proyecto.'},{label:'28 años · potencial 76 · OVR 75',score:55,reason:'Rinde ahora, pero casi no tiene margen.'},{label:'34 años · potencial 80 · OVR 72',score:25,reason:'Un contrato caro para una ventana corta.'}]},
  locker:{context:'Dos referentes discuten después de una derrota. El vestuario está dividido.',options:[{label:'Escucharlos en privado',score:100,reason:'Separaste el conflicto de la exposición pública.'},{label:'Dar descanso al plantel',score:60,reason:'Bajaste la tensión, pero sigue el conflicto.'},{label:'Culparlos ante la prensa',score:10,reason:'La exposición rompió la confianza.'}]},
  lineup:{context:'Tu lateral izquierdo está agotado. El rival ataca por esa banda.',options:[{label:'Lateral fresco + apoyo del volante',score:100,reason:'Protegiste el sector sin perder la estructura.'},{label:'Bajar a todo el equipo',score:65,reason:'Más cobertura, menos salida.'},{label:'Mantener la presión alta',score:20,reason:'El cansancio dejó el carril abierto.'}]},
  negotiation:{context:'Queda un año de contrato. El jugador quiere minutos y tu presupuesto es limitado.',options:[{label:'Rol titular + prima por objetivos',score:100,reason:'Alineaste su prioridad con un coste sostenible.'},{label:'Subir el fijo un 40%',score:55,reason:'Asegura continuidad, pero presiona la caja.'},{label:'Prometer fichajes sin presupuesto',score:10,reason:'La promesa no tiene respaldo.'}]},
}
function CoachTurn({scenario,onFinish}:{scenario:Scenario;onFinish:FinishGame}){
  const round=useRounds(1,onFinish,1200)
  return <div className="coach-challenge"><div className="coach-challenge__pitch"><FootballPitch/>{[{x:22,y:40},{x:50,y:65},{x:78,y:36}].map((p,i)=><Actor key={i} x={p.x} y={p.y}><FootballPlayerSprite number={String(i+7)} pose="running"/></Actor>)}<GameHUD round={0} total={1} label="LECTURA TÁCTICA"/></div><p>{scenario.context}</p><div>{scenario.options.map(option=><button key={option.label} disabled={round.locked} onClick={()=>round.submit(option.score,option.reason)}>{option.label} <b>→</b></button>)}</div><RoundFeedback feedback={round.feedback}/></div>
}
export function CoachChallenge({game,onBack,onScore}:{game:MiniGameId;onBack:()=>void;onScore:(score:number)=>void}){return <GameScene id={game} title="La decisión del DT" instruction="LEÉ EL CONTEXTO · ELEGÍ TU RESPUESTA" onBack={onBack} onComplete={onScore}>{finish=><CoachTurn scenario={situations[game]??situations.tactics} onFinish={finish}/>}</GameScene>}
