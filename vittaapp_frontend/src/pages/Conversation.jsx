import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { chatAPI } from '../services/api'


function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export default function Conversation() {
  const { userId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [other, setOther] = useState(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)
  const intervalRef = useRef(null)


  const fetchMessages = useCallback(async () => {
    const data = await chatAPI.conversa(userId)
    setMessages(data.messages)
    setOther(data.user)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchMessages()
    // Auto-refresh every 2s
    intervalRef.current = setInterval(fetchMessages, 2000)
    return () => clearInterval(intervalRef.current)
  }, [fetchMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSending(true)
    const msg = { id: Date.now(), senderId: 'me', text: text.trim(), time: new Date().toISOString() }
    setMessages(m => [...m, msg])
    setText('')
    try {
      await chatAPI.enviar(userId, msg.text)
    } catch {
      // Rollback on error
      setMessages(m => m.filter(x => x.id !== msg.id))
    } finally {
      setSending(false)
    }
  }

  const isMe = (msg) => msg.senderId === 'me' || msg.senderId === user?.id

  if (loading) return <div className="spinner" />

  return (
    <div className="page" style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--nav-h) - 80px)' }}>
      {/* Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '14px 18px', flexShrink: 0 }}>
        <Link to="/mensagens" style={{ color: 'var(--muted)', fontSize: 20, lineHeight: 1, marginRight: 4 }}>←</Link>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'var(--primary)', color: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 16,
        }}>
          {other?.initial || other?.name?.[0] || 'U'}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{other?.name}</div>
          <div style={{ fontSize: 11, color: 'var(--primary)' }}>● Online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="card" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0', fontSize: 14 }}>
            Nenhuma mensagem ainda. Diga olá! 👋
          </div>
        )}
        {messages.map(msg => {
          const mine = isMe(msg)
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: mine ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
              {!mine && (
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--primary-dim)', border: '1px solid var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: 'var(--primary)', fontWeight: 700,
                }}>
                  {other?.initial}
                </div>
              )}
              <div style={{ maxWidth: '72%' }}>
                <div style={{
                  padding: '9px 13px',
                  borderRadius: mine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: mine ? 'var(--primary)' : 'var(--surface2)',
                  color: mine ? '#ffffff' : 'var(--text)',
                  fontSize: 14, lineHeight: 1.5,
                  fontWeight: mine ? 500 : 400,
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3, textAlign: mine ? 'right' : 'left' }}>
                  {formatTime(msg.time)}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <input
          className="form-input"
          style={{ flex: 1, height: 46 }}
          placeholder="Escreva uma mensagem..."
          value={text}
          onChange={e => setText(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn btn-primary" disabled={sending || !text.trim()} style={{ height: 46, paddingInline: 20 }}>
          {sending ? '...' : '→'}
        </button>
      </form>
    </div>
  )
}
