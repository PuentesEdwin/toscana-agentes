import React, { Suspense } from 'react'

// La vista previa usa three.js: se carga aparte para no pesar en el resto de la app
const MinifigPreview = React.lazy(() => import('../office/MinifigPreview.jsx'))

export const STYLES = [
  { id: 'pelo', label: 'Cabello corto' },
  { id: 'pelo-largo', label: 'Cabello largo' },
  { id: 'casco', label: 'Casco' },
  { id: 'capa', label: 'Capa' },
  { id: 'gorra', label: 'Gorra' },
  { id: 'ninguno', label: 'Sin accesorio' },
]

export const SKINS = [
  { id: '#f6c445', label: 'Clásico' },
  { id: '#f9dcc4', label: 'Clara' },
  { id: '#eec1a0', label: 'Media clara' },
  { id: '#d9a07a', label: 'Media' },
  { id: '#b67a52', label: 'Trigueña' },
  { id: '#8a5636', label: 'Morena' },
  { id: '#5c3a24', label: 'Oscura' },
]

export const DEFAULT_LOOK = { torso: '#4700E0', legs: '#1f2937', arms: '#4700E0', hair: '#2b2118', accent: '#ffd23f', style: 'pelo', emblem: '', skin: '#f6c445' }

const hashPick = (str, arr) => {
  let h = 0
  for (const ch of String(str)) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return arr[h % arr.length]
}

// Personaje de una persona del equipo: lo que haya personalizado, o uno automático estable
export function userLook(u) {
  const auto = {
    torso: u?.color || '#4700E0', legs: '#1f2937',
    hair: hashPick(u?.uid, ['#2b2118', '#4b2e1a', '#7a5230', '#111827', '#b4231c']),
    style: hashPick((u?.uid || '') + 'x', ['pelo', 'pelo-largo']),
  }
  return { ...auto, ...(u?.look || {}) }
}

// Editor del personaje 3D (agentes y personas) con vista previa girando
export default function LookEditor({ look, onChange, showLipstick = true }) {
  const set = (k, v) => onChange({ ...look, [k]: v })
  const color = (k, label) => (
    <label className="look-color">
      <input type="color" value={look[k] || '#000000'} onChange={e => set(k, e.target.value)} />
      {label}
    </label>
  )
  return (
    <div className="look-editor">
      <div className="look-preview">
        <Suspense fallback={<div className="minifig-preview" style={{ width: 200, height: 200 }} />}>
          <MinifigPreview look={look} size={200} />
        </Suspense>
      </div>
      <div className="look-fields">
        <select className="form-select" value={look.style || 'pelo'} onChange={e => set('style', e.target.value)}>
          {STYLES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <div className="look-skins" role="radiogroup" aria-label="Tono de piel">
          {SKINS.map(s => (
            <button key={s.id} type="button" title={s.label} aria-label={s.label}
              className={`look-skin ${(look.skin || '#f6c445') === s.id ? 'on' : ''}`}
              style={{ background: s.id }} onClick={() => set('skin', s.id)} />
          ))}
        </div>
        <div className="look-grid">
          {color('torso', 'Torso')}
          {color('arms', 'Brazos')}
          {color('legs', 'Piernas')}
          {color('hair', 'Cabello / casco')}
          {color('accent', 'Detalle')}
          <label className="look-color">
            <input type="checkbox" checked={!!look.emblem} onChange={e => set('emblem', e.target.checked ? '#7dd3fc' : '')} />
            Emblema
            {look.emblem && <input type="color" value={look.emblem} onChange={e => set('emblem', e.target.value)} />}
          </label>
          {showLipstick && (
            <label className="look-color">
              <input type="checkbox" checked={!!look.lipstick} onChange={e => set('lipstick', e.target.checked)} />
              Labios rojos
            </label>
          )}
        </div>
      </div>
    </div>
  )
}
