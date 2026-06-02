import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { perfisAPI } from '../services/api'
import { useToast } from '../components/Toast'


const MOCK_GRAD = 'linear-gradient(135deg,#16c784,#0ea5e9)'

function Stars({ value, interactive, onRate }) {
  const [hover, setHover] = useState(0)
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i}
          style={{
            fontSize: interactive ? 28 : 16,
            color: (hover || value) >= i ? '#f59e0b' : '#374151',
            cursor: interactive ? 'pointer' : 'default',
            transition: 'color 0.1s',
          }}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate(i)}
        >★</span>
      ))}
      {!interactive && <span style={{ color: 'var(--muted)', fontSize: 12, marginLeft: 4 }}>{value}</span>}
    </span>
  )
}

export default function PerfilDetalhe() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [agendando, setAgendando] = useState(false)


  useEffect(() => {
    setLoading(true)
    perfisAPI.buscar(id)
      .then(setPerfil)
      .catch(() => setPerfil(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleRate = async (nota) => {
    if (!user) { navigate('/login'); return }
    setRating(nota)
    try {
      await perfisAPI.avaliar(id, nota)
      toast?.show(`Você avaliou com ${nota} estrela${nota > 1 ? 's' : ''}!`)
    } catch {
      toast?.show('Erro ao avaliar. Tente novamente.', 'error')
    }
  }

  const handleAgendar = () => {
    if (!user) { navigate('/login'); return }
    navigate(`/profissionais/${id}/agenda`)
  }

  if (loading) return <div className="spinner" />
  if (!perfil) return <div className="page"><p>Profissional não encontrado.</p></div>

  return (
    <div className="page">
      {/* Back */}
      <Link to="/" style={{ color: 'var(--muted)', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
        ← Voltar à lista
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Header card */}
          <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ height: 140, background: MOCK_GRAD, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(30,27,75,0.65) 0%, transparent 60%)' }} />
            </div>
            <div style={{ padding: '0 24px 24px', marginTop: -40, position: 'relative' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 700, color: '#ffffff',
                border: '3px solid var(--surface)',
                marginBottom: 12,
              }}>
                {perfil.usuario?.nome?.[0] || '?'}
              </div>
              <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 24, marginBottom: 4 }}>{perfil.usuario?.nome}</h1>
              <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 10 }}>
                <strong style={{ color: 'var(--text)' }}>{perfil.titulo}</strong> · {perfil.areaAtuacao}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <Stars value={perfil.avaliacaoMedia} />
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>({perfil.avaliacoes_count} avaliações)</span>
                <span className="chip">📍 {perfil.cidade}</span>
              </div>
            </div>
          </div>

          {/* Gallery */}
          {perfil.imagens?.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: 14, fontSize: 16 }}>Galeria</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                {perfil.imagens.map((img, i) => (
                  <img key={i} src={img.imagem || img} alt="" style={{ borderRadius: 8, aspectRatio: '4/3', objectFit: 'cover', width: '100%' }} />
                ))}
              </div>
            </div>
          )}

          {/* Sobre */}
          <div className="card">
            <h3 style={{ marginBottom: 12, fontSize: 16 }}>Sobre</h3>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: 14 }}>
              {perfil.descricao || 'Este profissional ainda não adicionou uma descrição.'}
            </p>
          </div>

          {/* Área */}
          {perfil.areaAtuacao && (
            <div className="card">
              <h3 style={{ marginBottom: 8, fontSize: 16 }}>Área de atuação</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                {perfil.areaAtuacao}
              </p>
            </div>
          )}

          {/* Avaliação */}
          <div className="card">
            <h3 style={{ marginBottom: 14, fontSize: 16 }}>
              {user ? 'Avaliar este profissional' : 'Avaliações'}
            </h3>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '16px 0', borderTop: '1px solid var(--border)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 40, fontWeight: 800, color: 'var(--primary)' }}>
                  {perfil.avaliacaoMedia}
                </div>
                <Stars value={Math.round(perfil.avaliacaoMedia || 0)} />
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                  {perfil.avaliacoes_count} avaliações
                </div>
              </div>
              {user && (
                <div style={{ paddingLeft: 20, borderLeft: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>Sua avaliação:</p>
                  <Stars value={rating} interactive onRate={handleRate} />
                  {rating > 0 && (
                    <p style={{ fontSize: 12, color: 'var(--primary)', marginTop: 6 }}>
                      Você avaliou com {rating} estrela{rating > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )}
              {!user && (
                <Link to="/login" style={{ color: 'var(--primary)', fontSize: 14 }}>
                  Faça login para avaliar
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Valor por sessão</div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 30, color: 'var(--primary)' }}>
                R$ {Number(perfil.valorPorSessao || 0).toFixed(0)}
                <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 400 }}>/hora</span>
              </div>
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <InfoRow label="Atendimento" value={perfil.forma_atendimento || 'Presencial / Online'} />
              <InfoRow label="Experiência" value={perfil.experiencia || 'Não informado'} />
              <InfoRow label="Email" value={perfil.usuario.email || '—'} />
            </div>

            <button
              className="btn btn-primary"
              onClick={handleAgendar}
              disabled={agendando}
              style={{ width: '100%', height: 44, fontSize: 15, marginBottom: 10 }}
            >
              📅 Agendar sessão
            </button>

            <Link
              to={user ? `/mensagens/${perfil.usuario.id || id}` : '/login'}
              className="btn btn-ghost"
              style={{ width: '100%', height: 40, fontSize: 14 }}
            >
              💬 Enviar mensagem
            </Link>
          </div>

          {/* Pagamento info */}
          <div style={{
            background: 'var(--primary-dim)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: 'var(--radius)',
            padding: '14px 16px',
            fontSize: 13, color: 'var(--muted)',
            lineHeight: 1.6,
          }}>
            💡 <strong style={{ color: 'var(--text)' }}>Pagamento após o treino.</strong> Combine os detalhes diretamente com o profissional.
          </div>
        </aside>
      </div>

      {/* Mobile responsive fix */}
      <style>{`
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: 180 }}>{value}</span>
    </div>
  )
}
