import { useState } from 'react'
import { clubById,type CareerState } from '../world/Architecture'
import { resolveCabalFinal,resolveSkillFinal } from '../systems/buildingStore'
import { ClubCrest } from '../components/ClubIdentity'
import { SkillGame } from '../games/SkillGame'
import { LuckGame } from '../games/LuckGame'
import { StadiumBackdrop,Trophy } from '../games/shared/FootballVisuals'
export function CareerFinalScene({state,onResolved}:{state:CareerState;onResolved:(next:CareerState)=>void}){
  const [playing,setPlaying]=useState<'skill'|'luck'|null>(null)
  const pending=state.pendingFinal
  if(!pending)return null
  const club=clubById(state.clubId),opponent=clubById(pending.opponentClubId),style=state.finalStyle??'mixto'
  const threshold=Math.round(100*Math.max(.56,Math.min(.78,.64+(opponent.prestige-club.prestige)/260)))
  if(playing==='skill')return <SkillGame game={pending.miniGame} career={state} forced onBack={()=>{}} onComplete={score=>onResolved(resolveSkillFinal(state,score))}/>
  if(playing==='luck')return <LuckGame game={pending.cabalaGame} forced onComplete={(won,score)=>onResolved(resolveCabalFinal(state,won,score))}/>
  return <section className="career-match-intro"><StadiumBackdrop/><span className="career-match-intro__tag">{pending.kind==='title'?'LA FINAL':pending.kind==='promotion'?'POR EL ASCENSO':'POR LA PERMANENCIA'}</span><h2>{pending.competition}</h2><div className="career-match-intro__trophy"><Trophy/></div>
    <div className="career-match-intro__versus"><div><ClubCrest name={club.name} size="lg"/><strong>{club.name}</strong></div><b>VS</b><div><ClubCrest name={opponent.name} size="lg"/><strong>{opponent.name}</strong></div></div>
    <span className="career-match-intro__season">TEMPORADA {state.history[pending.seasonRecordIndex]?.season??state.season} · TU NOCHE</span>
    <div className="career-match-intro__actions">{style!=='cabulero'&&<button className="play-button" onClick={()=>setPlaying('skill')}>⚡ JUGAR LA FINAL <small>{threshold} / 100 PARA GANAR</small></button>}{style!=='habilidoso'&&<button className="play-button match-luck" onClick={()=>setPlaying('luck')}>✦ CONFIAR EN EL PÁLPITO <small>EL DESTINO TAMBIÉN JUEGA</small></button>}</div>
  </section>
}
