import { useState } from 'react'
import type { CareerState,MiniGameId } from '../world/Architecture'
import { gameDifficulty } from '../systems/gameDifficulty'
import { GameScene } from './shared/GameScene'
import { ReactionGame } from './virtuoso/ReactionGame'
import { PenaltyGame } from './virtuoso/PenaltyGame'
import { TimingGame } from './virtuoso/TimingGame'
import { PassingGame } from './virtuoso/PassingGame'
import { DribbleGame } from './virtuoso/DribbleGame'
import { MemoryGame } from './virtuoso/MemoryGame'
import { KeeperGame } from './virtuoso/KeeperGame'
import { TacticGridGame } from './virtuoso/TacticGridGame'
import { PowerShotGame } from './virtuoso/PowerShotGame'
const scenes={reaction:{Component:ReactionGame,title:'Pulso',instruction:'TOCÁ LOS CINCO OBJETIVOS'},penalty:{Component:PenaltyGame,title:'Desde los doce pasos',instruction:'ARRASTRÁ DESDE LA PELOTA Y SOLTÁ EN EL ARCO'},timing:{Component:TimingGame,title:'El instante perfecto',instruction:'FRENÁ EN EL CENTRO'},passing:{Component:PassingGame,title:'Entre líneas',instruction:'TOCÁ EL ESPACIO DEL PRÓXIMO PASE'},dribble:{Component:DribbleGame,title:'Ruptura',instruction:'DESLIZÁ HACIA EL LADO LIBRE'},memory:{Component:MemoryGame,title:'Memoria de juego',instruction:'MIRÁ LA SECUENCIA Y REPETILA'},keeper:{Component:KeeperGame,title:'Última línea',instruction:'ESPERÁ EL REMATE · TOCÁ O DESLIZÁ'},tactic:{Component:TacticGridGame,title:'Pizarra 3×3',instruction:'LEÉ LA GRILLA · BLOQUEÁ · DEFINÍ'},power:{Component:PowerShotGame,title:'El fierrazo',instruction:'MANTENÉ PARA CARGAR · SOLTÁ EN LA ZONA'}}
export function skillMechanic(game:MiniGameId):keyof typeof scenes {
  if(['ball-track','duel'].includes(game))return 'reaction'
  if(['penalties','freekicks'].includes(game))return 'penalty'
  if(['timing-run','hold-up'].includes(game))return 'timing'
  if(['through-pass','long-kick','pressure-exit'].includes(game))return 'passing'
  if(['dribble','personal-run'].includes(game))return 'dribble'
  if(['memory-board','code-call','grid-gap'].includes(game))return 'memory'
  if(game==='tactic-grid')return 'tactic'
  if(game==='power-shot')return 'power'
  return 'keeper'
}
export function SkillGame({game,onComplete,onBack,forced,career}:{game:MiniGameId;onComplete:(score:number)=>void;onBack:()=>void;forced?:boolean;career?:CareerState}){
  const {Component,title,instruction}=scenes[skillMechanic(game)]
  const [difficulty]=useState(()=>gameDifficulty(career))
  return <GameScene key={game} id={skillMechanic(game)} title={title} instruction={instruction} difficulty={difficulty.label} forced={forced} onComplete={onComplete} onBack={onBack}>{finish=><Component difficulty={difficulty} onFinish={finish}/>}</GameScene>
}
