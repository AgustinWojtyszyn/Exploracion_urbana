import type { CareerState, PlayerStatKey } from '../world/Architecture'
import { bounded } from './gameScoring'
export type GameDifficulty = { level:number; speed:number; reactionMs:number; keeperMs:number; tolerance:number; memoryLength:number; assistance:(stat:PlayerStatKey)=>number; label:string }
export function gameDifficulty(career?:CareerState):GameDifficulty {
  const prestige=career?.pendingFinal?.competition.includes('Libertadores')? .13:0
  const stake=career?.pendingFinal?.kind==='title' ? .1 : career?.pendingFinal?.kind==='promotion' ? .06 : 0
  const level=bounded(((career?.season??1)-1)/35+Math.max(0,(career?.age??18)-29)/70+((career?.overall??60)-60)/200+prestige+stake,0,1)
  const assistance=(stat:PlayerStatKey)=>bounded(((career?.stats?.[stat]??60)-60)/40,0,1)
  return {level,speed:1+level*.38,reactionMs:Math.min(4000,4000-level*550+assistance('reflexes')*120),keeperMs:1250-level*300+assistance('reflexes')*100,tolerance:22-level*5+assistance('passing')*2,memoryLength:3+Math.floor(level*2),assistance,label:level>.65?'ÉLITE':level>.3?'COMPETITIVO':'INICIACIÓN'}
}
