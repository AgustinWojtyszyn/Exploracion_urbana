import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { GamePausedContext } from '../../hooks/useGameClock'
import { GameFeedbackContext } from '../../hooks/useRounds'
import { useGameAudio } from '../../hooks/useGameAudio'
import { useHaptic } from '../../hooks/useHaptic'
import { grade, score100 } from '../../systems/gameScoring'
import { StadiumBackdrop } from './FootballVisuals'
import { GameParticles } from './GameFeedback'
export type FinishGame=(score:number,label?:string)=>void
export function GameScene({id,title,instruction,mode='skill',difficulty,onComplete,onBack,forced=false,children}:{id:string;title:string;instruction:string;mode?:'skill'|'luck';difficulty?:string;onComplete:(score:number)=>void;onBack?:()=>void;forced?:boolean;children:(finish:FinishGame)=>ReactNode}) {
  const [started,setStarted]=useState(false), [paused,setPaused]=useState(false), [result,setResult]=useState<{score:number;label:string}|null>(null)
  const [sound,setSound]=useState(false),[haptic,setHaptic]=useState(false),[run,setRun]=useState(0)
  const [delivered,setDelivered]=useState(false)
  const [seenTutorial]=useState(()=>{try{return sessionStorage.getItem('legends-tutorial-'+id)==='seen'}catch{return false}})
  const finished=useRef(false), reported=useRef(false), completion=useRef(onComplete);completion.current=onComplete
  const audio=useGameAudio(sound),vibrate=useHaptic(haptic)
  const feedback=useCallback((good:boolean)=>{audio(good);vibrate(good)},[audio,vibrate])
  const finish=useCallback<FinishGame>((score,label)=>{if(finished.current)return;finished.current=true;setResult({score:score100(score),label:label??grade(score)})},[])
  useEffect(()=>{
    if(!result||reported.current)return
    const timer=window.setTimeout(()=>{if(reported.current)return;reported.current=true;setDelivered(true);completion.current(result.score)},1250)
    return()=>window.clearTimeout(timer)
  },[result])
  useEffect(()=>{if(!started)return;const hide=()=>{if(document.hidden)setPaused(true)};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide)},[started])
  const begin=()=>{try{sessionStorage.setItem('legends-tutorial-'+id,'seen')}catch{/* Tutorial persistence is optional. */}feedback(true);setStarted(true)}
  return <section className={'lg-scene lg-scene--'+mode+(paused?' is-paused':'')} aria-label={title}>
    <StadiumBackdrop/>
    <header className="lg-scene__header"><div><span>{forced?'PARTIDO DECISIVO':mode==='skill'?'VIRTUOSO':'AL PÁLPITO'} {difficulty&&'· '+difficulty}</span><h2>{title}</h2></div><div className="lg-controls"><button aria-label={sound?'Silenciar sonido':'Activar sonido'} aria-pressed={sound} onClick={()=>setSound(!sound)}>♪</button><button aria-label="Vibración" aria-pressed={haptic} onClick={()=>setHaptic(!haptic)}>⌁</button>{started&&!result&&<button aria-label={paused?'Continuar':'Pausar'} onClick={()=>setPaused(!paused)}>{paused?'▶':'Ⅱ'}</button>}{!forced&&onBack&&<button aria-label="Volver a juegos" disabled={!!result&&!delivered} onClick={onBack}>×</button>}</div></header>
    <div className="lg-scene__body">
      {!started?<div className="lg-count-in"><span className="lg-count-in__number">{mode==='skill'?'90′':'✦'}</span><span>EL MOMENTO ES TUYO</span><h3>{seenTutorial?'TU PRÓXIMA GRAN JUGADA.':instruction}</h3>{seenTutorial&&<small>{instruction}</small>}<button className="lg-action" onClick={begin}>ENTRAR A LA CANCHA →</button><small>{mode==='skill'?'Tu ejecución define el resultado.':'Azar, intuición y una señal.'}</small></div>:<GamePausedContext.Provider value={paused||!!result}><GameFeedbackContext.Provider value={feedback}><div key={run} className="lg-game-mount" inert={paused||!!result}>{children(finish)}</div></GameFeedbackContext.Provider></GamePausedContext.Provider>}
      {paused&&!result&&<div className="lg-pause"><span>TIEMPO MUERTO</span><h3>Respirá. La jugada espera.</h3><button className="lg-action" onClick={()=>setPaused(false)}>CONTINUAR ▶</button></div>}
      {result&&<div className={'lg-result '+(result.score>=60?'is-good':'is-miss')} role="status">{result.score>=80&&<GameParticles gold/>}<span>{mode==='skill'?grade(result.score):result.score>=60?'BUENA SEÑAL':'OTRA NOCHE'}</span><strong>{result.score}</strong><p>{result.label}</p><small>PUNTOS / 100</small>{!forced&&<div><button className="lg-action" disabled={!delivered} onClick={()=>{setDelivered(false);reported.current=true;setResult(null);finished.current=false;reported.current=false;setRun(value=>value+1);setPaused(false)}}>OTRA VEZ ↻</button>{onBack&&<button disabled={!delivered} onClick={onBack}>VOLVER</button>}</div>}</div>}
    </div>
    <footer className="lg-scene__footer"><span>LEGENDS</span><span>{paused?'PAUSA':result?'JUGADA COMPLETA':started?'EN JUEGO':'PREVIA'}</span><span>{id.toUpperCase()}</span></footer>
  </section>
}
