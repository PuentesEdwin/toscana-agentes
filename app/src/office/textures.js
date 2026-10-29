import * as THREE from 'three'

// Texturas procedurales dibujadas en canvas: sin descargas ni imágenes externas
function rng(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

function finish(canvas, repeatX = 1, repeatY = 1) {
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeatX, repeatY)
  t.anisotropy = 8
  return t
}

const shade = (hex, amt) => {
  const c = new THREE.Color(hex)
  c.offsetHSL(0, 0, amt)
  return `#${c.getHexString()}`
}

// Piso de madera: tablones con variación de tono, vetas y juntas
export function woodTexture(base = '#c89a6a', repeatX = 1, repeatY = 1, seed = 7) {
  const cv = document.createElement('canvas')
  cv.width = cv.height = 512
  const ctx = cv.getContext('2d')
  const r = rng(seed)
  const plankH = 64
  for (let y = 0; y < 512; y += plankH) {
    let x = -Math.floor(r() * 200)
    while (x < 512) {
      const len = 180 + r() * 200
      ctx.fillStyle = shade(base, (r() - 0.5) * 0.09)
      ctx.fillRect(x, y, len, plankH)
      ctx.strokeStyle = 'rgba(60,35,15,0.12)'
      ctx.lineWidth = 1
      for (let v = 0; v < 6; v++) {
        const gy = y + 6 + r() * (plankH - 12)
        ctx.beginPath()
        ctx.moveTo(x, gy)
        ctx.bezierCurveTo(x + len * 0.3, gy + (r() - 0.5) * 6, x + len * 0.7, gy + (r() - 0.5) * 6, x + len, gy)
        ctx.stroke()
      }
      ctx.fillStyle = 'rgba(40,22,8,0.35)'
      ctx.fillRect(x, y, 2, plankH)
      x += len
    }
    ctx.fillStyle = 'rgba(40,22,8,0.3)'
    ctx.fillRect(0, y, 512, 2)
  }
  return finish(cv, repeatX, repeatY)
}

// Baldosas con juntas
export function tileTexture(base = '#d9dde3', grout = '#b9bec7', tiles = 4, repeatX = 1, repeatY = 1, seed = 3) {
  const cv = document.createElement('canvas')
  cv.width = cv.height = 512
  const ctx = cv.getContext('2d')
  const r = rng(seed)
  const size = 512 / tiles
  ctx.fillStyle = grout
  ctx.fillRect(0, 0, 512, 512)
  for (let i = 0; i < tiles; i++) for (let j = 0; j < tiles; j++) {
    ctx.fillStyle = shade(base, (r() - 0.5) * 0.04)
    ctx.fillRect(i * size + 3, j * size + 3, size - 6, size - 6)
  }
  return finish(cv, repeatX, repeatY)
}

// Alfombra con textura de fibra
export function carpetTexture(base = '#6b6f80', repeatX = 1, repeatY = 1, seed = 11) {
  const cv = document.createElement('canvas')
  cv.width = cv.height = 256
  const ctx = cv.getContext('2d')
  const r = rng(seed)
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 5000; i++) {
    ctx.fillStyle = r() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'
    ctx.fillRect(r() * 256, r() * 256, 1.5, 1.5)
  }
  return finish(cv, repeatX, repeatY)
}

// Estampado frontal del torso del personaje: cuello, costuras y emblema opcional (o traje con corbata)
export function torsoPrint(color, { emblem, seed = 1, traje } = {}) {
  const cv = document.createElement('canvas')
  cv.width = 128; cv.height = 128
  const ctx = cv.getContext('2d')
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 128, 128)
  if (traje) {
    suitPrint(ctx, color, traje)
    return finish(cv)
  }
  // Cuello en V
  ctx.fillStyle = shade(color, -0.12)
  ctx.beginPath(); ctx.moveTo(44, 0); ctx.lineTo(64, 30); ctx.lineTo(84, 0); ctx.fill()
  ctx.strokeStyle = shade(color, -0.2)
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(64, 30); ctx.lineTo(64, 128); ctx.stroke()
  // Bolsillo
  if (seed % 2 === 0) { ctx.strokeRect(78, 52, 22, 18) }
  // Cinturón
  ctx.fillStyle = shade(color, -0.25)
  ctx.fillRect(0, 116, 128, 12)
  if (emblem) {
    ctx.fillStyle = emblem
    ctx.shadowColor = emblem
    ctx.shadowBlur = 10
    ctx.beginPath(); ctx.arc(64, 60, 16, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(64, 60, 10, 0, Math.PI * 2); ctx.stroke()
  }
  return finish(cv)
}

