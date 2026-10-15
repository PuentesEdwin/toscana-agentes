import React, { useState } from 'react'

const ADMIN_STEPS = [
  {
    icon: '👋',
    title: '¡Bienvenido a tu oficina de agentes!',
    desc: 'Este es el centro de comando de tu equipo. En los próximos pasos te mostramos todo lo que puedes hacer.',
  },
  {
    icon: '⊞',
    title: 'Tu Panel de Control',
    desc: 'Aquí ves en tiempo real: cuántas tareas hay por estado, quién está trabajando ahora mismo y los timers activos de cada miembro.',
  },
  {
    icon: '⏱️',
    title: 'Sistema de Timers',
    desc: 'Cada vez que alguien mueve una tarea a "En Progreso", el timer arranca automáticamente. Tú como admin puedes ver el tiempo exacto que lleva cada tarea activa.',
  },
  {
    icon: '👥',
    title: 'Vista de Equipo',
    desc: 'Ve qué está haciendo cada miembro: su tarea activa, pendientes y completadas. Solo tú como admin ves los timers y estadísticas de rendimiento.',
  },
  {
    icon: '☑',
    title: 'Lista de Tareas',
    desc: 'Filtra por miembro, estado, cliente o mes. Cambia el estado directamente desde la tabla. Exporta a CSV con un click.',
  },
  {
    icon: '▦',
    title: 'Tablero Kanban',
    desc: 'Arrastra y suelta las tarjetas entre columnas para cambiar el estado. El timer inicia o se detiene automáticamente según el movimiento.',
  },
  {
    icon: '◑',
    title: 'Métricas y Usuarios',
    desc: 'En Métricas ves el rendimiento del equipo: tiempo por miembro, tareas por cliente, etc. En Usuarios gestionas los roles del equipo.',
  },
  {
    icon: '🍅',
    title: 'Pomodoro — Siempre disponible',
    desc: 'El botón rojo 🍅 en la esquina inferior derecha es el temporizador Pomodoro. 25 minutos de trabajo + 5 de descanso para máxima productividad.',
  },
]

const EMPLOYEE_STEPS = [
  {
    icon: '👋',
    title: '¡Bienvenido a tu oficina de agentes!',
    desc: 'Aquí gestionas tu trabajo y tu tiempo. En los próximos pasos te explicamos cómo sacarle el máximo provecho.',
  },
  {
    icon: '⊞',
    title: 'Tu Panel Personal',
    desc: 'Esta es tu página de inicio. Muestra tu tarea activa con el timer en tiempo real, tus pendientes y tus estadísticas personales de productividad.',
  },
  {
    icon: '⏱️',
    title: 'El Timer arranca solo',
    desc: 'Cuando mueves una tarea a "En Progreso" — ya sea desde el formulario, la lista o el Kanban — el timer empieza a correr automáticamente y recibirás una notificación.',
  },
  {
    icon: '👥',
    title: 'Vista de Equipo',
    desc: 'Ve en qué están trabajando tus compañeros: su tarea activa y sus pendientes. No ves sus estadísticas privadas, solo lo que tienen asignado.',
  },
  {
    icon: '▦',
    title: 'Kanban: Arrastra tus tareas',
    desc: 'En el tablero Kanban puedes arrastrar y soltar TUS tareas entre columnas. Si la mueves a "En Progreso", el timer empieza. Si la mueves fuera, el tiempo se guarda.',
  },
  {
    icon: '🍅',
    title: 'Pomodoro para concentrarte',
    desc: 'El botón 🍅 en la esquina inferior derecha es tu temporizador Pomodoro. Trabaja 25 minutos concentrado, descansa 5. ¡Después de 4 ciclos te toca un descanso largo!',
  },
  {
    icon: '👤',
    title: 'Tu Perfil',
    desc: 'En "Mi Perfil" puedes actualizar tu cargo, teléfono y bio. También ves tus estadísticas: tareas completadas, tiempo promedio por tarea.',
  },
]

export default function Tutorial({ isAdmin, onClose }) {
  const steps = isAdmin ? ADMIN_STEPS : EMPLOYEE_STEPS
  const [current, setCurrent] = useState(0)

  const step = steps[current]
  const isLast = current === steps.length - 1
  const isFirst = current === 0

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-card">
        {/* Progress dots */}
        <div className="tutorial-step-indicator">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`tutorial-dot ${i <= current ? 'done' : ''}`}
              style={{ cursor: 'pointer', flex: 1, height: 4, borderRadius: 99 }}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        {/* Content */}
        <div className="tutorial-icon">{step.icon}</div>
        <h2 className="tutorial-title">{step.title}</h2>
        <p className="tutorial-desc">{step.desc}</p>

        {/* Footer */}
        <div className="tutorial-footer">
          <span className="tutorial-progress">
            {current + 1} / {steps.length}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              style={{ marginRight: 4 }}
            >
              Saltar
            </button>
            {!isFirst && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrent(c => c - 1)}
              >
                ← Atrás
              </button>
            )}
            {!isLast ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setCurrent(c => c + 1)}
              >
                Siguiente →
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={onClose}
                style={{ background: 'var(--success)' }}
              >
                ¡Empezar! 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
