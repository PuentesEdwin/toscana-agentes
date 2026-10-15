import React, { useState } from 'react'
import { useApp } from '../App.jsx'
import TeamView from './TeamView.jsx'
import UsersAdmin from './UsersAdmin.jsx'
import Icon from '../components/Icons.jsx'

// Team: unifica la vista de Equipo y la gestión de Usuarios (solo Super Admin ve la segunda)
export default function TeamPage() {
  const { isSuperAdmin } = useApp()
  const [tab, setTab] = useState('equipo')

  if (!isSuperAdmin) return <TeamView />

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        <button
          className={`btn btn-sm ${tab === 'equipo' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('equipo')}
        >
          <Icon name="users" size={14} /> Equipo
        </button>
        <button
          className={`btn btn-sm ${tab === 'usuarios' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('usuarios')}
        >
          <Icon name="user" size={14} /> Gestión de usuarios
        </button>
      </div>
      {tab === 'equipo' ? <TeamView /> : <UsersAdmin />}
    </div>
  )
}
