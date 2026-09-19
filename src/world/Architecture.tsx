export type Position = '9' | '10' | '7' | '5' | '2' | '1'
export type PlayerMode = 'classic' | 'daily'
export type GameMode = 'player' | 'coach'
export type Theme = 'dark' | 'light'
export type Tab = 'career' | 'market' | 'training' | 'history' | 'minigames' | 'ranking' | 'squad'
export type MiniGameId = 'penalties' | 'freekicks' | 'passing' | 'keeper' | 'duel' | 'scouting'

export type League = { id:string; name:string; country:string; tier:number; color:string }
export type Club = {
  id:string; leagueId:string; name:string; short:string; country:string;
  prestige:number; salary:number; minOverall:number; primary:string; secondary:string
}

export type SeasonRecord = {
  season:number; age:number; clubId:string; matches:number; goals:number; assists:number;
  titles:number; rating:number; score:number; note:string
}

export type Effects = Partial<Record<
  'overall'|'form'|'energy'|'reputation'|'fans'|'coachTrust'|'money'|
  'discipline'|'leadership'|'morale'|'injuryRisk',
  number
>>

export type EventOption = { id:string; label:string; description:string; effects:Effects }
export type CareerEvent = {
  id:string
  category:'football'|'life'|'media'|'health'|'contract'|'locker'
  eyebrow:string
  title:string
  body:string
  positions?:Position[]
  minSeason?:number
  options:EventOption[]
}

export type CareerState = {
  version:2
  gameMode:'player'
  mode:PlayerMode
  seed:number
  playerName:string
  nationality:string
  position:Position
  age:number
  season:number
  maxSeasons:number
  clubId:string
  overall:number
  form:number
  energy:number
  reputation:number
  fans:number
  coachTrust:number
  discipline:number
  leadership:number
  morale:number
  injuryRisk:number
  money:number
  matches:number
  goals:number
  assists:number
  titles:number
  caps:number
  nationalGoals:number
  trainingCredits:number
  history:SeasonRecord[]
  achievements:string[]
  offers:string[]
  activeEvent:CareerEvent|null
  retired:boolean
  finalScore?:number
}

export type CoachEventOption = {
  id:string
  label:string
  effects:Partial<Record<'boardTrust'|'fanTrust'|'morale'|'budget'|'tacticalRating'|'youthRating',number>>
}
export type CoachEvent = { id:string; title:string; body:string; options:CoachEventOption[] }
export type CoachSeason = { season:number; clubId:string; position:number; points:number; titles:number; score:number; note:string }
export type CoachState = {
  version:2
  gameMode:'coach'
  coachName:string
  clubId:string
  season:number
  maxSeasons:number
  boardTrust:number
  fanTrust:number
  morale:number
  budget:number
  tacticalRating:number
  youthRating:number
  titles:number
  history:CoachSeason[]
  activeEvent:CoachEvent|null
  retired:boolean
  finalScore?:number
}

export type RunScore = {
  id:string
  name:string
  mode:GameMode
  score:number
  detail:string
  createdAt:number
}

export type MiniGame = { id:MiniGameId; name:string; description:string; icon:string; playerOnly?:boolean; coachOnly?:boolean }

export const leagues:League[] = [
  {id:'arg-metropolitana',name:'Liga Metropolitana',country:'Argentina',tier:1,color:'#2f7cff'},
  {id:'arg-nacional',name:'Nacional Interior',country:'Argentina',tier:2,color:'#58a5ff'},
  {id:'bra-atlantica',name:'Liga Atlántica',country:'Brasil',tier:1,color:'#22a6b3'},
  {id:'esp-iberica',name:'Liga Ibérica',country:'España',tier:1,color:'#5c6cff'},
  {id:'eng-crown',name:'Crown League',country:'Inglaterra',tier:1,color:'#7a5cff'},
  {id:'ita-aurora',name:'Serie Aurora',country:'Italia',tier:1,color:'#3277d5'},
  {id:'fra-hexa',name:'Ligue Hexa',country:'Francia',tier:1,color:'#3b5dff'},
  {id:'por-lusitana',name:'Liga Lusitana',country:'Portugal',tier:1,color:'#3e8eff'},
]

