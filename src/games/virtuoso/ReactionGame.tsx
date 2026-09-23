import { useEffect, useRef, useState } from 'react'
import { useRounds } from '../../hooks/useRounds'
import { reactionScore, reactionSeries } from '../../systems/gameScoring'
import { FootballPitch } from '../shared/FootballVisuals'
import { GameHUD, RoundFeedback } from '../shared/GameFeedback'
import type { SkillProps } from '../shared/types'
export function ReactionGame({difficulty,onFinish}:SkillProps){
  const times=useRef<number[]>([]),limits=useRef<number[]>([]),errors=useRef(0),best=useRef(0)
  const [combo,setCombo]=useState(0),[misfire,setMisfire]=useState(0)
  const [spots]=useState(()=>Array.from({length:5},(_,i)=>({x:18+Math.random()*64,y:22+(i%2)*30+Math.random()*12})))
  const game=useRounds(5,()=>onFinish(reactionSeries(times.current,limits.current,errors.current,best.current),'SERIE DE REFLEJOS'),650)
  const deadline=difficulty.reactionMs-game.round*400, ready=game.elapsed>=400
  const remaining=1-(game.elapsed-400)/deadline
  const resolve=(hit:boolean)=>{
    if(game.locked)return
    const time=hit?Math.max(0,game.elapsed-400):-1
    if(!game.submit(hit?reactionScore(time,deadline):0,hit?(time<500?'PERFECT':'ACIERTO'):'SE ESCAPÓ',hit?(time/1000).toFixed(2)+' s':'SIGUE LA SERIE'))return
    times.current.push(time);limits.current.push(deadline)
    const next=hit?combo+1:0;setCombo(next);best.current=Math.max(best.current,next)
  }
  useEffect(()=>{if(ready&&remaining<=0&&!game.locked)resolve(false)},[ready,remaining,game.locked])
  const hits=times.current.filter(time=>time>=0)
  return <div className="lg-playfield lg-reaction" onPointerDown={event=>{if(event.target===event.currentTarget&&ready&&!game.locked){errors.current+=1;setCombo(0);setMisfire(value=>value+1)}}}>
    <FootballPitch/><GameHUD round={game.round} total={5} label="REFLEJOS" remaining={remaining} combo={combo}/>
    {ready&&!game.locked?<button autoFocus key={game.round} className="lg-reaction-target" style={{left:spots[game.round].x+'%',top:spots[game.round].y+'%'}} aria-label="Tocar objetivo" onPointerDown={event=>{event.stopPropagation();resolve(true)}} onClick={event=>{if(event.detail===0)resolve(true)}}><i/><b>◎</b></button>:!game.locked&&<span className="lg-center-call">PREPARATE</span>}
    {misfire>0&&!game.locked&&<span key={misfire} className="lg-misfire" role="status">FUERA DEL OBJETIVO</span>}
    <RoundFeedback feedback={game.feedback}/><div className="lg-field-caption">{hits.length?<>MEJOR {(Math.min(...hits)/1000).toFixed(2)} s · MEDIA {(hits.reduce((a,b)=>a+b,0)/hits.length/1000).toFixed(2)} s</>:'TOCÁ EL HALO'}</div>
  </div>
}
