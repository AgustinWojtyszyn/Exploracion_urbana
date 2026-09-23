import { useEffect,useState } from 'react'
import { useRounds } from '../../hooks/useRounds'
import { GameHUD,RoundFeedback } from '../shared/GameFeedback'
import type { LuckProps } from '../shared/types'
export function CoinGame({onFinish}:LuckProps){
  const game=useRounds(3,onFinish,1100)
  const [choice,setChoice]=useState(0),[toss,setToss]=useState<{at:number;side:number}|null>(null)
  useEffect(()=>{setToss(null)},[game.round])
  const tossCoin=()=>{if(toss||game.locked)return;setToss({at:game.elapsed,side:Math.random()<.5?0:1})}
  const landed=!!toss&&game.elapsed-toss.at>=1900
  useEffect(()=>{if(toss&&landed)game.submit(toss.side===choice?100:0,toss.side===choice?'CÁBALA CUMPLIDA':'CAMBIÓ LA SUERTE',toss.side===0?'CARA':'SECA')},[landed,toss,choice,game.submit])
  return <div className="lg-playfield lg-coin-game"><GameHUD round={game.round} total={3} label="MONEDA DE VESTUARIO" combo={game.scores.reduce((streak,score)=>score===100?streak+1:0,0)}/>
    <div key={game.round} className={'lg-coin-toss '+(toss?'is-tossing':'')}><div className="lg-coin" style={{transform:toss?`rotateY(${1800+toss.side*180}deg) rotateZ(12deg)`:'rotateY(0deg)'}}><span className="lg-coin__face">L<small>LEGENDS</small></span><span className="lg-coin__face lg-coin__back">★<small>DESTINO</small></span></div></div><div className="lg-coin-shadow"/>
    <div className="lg-luck-controls"><div className="lg-segmented"><button aria-pressed={choice===0} disabled={!!toss} onClick={()=>setChoice(0)}>CARA</button><button aria-pressed={choice===1} disabled={!!toss} onClick={()=>setChoice(1)}>SECA</button></div><button className="lg-action" disabled={!!toss} onClick={tossCoin}>{toss?'EN EL AIRE…':'LANZAR ↑'}</button></div><RoundFeedback feedback={game.feedback}/>
  </div>
}
