import fs from 'node:fs/promises'
import path from 'node:path'

const ENDPOINT='https://query.wikidata.org/sparql'
const OUT=path.resolve('src/data/verifiedLeagues.ts')
const MIN_COUNTRIES=80
const MAX_LEVEL=3

const sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms))

async function sparql(query,retries=4){
  const url=ENDPOINT+'?format=json&query='+encodeURIComponent(query)
  for(let attempt=1;attempt<=retries;attempt++){
    const res=await fetch(url,{
      headers:{
        Accept:'application/sparql-results+json',
        'User-Agent':'LeyendaFootballGame/1.0 (GitHub: AgustinWojtyszyn/Leyenda)'
      }
    })
    if(res.ok)return res.json()
    if(attempt===retries)throw new Error('Wikidata '+res.status+' '+await res.text())
    await sleep(1500*attempt)
  }
}

const qid=(uri)=>uri?.split('/').pop()??''
const clean=(value)=>String(value??'').replace(/\s+/g,' ').trim()

function safeId(value){
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}

function pushClub(map,country,leagueQid,level,club){
  if(!country||!leagueQid||!club||level<1||level>MAX_LEVEL)return
  const countryKey=country
  if(!map.has(countryKey))map.set(countryKey,new Map())
  const levels=map.get(countryKey)
  const key=String(level)
  if(!levels.has(key))levels.set(key,new Map())
  const leagues=levels.get(key)
  if(!leagues.has(leagueQid))leagues.set(leagueQid,new Set())
  leagues.get(leagueQid).add(club)
}

async function fetchDirectLevels(){
  const map=new Map()
  let offset=0
  const limit=5000
  while(true){
    const query=`
SELECT DISTINCT ?club ?clubLabel ?league ?country ?countryLabel ?level WHERE {
  ?club wdt:P31/wdt:P279* wd:Q476028 ;
        wdt:P118 ?league .
  ?league wdt:P641 wd:Q2736 ;
          wdt:P17 ?country ;
          wdt:P3983 ?level .
  FILTER(?level >= 1 && ?level <= 3)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
}
LIMIT ${limit}
OFFSET ${offset}`
    const data=await sparql(query)
    const rows=data.results?.bindings??[]
    for(const row of rows){
      pushClub(
        map,
        clean(row.countryLabel?.value),
        qid(row.league?.value),
        Number(row.level?.value),
        clean(row.clubLabel?.value)
      )
    }
    if(rows.length<limit)break
    offset+=limit
    await sleep(500)
  }
  return map
}

async function fetchHierarchyLevels(){
  const map=new Map()
  let offset=0
  const limit=5000
  while(true){
    const query=`
SELECT DISTINCT ?club ?clubLabel ?league ?country ?countryLabel ?level WHERE {
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
  ?club wdt:P31/wdt:P279* wd:Q476028 ;
        wdt:P118 ?league .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
}
LIMIT ${limit}
OFFSET ${offset}`
    const data=await sparql(query)
    const rows=data.results?.bindings??[]
    for(const row of rows){
      pushClub(
        map,
        clean(row.countryLabel?.value),
        qid(row.league?.value),
        Number(row.level?.value),
        clean(row.clubLabel?.value)
      )
    }
    if(rows.length<limit)break
    offset+=limit
    await sleep(500)
  }
  return map
}

function mergeMaps(target,source){
  for(const [country,levels] of source){
    if(!target.has(country))target.set(country,new Map())
    const targetLevels=target.get(country)
    for(const [level,leagues] of levels){
      if(!targetLevels.has(level))targetLevels.set(level,new Map())
      const targetLeagues=targetLevels.get(level)
      for(const [league,clubs] of leagues){
        if(!targetLeagues.has(league))targetLeagues.set(league,new Set())
        const set=targetLeagues.get(league)
        for(const club of clubs)set.add(club)
      }
    }
  }
}

