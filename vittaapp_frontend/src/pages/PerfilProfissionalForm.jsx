import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { perfisAPI } from '../services/api'
import { useToast } from '../components/Toast'

const AREAS_MOCK = ['Personal Trainer', 'Fisioterapia', 'Nutrição', 'Pilates', 'Yoga', 'Crossfit', 'Natação', 'Dança', 'Outros']

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
  const [foto, setFoto] = useState(null) 
  const [fotoSalva, setFotoSalva] = useState(user?.foto || null)

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
             // Carrega foto existente do perfil
        perfisAPI.listarImagens(data.id)
          .then(imgs => { if (imgs?.[0]) setFotoSalva(imgs[0].imagem) })
          .catch(() => {})  
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

      let idParaFoto = perfilId
      if (isEdit) {
        await perfisAPI.atualizar(perfilId, body)
      } else {
        const criado = await perfisAPI.criar(user.id, body)
        idParaFoto = criado.id
        updateUser({ temPerfilProfissional: true })
      }

      // Sobe a foto se o usuário selecionou uma nova
      if (foto && idParaFoto) {
        await perfisAPI.adicionarImagem(idParaFoto, foto, 0).catch(() => {})
      }

      toast?.show(isEdit ? 'Perfil atualizado com sucesso!' : 'Perfil criado com sucesso!')
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

  const handleFoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast?.show('Imagem muito grande. Máximo 2MB.', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => setFoto(ev.target.result)
    reader.readAsDataURL(file)
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
        {/* Foto do perfil */}
        <div className="form-group">
          <label className="form-label">Foto do perfil</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'var(--surface2)', border: '2px dashed var(--border)',
              overflow: 'hidden', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {(foto || fotoSalva)
                ? <img src={foto || fotoSalva} alt="preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 32 }}>📷</span>
              }
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                background: 'var(--primary-dim)', color: 'var(--primary)',
                border: '1px solid var(--primary)', fontWeight: 600, fontSize: 14,
              }}>
                📁 Escolher foto
                <input type="file" accept="image/*"
                  onChange={handleFoto} style={{ display: 'none' }} />
              </label>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                JPG, PNG ou WEBP — máximo 2MB
              </span>
              {foto && (
                <button type="button" onClick={() => setFoto(null)}
                  style={{ fontSize: 12, color: 'var(--danger)',
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  ✕ Remover seleção
                </button>
              )}
            </div>
          </div>
        </div>

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

