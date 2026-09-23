import { CoachFormationBoard } from './scenes/CoachFormationBoard'
import { Stat } from './components/Stat'
import { shopItems } from './data/careerShop'
import { MarketScene as MarketPanel } from './scenes/MarketScene'
import { CareerRetirementSummary } from './scenes/CareerRetirementSummary'
import { ClubCrest, useClubMedia } from './components/ClubIdentity'
import { PlayerGamesHub, CoachGamesHub } from './games/GamesHub'
import { CareerFinalScene } from './scenes/CareerFinalScene'
import { FinalStyleChoice, PositionPicker, EntranceScene } from './scenes/CareerSetup'
import { CareerOverview } from './scenes/CareerOverview'
import { SeasonSummary } from './scenes/SeasonSummary'
import { TrainingScene } from './scenes/TrainingScene'
import { CareerHistory } from './scenes/CareerHistory'
import { Trophy,StadiumBackdrop,FootballPlayerSprite } from './games/shared/FootballVisuals'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  clubs,
  clubsByLeague,
  clubById,
  formatMoney,
  leagues,
  leagueById,
  positions,
  statLabels,
  type CareerState,
  type CoachState,
  type EventOption,
  type GameMode,
  type MiniGameId,
  type PlayerMode,
  type PlayerStatKey,
  type Position,
  type RunScore,
  type SeasonRecord,
  type Tab,
  type Theme,
} from './world/Architecture'
import {
  applyEffects,
  careerDecisionEffects,
  careerScore,
  chooseCoachEvent,
  chooseFinalStyle,
  choosePlayerEvent,
  coachScore,
  createCareer,
  createCoach,
  getRunScores,
  saveRunScore,
  simulateCoachSeason,
  simulateSeason,
  statsFor,
} from './systems/buildingStore'
import { globalRankingEnabled, loadLeaderboard, submitLeaderboardScore } from './systems/rankingService'
import { getClubMedia, preloadClubMedia, type ClubMedia } from './systems/clubMediaService'
import { ensureOpenFootballLeague, isOpenFootballLeague, OPEN_FOOTBALL_LICENSE } from './data/openFootballCatalog'

type SaveState = CareerState | CoachState | null

function normalizeSaveState(value:SaveState):SaveState{
  if(!value)return null
  if(value.gameMode==='coach')return value
  const retirementAge=value.retirementAge??(39+(value.seed%4))
  const seasonsHere=value.history.filter(item=>item.clubId===value.clubId)
  const inferredLegacy=Math.min(
    42,
    seasonsHere.reduce((sum,item)=>sum+Math.max(1,Math.min(5,Math.round((item.rating-6.2)*1.1)+(item.titles?2:0))),0)
  )
  const current=clubById(value.clubId)
  return {
    ...value,
    retirementAge,
    maxSeasons:retirementAge-17,
    clubLegacy:value.clubLegacy??inferredLegacy,
    divisionTier:value.divisionTier??leagueById(current.leagueId).tier,
    caps:value.caps??0,
    nationalGoals:value.nationalGoals??0,
    finalStyle:value.finalStyle??null,
    pendingFinal:value.pendingFinal&&'kind' in value.pendingFinal&&'cabalaGame' in value.pendingFinal?value.pendingFinal:null,
    retirementPending:value.retirementPending??false,
    trophies:value.trophies??[],
    glory:value.glory??0,
    lastSeasonGlory:value.lastSeasonGlory??0,
    marketDecisionRequired:value.marketDecisionRequired??false,
    transferOffers:value.transferOffers??[],
    currentSalary:value.currentSalary??current.salary,
    contractYearsLeft:value.contractYearsLeft??2,
    contractYearsTotal:value.contractYearsTotal??2,
    activeEvent:value.activeEvent?.id==='selection'?null:value.activeEvent,
  }
}

const SAVE_KEY='leyenda-save-v2'
const THEME_KEY='leyenda-theme-v1'
const AUTH_KEY='leyenda-demo-auth-v1'

function LeyendaLogo({size='md'}:{size?:'sm'|'md'|'lg'}){
  return <span className={'leyenda-logo leyenda-logo--'+size} aria-label="Legends">
    <svg className="leyenda-emblem" viewBox="0 0 140 156" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="legendShield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7ec8ff"/>
          <stop offset="48%" stopColor="#317cff"/>
          <stop offset="100%" stopColor="#123f9b"/>
        </linearGradient>
        <linearGradient id="legendGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff0a8"/>
          <stop offset="52%" stopColor="#e7ba4a"/>
          <stop offset="100%" stopColor="#8d621b"/>
        </linearGradient>
      </defs>
      <g className="emblem-laurels">
        <path d="M34 123C17 112 9 94 11 73C12 56 19 41 31 30" fill="none" stroke="url(#legendGold)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M106 123C123 112 131 94 129 73C128 56 121 41 109 30" fill="none" stroke="url(#legendGold)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M22 106l-12-2 8-9m-2-9L5 80l12-5m1-10L8 56l14-2m4-10l-7-11 14 2" fill="none" stroke="#e7ba4a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M118 106l12-2-8-9m2-9 11-6-12-5m-1-10 10-9-14-2m-4-10 7-11-14 2" fill="none" stroke="#e7ba4a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <path className="emblem-star" d="M70 4l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="url(#legendGold)"/>
      <path d="M70 23L111 39V78c0 29-17 48-41 62-24-14-41-33-41-62V39z" fill="#071323" stroke="#d9edff" strokeWidth="3"/>
      <path d="M70 30l33 13v34c0 23-13 39-33 52-20-13-33-29-33-52V43z" fill="url(#legendShield)" stroke="rgba(255,255,255,.35)" strokeWidth="2"/>
      <path d="M70 39l24 9v27c0 17-9 29-24 40-15-11-24-23-24-40V48z" fill="rgba(5,16,37,.32)" stroke="rgba(255,255,255,.24)" strokeWidth="1.5"/>
      <circle cx="70" cy="72" r="23" fill="rgba(4,14,31,.62)" stroke="#e8f4ff" strokeWidth="2"/>
      <path d="M55 59l11 7 13-4 8 10-7 12-14 1-10-10z" fill="none" stroke="rgba(255,255,255,.42)" strokeWidth="1.7"/>
      <path d="M66 66l-4 12m17-16-2 14m-11 9 7 8" fill="none" stroke="rgba(255,255,255,.32)" strokeWidth="1.4"/>
      <text x="70" y="82" textAnchor="middle" className="emblem-letter">L</text>
      <path d="M35 118h70l-8 20H43z" fill="#071323" stroke="url(#legendGold)" strokeWidth="2"/>
      <text x="70" y="132" textAnchor="middle" className="emblem-word">LEGENDS</text>
    </svg>
  </span>
}

