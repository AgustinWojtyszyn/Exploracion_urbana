import fs from 'node:fs/promises'
import path from 'node:path'

const ENDPOINT='https://query.wikidata.org/sparql'
const OUT=path.resolve('src/data/verifiedLeagues.ts')
const MIN_COUNTRIES=80
const MAX_LEVEL=3
const MIN_TEAMS=4
const BATCH_SIZE=24

const sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms))
const qid=(uri)=>uri?.split('/').pop()??''
const clean=(value)=>String(value??'').replace(/\s+/g,' ').trim()
const wd=(id)=>'wd:'+id

async function sparql(query,retries=5){
  const url=ENDPOINT+'?format=json&query='+encodeURIComponent(query)
  for(let attempt=1;attempt<=retries;attempt++){
    const res=await fetch(url,{
      headers:{
        Accept:'application/sparql-results+json',
        'User-Agent':'LeyendaFootballGame/2.0 (https://github.com/AgustinWojtyszyn/Leyenda)'
      }
    })
    if(res.ok)return res.json()
    const body=await res.text()
    if(attempt===retries)throw new Error('Wikidata '+res.status+' '+body.slice(0,400))
    console.warn('Wikidata retry',attempt,res.status)
    await sleep(1200*attempt)
  }
}

function safeId(value){
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}

function addLeague(map,{league,country,countryLabel,level}){
  const leagueId=qid(league)
  const countryId=qid(country)
  const n=Number(level)
  const label=clean(countryLabel)
  if(!leagueId||!countryId||!label||!Number.isFinite(n)||n<1||n>MAX_LEVEL)return
  const existing=map.get(leagueId)
  if(!existing||n<existing.level){
    map.set(leagueId,{id:leagueId,countryId,country:label,level:n})
  }
}

async function fetchLeagueCatalog(){
  const map=new Map()

  const direct=`
SELECT DISTINCT ?league ?country ?countryLabel ?level WHERE {
  ?league wdt:P641 wd:Q2736 ;
          wdt:P17 ?country ;
          wdt:P3983 ?level .
  FILTER(?level >= 1 && ?level <= 3)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
}`
  const directData=await sparql(direct)
  for(const row of directData.results?.bindings??[]){
    addLeague(map,{
      league:row.league?.value,
      country:row.country?.value,
      countryLabel:row.countryLabel?.value,
      level:row.level?.value
    })
  }
  console.log('Ligas por nivel explícito:',map.size)

  const hierarchy=`
SELECT DISTINCT ?league ?country ?countryLabel ?level WHERE {
  ?top wdt:P641 wd:Q2736 ;
       wdt:P17 ?country ;
       wdt:P2500 ?second .
  {
    BIND(?top AS ?league)
    BIND(1 AS ?level)
  } UNION {
    BIND(?second AS ?league)
    BIND(2 AS ?level)
  } UNION {
    ?second wdt:P2500 ?third .
    BIND(?third AS ?league)
    BIND(3 AS ?level)
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
}`
  const hierarchyData=await sparql(hierarchy)
  for(const row of hierarchyData.results?.bindings??[]){
    addLeague(map,{
      league:row.league?.value,
      country:row.country?.value,
      countryLabel:row.countryLabel?.value,
      level:row.level?.value
    })
  }
  console.log('Ligas después de jerarquía:',map.size)
  return map
}

function candidateCountries(leagues){
  const byCountry=new Map()
  for(const league of leagues.values()){
    if(!byCountry.has(league.country))byCountry.set(league.country,new Set())
    byCountry.get(league.country).add(league.level)
  }
  const valid=new Set(
    [...byCountry.entries()]
      .filter(([,levels])=>levels.has(1)&&levels.has(2))
      .map(([country])=>country)
  )
  console.log('Países con 1ª + 2ª identificadas antes de cargar clubes:',valid.size)
  return valid
}

async function latestSeasonClubs(batch){
  const values=batch.map(item=>wd(item.id)).join(' ')
  const query=`
SELECT DISTINCT ?league ?club ?clubLabel WHERE {
  VALUES ?league { ${values} }
  {
    {
      SELECT ?league (MAX(?start) AS ?latestStart) WHERE {
        VALUES ?league { ${values} }
        ?season wdt:P3450 ?league ;
                wdt:P580 ?start .
        FILTER(?start <= NOW())
      }
      GROUP BY ?league
    }
    ?season wdt:P3450 ?league ;
            wdt:P580 ?latestStart ;
            wdt:P1923 ?club .
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
}`
  const data=await sparql(query)
  const map=new Map()
  for(const row of data.results?.bindings??[]){
    const league=qid(row.league?.value)
    const label=clean(row.clubLabel?.value)
    if(!league||!label||/^Q\d+$/.test(label))continue
    if(!map.has(league))map.set(league,new Set())
    map.get(league).add(label)
  }
  return map
}

async function currentLeagueClubs(batch){
  const values=batch.map(item=>wd(item.id)).join(' ')
  const query=`
SELECT DISTINCT ?league ?club ?clubLabel WHERE {
  VALUES ?league { ${values} }
  ?club wdt:P118 ?league ;
        wdt:P31/wdt:P279* wd:Q476028 .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
}`
  const data=await sparql(query)
  const map=new Map()
  for(const row of data.results?.bindings??[]){
    const league=qid(row.league?.value)
    const label=clean(row.clubLabel?.value)
    if(!league||!label||/^Q\d+$/.test(label))continue
    if(!map.has(league))map.set(league,new Set())
    map.get(league).add(label)
  }
  return map
}

