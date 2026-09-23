import type { EventOption } from '../world/Architecture'
export const shopItems:Array<{id:string;icon:string;name:string;description:string;cost:number;effects:EventOption['effects'];kind:'staff'|'asset'}>= [
  {id:'physio',icon:'✚',name:'Kinesiólogo personal',description:'Menos riesgo de lesión y mejor recuperación.',cost:180000,effects:{injuryRisk:-10,energy:6},kind:'staff'},
  {id:'psych',icon:'◉',name:'Psicólogo deportivo',description:'Más moral y disciplina en los momentos duros.',cost:150000,effects:{morale:10,discipline:4},kind:'staff'},
  {id:'physical',icon:'◆',name:'Preparador físico',description:'Mejora tu potencia y capacidad de sostener temporadas.',cost:260000,effects:{physical:4,pace:2,energy:7},kind:'staff'},
  {id:'video',icon:'⌁',name:'Analista de video',description:'Lectura específica de tu puesto y confianza del DT.',cost:240000,effects:{},kind:'staff'},
  {id:'technical',icon:'◎',name:'Entrenador técnico',description:'Trabajo individual específico para tu función.',cost:320000,effects:{},kind:'staff'},
  {id:'first-car',icon:'◫',name:'Primer auto',description:'Tu primer gusto grande como profesional. Sube la moral, no el fútbol.',cost:420000,effects:{morale:4,fans:1},kind:'asset'},
  {id:'apartment',icon:'▥',name:'Departamento propio',description:'Independencia y estabilidad fuera de la cancha.',cost:880000,effects:{morale:5,discipline:2},kind:'asset'},
  {id:'family-house',icon:'⌂',name:'Casa familiar',description:'Un hito de carrera que también ordena tu vida.',cost:1650000,effects:{morale:7,reputation:2},kind:'asset'},
  {id:'business',icon:'▦',name:'Negocio propio',description:'Un ingreso y un proyecto para pensar más allá del retiro.',cost:2400000,effects:{reputation:3,discipline:2},kind:'asset'},
  {id:'country-place',icon:'△',name:'Campo de descanso',description:'El lujo final de una carrera larga.',cost:4200000,effects:{morale:8,fans:2},kind:'asset'},
]

