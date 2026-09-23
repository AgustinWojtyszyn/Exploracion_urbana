import { useEffect,useState } from 'react'
import { useRounds } from '../../hooks/useRounds'
import { usePointerGesture } from '../../hooks/usePointerGesture'
import { reactionScore } from '../../systems/gameScoring'
import { GameHUD,RoundFeedback } from '../shared/GameFeedback'
import { Actor,BallFlight,FootballBall,FootballPitch,FootballPlayerSprite,GoalFrame,GoalkeeperSprite } from '../shared/FootballVisuals'
import type { SkillProps } from '../shared/types'
const zones=[{x:22,y:24,label:'Arriba izquierda'},{x:50,y:23,label:'Arriba centro'},{x:78,y:24,label:'Arriba derecha'},{x:25,y:46,label:'Abajo izquierda'},{x:75,y:46,label:'Abajo derecha'}]
export function KeeperGame({difficulty,onFinish}:SkillProps){
  const game=useRounds(4,onFinish,1450),[targets]=useState(()=>Array.from({length:4},()=>Math.floor(Math.random()*5))),[chosen,setChosen]=useState<number|null>(null)
  useEffect(()=>{setChosen(null)},[game.round])
  const preparation=1000+(game.round%3)*240, launched=game.elapsed>=preparation
  const target=zones[targets[game.round]]
  const save=(index:number)=>{
    if(game.locked)return
    setChosen(index)
    if(!launched){game.submit(0,'TE ADELANTASTE');return}
    const elapsed=game.elapsed-preparation,distance=Math.hypot(zones[index].x-target.x,zones[index].y-target.y)
    const score=distance<8?reactionScore(elapsed,difficulty.keeperMs):distance<27?35:0
    game.submit(score,score>=90?'ATAJADA PERFECTA':score>=60?'ATAJADA':score>0?'ROCE':'GOL',(elapsed/1000).toFixed(2)+' s')
  }
  const gesture=usePointerGesture(g=>{if(Math.hypot(g.dx,g.dy)<10)return;save(g.dy<-20?(g.dx<-12?0:g.dx>12?2:1):(g.dx<0?3:4))},!game.locked)
  useEffect(()=>{if(game.elapsed>=preparation+difficulty.keeperMs)game.submit(0,'GOL')},[game.elapsed,preparation,difficulty.keeperMs,game.submit])
  const keeper=chosen===null?{x:50,y:44}:zones[chosen]
  return <div className="lg-playfield lg-keeper-game" {...gesture.bind}><FootballPitch/><GoalFrame/><GameHUD round={game.round} total={4} label="ÚLTIMA LÍNEA" remaining={launched?1-(game.elapsed-preparation)/difficulty.keeperMs:1}/>
    <Actor x={keeper.x} y={keeper.y} className="lg-keeper" style={{rotate:chosen===null?'0deg':keeper.x<50?'-60deg':'60deg'}}><GoalkeeperSprite diving={chosen!==null}/></Actor>
    <Actor x={50} y={82}><FootballPlayerSprite opponent number="9" pose={launched?'shooting':'standing'}/></Actor>
    {launched?<BallFlight key={game.round} from={{x:55,y:85}} to={target} duration={difficulty.keeperMs}/>:<Actor x={55} y={85} className="lg-ball"><FootballBall/></Actor>}
    <div className="lg-keeper-zones">{zones.map((zone,index)=><button key={index} aria-label={zone.label} disabled={game.locked} style={{left:zone.x+'%',top:zone.y+'%'}} onPointerDown={event=>{event.stopPropagation();save(index)}} onClick={event=>{if(event.detail===0)save(index)}}><span>＋</span></button>)}</div>
    <span className="lg-field-caption">{launched?'¡AHORA! · TOCÁ O DESLIZÁ':'ESPERÁ EL REMATE'}</span><RoundFeedback feedback={game.feedback}/>
  </div>
}
