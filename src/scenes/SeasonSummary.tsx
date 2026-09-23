import { clubById,type SeasonRecord } from '../world/Architecture'
import { ClubCrest } from '../components/ClubIdentity'
import { useDialogFocus } from '../hooks/useDialogFocus'
import { GameParticles } from '../games/shared/GameFeedback'
import { Trophy,StadiumBackdrop } from '../games/shared/FootballVisuals'
export function SeasonSummary({record,onContinue}:{record:SeasonRecord;onContinue:()=>void}){
  const ref=useDialogFocus(onContinue),club=clubById(record.clubId)
  return <div className="career-summary-backdrop"><section ref={ref} tabIndex={-1} className={'career-summary '+(record.titles?'is-champion':'')} role="dialog" aria-modal="true" aria-labelledby="season-title"><StadiumBackdrop/>{record.titles>0&&<GameParticles gold/>}<span className="eyebrow">TEMPORADA {record.season} · {record.age} AÑOS</span><h2 id="season-title">{record.titles?'EN LO MÁS ALTO.':record.outcomeWon?'DEJASTE TU MARCA.':'ESTO TAMBIÉN ES FÚTBOL.'}</h2><div className="career-summary__club"><ClubCrest name={club.name} size="lg"/>{record.titles>0&&<Trophy/>}</div><h3>{club.name}</h3><div className="career-summary__stats">{[[record.matches,'PJ'],[record.goals,'GOLES'],[record.assists,'ASIST.'],[record.rating,'RATING']].map(([value,label])=><div key={label}><b>{value}</b><span>{label}</span></div>)}</div>{record.overallBefore!==undefined&&record.overallAfter!==undefined&&<div className="career-summary__evolution"><span>EVOLUCIÓN OVR</span><strong>{record.overallBefore} <i>→</i> {record.overallAfter}</strong></div>}<div className="career-summary__moment"><span>MOMENTO DE LA TEMPORADA</span><strong>{record.competition??'Tu año en la cancha'}</strong><p>{record.note}</p></div><button className="play-button" onClick={onContinue}>ESCRIBIR EL PRÓXIMO CAPÍTULO →</button></section></div>
}