export const clubs:Club[] = [
  {id:'ombu',leagueId:'arg-nacional',name:'Club Social El Ombú',short:'OMB',country:'Argentina',prestige:42,salary:18000,minOverall:56,primary:'#2563eb',secondary:'#dbeafe'},
  {id:'ferro-sur',leagueId:'arg-nacional',name:'Ferroviario del Sur',short:'FDS',country:'Argentina',prestige:47,salary:22000,minOverall:58,primary:'#174ea6',secondary:'#f8fafc'},
  {id:'cordillera',leagueId:'arg-nacional',name:'Deportivo Cordillera',short:'DCO',country:'Argentina',prestige:51,salary:25000,minOverall:60,primary:'#0f67d8',secondary:'#8ec5ff'},
  {id:'federal-norte',leagueId:'arg-nacional',name:'Federal del Norte',short:'FDN',country:'Argentina',prestige:54,salary:28000,minOverall:61,primary:'#1d4ed8',secondary:'#93c5fd'},

  {id:'costanera',leagueId:'arg-metropolitana',name:'Atlético Costanera',short:'ACO',country:'Argentina',prestige:62,salary:40000,minOverall:65,primary:'#1e88e5',secondary:'#e3f2fd'},
  {id:'cuyo',leagueId:'arg-metropolitana',name:'Unión de Cuyo',short:'UDC',country:'Argentina',prestige:66,salary:47000,minOverall:68,primary:'#2457c5',secondary:'#bfdbfe'},
  {id:'oeste',leagueId:'arg-metropolitana',name:'Deportivo Oeste',short:'DOE',country:'Argentina',prestige:72,salary:62000,minOverall:72,primary:'#153e90',secondary:'#dbeafe'},
  {id:'puerto',leagueId:'arg-metropolitana',name:'Puerto Central',short:'PCF',country:'Argentina',prestige:76,salary:72000,minOverall:74,primary:'#0067c5',secondary:'#90caf9'},

  {id:'rio-azul',leagueId:'bra-atlantica',name:'Rio Azul Clube',short:'RAZ',country:'Brasil',prestige:74,salary:82000,minOverall:74,primary:'#168aad',secondary:'#d9f3ff'},
  {id:'santa-mar',leagueId:'bra-atlantica',name:'Santa Mar FC',short:'SMF',country:'Brasil',prestige:78,salary:94000,minOverall:76,primary:'#2176ff',secondary:'#bde0fe'},
  {id:'paulista-nova',leagueId:'bra-atlantica',name:'Paulista Nova',short:'PNV',country:'Brasil',prestige:82,salary:108000,minOverall:78,primary:'#2b59c3',secondary:'#edf2fb'},
  {id:'mineiro-real',leagueId:'bra-atlantica',name:'Mineiro Real',short:'MIR',country:'Brasil',prestige:80,salary:101000,minOverall:77,primary:'#003f88',secondary:'#a9d6e5'},

  {id:'andalucia',leagueId:'esp-iberica',name:'Andalucía CF',short:'ACF',country:'España',prestige:84,salary:155000,minOverall:79,primary:'#1e40af',secondary:'#eff6ff'},
  {id:'capital-rojo',leagueId:'esp-iberica',name:'Capital 1902',short:'C02',country:'España',prestige:91,salary:255000,minOverall:85,primary:'#1d4ed8',secondary:'#ffffff'},
  {id:'mediterraneo',leagueId:'esp-iberica',name:'Mediterráneo UD',short:'MED',country:'España',prestige:86,salary:186000,minOverall:81,primary:'#0a66c2',secondary:'#dbeafe'},
  {id:'norte-vasco',leagueId:'esp-iberica',name:'Norte Vasco',short:'NVF',country:'España',prestige:82,salary:142000,minOverall:79,primary:'#0047ab',secondary:'#b9dcff'},

  {id:'borough',leagueId:'eng-crown',name:'London Borough FC',short:'LBF',country:'Inglaterra',prestige:88,salary:205000,minOverall:82,primary:'#3949ab',secondary:'#c5cae9'},
  {id:'northcastle',leagueId:'eng-crown',name:'Northcastle United',short:'NCU',country:'Inglaterra',prestige:83,salary:170000,minOverall:80,primary:'#1f4ba5',secondary:'#eff6ff'},
  {id:'riverport',leagueId:'eng-crown',name:'Riverport City',short:'RPC',country:'Inglaterra',prestige:92,salary:280000,minOverall:86,primary:'#1565c0',secondary:'#bbdefb'},
  {id:'mersey-athletic',leagueId:'eng-crown',name:'Mersey Athletic',short:'MAT',country:'Inglaterra',prestige:90,salary:250000,minOverall:84,primary:'#0d47a1',secondary:'#e3f2fd'},

  {id:'milano',leagueId:'ita-aurora',name:'Milano Rosso',short:'MIL',country:'Italia',prestige:91,salary:245000,minOverall:84,primary:'#1e3a8a',secondary:'#dbeafe'},
  {id:'torino-blu',leagueId:'ita-aurora',name:'Torino Blu',short:'TBL',country:'Italia',prestige:86,salary:180000,minOverall:81,primary:'#1d4ed8',secondary:'#bfdbfe'},
  {id:'roma-impero',leagueId:'ita-aurora',name:'Roma Impero',short:'RIM',country:'Italia',prestige:85,salary:176000,minOverall:81,primary:'#2563eb',secondary:'#dbeafe'},
  {id:'napoli-mare',leagueId:'ita-aurora',name:'Napoli Mare',short:'NPM',country:'Italia',prestige:88,salary:210000,minOverall:82,primary:'#0284c7',secondary:'#bae6fd'},

  {id:'paris-etoile',leagueId:'fra-hexa',name:'Paris Étoile',short:'PET',country:'Francia',prestige:93,salary:305000,minOverall:86,primary:'#172554',secondary:'#dbeafe'},
  {id:'lyon-union',leagueId:'fra-hexa',name:'Lyon Union',short:'LYU',country:'Francia',prestige:82,salary:155000,minOverall:79,primary:'#1d4ed8',secondary:'#eff6ff'},
  {id:'marsella-port',leagueId:'fra-hexa',name:'Marsella Port',short:'MSP',country:'Francia',prestige:84,salary:168000,minOverall:80,primary:'#0369a1',secondary:'#bae6fd'},
  {id:'monaco-royal',leagueId:'fra-hexa',name:'Monaco Royal',short:'MCR',country:'Francia',prestige:81,salary:149000,minOverall:79,primary:'#1e40af',secondary:'#dbeafe'},

  {id:'lisboa',leagueId:'por-lusitana',name:'Lisboa 1908',short:'L08',country:'Portugal',prestige:81,salary:122000,minOverall:77,primary:'#1e3a8a',secondary:'#dbeafe'},
  {id:'porto-norte',leagueId:'por-lusitana',name:'Porto Norte',short:'PON',country:'Portugal',prestige:83,salary:136000,minOverall:78,primary:'#2563eb',secondary:'#e0f2fe'},
  {id:'braga-atlas',leagueId:'por-lusitana',name:'Braga Atlas',short:'BRA',country:'Portugal',prestige:76,salary:98000,minOverall:75,primary:'#1d4ed8',secondary:'#bfdbfe'},
  {id:'setubal-ocean',leagueId:'por-lusitana',name:'Setúbal Ocean',short:'SEO',country:'Portugal',prestige:72,salary:82000,minOverall:73,primary:'#075985',secondary:'#bae6fd'},
]

