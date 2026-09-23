import { useState,type CSSProperties } from 'react'
import { useRounds } from '../../hooks/useRounds'
import { GameHUD,RoundFeedback } from '../shared/GameFeedback'
import { FootballBall } from '../shared/FootballVisuals'
import type { LuckProps } from '../shared/types'
function shuffleRoute(){
  const route=[[0,1,2]]
  for(let i=0;i<7;i++){const next=[...route[route.length-1]];const a=Math.floor(Math.random()*3),b=(a+1+Math.floor(Math.random()*2))%3;[next[a],next[b]]=[next[b],next[a]];route.push(next)}
  return route
}
export function CupsGame({onFinish}:LuckProps){
  const game=useRounds(1,onFinish,1700),[route]=useState(shuffleRoute),[chosen,setChosen]=useState<number|null>(null)
  const showing=game.elapsed<1200,step=Math.max(0,Math.min(7,Math.floor((game.elapsed-1700)/650)+1)),ready=game.elapsed>6900
  const slots=route[step]
  return <div className="lg-playfield lg-cups-game"><GameHUD round={0} total={1} label={showing?'MIRÁ LA PELOTA':ready?'ELEGÍ UN VASO':'SEGUÍ LA MEZCLA'} remaining={ready?1:1-game.elapsed/6900}/>
    <div className="lg-cups-table"><div className="lg-cup-ball" style={{'--cup-x':slots[0]*32+'cqw',opacity:showing||game.locked?1:0} as CSSProperties}><FootballBall/></div>
      {[0,1,2].map(id=><button key={id} className={'lg-cup '+((showing&&id===0)||(game.locked&&(id===chosen||id===0))?'is-lifted':'')} style={{'--cup-x':slots[id]*32+'cqw',zIndex:slots[id]===1?3:2} as CSSProperties} disabled={!ready||game.locked} aria-label={'Vaso en posición '+(slots[id]+1)} onClick={()=>{setChosen(id);game.submit(id===0?100:0,id===0?'LA TENÍAS':'VASO VACÍO')}}><svg viewBox="0 0 90 110" aria-hidden="true"><path d="M18 10h54l12 87q-39 20-78 0z" fill="#1593ca" stroke="#b1edff" strokeWidth="2"/><path d="M25 15 18 92M33 15 30 98M45 15v85M57 15l3 83M65 15l9 78" stroke="#e8faff" opacity=".22" strokeWidth="3"/><ellipse cx="45" cy="11" rx="27" ry="7" fill="#70d4ee"/><path d="M7 96q38 15 76 0" fill="none" stroke="#d4faff" strokeWidth="4"/></svg></button>)}
    </div><span className="lg-field-caption">{showing?'NO LA PIERDAS DE VISTA':ready?'TOCÁ PARA LEVANTAR':'MEZCLANDO…'}</span><RoundFeedback feedback={game.feedback}/>
  </div>
}
