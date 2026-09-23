import type { GameDifficulty } from '../../systems/gameDifficulty'
import type { FinishGame } from './GameScene'
export type SkillProps={difficulty:GameDifficulty;onFinish:FinishGame}
export type LuckProps={onFinish:FinishGame}