export const positions:Array<{id:Position;title:string;subtitle:string;boost:number}> = [
  {id:'9',title:'9 · DELANTERO',subtitle:'Goles, presencia y sangre fría.',boost:2},
  {id:'10',title:'10 · ENGANCHE',subtitle:'Visión, técnica y último pase.',boost:1},
  {id:'7',title:'7 · EXTREMO',subtitle:'Velocidad, gambeta y desequilibrio.',boost:1},
  {id:'5',title:'5 · VOLANTE',subtitle:'Equilibrio, presión y lectura.',boost:0},
  {id:'2',title:'2 · LEÑADOR',subtitle:'Defensa físico: cruces, juego aéreo y carácter.',boost:1},
  {id:'1',title:'1 · ARQUERO',subtitle:'Reflejos, personalidad y penales.',boost:0},
]

export const miniGames:MiniGame[] = [
  {id:'penalties',name:'Penales',description:'Clavá el timing y elegí esquina.',icon:'◎'},
  {id:'freekicks',name:'Tiros libres',description:'Potencia y precisión en una sola ventana.',icon:'↗'},
  {id:'passing',name:'Pase imposible',description:'Encontrá la línea antes de que cierre.',icon:'⇢'},
  {id:'keeper',name:'Reflejos',description:'Leé el disparo y reaccioná rápido.',icon:'◇'},
  {id:'duel',name:'Duelo defensivo',description:'Ideal para el 2: timing, riesgo y tarjeta.',icon:'◆'},
  {id:'scouting',name:'Ojo de scout',description:'Detectá valor antes que el mercado.',icon:'◉'},
]

