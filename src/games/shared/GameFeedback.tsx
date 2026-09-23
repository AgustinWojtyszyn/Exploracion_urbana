import type { CSSProperties } from 'react'
import type { RoundFeedback as Feedback } from '../../hooks/useRounds'
export function GameParticles({gold=false}:{gold?:boolean}){return <div className={'lg-particles '+(gold?'lg-particles--gold':'')} aria-hidden="true">{Array.from({length:12},(_,index)=><i key={index} style={{'--dx':Math.cos(index*Math.PI/6)*130+'px','--dy':Math.sin(index*Math.PI/6)*110+'px','--spin':index*67+'deg'} as CSSProperties}/>)}</div>}
export function RoundFeedback({feedback}:{feedback:Feedback|null}) {
  if(!feedback)return null
  return <div className={'lg-feedback '+(feedback.score>=60?'is-good':'is-miss')} role="status">
    {feedback.score>=80&&<GameParticles/>}<strong>{feedback.label}</strong><b>+{feedback.score}</b>{feedback.detail&&<small>{feedback.detail}</small>}
  </div>
}
export function GameHUD({round,total,remaining=1,label,combo}:{round:number;total:number;remaining?:number;label:string;combo?:number}) {
  return <div className="lg-hud"><span>{label}</span><b>{Math.min(round+1,total)}<small> / {total}</small></b>{combo!==undefined&&<em>×{combo} COMBO</em>}<div className="lg-hud__meter" role="progressbar" aria-label="Tiempo restante" aria-valuenow={Math.round(Math.max(0,remaining)*100)} aria-valuemin={0} aria-valuemax={100}><i style={{transform:`scaleX(${Math.max(0,Math.min(1,remaining))})`}}/></div></div>
}
