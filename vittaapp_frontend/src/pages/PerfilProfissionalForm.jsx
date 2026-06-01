import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { perfisAPI } from '../services/api'
import { useToast } from '../components/Toast'

const AREAS_MOCK = ['Personal Trainer', 'Fisioterapia', 'Nutrição', 'Pilates', 'Yoga', 'Crossfit', 'Natação', 'Dança']

export default function PerfilProfissionalForm() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [form, setForm] = useState({
    titulo: '', descricao: '', cidade: '',
    valor_por_sessao: '', area: '', forma_atendimento: 'Presencial',
    experiencia: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [areas, setAreas] = useState(AREAS_MOCK)
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    // Tenta carregar perfil existente
    // perfisAPI.meuPerfil().then(data => { setForm(data); setIsEdit(true) }).catch(() => {})
    // perfisAPI.areas().then(setAreas).catch(() => {})
  }, [])

  const validate = () => {
    const e = {}
    if (!form.titulo.trim()) e.titulo = 'Informe o título profissional'
    if (!form.descricao.trim()) e.descricao = 'Adicione uma descrição'
    if (!form.cidade.trim()) e.cidade = 'Informe a cidade'
    if (!form.valor_por_sessao) e.valor = 'Informe o valor por sessão'
    else if (isNaN(Number(form.valor_por_sessao)) || Number(form.valor_por_sessao) <= 0) e.valor = 'Valor inválido'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const body = { ...form, valor_por_sessao: Number(form.valor_por_sessao) }
      if (isEdit) {
        await perfisAPI.atualizar(body)
        toast?.show('Perfil atualizado com sucesso!')
      } else {
        await perfisAPI.criar(user.id,body)
        updateUser({ temPerfilProfissional: true })
        toast?.show('Perfil criado com sucesso!')
      }
      navigate('/')
    } catch (err) {
      toast?.show(err.message || 'Erro ao salvar perfil', 'error')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 26, marginBottom: 6 }}>
        {isEdit ? 'Editar perfil profissional' : 'Criar perfil profissional'}
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>
        Seu perfil será exibido para usuários que buscam profissionais.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Título profissional *</label>
              <input className="form-input" placeholder="Ex: Personal Trainer, Fisioterapeuta..." value={form.titulo} onChange={set('titulo')} style={errors.titulo ? { borderColor: 'var(--danger)' } : {}} />
              {errors.titulo && <span className="form-error">{errors.titulo}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Área de atuação</label>
              <select className="form-input" value={form.area} onChange={set('area')}>
                <option value="">Selecionar área...</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Cidade *</label>
              <input className="form-input" placeholder="Ex: São Paulo" value={form.cidade} onChange={set('cidade')} style={errors.cidade ? { borderColor: 'var(--danger)' } : {}} />
              {errors.cidade && <span className="form-error">{errors.cidade}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Valor por sessão (R$) *</label>
              <input className="form-input" type="number" min="1" step="0.01" placeholder="80" value={form.valor_por_sessao} onChange={set('valor_por_sessao')} style={errors.valor ? { borderColor: 'var(--danger)' } : {}} />
              {errors.valor && <span className="form-error">{errors.valor}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Forma de atendimento</label>
              <select className="form-input" value={form.forma_atendimento} onChange={set('forma_atendimento')}>
                <option value="Presencial">Presencial</option>
                <option value="Online">Online</option>
                <option value="Presencial / Online">Presencial / Online</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Experiência</label>
              <input className="form-input" placeholder="Ex: 5 anos" value={form.experiencia} onChange={set('experiencia')} />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Descrição *</label>
              <textarea
                className="form-input"
                placeholder="Fale sobre sua formação, especialidades e abordagem de trabalho..."
                rows={4}
                value={form.descricao}
                onChange={set('descricao')}
                style={errors.descricao ? { borderColor: 'var(--danger)' } : {}}
              />
              {errors.descricao && <span className="form-error">{errors.descricao}</span>}
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{form.descricao.length}/500 caracteres</span>
            </div>
          </div>

          <div className="divider" />

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 140 }}>
              {loading ? 'Salvando...' : isEdit ? 'Atualizar perfil' : 'Publicar perfil'}
            </button>
          </div>
        </form>
      </div>

      <div style={{
        marginTop: 16,
        background: 'var(--primary-dim)',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: 'var(--radius)',
        padding: '14px 16px',
        fontSize: 13, color: 'var(--muted)', lineHeight: 1.6,
      }}>
        💡 Após publicar, você poderá gerenciar sua <strong style={{ color: 'var(--text)' }}>agenda de disponibilidade</strong> na seção de agendamentos.
      </div>
    </div>
  )
}