export const playerEvents:CareerEvent[] = [
  {id:'agent',category:'contract',eyebrow:'FUERA DE LA CANCHA',title:'Te llama un representante',body:'Promete mover tu nombre, pero quiere una comisión alta y control sobre tus próximos contratos.',options:[
    {id:'sign',label:'Firmar con él',description:'Más exposición, menos control.',effects:{reputation:8,money:-12000,fans:2}},
    {id:'alone',label:'Seguir solo',description:'Cuidás la plata y el vestuario lo valora.',effects:{money:5000,coachTrust:5,discipline:2}},
    {id:'family',label:'Delegar en alguien cercano',description:'Menos ruido, más estabilidad.',effects:{energy:6,form:3,reputation:-2}},
  ]},
  {id:'classic',category:'football',eyebrow:'SEMANA DE CLÁSICO',title:'El técnico duda entre vos y un referente',body:'La cancha va a hervir. Podés exigir titularidad, aceptar el banco o entrenar doble.',options:[
    {id:'demand',label:'Quiero jugar',description:'Más presión y exposición.',effects:{form:5,coachTrust:-4,reputation:5,leadership:2}},
    {id:'bench',label:'Aceptar el banco',description:'Ganás confianza interna.',effects:{coachTrust:8,energy:5,morale:-2}},
    {id:'train',label:'Hablar en la cancha',description:'Doble turno.',effects:{overall:1,energy:-10,form:4,injuryRisk:4}},
  ]},
  {id:'night',category:'life',eyebrow:'VIDA PERSONAL',title:'Te invitan a una fiesta dos días antes del partido',body:'Va medio plantel. También hay periodistas y teléfonos por todos lados.',options:[
    {id:'go',label:'Ir igual',description:'La pasás bien, pero tiene costo.',effects:{energy:-12,fans:5,coachTrust:-7,discipline:-5}},
    {id:'home',label:'Quedarte en casa',description:'Profesionalismo puro.',effects:{energy:8,coachTrust:6,discipline:4,fans:-1}},
    {id:'appear',label:'Caer una hora y volver',description:'Equilibrio.',effects:{fans:2,energy:-3,coachTrust:2}},
  ]},
  {id:'injury',category:'health',eyebrow:'PARTE MÉDICO',title:'Sentís una molestia muscular',body:'No parece grave, pero hay un partido importante el fin de semana.',options:[
    {id:'play',label:'Jugar igual',description:'Riesgo alto, premio alto.',effects:{energy:-18,reputation:7,form:-3,injuryRisk:15}},
    {id:'rest',label:'Parar una fecha',description:'Cuidás el físico.',effects:{energy:15,coachTrust:2,morale:-2,injuryRisk:-8}},
    {id:'therapy',label:'Pagar recuperación privada',description:'Mejor recuperación.',effects:{money:-9000,energy:10,form:3,injuryRisk:-6}},
  ]},
  {id:'captain',category:'locker',eyebrow:'VESTUARIO',title:'El capitán te pide que hables con un juvenil',body:'Está a punto de romper con el grupo. Nadie quiere meterse.',minSeason:2,options:[
    {id:'mentor',label:'Sentarte con él',description:'Ganás liderazgo.',effects:{leadership:8,morale:5,energy:-2}},
    {id:'ignore',label:'No es asunto mío',description:'Cero desgaste.',effects:{energy:3,leadership:-4}},
    {id:'staff',label:'Avisar al cuerpo técnico',description:'Orden institucional.',effects:{coachTrust:4,morale:-3,discipline:3}},
  ]},
  {id:'press',category:'media',eyebrow:'MICRÓFONOS',title:'Un periodista te provoca en vivo',body:'Pregunta si tu buen momento se debe a que el equipo juega para vos.',options:[
    {id:'team',label:'Hablar del equipo',description:'Perfil bajo.',effects:{coachTrust:5,leadership:4,reputation:2}},
    {id:'ego',label:'Decir que sos decisivo',description:'La gente compra el personaje.',effects:{fans:7,reputation:6,morale:-4}},
    {id:'walk',label:'No responder',description:'Evitás el incendio.',effects:{discipline:2,reputation:-1}},
  ]},
  {id:'family',category:'life',eyebrow:'VIDA REAL',title:'Tu familia te pide que vuelvas unos días',body:'Coincide con una semana de entrenamiento importante.',minSeason:2,options:[
    {id:'travel',label:'Viajar',description:'Te hace bien a la cabeza.',effects:{morale:9,energy:5,coachTrust:-5}},
    {id:'stay',label:'Quedarte',description:'Foco total.',effects:{discipline:5,coachTrust:4,morale:-4}},
  ]},
  {id:'red',category:'football',eyebrow:'PARTIDO CALIENTE',title:'El 9 rival te viene buscando',body:'Ya te pegó dos codazos y el árbitro mira para otro lado.',positions:['2','5'],options:[
    {id:'hard',label:'Devolvérsela fuerte',description:'Podés imponerte o terminar afuera.',effects:{leadership:4,discipline:-8,reputation:4,injuryRisk:4}},
    {id:'smart',label:'Jugarle con cabeza',description:'Menos show, más control.',effects:{discipline:7,coachTrust:5,form:3}},
    {id:'talk',label:'Hablar con el árbitro',description:'Presión institucional.',effects:{leadership:3,reputation:1}},
  ]},
  {id:'keeper_pen',category:'football',eyebrow:'MINUTO 93',title:'Penal en contra',body:'El pateador mira siempre al arquero antes de arrancar.',positions:['1'],options:[
    {id:'study',label:'Esperar hasta el final',description:'Confianza en la lectura.',effects:{form:7,reputation:5,energy:-2}},
    {id:'guess',label:'Jugarte antes',description:'Todo o nada.',effects:{fans:6,form:-2}},
  ]},
  {id:'selection',category:'football',eyebrow:'SELECCIÓN',title:'Te llaman para una gira internacional',body:'Llegás con poco descanso y tu club juega una final apenas volvés.',minSeason:3,options:[
    {id:'go',label:'Ir igual',description:'La camiseta nacional pesa.',effects:{reputation:10,energy:-12,fans:6}},
    {id:'club',label:'Priorizar al club',description:'El DT te lo agradece.',effects:{coachTrust:8,reputation:-3,energy:6}},
  ]},
]

