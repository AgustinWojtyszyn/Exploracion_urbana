import { clubById,leagueById,type CareerState } from '../world/Architecture'
import { ClubCrest } from '../components/ClubIdentity'
const stadiumPhotos=[
  {file:'bernabeu-cc0.jpg',name:'Santiago Bernabéu',source:'https://commons.wikimedia.org/wiki/File:Estadio_de_Futbol_Santiago_Bernabeu.jpg'},
  {file:'wembley-cc0.jpg',name:'Wembley',source:'https://commons.wikimedia.org/wiki/File:Wembley_Association_Football_Stadium.jpg'},
]
export function CareerOverview({state}:{state:CareerState}){
  const club=clubById(state.clubId)
  const stadium=stadiumPhotos[Math.max(0,state.season-1)%stadiumPhotos.length]
  const next=!state.finalStyle?'ELEGÍ TU FILOSOFÍA':state.marketDecisionRequired?'DECIDÍ TU PRÓXIMO CLUB':state.activeEvent?state.activeEvent.eyebrow:'TEMPORADA LISTA PARA JUGAR'
  return <section className="career-command"><div className="career-command__hero">
    <img key={stadium.file} className="career-command__stadium-photo" src={`${import.meta.env.BASE_URL}legends-stadiums/${stadium.file}`} alt="" aria-hidden="true" width={960} height={720} decoding="async" onError={event=>{event.currentTarget.style.visibility='hidden'}}/>
    <header><span>CENTRO DE CARRERA</span><b>TEMP. {String(state.season).padStart(2,'0')}</b></header><div className="career-command__identity"><ClubCrest name={club.name} size="lg"/><div><span>{state.nationality} · {state.age} AÑOS</span><h1>{state.playerName}</h1><p>{club.name}</p><small>{state.divisionTier??leagueById(club.leagueId).tier}ª DIVISIÓN · {club.country}</small></div></div><div className="career-command__overall"><strong>{state.overall}</strong><span>OVR</span></div>
    <a className="career-command__photo-credit" href={stadium.source} target="_blank" rel="noopener noreferrer">Ambientación · {stadium.name} · CC0</a>
    <div className="career-command__next"><i/><span>PRÓXIMO</span><strong>{next}</strong></div></div>
    <div className="career-command__stats">{[[state.matches,'PARTIDOS'],[state.goals,'GOLES'],[state.assists,'ASIST.'],[state.titles,'TÍTULOS']].map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    <div className="career-command__vitals">{[[state.form,'FORMA'],[state.energy,'ENERGÍA'],[state.morale,'MORAL'],[state.reputation,'REPUTACIÓN']].map(([raw,label])=>{const value=Number(raw);return <div key={label}><span>{label}</span><b>{Math.round(value)}</b><meter min="0" max="100" value={value} aria-label={String(label)}/></div>})}</div>
  </section>
}
