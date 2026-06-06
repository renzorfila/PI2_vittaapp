import { useState, useEffect } from 'react'

import { useAuth } from '../context/AuthContext'
import { agendaAPI } from '../services/api'
import { useToast } from '../components/Toast'

const WEEKDAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

function formatDateTime(iso) {
  const d = new Date(iso)
  return d.toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

/* ── Modal para criar slot recorrente ── */
function CreateSlotModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', weekday: '0', start_time: '', end_time: '', start_date: '', end_date: '', capacity: 1 })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const toast = useToast()

  const validate = () => {
    const e = {}
    if (!form.start_time) e.start_time = 'Obrigatório'
    if (!form.end_time) e.end_time = 'Obrigatório'
    if (form.start_time && form.end_time && form.start_time >= form.end_time) e.end_time = 'Término deve ser após o início'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await agendaAPI.criarSlot({
        titulo:    form.title,
        startTime: `${form.start_date}T${form.start_time}:00`,
        endTime:   `${form.start_date}T${form.end_time}:00`,
        capacity:  Number(form.capacity),
      }, user.id)
      toast?.show('Série criada! Próximas 8 semanas geradas.')
      onCreate()
      onClose()
    } catch (err) {
      toast?.show(err.message || 'Erro ao criar série', 'error')
    } finally {
      setLoading(false)
    }
  }

  const set = (f) => (e) => { setForm(p => ({ ...p, [f]: e.target.value })); setErrors(err => ({ ...err, [f]: '' })) }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(30,27,75,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: 16,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-head)' }}>+ Nova série semanal</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título (opcional)</label>
            <input className="form-input" placeholder="Ex: Treino Funcional" value={form.title} onChange={set('title')} />
          </div>
          <div className="form-group">
            <label className="form-label">Dia da semana</label>
            <select className="form-input" value={form.weekday} onChange={set('weekday')}>
              {WEEKDAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Início *</label>
              <input className="form-input" type="time" value={form.start_time} onChange={set('start_time')} style={errors.start_time ? { borderColor: 'var(--danger)' } : {}} />
              {errors.start_time && <span className="form-error">{errors.start_time}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Término *</label>
              <input className="form-input" type="time" value={form.end_time} onChange={set('end_time')} style={errors.end_time ? { borderColor: 'var(--danger)' } : {}} />
              {errors.end_time && <span className="form-error">{errors.end_time}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Data de início</label>
              <input className="form-input" type="date" value={form.start_date} onChange={set('start_date')} />
            </div>
            <div className="form-group">
              <label className="form-label">Data de término</label>
              <input className="form-input" type="date" value={form.end_date} onChange={set('end_date')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Capacidade (vagas)</label>
            <input className="form-input" type="number" min="1" max="20" value={form.capacity} onChange={set('capacity')} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 180 }}>
              {loading ? 'Criando...' : 'Criar e gerar 8 semanas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Agenda() {
  const { user } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState('slots') // 'slots' | 'bookings'
  const [slots, setSlots] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [bookingSlot, setBookingSlot] = useState(null)


  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const [slotsData, bookingsData] = await Promise.all([
          agendaAPI.listarSlots(),
          agendaAPI.meusAgendamentos(user.id),
        ])

        setSlots(slotsData)
        setBookings(bookingsData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])


  const refreshData = async () => {

    agendaAPI.listarSlots()
      .then(setSlots)
      .catch(console.error)

    agendaAPI.meusAgendamentos()
      .then(setBookings)
      .catch(console.error)
  }

  const handleBook = async (slot) => {

    if (slot.available === 0) { toast?.show('Este horário está cheio', 'error'); return }
    setBookingSlot(slot.id)
    try {
      await agendaAPI.agendar(slot.id, user.id)
      toast?.show('Sessão agendada com sucesso!')
      refreshData()

    } catch (err) {
      toast?.show(err.message || 'Erro ao agendar', 'error')
    } finally {
      setBookingSlot(null)
    }
  }

  const handleCancel = async (bookingId) => {
    if (!confirm('Cancelar este agendamento?')) return
    try {
      await agendaAPI.cancelar(bookingId)
      toast?.show('Agendamento cancelado')
      refreshData()

    } catch (err) {
      toast?.show(err.message || 'Erro ao cancelar', 'error')
    }
  }

  const statusColor = { confirmed: 'var(--primary)', pending: '#f59e0b', cancelled: 'var(--danger)' }
  const statusLabel = { confirmed: 'Confirmado', pending: 'Pendente', cancelled: 'Cancelado' }

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 24, marginBottom: 4 }}>Agenda</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Gerencie horários disponíveis e agendamentos</p>
        </div>
        {user?.tipo === 'PROFISSIONAL' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Nova série
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', padding: 4, borderRadius: 'var(--radius-sm)', marginBottom: 24, width: 'fit-content' }}>
        {[['slots', '📅 Horários disponíveis'], ['bookings', '✅ Meus agendamentos']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{
              padding: '7px 16px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: tab === key ? 'var(--primary)' : 'transparent',
              color: tab === key ? '#ffffff' : 'var(--muted)',
              transition: 'all 0.15s',
            }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? <div className="spinner" /> : (
        <>
          {/* Available slots */}
          {tab === 'slots' && (
            slots.length === 0 ? (
              <div className="empty-state">
                <h3>Nenhum horário disponível</h3>
                <p>Os horários disponíveis dos profissionais aparecerão aqui.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {slots.map(slot => {
                  const isFull = slot.available === 0
                  const isBooking = bookingSlot === slot.id
                  return (
                    <div key={slot.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                        background: isFull ? 'var(--surface2)' : 'var(--primary-dim)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: 18 }}>📅</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>
                        {slot.titulo || slot.tutor?.nome}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                        {formatDateTime(slot.startTime)} → {formatTime(slot.endTime)}
                      </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{
                          fontSize: 12, color: isFull ? 'var(--danger)' : 'var(--primary)',
                          marginBottom: 6, fontWeight: 600,
                        }}>
                          {isFull ? 'Lotado' : `${slot.available}/${slot.capacity} vaga${slot.available !== 1 ? 's' : ''}`}
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={isFull || isBooking}
                          onClick={() => handleBook(slot)}
                          style={isFull ? { opacity: 0.4 } : {}}
                        >
                          {isBooking ? 'Agendando...' : 'Agendar'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          )}

          {/* My bookings */}
          {tab === 'bookings' && (
            bookings.length === 0 ? (
              <div className="empty-state">
                <h3>Nenhum agendamento</h3>
                <p>Seus agendamentos confirmados aparecerão aqui.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {bookings.map(b => (
                  <div key={b.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                      background: statusColor[b.status],
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{b.slot.titulo || b.slot.tutor?.nome}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                        {formatDateTime(b.slot.startTime)} → {formatTime(b.slot.endTime)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{ fontSize: 12, color: statusColor[b.status], fontWeight: 600 }}>
                        {statusLabel[b.status]}
                      </span>
                      {b.status !== 'cancelled' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}

      {showModal && <CreateSlotModal
        onClose={() => setShowModal(false)}
        onCreate={() => {
          // Recarrega após criar série
          refreshData()
        }}

      />}


    </div>
  )
}
