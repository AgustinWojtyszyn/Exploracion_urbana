import { clubById,formatMoney,type CareerState } from '../world/Architecture'
import { careerScore } from '../systems/buildingStore'
import { shopItems } from '../data/careerShop'
import { ClubCrest,useClubMedia } from '../components/ClubIdentity'
import { Stat } from '../components/Stat'
import { Trophy,StadiumBackdrop } from '../games/shared/FootballVisuals'
export function CareerRetirementSummary({state,onNewCareer}:{state:CareerState;onNewCareer:()=>void}){
  const club=clubById(state.clubId)
  const {media}=useClubMedia(club.name)
  const finals=state.history.filter(item=>item.outcomeKind)
  const finalsWon=finals.filter(item=>item.outcomeWon).length
  const finalsLost=finals.filter(item=>item.outcomeWon===false).length
  const assets=shopItems.filter(item=>item.kind==='asset'&&(state.purchases??[]).includes(item.id))
  const staff=shopItems.filter(item=>item.kind==='staff'&&(state.purchases??[]).includes(item.id))
  const journey:Array<{clubId:string;from:number;to:number;matches:number;goals:number;assists:number;titles:number}>=[]

  state.history.forEach(record=>{
    const current=journey[journey.length-1]
    if(current&&current.clubId===record.clubId){
      current.to=record.season
      current.matches+=record.matches
      current.goals+=record.goals
      current.assists+=record.assists
      current.titles+=record.titles
    }else{
      journey.push({clubId:record.clubId,from:record.season,to:record.season,matches:record.matches,goals:record.goals,assists:record.assists,titles:record.titles})
    }
  })

  const score=careerScore(state)
  const legacy=
    score>=1800000?'LEYENDA ABSOLUTA':
    score>=1000000?'LEYENDA':
    score>=550000?'ÍDOLO':
    score>=250000?'REFERENTE':'PROFESIONAL'
  const heroImage=media.stadiumImage??media.image
  const bestSeason=[...state.history].sort((a,b)=>b.rating-a.rating)[0]

  return <section className="career-retirement">
    <div className="retirement-hero" style={heroImage?{backgroundImage:'linear-gradient(90deg,rgba(3,9,19,.95),rgba(3,9,19,.54)),url("'+heroImage+'")'}:undefined}>
      <StadiumBackdrop/><div className="retirement-hero__top"><span>FINAL DE CARRERA</span><b>{legacy}</b></div>
      <div className="retirement-hero__identity">
        <ClubCrest name={club.name} size="lg"/>
        <div><small>{state.nationality} · {state.position}</small><h1>{state.playerName}</h1><p>{state.age} años · último club: {club.name}</p></div>
      </div>
      <div className="retirement-score"><span>SCORE FINAL</span><strong>{score.toLocaleString('es-AR')}</strong><small>{Math.round(state.glory??0).toLocaleString('es-AR')} GLORIA</small></div>
    </div>

    <div className="retirement-stats">
      <Stat value={state.matches} label="PARTIDOS"/>
      <Stat value={state.goals} label="GOLES"/>
      <Stat value={state.assists} label="ASIST."/>
      <Stat value={state.titles} label="TÍTULOS"/>
      <Stat value={finalsWon} label="FINALES GANADAS"/>
      <Stat value={finalsLost} label="FINALES PERDIDAS"/><Stat value={state.history.length} label="TEMPORADAS"/><Stat value={Math.max(state.overall,...state.history.map(record=>record.overallAfter??state.overall))} label="OVR MÁX. REGISTRADO"/>
    </div>

    {bestSeason&&<section className="retirement-best"><span>MOMENTO DE TU CARRERA</span><strong>Temporada {bestSeason.season}</strong><p>{bestSeason.note}</p></section>}
    <section className="retirement-section retirement-section--journey">
      <div className="retirement-section__head"><div><span className="eyebrow">TRAYECTORIA</span><h2>Los clubes que hicieron tu historia.</h2></div><b>{journey.length} ETAPAS</b></div>
      <div className="career-route">{journey.map((step,index)=>{
        const team=clubById(step.clubId)
        return <article key={step.clubId+'-'+index}>
          <span className="route-line"/>
          <ClubCrest name={team.name}/>
          <div><strong>{team.name}</strong><small>Temporadas {step.from}{step.to!==step.from?'–'+step.to:''}</small><p>{step.matches} PJ · {step.goals} G · {step.assists} A · {step.titles} títulos</p></div>
        </article>
      })}</div>
    </section>

    <section className="retirement-section">
      <div className="retirement-section__head"><div><span className="eyebrow">PALMARÉS</span><h2>Lo que levantaste.</h2></div><b>{state.trophies?.length??0} TROFEOS</b></div>
      {(state.trophies?.length??0)>0?<div className="retirement-trophies">{(state.trophies??[]).map(trophy=><article key={trophy.id}><Trophy/><span><strong>{trophy.name}</strong><small>Temporada {trophy.season} · {clubById(trophy.clubId).short}</small></span></article>)}</div>:<div className="retirement-empty">No levantaste trofeos. La carrera igual dejó historia.</div>}
    </section>

    <section className="retirement-section retirement-section--assets">
      <div className="retirement-section__head"><div><span className="eyebrow">FUERA DE LA CANCHA</span><h2>Lo que te llevaste del fútbol.</h2></div><b>$ {formatMoney(state.money)}</b></div>
      <div className="asset-showcase">
        {assets.length?assets.map(item=><article key={item.id}><b>{item.icon}</b><span><strong>{item.name}</strong><small>BIEN ADQUIRIDO</small></span></article>):<div className="retirement-empty">No compraste bienes durante la carrera.</div>}
      </div>
      {staff.length>0&&<div className="career-staff"><span>STAFF QUE TE ACOMPAÑÓ</span><div>{staff.map(item=><b key={item.id}>{item.icon} {item.name}</b>)}</div></div>}
    </section>

    <section className="retirement-section retirement-section--finals">
      <div className="retirement-section__head"><div><span className="eyebrow">PARTIDOS QUE PESARON</span><h2>Finales y noches decisivas.</h2></div></div>
      {finals.length?<div className="final-history">{[...finals].reverse().map(record=><article key={record.season+'-'+record.clubId}>
        <span className={record.outcomeWon?'won':'lost'}>{record.outcomeWon?'✓':'×'}</span>
        <div><strong>{record.competition??'Partido decisivo'}</strong><small>{clubById(record.clubId).name} · Temporada {record.season}</small></div>
        <b>{record.outcomeWon?'GANADA':'PERDIDA'}</b>
      </article>)}</div>:<div className="retirement-empty">No quedaron definiciones registradas en esta carrera.</div>}
    </section>
    <button className="new-career-button" onClick={onNewCareer}>↻ EMPEZAR OTRA CARRERA</button>
  </section>
}