async function fetchClubs(leagues,allowedCountries){
  const selected=[...leagues.values()].filter(l=>allowedCountries.has(l.country))
  const clubMap=new Map()

  for(let i=0;i<selected.length;i+=BATCH_SIZE){
    const batch=selected.slice(i,i+BATCH_SIZE)
    console.log(`Clubes: lote ${i/BATCH_SIZE+1}/${Math.ceil(selected.length/BATCH_SIZE)}`)
    let seasonMap=new Map()
    let currentMap=new Map()

    try{seasonMap=await latestSeasonClubs(batch)}
    catch(error){console.warn('season batch fallback:',String(error).slice(0,180))}

    const missing=batch.filter(l=>(seasonMap.get(l.id)?.size??0)<MIN_TEAMS)
    if(missing.length){
      try{currentMap=await currentLeagueClubs(missing)}
      catch(error){console.warn('current league fallback:',String(error).slice(0,180))}
    }

    for(const league of batch){
      const seasonTeams=seasonMap.get(league.id)
      const fallbackTeams=currentMap.get(league.id)
      const teams=seasonTeams&&seasonTeams.size>=MIN_TEAMS?seasonTeams:fallbackTeams
      if(teams&&teams.size>=MIN_TEAMS)clubMap.set(league.id,teams)
    }
    await sleep(250)
  }
  return clubMap
}

function buildSeeds(leagues,clubMap){
  const seeds=[]
  for(const league of leagues.values()){
    const teams=clubMap.get(league.id)
    if(!teams||teams.size<MIN_TEAMS)continue
    seeds.push({
      id:`${safeId(league.country)}-${league.level}`,
      country:league.country,
      division:league.level,
      teams:[...teams].sort((a,b)=>a.localeCompare(b,'es')),
      source:'Wikidata CC0'
    })
  }

  // Some countries have parallel regional leagues at the same level.
  // Merge them into one generic LEYENDA division without inventing membership.
  const merged=new Map()
  for(const seed of seeds){
    const key=`${seed.country}::${seed.division}`
    if(!merged.has(key))merged.set(key,{...seed,teams:[]})
    const row=merged.get(key)
    row.teams=[...new Set([...row.teams,...seed.teams])].sort((a,b)=>a.localeCompare(b,'es'))
  }
  return [...merged.values()].sort((a,b)=>a.country.localeCompare(b.country,'es')||a.division-b.division)
}

function coverage(seeds){
  const grouped=new Map()
  for(const seed of seeds){
    if(!grouped.has(seed.country))grouped.set(seed.country,new Set())
    grouped.get(seed.country).add(seed.division)
  }
  const valid=[...grouped.entries()].filter(([,levels])=>levels.has(1)&&levels.has(2))
  return {
    countries:valid.length,
    thirdDivisionCountries:valid.filter(([,levels])=>levels.has(3)).length,
    validNames:valid.map(([country])=>country).sort((a,b)=>a.localeCompare(b,'es'))
  }
}

async function main(){
  console.log('LEYENDA · sincronización mundial de ligas')
  console.log('Fuente: Wikidata CC0')
  const leagues=await fetchLeagueCatalog()
  const candidates=candidateCountries(leagues)
  const clubMap=await fetchClubs(leagues,candidates)
  let seeds=buildSeeds(leagues,clubMap)

  const initial=coverage(seeds)
  console.log('Cobertura con clubes:',initial.countries,'países; tercera división:',initial.thirdDivisionCountries)
  console.log(initial.validNames.join(' · '))

  const allowed=new Set(initial.validNames)
  seeds=seeds.filter(seed=>allowed.has(seed.country))

  if(initial.countries<MIN_COUNTRIES){
    throw new Error(`Cobertura insuficiente: ${initial.countries}/${MIN_COUNTRIES} países con 1ª y 2ª división y clubes verificados.`)
  }

  const header=`// AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
// Generated by scripts/sync-world-leagues.mjs
// Facts: Wikidata CC0.
// LEYENDA deliberately replaces commercial/official competition names with
// generic country + division labels and generates its own fictional crests.

export type LeagueSeed = {
  id:string
  country:string
  division:number
  teams:string[]
  source?:string
}

export const verifiedLeagueSeeds:LeagueSeed[] = `

  const footer=`

export const sourceNotice='Club names and division membership facts are sourced from Wikidata CC0. LEYENDA uses generic country/division league labels and original generated crests; no official league branding, sponsors or official crests are bundled.'

export const dataCoverage={
  countries:${initial.countries},
  leagues:${seeds.length},
  countriesWithThirdDivision:${initial.thirdDivisionCountries},
  generatedAt:${JSON.stringify(new Date().toISOString())},
  source:'Wikidata CC0'
}
`

  await fs.mkdir(path.dirname(OUT),{recursive:true})
  await fs.writeFile(OUT,header+JSON.stringify(seeds,null,2)+footer,'utf8')

  console.log(`✓ ${initial.countries} países con al menos 1ª + 2ª división`)
  console.log(`✓ ${initial.thirdDivisionCountries} países también con 3ª división`)
  console.log(`✓ ${seeds.length} divisiones verificadas`)
}

main().catch(error=>{
  console.error(error)
  process.exitCode=1
})
