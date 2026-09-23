import { useContext,useEffect,useState } from 'react'
import { useRounds,GameFeedbackContext } from '../../hooks/useRounds'
import { GameHUD,RoundFeedback } from '../shared/GameFeedback'
import { FootballPitch,FootballPlayerSprite } from '../shared/FootballVisuals'
import type { SkillProps } from '../shared/types'
const positions=[{x:25,y:30},{x:75,y:30},{x:25,y:67},{x:75,y:67}]
export function MemoryGame({difficulty,onFinish}:SkillProps){
  const signal=useContext(GameFeedbackContext)
  const game=useRounds(3,onFinish,1000),[progress,setProgress]=useState(0),[pressed,setPressed]=useState(-1)
  const [sequence]=useState(()=>Array.from({length:7},(_,index)=>(index+Math.floor(Math.random()*3))%4))
  useEffect(()=>{setProgress(0);setPressed(-1)},[game.round])
  const length=difficulty.memoryLength+game.round, beat=680-difficulty.level*110
  const showing=game.elapsed<600+length*beat, step=Math.floor((game.elapsed-600)/beat)
  const lit=showing&&step>=0&&(game.elapsed-600)%beat<beat*.72?sequence[step]:-1
  const deadline=length*2300
  const tap=(index:number)=>{
    if(showing||game.locked)return
    setPressed(index)
    if(sequence[progress]!==index){game.submit(progress/length*75,'SECUENCIA CORTADA',progress+' / '+length);return}
    const next=progress+1;setProgress(next);if(next<length)signal(true)
    if(next===length)game.submit(100,'PERFECT MEMORY',length+' PASES RECORDADOS')
  }
  useEffect(()=>{if(!showing&&game.elapsed>600+length*beat+deadline)game.submit(progress/length*70,'TIEMPO AGOTADO')},[game.elapsed,showing,length,beat,deadline,progress,game.submit])
  return <div className="lg-playfield lg-memory"><FootballPitch/><GameHUD round={game.round} total={3} label={showing?'MIRÁ LA JUGADA':'REPETÍ LA SECUENCIA'} remaining={showing?1:1-(game.elapsed-600-length*beat)/deadline}/>
    <div className="lg-memory-count">{showing?'OBSERVÁ':progress+' / '+length}</div>
    {positions.map((point,index)=><button key={index} disabled={showing||game.locked} aria-label={'Jugador '+(index+1)} className={'lg-memory-player '+(lit===index?'is-lit':'')+(!showing&&pressed===index?' is-selected':'')} style={{left:point.x+'%',top:point.y+'%'}} onClick={()=>tap(index)}><FootballPlayerSprite number={String([5,10,7,9][index])}/><span key={pressed===index?progress:0}>{['A','B','C','D'][index]}</span></button>)}
    <div className="lg-field-caption">{showing?'SEGUÍ LA LUZ':'TOCÁ LOS JUGADORES EN ORDEN'}</div><RoundFeedback feedback={game.feedback}/>
  </div>
}
