import { useEffect } from 'react'
import { useRounds } from '../../hooks/useRounds'
import { grade,timingScore } from '../../systems/gameScoring'
import { GameHUD, RoundFeedback } from '../shared/GameFeedback'
import { Actor,FootballPlayerSprite,FootballBall,FootballPitch } from '../shared/FootballVisuals'
import type { SkillProps } from '../shared/types'
export function TimingGame({difficulty,onFinish}:SkillProps){
  const game=useRounds(3,onFinish,900)
  const t=game.elapsed/850*difficulty.speed
  const position=50+47*Math.sin(t+.22*Math.sin(t*1.7))
  const center=52+game.round*6, width=22-difficulty.level*5
  const stop=()=>{const score=timingScore(position,center,width);game.submit(score,score>=60?grade(score):position<center?'EARLY':'LATE',Math.abs(position-center).toFixed(1)+' DE DESVÍO')}
  useEffect(()=>{if(game.elapsed>=6500)game.submit(0,'MISS')},[game.elapsed,game.submit])
  return <div className="lg-playfield lg-timing"><FootballPitch/><GameHUD round={game.round} total={3} label="PRIMER TOQUE" remaining={1-game.elapsed/6500}/>
    <Actor x={50} y={37}><FootballPlayerSprite pose={game.locked?'shooting':'standing'} number="9"/></Actor><Actor x={62} y={43} className="lg-ball"><FootballBall/></Actor>
    <div className="lg-timing-instrument"><span>ENCONTRÁ EL CENTRO</span><div className="lg-timing-track"><i className="lg-zone-yellow" style={{left:center-width+'%',width:width*2+'%'}}/><i className="lg-zone-green" style={{left:center-width*.4+'%',width:width*.8+'%'}}/><i className="lg-zone-perfect" style={{left:center-1.5+'%'}}/><span className="lg-timing-marker" style={{transform:`translateX(${position}%)`}}/></div><div className="lg-timing-labels"><span>EARLY</span><b>PERFECT</b><span>LATE</span></div></div>
    <button className="lg-touch-action" disabled={game.locked} onPointerDown={stop} onClick={event=>{if(event.detail===0)stop()}}>TOCAR</button><RoundFeedback feedback={game.feedback}/>
  </div>
}