export const coachEvents:CoachEvent[] = [
  {id:'star-bench',title:'La figura llega tarde por tercera vez',body:'Es tu mejor jugador. El vestuario espera una señal.',options:[
    {id:'bench',label:'Mandarlo al banco',effects:{boardTrust:3,fanTrust:-2,morale:5,tacticalRating:1}},
    {id:'fine',label:'Multa y titular',effects:{budget:40000,morale:-3,fanTrust:2}},
    {id:'protect',label:'Protegerlo públicamente',effects:{fanTrust:3,boardTrust:-4,morale:2}},
  ]},
  {id:'academy',title:'Aparece un juvenil distinto',body:'Tiene talento, pero subirlo ahora puede quemarlo.',options:[
    {id:'promote',label:'Subirlo ya',effects:{youthRating:7,morale:2,fanTrust:4}},
    {id:'reserve',label:'Llevarlo de a poco',effects:{youthRating:4,boardTrust:2}},
  ]},
  {id:'board-sale',title:'La dirigencia quiere vender a un referente',body:'La oferta arregla las cuentas pero debilita al equipo.',options:[
    {id:'sell',label:'Aceptar la venta',effects:{budget:600000,boardTrust:8,morale:-8,fanTrust:-8}},
    {id:'keep',label:'Plantarte',effects:{boardTrust:-7,fanTrust:8,morale:5}},
  ]},
  {id:'press-loss',title:'Tres partidos sin ganar',body:'La conferencia se empieza a poner áspera.',options:[
    {id:'own',label:'Asumir la culpa',effects:{fanTrust:4,morale:3,boardTrust:-2}},
    {id:'players',label:'Exigir al plantel',effects:{morale:-6,tacticalRating:3,boardTrust:3}},
    {id:'calm',label:'Bajar el ruido',effects:{morale:2,fanTrust:-1}},
  ]},
  {id:'derby-plan',title:'Semana de clásico',body:'El rival te supera en nombres. La gente pide ir al frente igual.',options:[
    {id:'attack',label:'Presionar alto',effects:{fanTrust:7,tacticalRating:3,morale:2}},
    {id:'counter',label:'Esperar y contragolpear',effects:{boardTrust:3,tacticalRating:5,fanTrust:-2}},
  ]},
  {id:'staff',title:'Tu ayudante recibe una oferta',body:'Podés mejorarle el contrato o dejarlo ir.',options:[
    {id:'raise',label:'Retenerlo',effects:{budget:-120000,tacticalRating:4,morale:3}},
    {id:'leave',label:'Dejarlo ir',effects:{budget:30000,tacticalRating:-4}},
  ]},
]

export const clubById=(id:string)=>clubs.find(c=>c.id===id)??clubs[0]
export const leagueById=(id:string)=>leagues.find(l=>l.id===id)??leagues[0]
export const clubsByLeague=(leagueId:string)=>clubs.filter(c=>c.leagueId===leagueId)
export const formatMoney=(value:number)=>new Intl.NumberFormat('es-AR',{notation:value>=1000000?'compact':'standard',maximumFractionDigits:1}).format(value)