function AssetBootScreen(){
  return <div className="asset-boot">
    <div className="asset-boot__mark"><LeyendaLogo size="lg"/></div>
    <strong>LEGENDS</strong>
    <span>Preparando clubes, escudos y cancha…</span>
    <div className="asset-boot__track"><i/></div>
  </div>
}

function MockLogin({onEnter}:{onEnter:(name:string)=>void}){
  const [name,setName]=useState('')
  const submit=(event:FormEvent)=>{
    event.preventDefault()
    onEnter(name.trim()||'Invitado')
  }
  return <div className="demo-login">
    <StadiumBackdrop/><div className="demo-login__athlete"><FootballPlayerSprite number="10"/></div>
    <section className="demo-login__card">
      <div className="demo-login__brand"><LeyendaLogo size="lg"/><div><span>LEGENDS</span><small>FÚTBOL · DESTINO · HISTORIA</small></div></div>
      <div className="demo-login__copy"><span className="eyebrow">EL PRIMER PASO</span><h1>De promesa<br/>a leyenda.</h1><p>Una carrera. Tus decisiones. Todas las noches que quedan por jugar.</p></div>
      <form onSubmit={submit}>
        <label><span>USUARIO O APODO</span><input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="Ej: Agustín"/></label>
        <button type="submit">ENTRAR A LEGENDS →</button>
      </form>
      <button className="demo-login__guest" onClick={()=>onEnter('Invitado')}>Entrar como invitado</button>
      <small className="demo-login__note">La carrera se guarda en esta pestaña durante la sesión.</small>
    </section>
  </div>
}

function MatchdayScene({clubName,media,mode,season,age}:{clubName:string;media:ClubMedia;mode:'player'|'coach';season:number;age?:number}){
  const background=media.stadiumImage??media.image
  return <section className={'matchday-scene '+(background?'matchday-scene--photo':'matchday-scene--fallback')} style={background?{backgroundImage:'linear-gradient(180deg,rgba(3,8,17,.08),rgba(3,8,17,.88)),url("'+background+'")'}:undefined}>
    <div className="matchday-scene__lights"><i/><i/><i/><i/></div>
    <div className="matchday-scene__stands"><i/><i/><i/></div>
    <div className="matchday-scene__pitch"><span/><span/><span/></div>
    <div className="matchday-scene__scoreboard">
      <ClubCrest name={clubName} size="lg"/>
      <div><small>{mode==='player'?'JORNADA DE CARRERA':'DÍA DE PARTIDO'}</small><strong>{clubName}</strong><span>{media.stadiumName??'Sede del club'}</span></div>
    </div>
    <div className="matchday-scene__meta"><span>Temporada {season}</span>{typeof age==='number'&&<b>{age} años</b>}</div>
    <div className="matchday-scene__name">{clubName}</div>
  </section>
}

function DecisionScene({category,title,media,clubName}:{category:string;title:string;media:ClubMedia;clubName:string}){
  const visuals:Record<string,{icon:string;label:string}>={
    football:{icon:'⚽',label:'CANCHA'},
    life:{icon:'◌',label:'FUERA DEL FÚTBOL'},
    media:{icon:'◉',label:'PRENSA'},
    health:{icon:'✚',label:'PARTE MÉDICO'},
    contract:{icon:'↗',label:'CONTRATO'},
    locker:{icon:'▦',label:'VESTUARIO'},
    coach:{icon:'⌁',label:'DECISIÓN DEL DT'},
  }
  const visual=visuals[category]??visuals.football
  const background=category==='football'?(media.stadiumImage??media.image):(media.image??media.stadiumImage)
  return <div className={'decision-scene decision-scene--'+category} style={background?{backgroundImage:'linear-gradient(90deg,rgba(3,9,18,.82),rgba(3,9,18,.28)),url("'+background+'")'}:undefined}>
    <div className="decision-scene__icon">{visual.icon}</div>
    <div className="decision-scene__copy"><span>{visual.label}</span><strong>{title}</strong><small>{clubName}</small></div>
    <div className="decision-scene__graphic"><i/><i/><i/></div>
  </div>
}

function ThemeToggle({theme,onToggle}:{theme:Theme;onToggle:()=>void}){
  return <button className="theme-toggle" onClick={onToggle} aria-label="Cambiar tema">
    <span className="theme-toggle__icon">{theme==='dark'?'☾':'☀'}</span>
    <span>{theme==='dark'?'Oscuro':'Claro'}</span>
  </button>
}

function SelectField({label,value,onChange,children}:{label:string;value:string;onChange:(value:string)=>void;children:React.ReactNode}){
  return <label className="field">
    <span>{label}</span>
    <select value={value} onChange={e=>onChange(e.target.value)}>{children}</select>
  </label>
}

function Meter({label,value}:{label:string;value:number}){
  return <div className="meter">
    <div className="meter__row"><span>{label}</span><strong>{Math.round(value)}</strong></div>
    <div className="meter__track"><i style={{width:Math.max(2,Math.min(100,value))+'%'}}/></div>
  </div>
}



function IdolProgress({value,years}:{value:number;years:number}){
  const level=
    value<6?'DESCONOCIDO':
    value<15?'YA TE UBICAN':
    value<30?'TITULAR QUERIDO':
    value<48?'REFERENTE':
    value<68?'BANDERA':
    value<90?'ÍDOLO':'LEGENDS'
  return <section className="idol-progress">
    <div className="idol-progress__head"><span>HUELLA EN EL CLUB</span><strong>{level} · {Math.round(value)}/100</strong></div>
    <div className="idol-progress__track"><i style={{width:Math.max(1,value)+'%'}}/><b className="i1">●</b><b className="i2">◆</b><b className="i3">★</b><b className="i4">♛</b></div>
    <div className="idol-progress__foot"><span>AÑOS EN ESTE CLUB</span><strong>{years} {years===1?'AÑO':'AÑOS'}</strong></div>
  </section>
}

const effectLabels:Record<string,string>={
  pace:'VELOCIDAD',
  finishing:'DEFINICIÓN',
  passing:'PASE',
  dribbling:'REGATE',
  defending:'DEFENSA',
  physical:'FÍSICO',
  reflexes:'REFLEJOS',
  overall:'OVR',
  form:'FORMA',
  energy:'ENERGÍA',
  reputation:'REPUTACIÓN',
  fans:'POPULARIDAD',
  coachTrust:'CONFIANZA DT',
  discipline:'DISCIPLINA',
  leadership:'LIDERAZGO',
  morale:'MORAL',
  injuryRisk:'RIESGO LESIÓN',
  money:'DINERO',
}

