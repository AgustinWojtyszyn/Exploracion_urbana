import { useEffect, useState } from 'react'
import { usePointerGesture, type Point } from '../../hooks/usePointerGesture'
import { useRounds } from '../../hooks/useRounds'
import { bounded,penaltyScore,shotPower } from '../../systems/gameScoring'
import { GameHUD,RoundFeedback } from '../shared/GameFeedback'
import { Actor,BallFlight,FootballBall,FootballPitch,FootballPlayerSprite,GoalFrame,GoalkeeperSprite } from '../shared/FootballVisuals'
import type { SkillProps } from '../shared/types'
export function PenaltyGame({difficulty,onFinish}:SkillProps){
  const game=useRounds(3,onFinish,1500),[shot,setShot]=useState<Point|null>(null),[aim,setAim]=useState<Point>({x:23,y:27}),[power,setPower]=useState(.8)
  useEffect(()=>{setShot(null)},[game.round])
  const keeperX=50+Math.sin(game.elapsed/700*difficulty.speed)*17
  const shoot=(end:Point,force:number)=>{if(game.locked)return;setShot(end);const result=penaltyScore(end.x,end.y,force,keeperX,difficulty.assistance('finishing')*2);game.submit(result.score,result.label,'POTENCIA '+Math.round(force*100)+'%')}
  const gesture=usePointerGesture(g=>{if(g.dy>-12)return;const force=shotPower(g.dx,g.dy);setPower(force);shoot(g.end,force)},!game.locked,point=>Math.hypot(point.x-50,point.y-82)<15)
  useEffect(()=>{if(game.elapsed>12000)game.submit(0,'SIN REMATE')},[game.elapsed,game.submit])
  return <div className="lg-playfield lg-penalty" {...gesture.bind}><FootballPitch/><GoalFrame/><GameHUD round={game.round} total={3} label="PENALES" remaining={1-game.elapsed/12000}/>
    <Actor x={game.locked&&shot?bounded(shot.x,keeperX-18,keeperX+18):keeperX} y={40} className={'lg-keeper '+(game.locked?'is-diving':'')} style={{rotate:game.locked?(shot&&shot.x<keeperX?'-55deg':'55deg'):'0deg'}}><GoalkeeperSprite diving={game.locked}/></Actor>
    <Actor x={40} y={79}><FootballPlayerSprite number="9" pose={game.locked?'shooting':'standing'}/></Actor>
    {!shot?<Actor x={50} y={82} className="lg-ball lg-ball--ready"><FootballBall/></Actor>:<BallFlight key={game.round} from={{x:50,y:82}} to={shot}/>}
    {gesture.aim&&<svg className="lg-flight-line lg-aim-line" viewBox="0 0 100 100" preserveAspectRatio="none"><path d={`M50 82L${gesture.aim.x} ${gesture.aim.y}`}/></svg>}
    {gesture.aim&&gesture.origin&&<div className="lg-shot-power"><span>POTENCIA</span><i><b style={{transform:`scaleX(${shotPower(gesture.aim.x-gesture.origin.x,gesture.aim.y-gesture.origin.y)})`}}/></i><strong>{Math.round(shotPower(gesture.aim.x-gesture.origin.x,gesture.aim.y-gesture.origin.y)*100)}%</strong></div>}
    <div className="lg-field-caption">ARRASTRÁ DESDE LA PELOTA · SOLTÁ EN EL ARCO</div>
    <details className="lg-keyboard-controls"><summary>Control con teclado</summary><label>Dirección<input aria-label="Dirección horizontal" type="range" min="10" max="90" value={aim.x} onChange={e=>setAim({...aim,x:Number(e.target.value)})}/></label><label>Altura<input aria-label="Altura del remate" type="range" min="15" max="50" value={aim.y} onChange={e=>setAim({...aim,y:Number(e.target.value)})}/></label><label>Potencia<input aria-label="Potencia" type="range" min="20" max="100" value={power*100} onChange={e=>setPower(Number(e.target.value)/100)}/></label><button disabled={game.locked} onClick={()=>shoot(aim,power)}>REMATAR</button></details><RoundFeedback feedback={game.feedback}/>
  </div>
}
