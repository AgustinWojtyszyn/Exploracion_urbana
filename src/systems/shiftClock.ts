const START_SECONDS = 2 * 3600 + 17 * 60
export function shiftClock(elapsed: number) {
  const t = START_SECONDS + Math.floor(elapsed)
  return [Math.floor(t / 3600) % 24, Math.floor(t / 60) % 60, t % 60].map(n => String(n).padStart(2, '0')).join(':')
}