function EffectChips({effects}:{effects:EventOption['effects']}){
  const entries=Object.entries(effects).filter(([,value])=>typeof value==='number'&&value!==0)
  return <div className="effect-chips">{entries.map(([key,value])=>{
    const numeric=Number(value)
    const dangerous=key==='injuryRisk'
    const positive=dangerous?numeric<0:numeric>0
    const amount=key==='money'
      ?(numeric>0?'+':'-')+'$'+formatMoney(Math.abs(numeric))
      :(numeric>0?'+':'')+numeric+' '+(effectLabels[key]??key.toUpperCase())
    return <span key={key} className={positive?'positive':'negative'}>{amount}</span>
  })}</div>
}

const visibleStatsByPosition:Record<Position,PlayerStatKey[]> = {
  '9':['pace','finishing','dribbling','physical','passing'],
  '10':['passing','dribbling','pace','finishing','physical'],
  '7':['pace','dribbling','passing','finishing','physical'],
  '5':['passing','defending','physical','pace','dribbling'],
  '2':['defending','physical','pace','passing'],
  '1':['reflexes','physical','passing'],
}

function PlayerAttributes({state}:{state:CareerState}){
  const stats=statsFor(state)
  const keys=visibleStatsByPosition[state.position]
  const entries=keys.map(key=>[key,stats[key]] as const)
  const best=new Set(
    entries.slice().sort((a,b)=>b[1]-a[1]).slice(0,2).map(([key])=>key)
  )
  return <section className="attributes-card">
    <div className="attributes-head">
      <div><span className="eyebrow">ATRIBUTOS DE TU PUESTO</span><h3>{positions.find(p=>p.id===state.position)?.title.split('·')[1]??'Jugador'}</h3></div>
      <span className="attributes-ovr">{state.overall}<small>OVR</small></span>
    </div>
    <div className="attributes-grid">{entries.map(([key,value])=><div className={best.has(key)?'attribute best':'attribute'} key={key}>
      <div><span>{statLabels[key]}</span><strong>{Math.round(value)}</strong></div>
      <i><b style={{width:Math.max(2,value)+'%'}}/></i>
    </div>)}</div>
  </section>
}

function StoryModes({start}:{start:(name:string,position:Position,clubId:string)=>void}){
  const byName=(name:string)=>clubs.find(club=>club.country==='Argentina'&&club.name===name)?.id
  const fallback=clubs.find(club=>club.country==='Argentina')?.id??clubs[0].id
  const stories=[
    {tag:'SAN JUAN',title:'EL PIBE DEL INTERIOR',body:'Debutás lejos de los flashes. Tenés que ganarte cada minuto.',icon:'⛰',position:'9' as Position,clubId:byName('San Martín de San Juan')??fallback},
    {tag:'DEFENSA',title:'EL 2 QUE NADIE QUERÍA',body:'Poco ruido, mucho duelo. Convertite en patrón del fondo.',icon:'◆',position:'2' as Position,clubId:byName('Banfield')??fallback},
    {tag:'ARCO',title:'DEBUT DE EMERGENCIA',body:'El titular cae y tu carrera arranca sin aviso.',icon:'◇',position:'1' as Position,clubId:byName('Aldosivi')??fallback},
  ]
  return <section className="story-mode-panel">
    <div className="section-head"><div><span className="eyebrow">MODO HISTORIA · ORIGINAL</span><h2>Tres carreras para arrancar distinto.</h2></div><span className="pill">ARG</span></div>
    <div className="story-mode-grid">{stories.map(story=><button key={story.title} onClick={()=>start('',story.position,story.clubId)}>
      <b>{story.icon}</b>
      <span><small>{story.tag}</small><strong>{story.title}</strong><em>{story.body}</em></span>
      <i>JUGAR →</i>
    </button>)}</div>
  </section>
}

function ClubPickerModal({clubsList,selectedId,title,onSelect,onClose}:{clubsList:typeof clubs;selectedId:string;title:string;onSelect:(id:string)=>void;onClose:()=>void}){
  const [query,setQuery]=useState('')
  const filtered=clubsList.filter(club=>club.name.toLowerCase().includes(query.trim().toLowerCase()))
  return <div className="club-picker-overlay" onClick={onClose}>
    <section className="club-picker-modal" onClick={event=>event.stopPropagation()}>
      <div className="club-picker-grab"/>
      <div className="club-picker-modal__head">
        <div><span className="eyebrow">{title.toUpperCase()}</span><h2>Elegí tu club</h2></div>
        <button onClick={onClose} aria-label="Cerrar">×</button>
      </div>
      <label className="club-picker-search"><span>⌕</span><input autoFocus value={query} onChange={event=>setQuery(event.target.value)} placeholder="Buscar equipo..."/></label>
      <div className="club-picker-results">
        {filtered.map(club=><button key={club.id} className={club.id===selectedId?'active':''} onClick={()=>{onSelect(club.id);onClose()}}>
          <ClubCrest name={club.name}/>
          <span><strong>{club.name}</strong><small>Prestigio {club.prestige} · OVR base {club.minOverall}</small></span>
          <b>{club.id===selectedId?'✓':'›'}</b>
        </button>)}
        {!filtered.length&&<div className="club-picker-empty">No encontré clubes con ese nombre.</div>}
      </div>
    </section>
  </div>
}

