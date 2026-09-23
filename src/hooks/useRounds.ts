import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useGameClock, GamePausedContext } from './useGameClock'
import { averageScore, score100 } from '../systems/gameScoring'
export type RoundFeedback={score:number;label:string;detail?:string}
export const GameFeedbackContext=createContext<(good:boolean)=>void>(()=>{})
export function useRounds(total:number,onFinish:(score:number,label?:string)=>void,delay=1050) {
  const [round,setRound]=useState(0), [feedback,setFeedback]=useState<RoundFeedback|null>(null)
  const samples=useRef<number[]>([]), locked=useRef(false), completed=useRef(false)
  const callback=useRef(onFinish);callback.current=onFinish
  const signal=useContext(GameFeedbackContext), paused=useContext(GamePausedContext)
  const elapsed=useGameClock(round,!feedback&&!completed.current)
  const submit=useCallback((score:number,label:string,detail?:string)=>{
    if(locked.current||completed.current||paused)return false
    locked.current=true
    const value=score100(score);samples.current.push(value)
    signal(value>=60);setFeedback({score:value,label,detail})
    return true
  },[signal,paused])
  useEffect(()=>{
    if(!feedback||paused)return
    const id=window.setTimeout(()=>{
      if(samples.current.length>=total){
        if(!completed.current){completed.current=true;callback.current(averageScore(samples.current),total>1?`${samples.current.filter(score=>score>=60).length} / ${total} RONDAS LOGRADAS`:feedback.label)}
      } else {locked.current=false;setFeedback(null);setRound(value=>value+1)}
    },delay)
    return()=>window.clearTimeout(id)
  },[feedback,paused,total,delay])
  return {round,elapsed,feedback,submit,locked:!!feedback,scores:samples.current}
}
