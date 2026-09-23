import { useId, type CSSProperties, type ReactNode } from 'react'
export function FootballPlayerSprite({pose='standing',number='10',opponent=false,keeper=false}:{pose?:'standing'|'running'|'shooting'|'diving';number?:string;opponent?:boolean;keeper?:boolean}) {
  return <svg className={'lg-player lg-player--'+pose+(opponent?' lg-player--opponent':'')+(keeper?' lg-player--keeper':'')} viewBox="0 0 70 112" aria-hidden="true">
    <ellipse cx="35" cy="105" rx="25" ry="5" fill="#000" opacity=".28"/>
    <g className="lg-player__body">
      <path d="M27 66L23 88 16 100M43 66l5 20 7 14" fill="none" stroke="#dba77b" strokeWidth="9" strokeLinecap="round" className="lg-player__legs"/>
      <path d="M27 72l-5 12m23-12 5 12" stroke="#eaf4ff" strokeWidth="9"/>
      <path d="M14 102l10-1m25 1h11" stroke="#071c30" strokeWidth="7" strokeLinecap="round"/>
      <path d="M22 33L9 51l-4-6m43-12 12 16 5-8" fill="none" stroke="#dba77b" strokeWidth="8" strokeLinecap="round" className="lg-player__arms"/>
      {keeper&&<g fill="#eafaff"><ellipse cx="5" cy="42" rx="5" ry="7"/><ellipse cx="65" cy="38" rx="5" ry="7"/></g>}
      <path d="M22 29l-8 10 9 8 1 18h22l1-18 9-8-9-10-12-4z" className="lg-player__shirt"/>
      <path d="M24 60h22l3 15H37l-2-9-3 9H21z" fill="#09223d"/>
      <path d="M30 26v5q5 6 10 0v-5" fill="#c88d62"/>
      <ellipse cx="35" cy="16" rx="10" ry="12" fill="#dfb087"/>
      <path d="M25 16q-3-17 12-15 12 0 9 15l-5-8-12 1z" fill="#15202c"/>
      <path d="M28 35l7 4 7-4" fill="none" stroke="#fff" strokeWidth="2" opacity=".8"/>
      <text x="35" y="55" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">{number}</text>
    </g>
  </svg>
}
export function GoalkeeperSprite({diving=false}:{diving?:boolean}) {return <FootballPlayerSprite keeper number="1" pose={diving?'diving':'standing'}/>}
export function FootballBall(){return <svg viewBox="0 0 40 40" className="lg-ball-art" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="#f3f8ff" stroke="#9badc1"/><path d="M20 10l9 7-4 10H15l-4-10zM8 5l3 12-9 3m27-3 9 3M15 27l-5 9m15-9 5 9M20 10V2" fill="#123047" stroke="#123047" strokeWidth="2"/><path d="M9 10q7-9 17-3" fill="none" stroke="#fff" strokeWidth="3"/></svg>}
export function StadiumBackdrop(){return <div className="lg-stadium" aria-hidden="true"><div className="lg-stadium__roof"/><div className="lg-stadium__crowd"/><i className="lg-floodlight lg-floodlight--left"/><i className="lg-floodlight lg-floodlight--right"/><div className="lg-stadium__haze"/></div>}
export function FootballPitch(){return <svg className="lg-pitch-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M6 4H94V96H6zM6 50H94M26 4V23H74V4M26 96V77H74V96"/><ellipse cx="50" cy="50" rx="15" ry="12"/><circle cx="50" cy="17" r=".8"/><circle cx="50" cy="83" r=".8"/></svg>}
export function GoalFrame(){return <div className="lg-goal" aria-hidden="true"><div/><i/><b/></div>}
export function Actor({x,y,children,className='',style}:{x:number;y:number;children:ReactNode;className?:string;style?:CSSProperties}){return <div className={'lg-actor '+className} style={{left:x+'%',top:y+'%',...style}}>{children}</div>}
export function BallFlight({from,to,duration=650}:{from:{x:number;y:number};to:{x:number;y:number};duration?:number}) {
  return <>
    <svg className="lg-flight-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d={`M${from.x} ${from.y} Q${(from.x+to.x)/2} ${Math.min(from.y,to.y)-8} ${to.x} ${to.y}`}/></svg>
    <span className="lg-flying-ball" style={{'--from-x':from.x+'%','--from-y':from.y+'%','--to-x':to.x+'%','--to-y':to.y+'%','--flight-time':duration+'ms'} as CSSProperties}><FootballBall/></span>
  </>
}
export function Trophy(){const id=useId();return <svg className="lg-trophy" viewBox="0 0 100 120" aria-hidden="true"><defs><linearGradient id={id}><stop stopColor="#9a661d"/><stop offset=".48" stopColor="#ffeda3"/><stop offset="1" stopColor="#d99c33"/></linearGradient></defs><g fill={'url(#'+id+')'} stroke="#f9d779" strokeWidth="2"><path d="M23 15h54l-5 40q-5 22-22 24-17-2-22-24z"/><path d="M25 24H9q-1 35 25 37l-3-9Q15 50 17 32h9m48-8h17q1 35-25 37l3-9q16-2 14-20h-9"/><path d="M45 76h10v24H45zM30 100h40v12H30z"/></g><path d="m50 29 4 8 9 1-7 7 2 9-8-5-8 5 2-9-7-7 9-1z" fill="#fff4c6"/></svg>}