function Home({
  theme,onTheme,startPlayer,startCoach
}:{
  theme:Theme
  onTheme:()=>void
  startPlayer:(name:string,position:Position,mode:PlayerMode,clubId:string,nationality:string)=>void
  startCoach:(name:string,clubId:string)=>void
}){
  useEffect(()=>{window.scrollTo({top:0,behavior:'auto'})},[])
  const countries=useMemo(()=>[...new Set(leagues.map(l=>l.country))].sort((a,b)=>a.localeCompare(b,'es')),[])
  const [gameMode,setGameMode]=useState<GameMode>('player')
  const [playerMode,setPlayerMode]=useState<PlayerMode>('classic')
  const [name,setName]=useState('')
  const [nationality,setNationality]=useState('Argentina')
  const [country,setCountry]=useState('')
  const [leagueId,setLeagueId]=useState('')
  const [clubId,setClubId]=useState('')
  const [position,setPosition]=useState<Position>('9')
  const [clubPickerOpen,setClubPickerOpen]=useState(false)
  const [catalogRevision,setCatalogRevision]=useState(0)
  const [leagueLoading,setLeagueLoading]=useState(false)
  const [leagueLoadFailed,setLeagueLoadFailed]=useState(false)

  const availableLeagues=country?leagues.filter(l=>l.country===country).sort((a,b)=>a.tier-b.tier):[]
  const activeLeague=availableLeagues.some(l=>l.id===leagueId)?leagueId:''
  const availableClubs=activeLeague?clubsByLeague(activeLeague):[]
  void catalogRevision
  const activeClub=availableClubs.some(club=>club.id===clubId)?clubId:''
  const selectedClub=activeClub?clubById(activeClub):null
  const {media:selectedMedia}=useClubMedia(selectedClub?.name??'')
  const canStart=Boolean(country&&activeLeague&&activeClub)

  const changeCountry=(value:string)=>{
    setCountry(value)
    setLeagueId('')
    setClubId('')
    setClubPickerOpen(false)
  }

  const changeLeague=(value:string)=>{
    setLeagueId(value)
    setClubId('')
    setClubPickerOpen(false)
  }

  useEffect(()=>{
    if(!activeLeague||!isOpenFootballLeague(activeLeague)||clubsByLeague(activeLeague).length)return
    let alive=true
    setLeagueLoading(true)
    setLeagueLoadFailed(false)
    void ensureOpenFootballLeague(activeLeague).then(result=>{
      if(!alive)return
      setLeagueLoadFailed(!result.ok)
      setCatalogRevision(value=>value+1)
    }).finally(()=>{if(alive)setLeagueLoading(false)})
    return()=>{alive=false}
  },[activeLeague])

  useEffect(()=>{
    if(country!=='Argentina'||!activeLeague||!availableClubs.length)return
    const id=window.setTimeout(()=>{
      void preloadClubMedia(availableClubs.map(club=>club.name),5,false)
    },120)
    return()=>window.clearTimeout(id)
  },[country,activeLeague,catalogRevision])

  const leagueLabel=activeLeague?leagueById(activeLeague):null

  return <div className="shell shell--home">
    <header className="site-header">
      <a className="brand" href="#" onClick={event=>event.preventDefault()}>
        <LeyendaLogo size="sm"/>
        <span><strong>LEGENDS</strong><small>FÚTBOL · DESTINO · GLORIA</small></span>
      </a>
      <ThemeToggle theme={theme} onToggle={onTheme}/>
    </header>

    <div className="home-layout">
      <aside className="desktop-rail">
        <div className="rail-title"><span>✦</span> MUNDO LEGENDS</div>
        <div className="rail-search">Elegí dónde empieza tu historia</div>
        <div className="rail-list">
          {countries.slice(0,12).map(item=><button key={item} className={item===country?'active':''} onClick={()=>changeCountry(item)}>
            <span>{item}</span><b>{leagues.filter(league=>league.country===item).length}</b>
          </button>)}
        </div>
        <div className="rail-foot"><strong>ARG</strong><span>Primera + Primera Nacional listas para test.</span></div>
      </aside>

      <main className="home-main home-main--compact">
        <EntranceScene mode={gameMode} onMode={setGameMode}/>

        <section className="create-card create-card--primary">
          <div className="setup-heading">
            <div><span className="eyebrow">TU ARRANQUE</span><h2>Elegí dónde empieza todo.</h2><p>Nada se asigna al azar. País, división y club son decisión tuya.</p></div>
            <div className="setup-progress">
              <span className={country?'done':'active'}>1<small>PAÍS</small></span>
              <span className={activeLeague?'done':country?'active':''}>2<small>DIVISIÓN</small></span>
              <span className={activeClub?'done':activeLeague?'active':''}>3<small>CLUB</small></span>
              <span className={activeClub?'active':''}>4<small>ROL</small></span>
            </div>
          </div>

          <div className="form-grid form-grid--start">
            {gameMode==='player'&&<SelectField label="NACIONALIDAD" value={nationality} onChange={setNationality}>
              {[...new Set(['Argentina',...countries])].map(item=><option key={item} value={item}>{item}</option>)}
            </SelectField>}
            <SelectField label="PAÍS DE LA LIGA" value={country} onChange={changeCountry}>
              <option value="">Elegí un país...</option>
              {countries.map(item=><option key={item} value={item}>{item}</option>)}
            </SelectField>
            <SelectField label="DIVISIÓN" value={activeLeague} onChange={changeLeague}>
              <option value="">{country?'Elegí una división...':'Primero elegí un país'}</option>
              {availableLeagues.map(league=><option key={league.id} value={league.id}>{league.tier}ª División · {league.country}</option>)}
            </SelectField>
          </div>

          {activeLeague&&<section className="club-choice-zone">
            <div className="club-choice-head">
              <div><span className="eyebrow">{country.toUpperCase()} · {leagueLabel?.tier}ª DIVISIÓN</span><h3>Elegí tu club</h3></div>
              <button className="club-picker-open" disabled={leagueLoading||!availableClubs.length} onClick={()=>setClubPickerOpen(true)}>{leagueLoading?'CARGANDO…':availableClubs.length+' CLUBES · VER TODOS'}</button>
            </div>
            {leagueLoading?<div className="league-data-state"><b>⚽</b><span><strong>Cargando liga abierta…</strong><small>Datos CC0 de OpenFootball. Se guarda en este dispositivo para próximas partidas.</small></span></div>:
            leagueLoadFailed&&!availableClubs.length?<div className="league-data-state league-data-state--error"><b>↻</b><span><strong>Esta temporada no está publicada en la fuente.</strong><small>Probá otra división; el catálogo sólo habilita datos con licencia abierta verificable.</small></span></div>:
            <div className="club-strip club-strip--choice">
              {availableClubs.slice(0,12).map(club=><button key={club.id} className={club.id===activeClub?'active':''} onClick={()=>setClubId(club.id)}>
                <ClubCrest name={club.name}/>
                <span>{club.name}</span>
              </button>)}
            </div>}
            {isOpenFootballLeague(activeLeague)&&<small className="open-data-note">FUENTE DE CLUBES · OPENFOOTBALL · {OPEN_FOOTBALL_LICENSE}</small>}
          </section>}

          {selectedClub?<div className="club-preview club-preview--media club-preview--selected" style={(selectedMedia.stadiumImage??selectedMedia.image)?{backgroundImage:'linear-gradient(90deg,var(--surface) 18%,rgba(5,10,18,.7)),url("'+(selectedMedia.stadiumImage??selectedMedia.image)+'")'}:undefined}>
            <ClubCrest name={selectedClub.name} size="lg"/>
            <div><span>{leagueById(selectedClub.leagueId).name}</span><strong>{selectedClub.name}</strong><small>Este será tu primer club.</small></div>
            <b>✓</b>
          </div>:<div className="club-empty-prompt"><b>◈</b><span><strong>Elegí un club para continuar.</strong><small>La carrera no arranca hasta que vos decidas el destino.</small></span></div>}

          <label className="name-field">
            <span>{gameMode==='player'?'NOMBRE O APODO':'NOMBRE DEL ENTRENADOR'}</span>
            <input value={name} onChange={event=>setName(event.target.value)} maxLength={24} placeholder={gameMode==='player'?'Ej: El Zurdo':'Ej: Míster A.'}/>
          </label>

          {gameMode==='player'&&<PositionPicker value={position} onChange={setPosition}/>}

          {gameMode==='coach'&&<div className="coach-features">
            <span>◈ Mercado</span><span>◈ Juveniles</span><span>◈ Vestuario</span><span>◈ Táctica</span>
          </div>}

          <button className="play-button start-career-button" disabled={!canStart} onClick={()=>{
            if(!activeClub)return
            if(gameMode==='player') startPlayer(name,position,playerMode,activeClub,nationality)
            else startCoach(name,activeClub)
          }}>
            <span>▶</span>{canStart?(gameMode==='player'?'EMPEZAR CARRERA':'ASUMIR COMO ENTRENADOR'):'ELEGÍ PAÍS, DIVISIÓN Y CLUB'}
          </button>
        </section>

        <section className="daily-card daily-card--compact">
          <div className="section-head"><div><span className="eyebrow">DESAFÍO DEL DÍA</span><h2>Una carrera corta. Una semilla compartida.</h2></div><span className="pill">HOY</span></div>
          <div className="daily-goals daily-goals--horizontal"><div><b>01</b><span>Terminá</span><strong>+500</strong></div><div><b>02</b><span>Ganate un título</span><strong>+250</strong></div><div><b>03</b><span>Superá tu score</span><strong>+150</strong></div></div>
          {gameMode==='player'&&<button className="ghost-action" onClick={()=>setPlayerMode(playerMode==='daily'?'classic':'daily')}>{playerMode==='daily'?'✓ Desafío diario activado':'Activar desafío diario'}</button>}
        </section>

        <section className="feature-grid feature-grid--compact">
          <article><span>◎</span><div><strong>MINIJUEGOS</strong><small>Finales y partidos decisivos</small></div></article>
          <article><span>↗</span><div><strong>MERCADO</strong><small>Ofertas desde tu primera temporada</small></div></article>
          <article><span>♛</span><div><strong>PALMARÉS</strong><small>Copas, ascensos y gloria</small></div></article>
          <article><span>⌁</span><div><strong>RANKING</strong><small>Compará carreras completas</small></div></article>
        </section>

        {clubPickerOpen&&activeLeague&&<ClubPickerModal clubsList={availableClubs} selectedId={activeClub} title={country+' · '+(leagueLabel?.tier??'')+'ª División'} onSelect={setClubId} onClose={()=>setClubPickerOpen(false)}/>}

        <footer className="legal-note">LEYENDA usa nombres de clubes reales y referencias públicas de Wikipedia/Wikimedia para sus escudos durante esta prueba. No incluye futbolistas reales.</footer>
      </main>
    </div>
  </div>
}

