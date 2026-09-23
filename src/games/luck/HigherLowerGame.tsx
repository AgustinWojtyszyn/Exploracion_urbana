import { useEffect,useState } from 'react'
import { useRounds } from '../../hooks/useRounds'
import { GameHUD,RoundFeedback } from '../shared/GameFeedback'
import type { LuckProps } from '../shared/types'
export function HigherLowerGame({onFinish}:LuckProps){
  const game=useRounds(3,onFinish,1350),[cards]=useState(()=>Array.from({length:4},()=>1+Math.floor(Math.random()*12)))
  const [pick,setPick]=useState<{higher:boolean;at:number}|null>(null)
  useEffect(()=>{setPick(null)},[game.round])
  const current=cards[game.round],next=cards[game.round+1],reveal=pick!==null&&game.elapsed-pick.at>=650
  useEffect(()=>{if(!reveal||!pick)return;const equal=next===current;const won=pick.higher?next>current:next<current;game.submit(equal?50:won?100:0,equal?'EMPATE':won?'BUEN PÁLPITO':'SE CORTÓ LA RACHA',current+' → '+next)},[reveal,pick,current,next,game.submit])
  return <div className="lg-playfield lg-higher-game"><GameHUD round={game.round} total={3} label="MAYOR O MENOR" combo={game.scores.reduce((streak,s)=>s===100?streak+1:0,0)}/>
    <div className="lg-card-trail">{cards.slice(0,game.round).map((card,i)=><span key={i}>{card}</span>)}</div>
    <div className="lg-playing-cards"><div className="lg-playing-card"><small>ACTUAL</small><strong>{current}</strong><span>LEGENDS</span></div><div key={game.round} className={'lg-playing-card lg-playing-card--next '+(reveal?'is-revealed':'')}><small>SIGUIENTE</small><strong>{reveal?next:'?'}</strong><span>1 — 12</span></div></div>
    <div className="lg-luck-controls"><div className="lg-segmented"><button disabled={!!pick} onClick={()=>setPick({higher:false,at:game.elapsed})}>↓ MENOR</button><button disabled={!!pick} onClick={()=>setPick({higher:true,at:game.elapsed})}>MAYOR ↑</button></div><small>Iguales: 50 puntos. Tres predicciones.</small></div><RoundFeedback feedback={game.feedback}/>
  </div>
}
