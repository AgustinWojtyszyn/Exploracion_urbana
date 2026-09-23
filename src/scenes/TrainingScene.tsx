import { useState } from 'react'
import { statLabels,type CareerState,type PlayerStatKey } from '../world/Architecture'
import { statsFor,trainCareer } from '../systems/buildingStore'
import { FootballPlayerSprite } from '../games/shared/FootballVisuals'
type Focus='physical'|'technique'|'finishing'|'defending'|'mind'
const drills:Array<{id:Focus;name:string;stat:PlayerStatKey;description:string}>=[{id:'physical',name:'POTENCIA',stat:'physical',description:'Físico, velocidad y energía'},{id:'technique',name:'CONTROL Y PASE',stat:'passing',description:'Técnica con pelota'},{id:'finishing',name:'DEFINICIÓN',stat:'finishing',description:'Precisión frente al arco'},{id:'defending',name:'CRUCES',stat:'defending',description:'Marca y liderazgo'},{id:'mind',name:'LECTURA',stat:'reflexes',description:'Moral, disciplina y reflejos'}]
export function TrainingScene({state,onState}:{state:CareerState;onState:(next:CareerState)=>void}){
  const [last,setLast]=useState<{id:Focus;before:number;after:number}|null>(null)
  const stats=statsFor(state)
  const available=drills.filter(drill=>state.position==='1'?['mind','physical','technique'].includes(drill.id):['9','10','7'].includes(state.position)?drill.id!=='defending':drill.id!=='finishing')
  return <section className="career-training"><header><span className="eyebrow">CAMPO DE ENTRENAMIENTO</span><h2>El talento se trabaja.</h2><b>{state.trainingCredits} SESIONES</b></header><div className="career-training__figure"><FootballPlayerSprite pose="running" number={state.position}/></div><div className="career-training__drills">{available.map(drill=>{
    const mental=drill.id==='mind'&&state.position!=='1',value=mental?state.morale:stats[drill.stat]
    const next=trainCareer(state,drill.id),after=mental?next.morale:statsFor(next)[drill.stat]
    return <button key={drill.id} disabled={!state.trainingCredits||state.retired} onClick={()=>{setLast({id:drill.id,before:value,after});onState(next)}}><div><span>{drill.name}</span><strong>{Math.round(value)} <small>→ {Math.round(after)}</small></strong></div><meter aria-label={mental?'Moral':statLabels[drill.stat]} min="0" max="100" value={value}/><p>{drill.description}</p><small>1 SESIÓN · ENTRENAR ↗</small>{last?.id===drill.id&&<em key={state.trainingCredits} role="status">{Math.round(last.before)} → {Math.round(last.after)} ✓</em>}</button>
  })}</div></section>
}
