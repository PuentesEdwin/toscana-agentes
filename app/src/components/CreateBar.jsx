import React, { useState } from 'react'
import { db } from '../firebase.js'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import CATALOGO from '../../../roles/catalogo.json'
import Icon from './Icons.jsx'

// Barra "¿Qué quieres crear hoy?": cada botón es un atajo de un rol (roles/catalogo.json → atajos)
// y crea la tarea para el agente activo que tiene ese rol. Si ningún agente tiene atajos, no se muestra.
export default function CreateBar({ agents, userEmail, showToast }) {
  const [open, setOpen] = useState(null)
  const items = agents
    .filter(a => a.active !== false)
    .flatMap(a => (CATALOGO.roles[a.rol]?.atajos || []).map(at => ({ ...at, agent: a })))
  // Un botón por atajo: si dos agentes tienen el mismo rol, lo hace el primero
  const unicos = [...new Map(items.map(i => [i.id, i])).values()]
  if (!unicos.length) return null

  return (
    <>
      <section className="create-bar card">
        <div className="create-bar-title">¿Qué quieres crear hoy?</div>
        <div className="create-bar-grid">
          {unicos.map(i => (
            <button key={i.id} className="create-btn" onClick={() => setOpen(i)}>
              <strong>{i.titulo}</strong>
              <span>{i.ayuda}</span>
              <small>Lo hace {i.agent.name}</small>
            </button>
          ))}
        </div>
      </section>
      {open && <CreateModal item={open} userEmail={userEmail} showToast={showToast} onClose={() => setOpen(null)} />}
    </>
  )
}

function CreateModal({ item, userEmail, showToast, onClose }) {
  const [vals, setVals] = useState({})
  const [saving, setSaving] = useState(false)
  const val = (id) => (vals[id] || '').trim()

  const handleSave = async () => {
    const falta = item.campos.find(c => !c.opcional && !val(c.id))
    if (falta) { showToast(`Falta: ${falta.label}`, 'error'); return }
    // Nombre de la tarea desde la plantilla del atajo; los datos van como instrucciones
    const tarea = item.tarea.replace(/\{(\w+)\}/g, (_, k) => val(k)).replace(/[\s·:-]+$/, '').trim()
    const descripcion = item.campos.filter(c => val(c.id)).map(c => `${c.label}: ${val(c.id)}`).join('\n')
    setSaving(true)
    try {
      await addDoc(collection(db, 'tasks'), {
        tarea, descripcion,
        asignado: item.agent.id, asignadoAgente: true,
        cliente: '', prioridad: 'media',
        estado: 'pendiente',
        fechaRequerimiento: null, fechaVencimiento: null, tiempoEstimadoMin: 0,
        links: '', linkTerminada: '', feedback: '', rating: 0,
        fechaInicio: null, fechaEntrega: null,
        timerStartedAt: null, timerPaused: false, totalTimeSeconds: 0,
        createdAt: serverTimestamp(), createdBy: userEmail,
        lastEditedBy: userEmail, lastEditedAt: serverTimestamp(),
      })
      showToast(`${item.agent.name} ya tiene la tarea "${tarea}"`)
      onClose()
    } catch (e) {
      console.error(e)
      showToast('No se pudo crear la tarea', 'error')
    }
    setSaving(false)
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <h2 className="modal-title">{item.titulo} · {item.agent.name}</h2>
          <button className="icon-btn" onClick={onClose} title="Cerrar"><Icon name="x" size={14} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {item.campos.map((c, n) => (
            <div className="form-group" key={c.id}>
              <label className="form-label" htmlFor={`crear-${c.id}`}>{c.label}{c.opcional ? ' (opcional)' : ''}</label>
              {c.largo
                ? <textarea id={`crear-${c.id}`} className="form-textarea" rows={3} value={vals[c.id] || ''} placeholder={c.ejemplo}
                    onChange={e => setVals(v => ({ ...v, [c.id]: e.target.value }))} />
                : <input id={`crear-${c.id}`} className="form-input" value={vals[c.id] || ''} placeholder={c.ejemplo} autoFocus={n === 0}
                    onChange={e => setVals(v => ({ ...v, [c.id]: e.target.value }))} />}
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Enviando...' : `Pedírselo a ${item.agent.name}`}</button>
        </div>
      </div>
    </div>
  )
}
