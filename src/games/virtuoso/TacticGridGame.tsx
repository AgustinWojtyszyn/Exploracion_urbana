import { useEffect } from 'react'
import { useRounds } from '../../hooks/useRounds'
import { GameHUD,RoundFeedback } from '../shared/GameFeedback'
import { FootballPitch } from '../shared/FootballVisuals'
import type { SkillProps } from '../shared/types'

type Cell='X'|'O'|null
const puzzles:Array<{label:string;cells:Cell[];best:number[];good:number[]}>=[
  {label:'CERRÁ LA JUGADA',cells:['X','X',null,'O','O',null,null,null,null],best:[2],good:[5]},
  {label:'SALVÁ LA LÍNEA',cells:['O','O',null,'X',null,null,'X',null,null],best:[2],good:[4]},
  {label:'CREÁ EL DOS CONTRA UNO',cells:['X',null,null,null,'O',null,null,null,'X'],best:[2,6],good:[1,3,5,7]},
]

export function TacticGridGame({difficulty,onFinish}:SkillProps){
  const game=useRounds(3,onFinish,950)
  const puzzle=puzzles[game.round]??puzzles[0]
  const deadline=7800-difficulty.level*1200+difficulty.assistance('passing')*420
  const choose=(index:number)=>{
    if(game.locked||puzzle.cells[index])return
    const best=puzzle.best.includes(index), good=puzzle.good.includes(index)
    const speedBonus=Math.max(0,Math.round(12*(1-game.elapsed/deadline)))
    const score=best?Math.min(100,88+speedBonus):good?65+Math.round(speedBonus/2):25
    game.submit(
      score,
      best?'LECTURA PERFECTA':good?'BUENA IDEA':'TE LEYERON',
      best?'GANASTE LA VENTAJA':good?'HAY UNA JUGADA MÁS FUERTE':'MIRÁ FILAS, COLUMNAS Y DIAGONALES'
    )
  }
  useEffect(()=>{if(game.elapsed>=deadline)game.submit(0,'SIN JUGADA')},[game.elapsed,deadline,game.submit])
  return <div className="lg-playfield lg-tactic-grid"><FootballPitch/><GameHUD round={game.round} total={3} label={puzzle.label} remaining={1-game.elapsed/deadline}/>
    <div className="lg-tactic-grid__board" role="grid" aria-label="Pizarra táctica tres por tres">
      {puzzle.cells.map((cell,index)=><button key={index} role="gridcell" disabled={game.locked||!!cell} aria-label={cell?('Casillero ocupado por '+cell):('Jugar casillero '+(index+1))} onClick={()=>choose(index)} className={cell?'is-filled':''}>
        <span className={cell==='X'?'is-you':cell==='O'?'is-rival':''}>{cell==='X'?'●':cell==='O'?'×':''}</span>
      </button>)}
    </div>
    <div className="lg-tactic-grid__legend"><span><b>●</b> VOS</span><span><b>×</b> RIVAL</span><strong>LEÉ · BLOQUEÁ · DEFINÍ</strong></div>
    <RoundFeedback feedback={game.feedback}/>
  </div>
}
