import React from 'react'
import { SUPER_ADMIN_EMAIL } from '../config.js'

export default function PendingApproval({ userProfile, onLogout, theme }) {
  return (
    <div className="login-page" data-theme={theme || 'dark'}>
      <div className="login-card" style={{ maxWidth: 440 }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>⏳</div>
        <h1 className="login-title">Cuenta pendiente</h1>
        <p className="login-sub" style={{ marginBottom: 20 }}>
          Tu cuenta está esperando aprobación del administrador.
          Una vez aprobada, podrás acceder a la plataforma.
        </p>

        <div style={{
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '14px 18px',
          marginBottom: 24,
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {userProfile?.photo
              ? <img src={userProfile.photo} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
              : <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: userProfile?.color || '#4700E0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700, color: '#fff'
                }}>
                  {(userProfile?.name || '?')[0].toUpperCase()}
                </div>
            }
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{userProfile?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{userProfile?.email}</div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>
          Avisa a <strong>{SUPER_ADMIN_EMAIL}</strong> para que aprueben tu acceso.
        </p>

        <button className="btn btn-secondary" onClick={onLogout} style={{ width: '100%' }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
