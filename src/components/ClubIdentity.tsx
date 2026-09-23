import { useEffect, useState } from 'react'
import { clubs } from '../world/Architecture'
import { getClubMedia, type ClubMedia } from '../systems/clubMediaService'
function Crest({name,size='md'}:{name:string;size?:'sm'|'md'|'lg'}){
  const letters=name.split(/\s+/).filter(Boolean).slice(0,3).map(x=>x[0]).join('').toUpperCase()
  let hash=0
  for(let i=0;i<name.length;i++) hash=(hash*31+name.charCodeAt(i))>>>0
  const hue=205+(hash%36)
  return <span className={'crest crest--'+size} style={{'--crest-hue':String(hue)} as React.CSSProperties}>
    <span>{letters}</span>
  </span>
}

export function useClubMedia(name:string){
  const [media,setMedia]=useState<ClubMedia>({})
  const [loading,setLoading]=useState(Boolean(name))
  useEffect(()=>{
    let alive=true
    if(!name){setMedia({});setLoading(false);return()=>{alive=false}}
    setMedia({})
    setLoading(true)
    void getClubMedia(name).then(value=>{
      if(!alive)return
      setMedia(value)
      setLoading(false)
      void getClubMedia(name,true).then(fresh=>{
        if(!alive)return
        if(fresh.logo||fresh.image||fresh.stadiumImage)setMedia(fresh)
      }).catch(()=>{/* Keep the last usable club identity. */})
    }).catch(()=>{if(alive)setLoading(false)})
    return()=>{alive=false}
  },[name])
  return {media,loading}
}

export function ClubCrest({name,size='md'}:{name:string;size?:'sm'|'md'|'lg'}){
  const clubRecord=clubs.find(club=>club.name===name)
  const openDataOnly=Boolean(clubRecord?.leagueId.startsWith('of-'))
  const {media,loading}=useClubMedia(openDataOnly?'':name)
  const [failed,setFailed]=useState(false)
  useEffect(()=>setFailed(false),[name])
  if(openDataOnly)return <Crest name={name} size={size}/>
  if(loading)return <span className={'crest-skeleton crest-skeleton--'+size} aria-label={'Cargando escudo de '+name}/>
  if(media.logo&&!failed){
    return <span className={'real-crest real-crest--'+size}><img src={media.logo} alt={'Escudo de '+name} loading="eager" decoding="async" onError={()=>setFailed(true)}/></span>
  }
  return <Crest name={name} size={size}/>
}

