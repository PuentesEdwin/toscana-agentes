// Temas de la Oficina 3D: colores, luz, decoración y uniforme de los agentes.
// Se elige con VITE_OFFICE_THEME en app/.env; sin valor queda el diseño clásico.
const TOSCANA = { sol: '#f8b155', verde: '#03b271', bosque: '#156d54', mar: '#20aeee', noche: '#0b2a4a' }

export const THEMES = {
  clasico: { id: 'clasico', nombre: 'Clásica' },

  // Opción 1: agencia luminosa de día con los colores Toscana y una sala de mando con holograma
  sol: {
    id: 'sol', nombre: 'Toscana Sol',
    mat: { fabric: TOSCANA.bosque, fabricAccent: TOSCANA.sol, glow: TOSCANA.mar, wallCap: TOSCANA.bosque },
    pisos: { equipo: '#d2a676', lab: '#1d4f6e', oficinas: '#7c8a84', reuniones: '#9a6b45' },
    decor: { logo: true, afiches: true, bus: true, centro: 'jardin', holoMesa: true },
    uniforme: { saco: TOSCANA.bosque, pantalon: '#1f2937', corbata: TOSCANA.sol },
  },

  // Opción 2: cuartel de héroes de noche, azul Toscana con luces de neón y un globo holográfico al centro
  cuartel: {
    id: 'cuartel', nombre: 'Cuartel Toscana',
    mat: {
      wall: '#16324f', wallCap: TOSCANA.mar, frame: '#0d1b2a', fabric: '#1b3a5c', fabricAccent: '#b8202e',
      leather: '#10151d', deskTop: '#e9eef3', glow: TOSCANA.mar, glass: '#7fd4ff',
    },
    pisos: { exterior: ['#0f2236', '#0a1826'], interior: ['#183451', '#10263c'], equipo: '#5b4636', lab: '#0e2033', oficinas: '#1f3348', reuniones: '#4a3627' },
    luz: { sol: '#bcd6ff', solI: 1.3, cielo: '#5f86c4', suelo: '#0b1a2a', cieloI: 0.55, exposicion: 1.0, entorno: 0.35, fondo: '#08131f' },
    decor: { logo: true, afiches: true, bus: true, centro: 'holograma', neon: TOSCANA.mar, neon2: TOSCANA.sol, holoMesa: true },
    uniforme: { saco: TOSCANA.noche, pantalon: '#111827', corbata: 'detalle' },
  },

  // Opción 3: torre de día con madera, rojo y dorado de héroe en el laboratorio y un mapa de destinos al centro
  torre: {
    id: 'torre', nombre: 'Torre Toscana',
    mat: { fabric: TOSCANA.bosque, fabricAccent: '#a3161f', glow: '#ffb627', wallCap: '#a3161f', leather: '#3b2418' },
    pisos: { equipo: '#c49466', lab: '#3a2a22', oficinas: '#6d5a4a', reuniones: '#8a6242' },
    luz: { sol: '#fff0d6', solI: 2.5, exposicion: 1.05 },
    decor: { logo: true, afiches: true, bus: true, centro: 'mapa', holoMesa: true },
    uniforme: { saco: '#2f3542', pantalon: '#1f2937', corbata: '#d4a017' },
  },
}

export const DESTINOS = [
  { nombre: 'Cartagena', tipo: 'mar' },
  { nombre: 'Boyacá', tipo: 'montaña' },
  { nombre: 'Santa Marta', tipo: 'mar' },
  { nombre: 'Turquía y Dubái', tipo: 'globo' },
  { nombre: 'Barranquilla', tipo: 'mar' },
]

export { TOSCANA }

export function officeTheme(id) {
  return THEMES[id] || THEMES.clasico
}

// Viste a un agente con el uniforme del tema: saco, pantalón y corbata (del color "detalle" del agente si el tema lo pide)
export function vestir(look = {}, theme) {
  const u = theme?.uniforme
  if (!u || look.ropa === 'casual') return look
  return {
    ...look, ropa: 'traje', torso: u.saco, arms: u.saco, legs: u.pantalon,
    corbata: u.corbata === 'detalle' ? (look.accent || TOSCANA.sol) : (look.corbata || u.corbata),
  }
}
