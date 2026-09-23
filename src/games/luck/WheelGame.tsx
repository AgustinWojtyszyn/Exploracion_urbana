import { useEffect,useState } from 'react'
import { useRounds } from '../../hooks/useRounds'
import { GameHUD,RoundFeedback } from '../shared/GameFeedback'
import type { LuckProps } from '../shared/types'
const prizes=[100,25,80,10,65,40]
export function WheelGame({onFinish}:LuckProps){
  const game=useRounds(1,onFinish,1000),[spin,setSpin]=useState<{index:number;at:number}|null>(null)
  useEffect(()=>{if(spin&&game.elapsed-spin.at>=3900)game.submit(prizes[spin.index],prizes[spin.index]>=65?'EL DESTINO ACOMPAÑA':'LA RUEDA CAMBIÓ DE LADO')},[spin,game.elapsed,game.submit])
  return <div className="lg-playfield lg-wheel-game"><GameHUD round={0} total={1} label="RUEDA DEL DESTINO"/>
    <div className="lg-wheel-wrap"><span className="lg-wheel-pointer">▼</span><svg viewBox="0 0 300 300" className="lg-wheel" style={{transform:`rotate(${spin?2160+360-(spin.index*60+30):0}deg)`}} aria-label="Ruleta de seis sectores">
      {prizes.map((score,index)=>{const a=(index*60-90)*Math.PI/180,b=((index+1)*60-90)*Math.PI/180,m=(a+b)/2;return <g key={index}><path d={`M150 150L${150+140*Math.cos(a)} ${150+140*Math.sin(a)}A140 140 0 0 1 ${150+140*Math.cos(b)} ${150+140*Math.sin(b)}Z`} fill={['#d4a84b','#0e3d61','#138ba0','#172d45','#256181','#0a4769'][index]} stroke="#d9f6ff" strokeWidth="1"/><text x={150+101*Math.cos(m)} y={155+101*Math.sin(m)} textAnchor="middle" fill="#fff" fontSize="25" fontWeight="bold">{score}</text></g>})}<circle cx="150" cy="150" r="30" fill="#091a2d" stroke="#efd48c" strokeWidth="5"/><text x="150" y="160" textAnchor="middle" fill="#efd48c" fontSize="29" fontWeight="bold">L</text>
    </svg></div><div className="lg-luck-controls"><button className="lg-action" disabled={!!spin} onClick={()=>setSpin({index:Math.floor(Math.random()*6),at:game.elapsed})}>{spin?'QUE GIRE…':'GIRAR LA RUEDA ↻'}</button></div><RoundFeedback feedback={game.feedback}/>
  </div>
}