function GameTopNav({
  tab,setTab,coach,clubName,onExit,onRetire,retired,theme,onTheme
}:{
  tab:Tab
  setTab:(t:Tab)=>void
  coach:boolean
  clubName:string
  onExit:()=>void
  onRetire?:()=>void
  retired?:boolean
  theme:Theme
  onTheme:()=>void
}){
  const [moreOpen,setMoreOpen]=useState(false)
  const primary:Array<[Tab,string]> = coach
    ? [['career','Inicio'],['squad','Equipo'],['minigames','Desafíos']]
    : [['career','Carrera'],['market','Mercado'],['minigames','Jugar']]
  const secondary:Array<[Tab,string]> = coach
    ? [['history','Historia'],['ranking','Ranking']]
    : [['training','Entreno'],['shop','Tienda'],['history','Historia'],['ranking','Ranking']]
  const go=(next:Tab)=>{
    setMoreOpen(false)
    setTab(next)
    window.scrollTo({top:0,behavior:'smooth'})
  }
  const secondaryActive=secondary.some(([id])=>id===tab)
  return <header className="game-topbar">
    <div className="game-topbar__brand">
      <button onClick={()=>{if(window.confirm('¿Cerrar la carrera actual y volver al inicio?'))onExit()}} aria-label="Nueva carrera"><LeyendaLogo size="sm"/></button>
      <div><strong>LEGENDS</strong><small>{clubName}</small></div>
    </div>
    <nav className="game-topbar__nav" aria-label="Secciones del juego">
      {primary.map(([id,label])=><button key={id} className={tab===id?'active':''} onClick={()=>go(id)}>{label}</button>)}
      <button className={secondaryActive||moreOpen?'active':''} onClick={()=>setMoreOpen(open=>!open)}>Más <span>⌄</span></button>
    </nav>
    <button className="game-topbar__theme" onClick={onTheme} aria-label="Cambiar tema">{theme==='dark'?'☾':'☀'}</button>
    {moreOpen&&<div className="game-topbar__more">
      {secondary.map(([id,label])=><button key={id} className={tab===id?'active':''} onClick={()=>go(id)}>{label}</button>)}
      {!coach&&!retired&&onRetire&&<button className="game-topbar__danger" onClick={()=>{setMoreOpen(false);onRetire()}}>⌛ Retirarme ahora</button>}
      <button className="game-topbar__new" onClick={()=>{setMoreOpen(false);if(window.confirm('¿Empezar otra carrera? La carrera actual se cerrará en este dispositivo.'))onExit()}}>↻ Nueva carrera</button>
    </div>}
  </header>
}
function shopEffectsFor(position:Position,id:string,base:EventOption['effects']):EventOption['effects']{
  if(id==='video'){
    if(position==='1')return {passing:3,reflexes:2,coachTrust:5}
    if(position==='2'||position==='5')return {passing:3,defending:3,coachTrust:5}
    return {passing:3,dribbling:2,coachTrust:5}
  }
  if(id==='technical'){
    if(position==='1')return {reflexes:4,passing:2}
    if(position==='2')return {defending:3,passing:3,physical:1}
    if(position==='5')return {passing:4,defending:2}
    return {dribbling:4,finishing:3}
  }
  return base
}

