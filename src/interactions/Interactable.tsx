import type { ReactNode } from 'react'

export type Interaction = { label: () => string; perform: () => void }
export function Interactable({ interaction, children }: { interaction: Interaction; children: ReactNode }) {
  return <group userData={{ interaction }}>{children}</group>
}
