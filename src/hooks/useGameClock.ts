import { createContext, useContext, useEffect, useRef, useState } from 'react'
export const GamePausedContext=createContext(false)
/** One animation clock per active scene. Background time never consumes a turn. */
export function useGameClock(resetKey=0, active=true) {
  const paused=useContext(GamePausedContext)
  const [snapshot,setSnapshot]=useState({key:resetKey,elapsed:0})
  const time=useRef(0)
  useEffect(()=>{time.current=0;setSnapshot({key:resetKey,elapsed:0})},[resetKey])
  useEffect(()=>{
    if(!active||paused)return
    let frame=0, previous=performance.now(), painted=previous
    const tick=(now:number)=>{
      if(!document.hidden)time.current+=Math.min(now-previous,80)
      previous=now
      if(now-painted>=16){setSnapshot({key:resetKey,elapsed:time.current});painted=now}
      frame=requestAnimationFrame(tick)
    }
    frame=requestAnimationFrame(tick)
    return()=>cancelAnimationFrame(frame)
  },[active,paused,resetKey])
  return snapshot.key===resetKey?snapshot.elapsed:0
}
