import { useEffect,useState } from 'react'
import { pointerPoint,type Point } from '../../hooks/usePointerGesture'
import { useRounds } from '../../hooks/useRounds'
import { bounded,precisionScore } from '../../systems/gameScoring'
import { GameHUD,RoundFeedback } from '../shared/GameFeedback'
import { Actor,BallFlight,FootballBall,FootballPitch,FootballPlayerSprite } from '../shared/FootballVisuals'
import type { SkillProps } from '../shared/types'
export function PassingGame({difficulty,onFinish}:SkillProps){
  const game=useRounds(3,onFinish,1400),[shot,setShot]=useState<Point|null>(null),[keyboardAim,setKeyboardAim]=useState<Point>({x:50,y:30}),[keyboard,setKeyboard]=useState(false)
  useEffect(()=>{setShot(null)},[game.round])
  const t=game.elapsed/1000*difficulty.speed
  const receiver={x:50+28*Math.sin(t*.95),y:25+5*Math.cos(t)}
  const target={x:50+28*Math.sin((t+.5)*.95),y:23+5*Math.cos(t+.5)}
  const defenders=[{x:30+16*Math.sin(t*1.4),y:52},{x:66+17*Math.cos(t*1.3),y:45}]
  const clearance=(point:Point)=>Math.min(...defenders.map(d=>{const dx=point.x-50,dy=point.y-82;const u=Math.max(0,Math.min(1,((d.x-50)*dx+(d.y-82)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(d.x-(50+u*dx),d.y-(82+u*dy))}))
  const open=clearance(target)>9
  const pass=(point:Point)=>{
    if(game.locked)return;setShot(point)
    const distance=Math.hypot(point.x-target.x,(point.y-target.y)*1.2)
    const intercepted=clearance(point)<8-difficulty.assistance('passing')
    const score=intercepted?15:precisionScore(distance,difficulty.tolerance)*.85+Math.max(0,15-game.elapsed/900)
    const label=intercepted?'INTERCEPTADO':distance<4?'PASE PERFECTO':distance<9?'PASE CON VENTAJA':distance<17?'PASE FORZADO':point.y<target.y?'PASE LARGO':'PASE CORTO'
    game.submit(score,label,Math.round(distance)+' m DE DESVÍO')
  }
  useEffect(()=>{if(game.elapsed>=8500)game.submit(0,'SE CERRÓ EL ESPACIO')},[game.elapsed,game.submit])
  return <div className="lg-playfield lg-passing" role="button" tabIndex={0} aria-label="Cancha: tocá el espacio. Con teclado, apuntá con flechas y pasá con Enter." onPointerDown={event=>{if((event.target as Element).closest('button'))return;pass(pointerPoint(event))}} onKeyDown={event=>{if(event.key.startsWith('Arrow')){event.preventDefault();setKeyboard(true);setKeyboardAim(point=>({x:bounded(point.x+(event.key==='ArrowRight'?3:event.key==='ArrowLeft'?-3:0),5,95),y:bounded(point.y+(event.key==='ArrowDown'?3:event.key==='ArrowUp'?-3:0),15,90)}))}else if(event.key==='Enter'||event.key===' '){event.preventDefault();pass(keyboardAim)}}}>
    <FootballPitch/><GameHUD round={game.round} total={3} label="PASE FILTRADO" remaining={1-game.elapsed/8500}/>
    <svg className="lg-flight-line lg-aim-line" viewBox="0 0 100 100" preserveAspectRatio="none"><path d={`M50 82L${target.x} ${target.y}`} opacity={open ? .65 : .15}/></svg>
    {defenders.map((d,i)=><Actor key={i} x={d.x} y={d.y}><FootballPlayerSprite opponent number={String(i+2)} pose="running"/></Actor>)}
    <Actor x={receiver.x} y={receiver.y}><FootballPlayerSprite number="7" pose="running"/></Actor><Actor x={44} y={82}><FootballPlayerSprite number="10" pose={shot?'shooting':'standing'}/></Actor>
    <div className={'lg-pass-window '+(open?'is-open':'')} style={{left:target.x+'%',top:target.y+'%'}}><span>{open?'↗':'×'}</span></div>
    {keyboard&&!game.locked&&<span className="lg-keyboard-aim" style={{left:keyboardAim.x+'%',top:keyboardAim.y+'%'}}>＋</span>}
    {shot?<BallFlight key={game.round} from={{x:50,y:82}} to={shot}/>:<Actor x={50} y={82} className="lg-ball"><FootballBall/></Actor>}<RoundFeedback feedback={game.feedback}/><div className="lg-field-caption">ANTICIPÁ LA CARRERA · TOCÁ EL ESPACIO</div>
  </div>
}
