import { clubById, clubs, events, positions, type CareerState, type Effects, type Mode, type Position, type SeasonRecord } from '../world/Architecture'

export const clamp=(v:number,a=0,b=100)=>Math.max(a,Math.min(b,v))
const rnd=(seed:number)=>{let a=seed>>>0;return()=>{a+=0x6d2b79f5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
const hash=(s:string)=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const eventFor=(s:CareerState)=>events[Math.floor(rnd(s.seed+s.season*971+s.age*37)()*events.length)]
const offersFor=(s:CareerState)=>clubs.filter(c=>c.id!==s.clubId&&s.overall+4>=c.minOverall).sort((a,b)=>Math.abs(a.minOverall-s.overall)-Math.abs(b.minOverall-s.overall)).slice(0,3).map(c=>c.id)

export function createCareer(name:string,position:Position,mode:Mode,clubId:string):CareerState{
 const seed=mode==='daily'?hash(new Date().toISOString().slice(0,10)+position+clubId):Math.floor(Math.random()*2147483647)
 const pos=positions.find(p=>p.id===position)!
 const s:CareerState={version:1,mode,seed,playerName:name.trim()||'El Pibe',position,age:17,season:1,clubId,overall:58+pos.boost,form:68,energy:92,reputation:8,fans:12,coachTrust:55,money:12000,matches:0,goals:0,assists:0,titles:0,caps:0,nationalGoals:0,trainingCredits:2,history:[],achievements:[],offers:[],activeEvent:null,retired:false}
 return {...s,activeEvent:eventFor(s)}
}

export function applyEffects(s:CareerState,e:Effects):CareerState{
 return {...s,overall:clamp(s.overall+(e.overall??0),40,99),form:clamp(s.form+(e.form??0)),energy:clamp(s.energy+(e.energy??0)),reputation:clamp(s.reputation+(e.reputation??0)),fans:clamp(s.fans+(e.fans??0)),coachTrust:clamp(s.coachTrust+(e.coachTrust??0)),money:Math.max(0,s.money+(e.money??0)),activeEvent:null}
}

export function simulateSeason(s:CareerState):CareerState{
 const club=clubById(s.clubId),r=rnd(s.seed+s.season*4999+s.overall)
 const perf=clamp(s.overall*.55+s.form*.25+s.coachTrust*.12+s.energy*.08)
 const matches=Math.round(25+r()*15+perf/12)
 const atk=s.position==='9'?1.35:s.position==='10'?.82:s.position==='7'?.95:s.position==='5'?.35:s.position==='2'?.12:.03
 const ast=s.position==='10'?1.25:s.position==='7'?.9:s.position==='5'?.72:s.position==='9'?.42:.18
 const goals=Math.max(0,Math.round(matches*atk*(perf/100)*(.34+r()*.2)))
 const assists=Math.max(0,Math.round(matches*ast*(perf/100)*(.25+r()*.2)))
 const title=r()<(club.prestige+s.overall+s.form)/330?1:0
 const rating=Math.round((6.1+perf/55+r()*.8)*10)/10
 const growth=(s.age<=23?2:s.age<=28?1:s.age>=33?-1:0)+(s.trainingCredits===0?1:0)+(rating>=7.8?1:0)
 const selected=s.reputation>55&&s.overall>77&&r()>.45
 const caps=selected?Math.round(2+r()*7):0
 const record:SeasonRecord={season:s.season,age:s.age,clubId:s.clubId,matches,goals,assists,titles:title,rating,note:title?'Campeón. La temporada cambió tu lugar en el club.':rating>=7.7?'Temporada de consolidación.':rating<6.8?'Año irregular. El próximo puede ser decisivo.':'Cumpliste y seguís creciendo.'}
 let n:CareerState={...s,age:s.age+1,season:s.season+1,overall:clamp(s.overall+growth,45,96),form:clamp(58+r()*28),energy:clamp(82+r()*17),reputation:clamp(s.reputation+Math.round(rating*2.1)+title*9),fans:clamp(s.fans+Math.round(goals*.8+assists*.45+title*12)),coachTrust:clamp(s.coachTrust+Math.round(rating-6.8)*4),money:s.money+club.salary*12,matches:s.matches+matches,goals:s.goals+goals,assists:s.assists+assists,titles:s.titles+title,caps:s.caps+caps,nationalGoals:s.nationalGoals+(selected&&s.position!=='1'?Math.round(caps*atk*.25*r()):0),trainingCredits:2,history:[...s.history,record],offers:[],activeEvent:null,retired:s.age+1>=38}
 const a=new Set(n.achievements);if(n.goals>=50)a.add('50 goles');if(n.matches>=100)a.add('100 partidos');if(n.titles)a.add('Primer título');if(n.caps)a.add('Debut en la Selección');if(n.fans>=90)a.add('Ídolo de la gente');if(n.overall>=90)a.add('Clase mundial')
 n={...n,achievements:[...a]}
 return n.retired?n:{...n,offers:offersFor(n),activeEvent:eventFor(n)}
}

export function trainCareer(s:CareerState,focus:'fisico'|'tecnica'|'definicion'){
 if(!s.trainingCredits)return s
 const e:Effects=focus==='fisico'?{overall:1,energy:8,form:1}:focus==='tecnica'?{overall:1,form:5,energy:-4}:{overall:1,reputation:3,energy:-6}
 const n=applyEffects(s,e);return{...n,activeEvent:s.activeEvent,trainingCredits:s.trainingCredits-1}
}

export function transferTo(s:CareerState,id:string):CareerState{
 const c=clubById(id);return{...s,clubId:id,offers:[],reputation:clamp(s.reputation+4),fans:clamp(s.fans-6),coachTrust:48,money:s.money+c.salary*2}
}
