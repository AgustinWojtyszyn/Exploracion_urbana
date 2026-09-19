import type { Club } from '../world/Architecture'

export function Badge({ club }: { club: Club }) {
  return <div className="badge" style={{ background: club.primary }}><span>{club.short}</span></div>
}