// Saco abierto, camisa, corbata y un pin de la marca
function suitPrint(ctx, color, { camisa = '#ffffff', corbata = '#c0392b', pin = '#f8b155' }) {
  ctx.fillStyle = camisa
  ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(98, 0); ctx.lineTo(64, 104); ctx.fill()
  // Cuello de la camisa
  ctx.fillStyle = shade(camisa, -0.1)
  ctx.beginPath(); ctx.moveTo(44, 0); ctx.lineTo(62, 12); ctx.lineTo(50, 18); ctx.fill()
  ctx.beginPath(); ctx.moveTo(84, 0); ctx.lineTo(66, 12); ctx.lineTo(78, 18); ctx.fill()
  // Corbata: nudo y hoja
  ctx.fillStyle = shade(corbata, -0.08)
  ctx.beginPath(); ctx.moveTo(57, 8); ctx.lineTo(71, 8); ctx.lineTo(68, 20); ctx.lineTo(60, 20); ctx.fill()
  ctx.fillStyle = corbata
  ctx.beginPath(); ctx.moveTo(60, 20); ctx.lineTo(68, 20); ctx.lineTo(74, 78); ctx.lineTo(64, 90); ctx.lineTo(54, 78); ctx.fill()
  ctx.strokeStyle = shade(corbata, 0.12); ctx.lineWidth = 2
  for (let y = 32; y < 80; y += 12) { ctx.beginPath(); ctx.moveTo(57, y); ctx.lineTo(71, y + 6); ctx.stroke() }
  // Solapas del saco (sombra encima del color: shade() oscurece de más los colores oscuros)
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(40, 0); ctx.lineTo(58, 66); ctx.lineTo(64, 104); ctx.lineTo(38, 46); ctx.lineTo(26, 38); ctx.fill()
  ctx.beginPath(); ctx.moveTo(98, 0); ctx.lineTo(88, 0); ctx.lineTo(70, 66); ctx.lineTo(64, 104); ctx.lineTo(90, 46); ctx.lineTo(102, 38); ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(64, 104); ctx.lineTo(64, 128); ctx.stroke()
  // Botones, bolsillo con pañuelo y pin
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  for (const y of [108, 120]) { ctx.beginPath(); ctx.arc(70, y, 2.5, 0, Math.PI * 2); ctx.fill() }
  ctx.fillRect(88, 66, 22, 3)
  ctx.fillStyle = pin
  ctx.beginPath(); ctx.moveTo(92, 66); ctx.lineTo(97, 59); ctx.lineTo(102, 66); ctx.fill()
  ctx.beginPath(); ctx.arc(40, 40, 4, 0, Math.PI * 2); ctx.fill()
}

const FONT = "Raleway, 'Segoe UI', Arial, sans-serif"