function ShopPanel({state,setState}:{state:CareerState;setState:(next:CareerState)=>void}){
  const owned=new Set(state.purchases??[])
  const buy=(item:(typeof shopItems)[number])=>{
    if(owned.has(item.id)||state.money<item.cost)return
    const effects=shopEffectsFor(state.position,item.id,item.effects)
    const next=applyEffects(state,effects)
    setState({...next,activeEvent:state.activeEvent,money:next.money-item.cost,purchases:[...(state.purchases??[]),item.id]})
  }
  const staff=shopItems.filter(item=>item.kind==='staff')
  const assets=shopItems.filter(item=>item.kind==='asset')

  return <section className="panel shop-panel shop-panel--career">
    <div className="panel-head"><div><span className="eyebrow">TU CARRERA · STAFF + BIENES</span><h2>Lo que construís afuera también queda.</h2></div><span className="wallet">$ {formatMoney(state.money)}</span></div>
    <p className="shop-intro">Sin marcas. Mejorás tu entorno profesional y, cuando la carrera despega, empezás a convertir contratos en patrimonio.</p>

    <div className="shop-section-head"><span>STAFF · CAMBIA TU RENDIMIENTO</span><b>{staff.filter(item=>owned.has(item.id)).length}/{staff.length}</b></div>
    <div className="shop-list">{staff.map(item=>{
      const bought=owned.has(item.id)
      const effects=shopEffectsFor(state.position,item.id,item.effects)
      return <button key={item.id} disabled={bought||state.money<item.cost} onClick={()=>buy(item)}>
        <b>{item.icon}</b>
        <span><strong>{item.name}</strong><small>{item.description}</small><EffectChips effects={effects}/></span>
        <em>{bought?'CONTRATADO':'$ '+formatMoney(item.cost)}</em>
      </button>
    })}</div>

    <div className="shop-section-head shop-section-head--assets"><span>BIENES · QUEDAN EN TU HISTORIA</span><b>{assets.filter(item=>owned.has(item.id)).length}/{assets.length}</b></div>
    <div className="asset-shop-grid">{assets.map(item=>{
      const bought=owned.has(item.id)
      return <button key={item.id} className={bought?'owned':''} disabled={bought||state.money<item.cost} onClick={()=>buy(item)}>
        <span className="asset-shop-art"><b>{item.icon}</b><i/><i/></span>
        <strong>{item.name}</strong>
        <small>{item.description}</small>
        <em>{bought?'✓ TUYO':'$ '+formatMoney(item.cost)}</em>
      </button>
    })}</div>
  </section>
}

function RankingPanel({scores}:{scores:RunScore[]}){
  return <section className="panel ranking-panel">
    <div className="panel-head"><div><span className="eyebrow">HALL DE LA FAMA</span><h2>Mejores carreras</h2></div><span className="pill">{globalRankingEnabled?'GLOBAL':'LOCAL'} · TOP {Math.min(20,scores.length)}</span></div>
    {scores.length===0?<div className="empty-state"><b>⌁</b><strong>Todavía no hay carreras terminadas.</strong><span>Tu primera run completa inaugura el ranking.</span></div>:
      <div className="ranking-list">{scores.slice(0,20).map((s,i)=><div key={s.id}><b>{String(i+1).padStart(2,'0')}</b><div><strong>{s.name}</strong><span>{s.detail}</span></div><em>{s.score.toLocaleString('es-AR')}</em></div>)}</div>}
  </section>
}

