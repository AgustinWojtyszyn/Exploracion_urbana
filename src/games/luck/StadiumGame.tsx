import { useEffect,useState } from 'react'
import { useRounds } from '../../hooks/useRounds'
import { GameHUD,RoundFeedback } from '../shared/GameFeedback'
import type { LuckProps } from '../shared/types'
const paths=['M18 114Q31 29 141 24L147 77Q81 82 71 127Z','M151 23Q213 14 269 24L263 78Q207 64 156 77Z','M280 26Q380 45 400 117L346 133Q327 91 275 80Z','M15 126L69 140Q65 182 114 209L82 253Q10 214 15 126Z','M127 215Q210 248 292 215L318 263Q213 307 98 265Z','M351 143L405 130Q412 212 328 254L304 207Q354 179 351 143Z']
export function StadiumGame({onFinish}:LuckProps){
  const game=useRounds(3,onFinish,1200),[winners]=useState(()=>Array.from({length:3},()=>Math.floor(Math.random()*6))),[selected,setSelected]=useState<{index:number;at:number}|null>(null)
  useEffect(()=>{setSelected(null)},[game.round])
  useEffect(()=>{if(selected&&game.elapsed-selected.at>1000){const distance=(selected.index-winners[game.round]+6)%6;const good=distance===0||distance===1||distance===5;game.submit(good?100:0,good?'LA TRIBUNA EXPLOTA':'OTRA TRIBUNA CANTÓ MÁS')}},[selected,game.elapsed,game.round,game.submit,winners])
  return <div className="lg-playfield lg-stands-game"><GameHUD round={game.round} total={3} label="LA TRIBUNA"/>
    <svg className={'lg-interactive-stadium '+(selected?'is-zoomed':'')} viewBox="0 0 420 320" role="group" aria-label="Elegí uno de los seis sectores del estadio">
      <defs><pattern id="lg-crowd-pattern" width="9" height="10" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1.7" fill="#d2f6ff"/><path d="M1 8h4" stroke="#fff" opacity=".45"/></pattern></defs>
      <ellipse cx="210" cy="170" rx="201" ry="145" fill="#041626"/>
      {paths.map((path,index)=>(
        <g
          key={index}
          role="button"
          tabIndex={selected?-1:0}
          aria-disabled={!!selected}
          aria-label={'Sector '+(index+1)}
          className={`lg-stand-sector${selected?.index===index?' is-selected':''}${game.locked&&winners[game.round]===index?' is-winner':''}`}
          onClick={()=>{
            if(!selected)setSelected({index,at:game.elapsed})
          }}
          onKeyDown={event=>{
            if((event.key==='Enter'||event.key===' ')&&!selected){
              event.preventDefault()
              setSelected({index,at:game.elapsed})
            }
          }}
        >
          <path d={path} fill={selected?.index===index?'#ecc765':'#17688e'}/>
          <path d={path} fill="url(#lg-crowd-pattern)"/>
          <title>Sector {index+1}</title>
        </g>
      ))}
      <path d="M142 99h130l44 96-102 38-106-38z" fill="#13764f" stroke="#8ec9ac" strokeWidth="2"/><path d="M121 164h182M164 99l-17 32h145l-16-32" fill="none" stroke="#d5ffe1" opacity=".6"/>
      <ellipse cx="214" cy="164" rx="25" ry="14" fill="none" stroke="#d5ffe1" opacity=".6"/>
      {[{x:80,y:86},{x:200,y:50},{x:335,y:86},{x:46,y:177},{x:210,y:268},{x:369,y:183}].map((p,i)=><g key={i} className="lg-stand-flag" style={{animationDelay:i*.16+'s'}} pointerEvents="none"><path d={`M${p.x} ${p.y}v-24l19 5-19 7`} stroke="#effbff" fill={i%2?'#26d6ff':'#fff'}/><text x={p.x+4} y={p.y+16} fill="#fff" fontSize="12" fontWeight="bold">{i+1}</text></g>)}
    </svg><div className="lg-field-caption">TOCÁ TU SECTOR · EL DESTINO ELIGE DÓNDE SUENA MÁS</div><RoundFeedback feedback={game.feedback}/>
  </div>
}
