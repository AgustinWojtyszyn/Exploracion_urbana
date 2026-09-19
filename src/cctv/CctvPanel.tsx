import { clubs, positions, type Mode, type Position } from '../world/Architecture'
import { Badge } from '../ui/ExplorationHud'

export function StartScreen({name,setName,position,setPosition,mode,setMode,starter,setStarter,onStart}:{name:string;setName:(v:string)=>void;position:Position;setPosition:(v:Position)=>void;mode:Mode;setMode:(v:Mode)=>void;starter:string;setStarter:(v:string)=>void;onStart:()=>void}){
 const selected=clubs.find(c=>c.id===starter)??clubs[0]
 return <main className="landing">
  <div className="noise"/>
  <section className="hero">
   <div className="brand"><span>●</span> LEYENDA <b>CAREER</b></div>
   <p className="hero__kicker">MODO CARRERA · FÚTBOL</p>
   <h1>DE PIBE<br/><em>A LEYENDA.</em></h1>
   <p className="hero__copy">Una carrera completa en minutos. Decidí, rendí, negociá y bancate las consecuencias. Cada temporada deja marca.</p>
   <div className="feature-row"><span>6 posiciones</span><span>Mercado dinámico</span><span>Selección</span><span>Modo diario</span></div>
  </section>
  <section className="setup card">
   <div className="section-title"><span>01</span><div><small>TU IDENTIDAD</small><h2>¿Quién sos adentro de la cancha?</h2></div></div>
   <input className="name-input" value={name} onChange={e=>setName(e.target.value)} maxLength={22} placeholder="Tu nombre o apodo"/>
   <div className="mode-switch">
    <button className={mode==='classic'?'active':''} onClick={()=>setMode('classic')}>Carrera clásica</button>
    <button className={mode==='daily'?'active':''} onClick={()=>setMode('daily')}>Desafío del día</button>
   </div>
   <div className="position-grid">{positions.map(p=><button key={p.id} className={'position-card '+(position===p.id?'selected':'')} onClick={()=>setPosition(p.id)}><strong>{p.title}</strong><span>{p.subtitle}</span></button>)}</div>
   <div className="section-title section-title--club"><span>02</span><div><small>PRIMER CONTRATO</small><h2>Arrancá desde abajo</h2></div></div>
   <div className="club-picks">{clubs.slice(0,3).map(c=><button key={c.id} className={'club-pick '+(starter===c.id?'selected':'')} onClick={()=>setStarter(c.id)}><Badge club={c}/><div><strong>{c.name}</strong><span>Prestigio {c.prestige}</span></div></button>)}</div>
   <button className="primary" onClick={onStart}>EMPEZAR MI CARRERA <span>→</span></button>
   <p className="setup-note">{mode==='daily'?'Misma semilla diaria para quienes elijan la misma posición y club.':'La carrera se guarda automáticamente en este navegador.'}</p>
   <div className="selected-preview"><Badge club={selected}/><div><small>VAS A DEBUTAR EN</small><strong>{selected.name}</strong></div></div>
  </section>
 </main>
}
