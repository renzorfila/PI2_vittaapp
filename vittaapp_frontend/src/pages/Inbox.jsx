import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { chatAPI } from '../services/api'



function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60) return 'agora'
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

const GRAD_COLORS = ['#16c784', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4']

export default function Inbox() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    chatAPI
      .inbox(user.id)
      .then(setConversations)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.id])


  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 24, marginBottom: 4 }}>Mensagens</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
        Suas conversas com profissionais e alunos
      </p>

      {loading ? <div className="spinner" /> : (
        conversations.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhuma mensagem</h3>
            <p>Inicie uma conversa acessando o perfil de um profissional.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {conversations.map((c, i) => (
              <Link key={c.userId} to={`/mensagens/${c.userId}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 20px',
                  borderBottom: i < conversations.length - 1 ? '1px solid var(--border)' : 'none',
                  textDecoration: 'none',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                {/* Avatar */}
                <div style={{
                  width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                  background: GRAD_COLORS[i % GRAD_COLORS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700, color: '#fff',
                }}>
                  {c.initial}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontWeight: c.unread ? 700 : 500, fontSize: 15, color: 'var(--text)' }}>
                      {c.name}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>
                      {timeAgo(c.time)}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 13, color: c.unread ? 'var(--text)' : 'var(--muted)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    fontWeight: c.unread ? 500 : 400,
                  }}>
                    {c.lastMessage}
                  </div>
                </div>

                {/* Unread badge */}
                {c.unread > 0 && (
                  <div style={{
                    minWidth: 20, height: 20, borderRadius: 99,
                    background: 'var(--primary)', color: '#ffffff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                    padding: '0 5px',
                  }}>
                    {c.unread}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  )
}