function TrophyCabinet({state}:{state:CareerState}){
  const trophies=state.trophies??[]
  if(!trophies.length)return null
  const grouped=Object.values(trophies.reduce<Record<string,{name:string;icon:string;count:number}>>((acc,trophy)=>{
    const current=acc[trophy.name]??{name:trophy.name,icon:trophy.icon,count:0}
    current.count+=1
    acc[trophy.name]=current
    return acc
  },{}))
  return <section className="trophy-cabinet"><div className="trophy-cabinet__head"><div><span className="eyebrow">PALMARÉS</span><h3>Tu vitrina</h3></div><strong>{trophies.length} TROFEOS</strong></div><div className="trophy-grid">{grouped.map(item=><article key={item.name}><Trophy/><span><strong>{item.name}</strong><small>x{item.count}</small></span></article>)}</div></section>
}
function PlayerGame({state,setState,theme,onTheme,onExit}:{state:CareerState;setState:(s:CareerState)=>void;theme:Theme;onTheme:()=>void;onExit:()=>void}){
  const [tab,setTab]=useState<Tab>('career')
  const [scores,setScores]=useState<RunScore[]>(()=>getRunScores())
  const [lastEffects,setLastEffects]=useState<EventOption['effects']|null>(null)
  const [seasonSummary,setSeasonSummary]=useState<SeasonRecord|null>(null)
  const club=clubById(state.clubId)
  const playerStats=statsFor(state)
  const {media:playerMedia}=useClubMedia(club.name)

  const retireNow=()=>{
    if(!window.confirm('¿Retirarte ahora? Vas a cerrar la carrera con tu edad y estadísticas actuales.'))return
    const base:CareerState={
      ...state,
      retired:true,
      retirementPending:false,
      pendingFinal:null,
      marketDecisionRequired:false,
      activeEvent:null,
    }
    setSeasonSummary(null)
    setLastEffects(null)
    setTab('career')
    setState({...base,finalScore:careerScore(base)})
    window.scrollTo({top:0,behavior:'auto'})
  }

  useEffect(()=>{
    loadLeaderboard().then(setScores)
  },[])

  useEffect(()=>{
    if(state.retired&&state.finalScore&&!scores.some(s=>s.id==='player-'+state.seed)){
      const run={id:'player-'+state.seed,name:state.playerName,mode:'player' as const,score:state.finalScore,detail:`${state.position} · ${state.history.length} temporadas · ${state.titles} títulos`,createdAt:Date.now()}
      const next=saveRunScore(run)
      setScores(next)
      void submitLeaderboardScore(run).then(()=>loadLeaderboard()).then(setScores)
    }
  },[state.retired,state.finalScore])

  useEffect(()=>{
    if(state.pendingFinal&&tab!=='career')setTab('career')
  },[state.pendingFinal,tab])


  const playSeason=()=>{
    const next=simulateSeason(state)
    if(next===state)return
    setSeasonSummary(next.pendingFinal?null:(next.history[next.history.length-1]??null))
    setLastEffects(null)
    setState(next)
  }

  const resolveFinal=(next:CareerState)=>{
    setState(next)
    setSeasonSummary(next.history[next.history.length-1]??null)
    setLastEffects(null)
  }

  const closeSeasonSummary=()=>{
    setSeasonSummary(null)
    if(state.marketDecisionRequired)setTab('market')
  }

  const playMini=(game:MiniGameId,value:number)=>{
    if(value<45||state.retired)return
    const bonus=value>=80?2:1
    const effects:EventOption['effects']=
      game==='penalties'||game==='freekicks'?{finishing:bonus,form:1}:
      game==='dribble'||game==='personal-run'?{dribbling:bonus,pace:1}:
      game==='timing-run'?{pace:bonus,physical:1}:
      game==='keeper'?{reflexes:bonus,form:1}:
      game==='duel'?{defending:bonus,physical:1}:
      game==='memory-board'||game==='code-call'?{passing:bonus,discipline:1}:
      game==='tactic-grid'?{passing:bonus,leadership:1}:
      game==='power-shot'?{finishing:bonus,physical:1}:
      game==='ball-track'||game==='grid-gap'?{dribbling:1,passing:1}:
      game==='hold-up'?{physical:bonus,dribbling:1}:
      game==='through-pass'||game==='long-kick'||game==='pressure-exit'?{passing:bonus,coachTrust:1}:
      {form:1}
    const next=applyEffects(state,effects)
    setState({...next,activeEvent:state.activeEvent})
  }

  return <div className="shell game-shell">
    <GameTopNav tab={tab} setTab={setTab} coach={false} clubName={club.name} onExit={onExit} onRetire={retireNow} retired={state.retired} theme={theme} onTheme={onTheme}/>

    <main className="game-main">
      {seasonSummary&&<SeasonSummary record={seasonSummary} onContinue={closeSeasonSummary}/>}
      {tab==='career'&&state.retired&&<CareerRetirementSummary state={state} onNewCareer={()=>{if(window.confirm('¿Empezar una nueva carrera?'))onExit()}}/>}
      {tab==='career'&&!state.retired&&!state.pendingFinal&&<CareerOverview state={state}/>}

      {tab==='career'&&!state.retired&&<div className="dashboard-grid">
        <section className="panel event-panel">
          {lastEffects&&<div className="decision-feedback"><div><span className="eyebrow">DECISIÓN TOMADA</span><strong>Tu jugador cambió</strong><EffectChips effects={lastEffects}/></div><button onClick={()=>setLastEffects(null)}>×</button></div>}
          {state.retired?<><span className="eyebrow">FINAL DE CARRERA</span><h2>Tu historia ya está escrita.</h2><p>Terminaste {state.history.length} temporadas con {state.matches} partidos y {state.titles} títulos.</p><div className="final-score"><span>SCORE FINAL</span><strong>{careerScore(state).toLocaleString('es-AR')}</strong></div></>:
          !state.finalStyle&&!state.activeEvent?<FinalStyleChoice onChoose={style=>setState(chooseFinalStyle(state,style))}/>:
          state.pendingFinal?<CareerFinalScene key={state.pendingFinal.id} state={state} onResolved={resolveFinal}/>:
          state.marketDecisionRequired?<div className="market-blocker"><span className="eyebrow">MERCADO DE PASES</span><h2>Antes de seguir, decidí tu futuro.</h2><p>Tenés que elegir si continuás, renovás o aceptás una de las ofertas que llegaron.</p><button className="play-button" onClick={()=>setTab('market')}>VER OFERTAS →</button></div>:
          state.activeEvent?<><DecisionScene category={state.activeEvent.category} title={state.activeEvent.title} media={playerMedia} clubName={club.name}/><span className="eyebrow">{state.activeEvent.eyebrow}</span><h2>{state.activeEvent.title}</h2><p>{state.activeEvent.body}</p><div className="decision-list">{state.activeEvent.options.map(o=>{const effects=careerDecisionEffects(state.activeEvent?.id,o.effects);return <button key={o.id} onClick={()=>{setLastEffects(effects);setState(choosePlayerEvent(state,o as EventOption))}}><div><strong>{o.label}</strong><span>{o.description}</span><EffectChips effects={effects}/></div><b>→</b></button>})}</div></>:
          <><span className="eyebrow">TEMPORADA {state.season} DE {state.maxSeasons}</span><h2>Todo listo para competir.</h2><p>Tu estado físico, la confianza, el vestuario y las decisiones ya están en juego.</p><button className="play-button" onClick={playSeason}>▶ JUGAR TEMPORADA</button></>}
        </section>


      </div>}

      {tab==='career'&&!state.retired&&<details className="career-details">
        <summary><span>FICHA Y PROGRESO</span><b>OVR {state.overall} · HUELLA {Math.round(state.clubLegacy??0)}/100 · {state.trophies?.length??0} TROFEOS</b></summary>
        <div className="career-details__body">
          <PlayerAttributes state={{...state,stats:playerStats}}/>
          <IdolProgress value={state.clubLegacy??0} years={state.history.filter(item=>item.clubId===state.clubId).length}/>
          <TrophyCabinet state={state}/>
        </div>
      </details>}

      {tab==='market'&&<MarketPanel state={state} onState={setState} onDone={()=>setTab('career')}/>} 

      {tab==='training'&&<TrainingScene state={state} onState={setState}/>}

      {tab==='shop'&&<ShopPanel state={state} setState={setState}/>}
      {tab==='minigames'&&<PlayerGamesHub career={state} onSkillScore={playMini}/>}
      {tab==='ranking'&&<RankingPanel scores={scores}/>}
      {tab==='history'&&<CareerHistory state={state}/>}
    </main>
  </div>
}

