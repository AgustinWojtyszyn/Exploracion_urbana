import { useEffect,useRef } from 'react'
export function useDialogFocus(onClose?:()=>void){
  const ref=useRef<HTMLElement|null>(null),close=useRef(onClose);close.current=onClose
  useEffect(()=>{
    const previous=document.activeElement as HTMLElement|null
    const node=ref.current;if(!node)return
    node.focus({preventScroll:true})
    const key=(event:KeyboardEvent)=>{
      if(event.key==='Escape'&&close.current){event.preventDefault();close.current()}
      if(event.key!=='Tab')return
      const targets=Array.from(node.querySelectorAll<HTMLElement>('button:not(:disabled),[href],input,select,[tabindex="0"]'))
      const a=targets[0],b=targets[targets.length-1]
      if(!a){event.preventDefault();return}
      if(event.shiftKey&&(document.activeElement===a||document.activeElement===node)){event.preventDefault();b.focus()}
      else if(!event.shiftKey&&document.activeElement===b){event.preventDefault();a.focus()}
    }
    node.addEventListener('keydown',key)
    const overflow=document.body.style.overflow;document.body.style.overflow='hidden'
    return()=>{node.removeEventListener('keydown',key);document.body.style.overflow=overflow;previous?.focus()}
  },[])
  return ref
}
