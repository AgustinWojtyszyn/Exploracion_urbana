import { useEffect,useState } from 'react'
import { usePointerGesture } from '../../hooks/usePointerGesture'
import { useRounds } from '../../hooks/useRounds'
import { reactionScore,bounded } from '../../systems/gameScoring'
import { GameHUD,RoundFeedback } from '../shared/GameFeedback'
import { Actor,FootballBall,FootballPitch,FootballPlayerSprite } from '../shared/FootballVisuals'
import type { SkillProps } from '../shared/types'
export function DribbleGame({difficulty,onFinish}:SkillProps){
  const game=useRounds(4,onFinish,950),[directions]=useState(()=>Array.from({length:4},()=>Math.random()<.5?-1:1)),[exit,setExit]=useState(0)
  useEffect(()=>{setExit(0)},[game.round])
  const cue=500,deadline=2100-difficulty.level*650+difficulty.assistance('dribbling')*140
  const closed=directions[game.round], visible=game.elapsed>cue
  const dodge=(direction:number,quality=1)=>{
    if(game.locked)return
    setExit(direction)
    const correct=visible&&direction===-closed
    const score=correct?reactionScore(game.elapsed-cue,deadline)*.8+bounded(quality,0,1)*20:10
    game.submit(score,!visible?'TE ANTICIPASTE':correct?'LO DEJASTE ATRÁS':'TE CERRÓ',correct?((game.elapsed-cue)/1000).toFixed(2)+' s':'LEÉ EL PERFIL DEL RIVAL')
  }
  const gesture=usePointerGesture(g=>{if(Math.abs(g.dx)<9)return;dodge(g.dx<0?-1:1,Math.abs(g.dx)/(Math.abs(g.dy)+Math.abs(g.dx))*.7+Math.max(0,1-g.duration/700)*.3)},!game.locked)
  useEffect(()=>{if(game.elapsed>cue+deadline)game.submit(0,'TE ALCANZÓ')},[game.elapsed,deadline,game.submit])
  return <div className="lg-playfield lg-dribble" {...gesture.bind}><FootballPitch/><GameHUD round={game.round} total={4} label="UNO CONTRA UNO" remaining={1-(game.elapsed-cue)/deadline} combo={game.scores.filter(s=>s>=60).length}/>
    <div className={'lg-defender-shadow '+(visible?'is-visible':'')} style={{left:(closed<0?25:55)+'%'}}/>
    <Actor x={50+(visible?closed*13:0)} y={27+Math.min(22,game.elapsed/deadline*22)}><FootballPlayerSprite opponent number="2" pose="running"/></Actor>
    <Actor x={50+exit*27} y={exit?40:75} className="lg-dribbler"><FootballPlayerSprite number="7" pose={exit?'running':'standing'}/></Actor>
    <Actor x={57+exit*27} y={exit?49:82} className="lg-ball lg-dribbler"><FootballBall/></Actor>
    <div className="lg-swipe-hints"><button aria-label="Regate a la izquierda" disabled={game.locked} onClick={()=>dodge(-1)}>←</button><span>LEÉ · AMAGÁ · SALÍ</span><button aria-label="Regate a la derecha" disabled={game.locked} onClick={()=>dodge(1)}>→</button></div><RoundFeedback feedback={game.feedback}/>
  </div>
}