function buildSeeds(map){
  const seeds=[]
  for(const [country,levels] of map){
    for(let level=1;level<=MAX_LEVEL;level++){
      const leagues=levels.get(String(level))
      if(!leagues)continue
      const clubs=new Set()
      for(const set of leagues.values())for(const club of set)clubs.add(club)
      const teams=[...clubs].filter(name=>name&&!/^Q\d+$/.test(name)).sort((a,b)=>a.localeCompare(b,'es'))
      if(teams.length<6)continue
      seeds.push({
        id:`${safeId(country)}-${level}`,
        country,
        division:level,
        teams,
        source:'Wikidata CC0'
      })
    }
  }
  return seeds.sort((a,b)=>a.country.localeCompare(b.country,'es')||a.division-b.division)
}

function coverage(seeds){
  const grouped=new Map()
  for(const seed of seeds){
    if(!grouped.has(seed.country))grouped.set(seed.country,new Set())
    grouped.get(seed.country).add(seed.division)
  }
  const countries=[...grouped.entries()]
  const twoPlus=countries.filter(([,levels])=>levels.has(1)&&levels.has(2))
  const threePlus=twoPlus.filter(([,levels])=>levels.has(3))
  return {
    totalCountries:countries.length,
    twoPlusCountries:twoPlus.length,
    threePlusCountries:threePlus.length,
    countries:twoPlus.map(([country,levels])=>({country,divisions:[...levels].sort()}))
  }
}

async function main(){
  console.log('LEYENDA · sincronización mundial de ligas')
  console.log('Fuente primaria: Wikidata CC0')
  const combined=new Map()

  console.log('1/2 · consultando niveles explícitos…')
  mergeMaps(combined,await fetchDirectLevels())

  console.log('2/2 · consultando jerarquía ascenso/descenso…')
  mergeMaps(combined,await fetchHierarchyLevels())

  let seeds=buildSeeds(combined)
  const firstCoverage=coverage(seeds)
  console.log('Cobertura bruta:',JSON.stringify(firstCoverage,null,2))

  // LEYENDA only ships countries with at least 1st + 2nd division verified.
  const allowedCountries=new Set(firstCoverage.countries.map(x=>x.country))
  seeds=seeds.filter(seed=>allowedCountries.has(seed.country))

  const finalCoverage=coverage(seeds)
  if(finalCoverage.twoPlusCountries<MIN_COUNTRIES){
    throw new Error(`Cobertura insuficiente: ${finalCoverage.twoPlusCountries}/${MIN_COUNTRIES} países con 1ª y 2ª división verificadas.`)
  }

  const header=`// AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
// Generated by scripts/sync-world-leagues.mjs
// Club and league-membership facts: Wikidata CC0.
// League display labels inside LEYENDA are generic country/division labels.
// Official league brands and official club crests are NOT bundled.

export type LeagueSeed = {
  id:string
  country:string
  division:number
  teams:string[]
  source?:string
}

export const verifiedLeagueSeeds:LeagueSeed[] = `

  const footer=`

export const sourceNotice='Club names and league membership facts are sourced from Wikidata CC0. LEYENDA uses generic country/division league labels and original generated crests; no official league branding, sponsors or official crests are bundled.'

export const dataCoverage={
  countries:${finalCoverage.twoPlusCountries},
  leagues:${seeds.length},
  countriesWithThirdDivision:${finalCoverage.threePlusCountries},
  generatedAt:${JSON.stringify(new Date().toISOString())},
  source:'Wikidata CC0'
}
`

  await fs.mkdir(path.dirname(OUT),{recursive:true})
  await fs.writeFile(OUT,header+JSON.stringify(seeds,null,2)+footer,'utf8')

  console.log(`✓ ${finalCoverage.twoPlusCountries} países con al menos 1ª + 2ª división`)
  console.log(`✓ ${finalCoverage.threePlusCountries} países con 3ª división`)
  console.log(`✓ ${seeds.length} divisiones verificadas`)
  console.log('✓ escrito:',OUT)
}

main().catch(error=>{
  console.error(error)
  process.exitCode=1
})
