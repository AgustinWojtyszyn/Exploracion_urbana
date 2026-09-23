import { useState } from 'react'
import { FootballPitch,FootballPlayerSprite } from '../games/shared/FootballVisuals'
const formations={
  '4-3-3':{lines:[[18,39,61,82],[22,50,78],[18,50,82]],label:'Presión alta y amplitud',detail:'Extremos abiertos, tres apoyos por dentro.'},
  '4-4-2':{lines:[[18,39,61,82],[15,38,62,85],[35,65]],label:'Orden y transición',detail:'Dos líneas compactas y dos referencias de ataque.'},
  '3-5-2':{lines:[[25,50,75],[10,30,50,70,90],[35,65]],label:'Control del centro',detail:'Carrileros profundos y superioridad interior.'},
}
export function CoachFormationBoard(){
  const [selected,setSelected]=useState<keyof typeof formations>('4-3-3')
  const formation=formations[selected]
  return <section className="coach-formation"><header><span className="eyebrow">PIZARRA DEL ENTRENADOR</span><h2>Encontrá la forma del equipo.</h2><p>Explorá los roles de cada sistema.</p></header><div className="coach-formation__tabs">{Object.keys(formations).map(key=><button key={key} aria-pressed={selected===key} onClick={()=>setSelected(key as keyof typeof formations)}>{key}</button>)}</div><div className="coach-formation__pitch"><FootballPitch/><div className="coach-formation__player" style={{left:'50%',top:'89%'}}><FootballPlayerSprite keeper number="1"/></div>{formation.lines.flatMap((line,row)=>line.map((x,col)=><div key={row+'-'+col} className="coach-formation__player" style={{left:x+'%',top:(69-row*25)+'%'}}><FootballPlayerSprite number={String(2+formation.lines.slice(0,row).reduce((sum,items)=>sum+items.length,0)+col)}/></div>))}</div><footer><strong>{formation.label}</strong><p>{formation.detail}</p></footer></section>
}
