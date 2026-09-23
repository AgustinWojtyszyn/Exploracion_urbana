import { useRef, useState, type PointerEvent } from 'react'
export type Point={x:number;y:number}
export type Gesture={start:Point;end:Point;duration:number;dx:number;dy:number}
export function pointerPoint(event:PointerEvent<HTMLElement>):Point {
  const rect=event.currentTarget.getBoundingClientRect()
  return {x:(event.clientX-rect.left)/rect.width*100,y:(event.clientY-rect.top)/rect.height*100}
}
export function usePointerGesture(onGesture:(gesture:Gesture)=>void, enabled=true, canStart?:(point:Point)=>boolean) {
  const start=useRef<{point:Point;time:number;id:number}|null>(null)
  const [aim,setAim]=useState<Point|null>(null)
  const cancel=()=>{start.current=null;setAim(null)}
  return {aim,origin:start.current?.point??null,bind:{
    onPointerDown:(event:PointerEvent<HTMLDivElement>)=>{
      if(!enabled||start.current||!event.isPrimary||event.button!==0)return
      if((event.target as Element).closest('button,input,summary'))return
      const point=pointerPoint(event)
      if(canStart&&!canStart(point))return
      event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId)
      start.current={point,time:performance.now(),id:event.pointerId};setAim(point)
    },
    onPointerMove:(event:PointerEvent<HTMLDivElement>)=>{if(start.current?.id===event.pointerId)setAim(pointerPoint(event))},
    onPointerUp:(event:PointerEvent<HTMLDivElement>)=>{
      const origin=start.current
      if(!origin||origin.id!==event.pointerId)return
      const end=pointerPoint(event);cancel()
      if(enabled)onGesture({start:origin.point,end,duration:performance.now()-origin.time,dx:end.x-origin.point.x,dy:end.y-origin.point.y})
    },onPointerCancel:cancel,onLostPointerCapture:cancel,
  }}
}