function CoachGame({state,setState,theme,onTheme,onExit}:{state:CoachState;setState:(s:CoachState)=>void;theme:Theme;onTheme:()=>void;onExit:()=>void}){
  const [tab,setTab]=useState<Tab>('career')
  const [scores,setScores]=useState<RunScore[]>(()=>getRunScores())
  const club=clubById(state.clubId)
  const {media:coachMedia}=useClubMedia(club.name)

  useEffect(()=>{
    loadLeaderboard().then(setScores)
  },[])

  useEffect(()=>{
    if(state.retired&&state.finalScore&&!scores.some(s=>s.id==='coach-'+state.coachName+'-'+state.clubId)){
      const run={id:'coach-'+state.coachName+'-'+state.clubId,name:state.coachName,mode:'coach' as const,score:state.finalScore,detail:`DT · ${club.name} · ${state.titles} títulos`,createdAt:Date.now()}
      setScores(saveRunScore(run))
      void submitLeaderboardScore(run).then(()=>loadLeaderboard()).then(setScores)
    }
  },[state.retired,state.finalScore])

  return <div className="shell game-shell">
    <GameTopNav tab={tab} setTab={setTab} coach={true} clubName={club.name} onExit={onExit} theme={theme} onTheme={onTheme}/>

    <main className="game-main">
      {tab==='career'&&<div className="career-overview">
      <section className="identity-card coach-identity identity-card--media" style={(coachMedia.stadiumImage??coachMedia.image)?{backgroundImage:'linear-gradient(90deg,var(--surface) 35%,rgba(5,10,18,.58)),url("'+(coachMedia.stadiumImage??coachMedia.image)+'")'}:undefined}>
        <ClubCrest name={club.name} size="lg"/>
        <div className="identity-card__copy"><span className="eyebrow">MODO ENTRENADOR · {leagueById(club.leagueId).name}</span><h1>{state.coachName}</h1><p>{club.name} · Temporada {state.season}/{state.maxSeasons}</p></div>
        <div className="overall"><strong>{state.tacticalRating}</strong><span>TÁCTICA</span></div>
      </section>
      <MatchdayScene clubName={club.name} media={coachMedia} mode="coach" season={state.season}/>

      <div className="quick-stats"><Stat value={state.titles} label="TÍTULOS"/><Stat value={state.boardTrust} label="DIRECTIVA"/><Stat value={state.fanTrust} label="HINCHADA"/><Stat value={'$ '+formatMoney(state.budget)} label="CAJA"/></div>

      </div>}

      {tab==='career'&&<div className="dashboard-grid">
        <section className="panel event-panel">
          {state.retired?<><span className="eyebrow">FIN DEL CICLO</span><h2>Tu proyecto terminó.</h2><p>Ocho temporadas de decisiones, mercado y vestuario.</p><div className="final-score"><span>SCORE DT</span><strong>{coachScore(state).toLocaleString('es-AR')}</strong></div></>:
          state.activeEvent?<><DecisionScene category="coach" title={state.activeEvent.title} media={coachMedia} clubName={club.name}/><span className="eyebrow">DECISIÓN DEL ENTRENADOR</span><h2>{state.activeEvent.title}</h2><p>{state.activeEvent.body}</p><div className="decision-list">{state.activeEvent.options.map(o=><button key={o.id} onClick={()=>setState(chooseCoachEvent(state,o))}><div><strong>{o.label}</strong><span>Impacta en tu proyecto.</span></div><b>→</b></button>)}</div></>:
          <><span className="eyebrow">TEMPORADA {state.season}</span><h2>El equipo está listo.</h2><p>La táctica, la moral, los juveniles y la confianza de la directiva definen el año.</p><button className="play-button" onClick={()=>setState(simulateCoachSeason(state))}>▶ DIRIGIR TEMPORADA</button></>}
        </section>
        <aside className="panel condition-panel"><span className="eyebrow">PROYECTO</span><h3>Estado del club</h3><Meter label="Directiva" value={state.boardTrust}/><Meter label="Hinchas" value={state.fanTrust}/><Meter label="Moral" value={state.morale}/><Meter label="Táctica" value={state.tacticalRating}/><Meter label="Juveniles" value={state.youthRating}/></aside>
      </div>}

      {tab==='squad'&&<CoachFormationBoard/>}

      {tab==='minigames'&&<CoachGamesHub onScore={(_,value)=>setState({...state,tacticalRating:Math.min(100,state.tacticalRating+(value>=60?1:0)),fanTrust:Math.min(100,state.fanTrust+(value>=80?2:0))})}/>}
      {tab==='ranking'&&<RankingPanel scores={scores}/>}
      {tab==='history'&&<section className="panel"><div className="panel-head"><div><span className="eyebrow">ARCHIVO DEL DT</span><h2>Temporadas</h2></div></div><div className="timeline">{[...state.history].reverse().map(s=><article key={s.season}><ClubCrest name={clubById(s.clubId).name} size="sm"/><div><strong>{clubById(s.clubId).name}</strong><span>Temporada {s.season}</span><p>{s.note}</p></div><aside><b>#{s.position}</b><span>{s.points} PTS</span></aside></article>)}</div></section>}
    </main>
  </div>
}

export function App(){
  const [theme,setTheme]=useState<Theme>(()=>(localStorage.getItem(THEME_KEY) as Theme)||'dark')
  const [assetsReady,setAssetsReady]=useState(false)
  const [demoUser,setDemoUser]=useState(()=>sessionStorage.getItem(AUTH_KEY)||'')
  const [save,setSave]=useState<SaveState>(()=>{
    try{
      const raw=sessionStorage.getItem(SAVE_KEY)
      return raw?normalizeSaveState(JSON.parse(raw) as SaveState):null
    }catch{return null}
  })

  useEffect(()=>{
    document.documentElement.dataset.theme=theme
    localStorage.setItem(THEME_KEY,theme)
  },[theme])

  useEffect(()=>{
    let alive=true
    const imageCleanups=new Set<()=>void>()
    const bootTimeout=window.setTimeout(()=>{if(alive)setAssetsReady(true)},1800)
    const argentinaCrestNames=clubs.filter(club=>club.country==='Argentina').map(club=>club.name)
    const warmImages=async()=>{
      await preloadClubMedia(argentinaCrestNames,Math.min(16,argentinaCrestNames.length),false)
      if(!alive)return
      const medias=await Promise.all(argentinaCrestNames.map(name=>getClubMedia(name)))
      if(!alive)return
      const urls=[...new Set(medias.map(media=>media.logo).filter((url):url is string=>Boolean(url)))]
      let cursor=0
      const workers=Array.from({length:Math.min(12,urls.length)},async()=>{
        while(alive&&cursor<urls.length){
          const url=urls[cursor++]
          await new Promise<void>(resolve=>{
            const img=new Image()
            let timeout=0
            const done=()=>{window.clearTimeout(timeout);img.onload=null;img.onerror=null;imageCleanups.delete(done);resolve()}
            imageCleanups.add(done)
            timeout=window.setTimeout(done,5000)
            img.onload=done
            img.onerror=done
            img.src=url
            if(img.complete)done()
          })
        }
      })
      await Promise.all(workers)
    }
    void warmImages().catch(()=>{/* Escudos con fallback; el inicio no depende de la red. */}).finally(()=>{if(alive)setAssetsReady(true)})
    return()=>{alive=false;window.clearTimeout(bootTimeout);imageCleanups.forEach(done=>done())}
  },[])

  useEffect(()=>{
    if(save)sessionStorage.setItem(SAVE_KEY,JSON.stringify(save))
  },[save])

  const toggleTheme=()=>setTheme(t=>t==='dark'?'light':'dark')
  const enterDemo=(name:string)=>{sessionStorage.setItem(AUTH_KEY,name);setDemoUser(name);window.scrollTo({top:0,behavior:'auto'})}
  const exit=()=>{setSave(null);sessionStorage.removeItem(SAVE_KEY)}

  if(!assetsReady)return <AssetBootScreen/>
  if(!demoUser)return <MockLogin onEnter={enterDemo}/>

  if(!save){
    return <Home theme={theme} onTheme={toggleTheme}
      startPlayer={(name,position,mode,clubId,nationality)=>setSave(createCareer(name,position,mode,clubId,nationality))}
      startCoach={(name,clubId)=>setSave(createCoach(name,clubId))}
    />
  }

  if(save.gameMode==='coach') return <CoachGame state={save} setState={setSave} theme={theme} onTheme={toggleTheme} onExit={exit}/>
  return <PlayerGame state={save} setState={setSave} theme={theme} onTheme={toggleTheme} onExit={exit}/>
}
