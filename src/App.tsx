import { GameCanvas } from './game/GameCanvas'
import { ExplorationHud } from './ui/ExplorationHud'

export function App() {
  return (
    <main className="app-shell">
      <GameCanvas />
      <ExplorationHud />
    </main>
  )
}
