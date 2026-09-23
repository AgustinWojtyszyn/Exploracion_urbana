/** Skill scores are derived only from observed input, never from a random draw. */
export const bounded = (value:number, min=0, max=100) => Math.max(min, Math.min(max, Number.isFinite(value)?value:min))
export const score100 = (value:number) => Math.round(bounded(value))
export const averageScore = (values:number[]) => score100(values.reduce((sum,value)=>sum+value,0)/Math.max(1,values.length))
export const reactionScore = (milliseconds:number, deadline:number) => score100(100-85*bounded((milliseconds-180)/(deadline-180),0,1))
export const precisionScore = (distance:number, tolerance:number) => score100(100*(1-bounded(distance/tolerance,0,1)))
export const timingScore = (position:number, center:number, width:number) => precisionScore(Math.abs(position-center),width)
export const grade = (score:number) => score>=95?'PERFECT':score>=80?'GREAT':score>=60?'GOOD':score>=35?'LATE':'MISS'
export function reactionSeries(times:number[], deadlines:number[], errors:number, bestCombo:number) {
  const scores=times.map((time,index)=>time<0?0:reactionScore(time,deadlines[index]))
  return score100(averageScore(scores)-errors*3+Math.max(0,bestCombo-2)*2)
}
export const shotPower=(dx:number,dy:number)=>bounded(.25+Math.hypot(dx,dy)/95,0,1)
export type ShotResult = {score:number; label:string}
export function penaltyScore(x:number,y:number,power:number,keeperX:number,assistance:number):ShotResult {
  if(x<12||x>88||y<16||y>48)return {score:8,label:'AFUERA'}
  if(x<14||x>86||y<18)return {score:30,label:'PALO'}
  const distance=Math.hypot(x-keeperX,(y-39)*.6)
  const reach=12+(1-power)*13-assistance
  if(distance<reach)return {score:25,label:'ATAJADA'}
  const corner=bounded(Math.abs(x-50)/34,0,1)
  const score=score100(60+corner*20+power*12+bounded(distance/45,0,1)*8)
  return {score,label:score>=90?'GOLAZO':'GOL'}
}
