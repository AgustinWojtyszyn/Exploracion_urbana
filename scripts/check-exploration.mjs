import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'

// Exercise progression independently of WebGL. Uses the existing Vite toolchain.
const directory = await mkdtemp(join(tmpdir(), 'city-below-state-'))
try {
  await build({
    configFile: false, logLevel: 'silent',
    build: { outDir: directory, emptyOutDir: true, minify: false,
      lib: { entry: 'src/systems/explorationStore.ts', formats: ['es'], fileName: () => 'store.mjs' } },
  })
  const { useExplorationStore: store } = await import(pathToFileURL(join(directory, 'store.mjs')).href)
  const state = () => store.getState()
  const selected = ['plan', 'numbers', 'power']
  assert.equal(state().openAccess(), false, 'cannot open an unconnected access')
  assert.equal(state().connectEvidence(selected, '14', 'below'), false, 'cannot invent missing evidence')
  state().observeMark('platform'); state().observeMark('platform')
  assert.equal(state().discoveries.length, 0, 'repeated inspection of one mark is not a discovery')
  state().observeMark('other')
  assert.equal(state().observedMarkIds.length, 1, 'unknown markers are ignored')
  state().observeMark('gallery'); state().observeMark('gallery')
  assert.equal(state().discoveries.length, 1)
  for (const id of ['plan', 'power']) {
    const record = { id, title: id, kind: 'infrastructure', zoneId: 'linea-cero-anden' }
    state().recordDiscovery(record); state().recordDiscovery(record)
  }
  assert.equal(state().discoveries.length, 3, 'recording is idempotent')
  assert.equal(state().connectEvidence(['plan', 'power'], '14', 'below'), false)
  assert.equal(state().connectEvidence(selected, '08', 'below'), false)
  assert.equal(state().connectEvidence(selected, '14', 'gallery'), false)
  assert.equal(state().connectEvidence(selected, ' 14 ', 'below'), true)
  assert.equal(state().accessOpen, false, 'deduction alone does not actuate the mechanism')
  assert.equal(state().openAccess(), true)
  state().setCurrentZone('sector-tecnico'); state().setCurrentZone('sector-tecnico')
  assert.equal(state().knownZoneIds.filter(id => id === 'sector-tecnico').length, 1)
  state().markZoneMapped('sector-tecnico'); state().markZoneMapped('sector-tecnico')
  assert.deepEqual(state().mappedZoneIds, ['sector-tecnico'])
  state().reachBelow(); assert.equal(state().reachedBelow, true)
  console.log('Exploration progression: all checks passed.')
} finally {
  await rm(directory, { recursive: true, force: true })
}
