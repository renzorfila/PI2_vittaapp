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
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [areas, setAreas]     = useState(AREAS_MOCK)
  const [isEdit, setIsEdit]   = useState(false)
  const [perfilId, setPerfilId] = useState(null)  // guarda o ID do perfil para edição

  useEffect(() => {
    // Se o usuário já tem perfil profissional, carrega os dados para edição
    if (user?.temPerfilProfissional) {
      perfisAPI.meuPerfil(user.id)
        .then(data => {
          setPerfilId(data.id)
          setIsEdit(true)
          setForm({
            titulo:           data.titulo           || '',
            descricao:        data.descricao         || '',
            cidade:           data.cidade            || '',
            valor_por_sessao: data.valorPorSessao    ? String(data.valorPorSessao) : '',
            area:             data.areaAtuacao       || '',
            forma_atendimento: data.formaAtendimento || 'Presencial',
            experiencia:      data.experiencia       || '',
          })
        })
        .catch(() => {
          // Perfil não encontrado — mostra o form de criação mesmo assim
          setIsEdit(false)
        })
    }

    // Carrega áreas da API (se disponível)
    perfisAPI.areas()
      .then(data => {
        if (data?.length) setAreas(data.map(a => a.nome || a))
      })
      .catch(() => {}) // mantém AREAS_MOCK se falhar
  }, [user])

  const validate = () => {
    const e = {}
    if (!form.titulo.trim())          e.titulo = 'Informe o título profissional'
    if (!form.descricao.trim())       e.descricao = 'Adicione uma descrição'
    if (!form.cidade.trim())          e.cidade = 'Informe a cidade'
    if (!form.valor_por_sessao)       e.valor = 'Informe o valor por sessão'
    else if (isNaN(Number(form.valor_por_sessao)) || Number(form.valor_por_sessao) <= 0)
      e.valor = 'Valor inválido'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const body = {
        titulo:           form.titulo,
        descricao:        form.descricao,
        cidade:           form.cidade,
        experiencia:      form.experiencia,
        formaAtendimento: form.forma_atendimento,
        valorPorSessao:   Number(form.valor_por_sessao),
        areaAtuacao:      form.area,
      }

      if (isEdit) {
        await perfisAPI.atualizar(perfilId, body)   // ← passa o ID corretamente
        toast?.show('Perfil atualizado com sucesso!')
      } else {
        await perfisAPI.criar(user.id, body)
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
      <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
        {isEdit ? 'Atualize suas informações profissionais' : 'Preencha seus dados para aparecer nas buscas'}
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Título */}
        <div className="form-group">
          <label className="form-label">Título profissional</label>
          <input className="form-input" placeholder="Ex: Personal Trainer especializado em emagrecimento"
            value={form.titulo} onChange={set('titulo')} />
          {errors.titulo && <span className="form-error">{errors.titulo}</span>}
        </div>

        {/* Área */}
        <div className="form-group">
          <label className="form-label">Área de atuação</label>
          <select className="form-input" value={form.area} onChange={set('area')}>
            <option value="">Selecione...</option>
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Descrição */}
        <div className="form-group">
          <label className="form-label">Descrição</label>
          <textarea className="form-input" rows={4}
            placeholder="Fale sobre sua experiência, método de trabalho e diferenciais..."
            value={form.descricao} onChange={set('descricao')} />
          {errors.descricao && <span className="form-error">{errors.descricao}</span>}
        </div>

        {/* Cidade + Forma atendimento */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Cidade</label>
            <input className="form-input" placeholder="Ex: São Paulo - SP"
              value={form.cidade} onChange={set('cidade')} />
            {errors.cidade && <span className="form-error">{errors.cidade}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Forma de atendimento</label>
            <select className="form-input" value={form.forma_atendimento} onChange={set('forma_atendimento')}>
              <option>Presencial</option>
              <option>Online</option>
              <option>Presencial e Online</option>
            </select>
          </div>
        </div>

        {/* Valor + Experiência */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Valor por sessão (R$)</label>
            <input className="form-input" type="number" min="1" placeholder="Ex: 150"
              value={form.valor_por_sessao} onChange={set('valor_por_sessao')} />
            {errors.valor && <span className="form-error">{errors.valor}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Tempo de experiência</label>
            <input className="form-input" placeholder="Ex: 5 anos"
              value={form.experiencia} onChange={set('experiencia')} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}
          style={{ marginTop: 8, alignSelf: 'flex-end', minWidth: 180 }}>
          {loading ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar perfil'}
        </button>
      </form>
    </div>
  )
}