// Afiche de un destino: cielo, sol, mar o montañas y el nombre en grande
export function posterTexture(nombre, tipo, c) {
  const cv = document.createElement('canvas')
  cv.width = 360; cv.height = 240
  const ctx = cv.getContext('2d')
  const sky = ctx.createLinearGradient(0, 0, 0, 240)
  sky.addColorStop(0, tipo === 'globo' ? '#f3c98b' : '#8fd3f4')
  sky.addColorStop(1, '#fff3dc')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, 360, 240)
  ctx.fillStyle = c.sol
  ctx.beginPath(); ctx.arc(270, 92, 38, 0, Math.PI * 2); ctx.fill()
  if (tipo === 'montaña') {
    ctx.fillStyle = c.verde
    ctx.beginPath(); ctx.moveTo(0, 190); ctx.lineTo(90, 100); ctx.lineTo(170, 170); ctx.lineTo(250, 110); ctx.lineTo(360, 190); ctx.lineTo(360, 240); ctx.lineTo(0, 240); ctx.fill()
    ctx.fillStyle = c.bosque
    ctx.beginPath(); ctx.moveTo(0, 215); ctx.quadraticCurveTo(180, 160, 360, 215); ctx.lineTo(360, 240); ctx.lineTo(0, 240); ctx.fill()
  } else if (tipo === 'globo') {
    for (const [x, y, r, col] of [[90, 80, 24, '#e74c3c'], [160, 120, 16, c.mar], [215, 60, 12, c.verde]]) {
      ctx.fillStyle = col
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#6b4a2d'; ctx.fillRect(x - r * 0.25, y + r * 1.2, r * 0.5, r * 0.4)
    }
    ctx.fillStyle = '#c98b4b'
    ctx.beginPath(); ctx.moveTo(0, 200); ctx.quadraticCurveTo(120, 150, 220, 190); ctx.quadraticCurveTo(300, 160, 360, 185); ctx.lineTo(360, 240); ctx.lineTo(0, 240); ctx.fill()
  } else {
    ctx.fillStyle = c.mar
    ctx.fillRect(0, 165, 360, 75)
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 3
    for (let y = 180; y < 240; y += 18) {
      ctx.beginPath()
      for (let x = 0; x <= 360; x += 30) ctx.quadraticCurveTo(x + 7, y - 6, x + 15, y)
      ctx.stroke()
    }
    ctx.fillStyle = '#f2dfb4'
    ctx.beginPath(); ctx.moveTo(0, 240); ctx.quadraticCurveTo(80, 200, 170, 240); ctx.fill()
  }
  ctx.fillStyle = 'rgba(11,42,74,0.78)'
  ctx.fillRect(0, 0, 360, 52)
  ctx.fillStyle = '#ffffff'
  ctx.font = `800 30px ${FONT}`
  ctx.textAlign = 'center'
  ctx.fillText(nombre.toUpperCase(), 180, 37)
  return finish(cv)
}

// Costado del bus de la agencia: franjas de marca y el nombre
export function busTexture(c, nombre = 'TOSCANA TOURS') {
  const cv = document.createElement('canvas')
  cv.width = 512; cv.height = 160
  const ctx = cv.getContext('2d')
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 512, 160)
  ctx.fillStyle = '#1b2733'; ctx.fillRect(18, 18, 476, 48)
  ctx.fillStyle = c.verde; ctx.fillRect(0, 96, 512, 14)
  ctx.fillStyle = c.sol; ctx.fillRect(0, 112, 512, 8)
  ctx.fillStyle = c.mar; ctx.fillRect(0, 122, 512, 6)
  ctx.fillStyle = c.bosque
  ctx.font = `800 26px ${FONT}`
  ctx.fillText(nombre, 22, 92)
  return finish(cv)
}

// Piso del centro: rutas punteadas desde la agencia a los destinos, con rosa de los vientos
export function routeMapTexture(c, destinos) {
  const cv = document.createElement('canvas')
  cv.width = cv.height = 512
  const ctx = cv.getContext('2d')
  const g = ctx.createRadialGradient(256, 256, 40, 256, 256, 360)
  g.addColorStop(0, '#163d5c'); g.addColorStop(1, c.noche)
  ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512)
  ctx.strokeStyle = 'rgba(32,174,238,0.18)'; ctx.lineWidth = 1
  for (let i = 0; i <= 512; i += 32) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke() }
  const hub = [230, 300]
  const pts = [[150, 120], [330, 110], [400, 230], [110, 390], [420, 410]]
  ctx.setLineDash([8, 8]); ctx.lineWidth = 3; ctx.strokeStyle = c.sol
  for (const p of pts) { ctx.beginPath(); ctx.moveTo(...hub); ctx.quadraticCurveTo((hub[0] + p[0]) / 2, Math.min(hub[1], p[1]) - 60, ...p); ctx.stroke() }
  ctx.setLineDash([])
  ctx.font = `700 18px ${FONT}`; ctx.textAlign = 'center'
  pts.forEach((p, i) => {
    ctx.fillStyle = c.verde; ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#ffffff'; ctx.fillText(destinos[i]?.nombre || '', p[0], p[1] - 16)
  })
  ctx.fillStyle = c.sol; ctx.beginPath(); ctx.arc(...hub, 14, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ffffff'; ctx.fillText('Toscana Tours', hub[0], hub[1] + 34)
  return finish(cv)
}
