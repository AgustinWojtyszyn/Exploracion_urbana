// Only doors move in this slice. Re-render the static shadow map when they do.
export let shadowRevision = 0
export function invalidateShadows() { shadowRevision++ }
