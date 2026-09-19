export type Position = '9' | '10' | '7' | '5' | '2' | '1'
export type Mode = 'classic' | 'daily'
export type Tab = 'career' | 'market' | 'training' | 'history'

export type Club = {
  id: string
  name: string
  short: string
  country: string
  prestige: number
  salary: number
  minOverall: number
  primary: string
  secondary: string
}

export type SeasonRecord = {
  season: number
  age: number
  clubId: string
  matches: number
  goals: number
  assists: number
  titles: number
  rating: number
  note: string
}

export type Effects = Partial<Record<'overall' | 'form' | 'energy' | 'reputation' | 'fans' | 'coachTrust' | 'money', number>>

export type EventOption = {
  id: string
  label: string
  description: string
  effects: Effects
}

export type CareerEvent = {
  id: string
  eyebrow: string
  title: string
  body: string
  options: EventOption[]
}

export type CareerState = {
  version: 1
  mode: Mode
  seed: number
  playerName: string
  position: Position
  age: number
  season: number
  clubId: string
  overall: number
  form: number
  energy: number
  reputation: number
  fans: number
  coachTrust: number
  money: number
  matches: number
  goals: number
  assists: number
  titles: number
  caps: number
  nationalGoals: number
  trainingCredits: number
  history: SeasonRecord[]
  achievements: string[]
  offers: string[]
  activeEvent: CareerEvent | null
  retired: boolean
}

export const clubs: Club[] = [
  { id: 'ombu', name: 'Club Social El Ombú', short: 'CEO', country: 'Argentina', prestige: 42, salary: 18000, minOverall: 56, primary: '#087847', secondary: '#efe7c7' },
  { id: 'ferro-sur', name: 'Ferroviario del Sur', short: 'FDS', country: 'Argentina', prestige: 47, salary: 22000, minOverall: 58, primary: '#e7ad26', secondary: '#151515' },
  { id: 'costanera', name: 'Atlético Costanera', short: 'ACO', country: 'Argentina', prestige: 59, salary: 36000, minOverall: 64, primary: '#55a9df', secondary: '#f5f5f5' },
  { id: 'cuyo', name: 'Unión de Cuyo', short: 'UDC', country: 'Argentina', prestige: 64, salary: 44000, minOverall: 68, primary: '#7b1833', secondary: '#ead6ad' },
  { id: 'oeste', name: 'Deportivo Oeste', short: 'DOE', country: 'Argentina', prestige: 71, salary: 60000, minOverall: 72, primary: '#1f3d8f', secondary: '#f4d35e' },
  { id: 'lisboa', name: 'Lisboa 1908', short: 'L08', country: 'Portugal', prestige: 79, salary: 115000, minOverall: 76, primary: '#cc1735', secondary: '#f4f4f4' },
  { id: 'andalucia', name: 'Andalucía CF', short: 'ACF', country: 'España', prestige: 84, salary: 155000, minOverall: 79, primary: '#efefef', secondary: '#b6122c' },
  { id: 'borough', name: 'London Borough FC', short: 'LBF', country: 'Inglaterra', prestige: 88, salary: 205000, minOverall: 82, primary: '#512d6d', secondary: '#76c7c0' },
  { id: 'milano', name: 'Milano Rosso', short: 'MIL', country: 'Italia', prestige: 91, salary: 245000, minOverall: 84, primary: '#b10f2e', secondary: '#111111' },
  { id: 'amsterdam', name: 'Amsterdam Noord', short: 'ASN', country: 'Países Bajos', prestige: 86, salary: 178000, minOverall: 80, primary: '#eeeeee', secondary: '#d71920' },
]

export const positions: Array<{ id: Position; title: string; subtitle: string; boost: number }> = [
  { id: '9', title: '9 · DELANTERO', subtitle: 'Goles, presencia y sangre fría.', boost: 2 },
  { id: '10', title: '10 · ENGANCHE', subtitle: 'Visión, técnica y asistencias.', boost: 1 },
  { id: '7', title: '7 · EXTREMO', subtitle: 'Desequilibrio, velocidad y uno contra uno.', boost: 1 },
  { id: '5', title: '5 · VOLANTE', subtitle: 'Equilibrio, pase y lectura.', boost: 0 },
  { id: '2', title: '2 · CENTRAL', subtitle: 'Jerarquía, marca y liderazgo.', boost: 0 },
  { id: '1', title: '1 · ARQUERO', subtitle: 'Reflejos, personalidad y penales.', boost: 0 },
]

