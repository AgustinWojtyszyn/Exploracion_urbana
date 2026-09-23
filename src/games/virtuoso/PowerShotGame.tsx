import { useEffect,useRef,useState } from 'react'
import { useRounds } from '../../hooks/useRounds'
import { bounded,timingScore } from '../../systems/gameScoring'
import { GameHUD,RoundFeedback } from '../shared/GameFeedback'
import { Actor,FootballBall,FootballPitch,FootballPlayerSprite,GoalFrame } from '../shared/FootballVisuals'
import type { SkillProps } from '../shared/types'

const targets=[78,86,93]

export function PowerShotGame({difficulty,onFinish}:SkillProps){
  const game=useRounds(3,onFinish,1000)
  const startRef=useRef<number|null>(null)
  const [holding,setHolding]=useState(false)
  const target=targets[game.round]??86
  const assistance=difficulty.assistance('finishing')
  const fullChargeMs=1080-difficulty.level*120+assistance*120
  const width=15-difficulty.level*4+assistance*3
  const charge=holding&&startRef.current!==null?bounded((game.elapsed-startRef.current)/fullChargeMs*100,0,125):0
  const begin=()=>{
    if(game.locked||holding)return
    startRef.current=game.elapsed
    setHolding(true)
  }
  const release=()=>{
    if(game.locked||!holding||startRef.current===null)return
    const value=bounded((game.elapsed-startRef.current)/fullChargeMs*100,0,125)
    startRef.current=null
    setHolding(false)
    const score=timingScore(value,target,width)
    game.submit(score,score>=95?'MISIL':score>=80?'BOMBAZO':score>=60?'BUEN REMATE':value<target?'FALTÓ PIERNA':'TE PASASTE',Math.round(value)+'% POTENCIA')
  }
  useEffect(()=>{
    if(game.elapsed>=7000){
      startRef.current=null
      setHolding(false)
      game.submit(0,'SIN REMATE')
    }
  },[game.elapsed,game.submit])
  return <div className="lg-playfield lg-power-shot"><FootballPitch/><GameHUD round={game.round} total={3} label="EL FIERRAZO" remaining={1-game.elapsed/7000}/>
    <GoalFrame/><Actor x={50} y={72}><FootballPlayerSprite number="9" pose={holding?'shooting':'standing'}/></Actor><Actor x={58} y={79} className="lg-ball"><FootballBall/></Actor>
    <div className="lg-power-shot__panel">
      <div className="lg-power-shot__readout"><span>POTENCIA</span><strong>{Math.round(charge)}%</strong><small>OBJETIVO {target}%</small></div>
      <div className="lg-power-shot__meter"><i className="lg-power-shot__target" style={{left:(target-width)+'%',width:(width*2)+'%'}}/><b style={{transform:`scaleX(${Math.min(charge,100)/100})`}}/><em style={{left:target+'%'}}/></div>
      <div className="lg-power-shot__labels"><span>SUAVE</span><b>ZONA DE GOL</b><span>PASADO</span></div>
    </div>
    <button className={'lg-power-shot__button '+(holding?'is-holding':'')} disabled={game.locked}
      onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);begin()}}
      onPointerUp={release}
      onPointerCancel={()=>{startRef.current=null;setHolding(false)}}
      onKeyDown={event=>{if((event.key===' '||event.key==='Enter')&&!event.repeat){event.preventDefault();begin()}}}
      onKeyUp={event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();release()}}}>
      {holding?'SOLTÁ AHORA':'MANTENÉ PARA CARGAR'}
    </button>
    <RoundFeedback feedback={game.feedback}/>
  </div>
}
