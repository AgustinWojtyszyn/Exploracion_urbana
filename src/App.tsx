import { useEffect, useState } from 'react'
import { clubs, clubById, formatMoney, positions, type CareerState, type EventOption, type Mode, type Position, type Tab } from './world/Architecture'
import { applyEffects, createCareer, simulateSeason, trainCareer, transferTo } from './systems/buildingStore'

export function App() {
  const [career,setCareer]=useState<CareerState|null>(()=>{
    try { const raw=localStorage.getItem('leyenda-career-v1'); return raw?JSON.parse(raw):null } catch { return null }
  })
  const [name,setName]=useState('')
  const [position,setPosition]=useState<Position>('9')
  const [mode,setMode]=useState<Mode>('classic')
  const [starter,setStarter]=useState('ombu')
  const [tab,setTab]=useState<Tab>('career')

  useEffect(()=>{ if(career) localStorage.setItem('leyenda-career-v1',JSON.stringify(career)) },[career])

  if(!career) return <main className="landing">
    <section className="hero">
      <p className="kicker">MODO CARRERA · FÚTBOL</p>
      <h1>DE PIBE<br/><em>A LEYENDA.</em></h1>
      <p>Construí una carrera completa en minutos. Decidí, rendí, negociá y bancate las consecuencias.</p>
    </section>
    <section className="setup card">
      <h2>Creá tu jugador</h2>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre o apodo"/>
      <div className="switch"><button className={mode==='classic'?'active':''} onClick={()=>setMode('classic')}>Clásica</button><button className={mode==='daily'?'active':''} onClick={()=>setMode('daily')}>Desafío diario</button></div>
      <div className="grid">{positions.map(p=><button key={p.id} className={position===p.id?'selected':''} onClick={()=>setPosition(p.id)}><strong>{p.title}</strong><span>{p.subtitle}</span></button>)}</div>
      <h3>Primer contrato</h3>
      <div className="clubs">{clubs.slice(0,3).map(c=><button key={c.id} className={starter===c.id?'selected':''} onClick={()=>setStarter(c.id)}><b style={{background:c.primary}}>{c.short}</b><span>{c.name}</span></button>)}</div>
      <button className="primary" onClick={()=>setCareer(createCareer(name,position,mode,starter))}>EMPEZAR CARRERA →</button>
    </section>
  </main>

  const club=clubById(career.clubId)
  const choose=(o:EventOption)=>setCareer(applyEffects(career,o.effects))
  const reset=()=>{localStorage.removeItem('leyenda-career-v1');setCareer(null)}
  return <main className="game">
    <header><strong>LEYENDA</strong><nav>{(['career','market','training','history'] as Tab[]).map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t==='career'?'Carrera':t==='market'?'Mercado':t==='training'?'Entrenamiento':'Historia'}</button>)}</nav><button onClick={reset}>Nueva carrera</button></header>

    <section className="player">
      <div><span className="badge" style={{background:club.primary}}>{club.short}</span><div><small>{career.mode==='daily'?'CARRERA DEL DÍA':'CARRERA CLÁSICA'}</small><h1>{career.playerName}</h1><p>{career.position} · {career.age} años · {club.name}</p></div></div>
      <strong className="ovr">{career.overall}<small>OVR</small></strong>
    </section>

    <section className="stats">
      {[[career.matches,'PARTIDOS'],[career.goals,'GOLES'],[career.assists,'ASISTENCIAS'],[career.titles,'TÍTULOS'],[career.caps,'SELECCIÓN'],['$ '+formatMoney(career.money),'PATRIMONIO']].map(([v,l])=><div key={String(l)}><strong>{v}</strong><span>{l}</span></div>)}
    </section>

    {tab==='career'&&<section className="dashboard">
      <article className="card maincard">
        {career.retired?<><small>FINAL DE CARRERA</small><h2>Se terminó el viaje.</h2><p>{career.matches} partidos, {career.goals} goles y {career.titles} títulos.</p></>:
        career.activeEvent?<><small>{career.activeEvent.eyebrow}</small><h2>{career.activeEvent.title}</h2><p>{career.activeEvent.body}</p><div className="choices">{career.activeEvent.options.map(o=><button key={o.id} onClick={()=>choose(o)}><strong>{o.label}</strong><span>{o.description}</span></button>)}</div></>:
        <><small>TEMPORADA {career.season}</small><h2>Todo listo.</h2><p>Tu nivel, tu forma, el club y tus decisiones van a definir el año.</p><button className="primary" onClick={()=>setCareer(simulateSeason(career))}>JUGAR TEMPORADA ▶</button></>}
      </article>
      <aside className="card"><h3>Estado</h3>{[['Forma',career.form],['Energía',career.energy],['Reputación',career.reputation],['Confianza DT',career.coachTrust],['Idolatría',career.fans]].map(([l,v])=><div className="meter" key={String(l)}><span>{l} <b>{Math.round(Number(v))}</b></span><i><em style={{width:Number(v)+'%'}}/></i></div>)}</aside>
    </section>}

    {tab==='market'&&<section className="card page"><h2>Mercado de pases</h2>{career.offers.length===0?<p>No hay ofertas formales. Terminá otra temporada para mover el mercado.</p>:<div className="offers">{career.offers.map(id=>{const c=clubById(id);return <button key={id} onClick={()=>{setCareer(transferTo(career,id));setTab('career')}}><b style={{background:c.primary}}>{c.short}</b><strong>{c.name}</strong><span>{c.country} · $ {formatMoney(c.salary)}/mes</span></button>})}</div>}</section>}

    {tab==='training'&&<section className="card page"><h2>Entrenamiento</h2><p>Sesiones disponibles: {career.trainingCredits}</p><div className="training">{(['fisico','tecnica','definicion'] as const).map(f=><button key={f} disabled={!career.trainingCredits} onClick={()=>setCareer(trainCareer(career,f))}>{f==='fisico'?'Potencia física':f==='tecnica'?'Técnica individual':'Definición bajo presión'}</button>)}</div></section>}

    {tab==='history'&&<section className="card page"><h2>Tu historia</h2>{career.history.length===0?<p>Todavía no jugaste una temporada completa.</p>:career.history.slice().reverse().map(s=><article className="season" key={s.season}><strong>{clubById(s.clubId).name}</strong><span>Temporada {s.season} · {s.age} años</span><p>{s.matches} PJ · {s.goals} G · {s.assists} A · Rating {s.rating} {s.titles?'· 🏆':''}</p></article>)}</section>}
  </main>
}