export const events: CareerEvent[] = [
  {
    id: 'agent',
    eyebrow: 'FUERA DE LA CANCHA',
    title: 'Te llama un representante',
    body: 'Promete mover tu nombre, pero quiere una comisión alta y control sobre tus próximos contratos.',
    options: [
      { id: 'sign', label: 'Firmar con él', description: 'Más exposición, menos plata.', effects: { reputation: 8, money: -12000, fans: 2 } },
      { id: 'alone', label: 'Seguir solo', description: 'Cuidás la plata y te ganás el vestuario.', effects: { money: 5000, coachTrust: 5 } },
      { id: 'family', label: 'Que te maneje alguien cercano', description: 'Menos ruido, más estabilidad.', effects: { energy: 6, form: 3, reputation: -2 } },
    ],
  },
  {
    id: 'classic',
    eyebrow: 'SEMANA DE CLÁSICO',
    title: 'El técnico duda entre vos y un referente',
    body: 'La cancha va a estar hirviendo. Podés pedir la titularidad o aceptar entrar desde el banco.',
    options: [
      { id: 'demand', label: 'Quiero jugar', description: 'Subís presión y exposición.', effects: { form: 5, coachTrust: -4, reputation: 5 } },
      { id: 'bench', label: 'Aceptar el banco', description: 'Ganás confianza del DT.', effects: { coachTrust: 8, energy: 5 } },
      { id: 'train', label: 'Hablar en la cancha', description: 'Doble turno antes del clásico.', effects: { overall: 1, energy: -10, form: 4 } },
    ],
  },
  {
    id: 'night',
    eyebrow: 'VIDA PERSONAL',
    title: 'Te invitan a una fiesta dos días antes del partido',
    body: 'Va todo el plantel. También hay periodistas y teléfonos por todos lados.',
    options: [
      { id: 'go', label: 'Ir igual', description: 'La pasás bien, pero tiene costo.', effects: { energy: -12, fans: 5, coachTrust: -7 } },
      { id: 'home', label: 'Quedarte en casa', description: 'Profesionalismo puro.', effects: { energy: 8, coachTrust: 6, fans: -1 } },
      { id: 'appear', label: 'Caer una hora y volver', description: 'Equilibrio.', effects: { fans: 2, energy: -3, coachTrust: 2 } },
    ],
  },
  {
    id: 'number',
    eyebrow: 'VESTUARIO',
    title: 'Te ofrecen una camiseta histórica',
    body: 'El número pesa. La gente espera que rindas desde el primer partido.',
    options: [
      { id: 'take', label: 'Ponértela', description: 'Más presión, más idolatría.', effects: { fans: 9, reputation: 5, form: -2 } },
      { id: 'wait', label: 'Todavía no', description: 'Perfil bajo y foco.', effects: { coachTrust: 4, energy: 4 } },
    ],
  },
  {
    id: 'injury',
    eyebrow: 'PARTE MÉDICO',
    title: 'Sentís una molestia muscular',
    body: 'No parece grave, pero hay un partido importante el fin de semana.',
    options: [
      { id: 'play', label: 'Jugar infiltrado', description: 'Riesgo alto, premio alto.', effects: { energy: -18, reputation: 7, form: -3 } },
      { id: 'rest', label: 'Parar una fecha', description: 'Cuidás el físico.', effects: { energy: 15, coachTrust: 2 } },
      { id: 'therapy', label: 'Pagar tratamiento privado', description: 'Recuperación más rápida.', effects: { money: -9000, energy: 10, form: 3 } },
    ],
  },
]

export function clubById(id: string) {
  return clubs.find((club) => club.id === id) ?? clubs[0]
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('es-AR', {
    notation: value >= 1000000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value)
}
