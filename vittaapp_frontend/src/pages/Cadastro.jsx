import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI, perfisAPI } from '../services/api'
import { useToast } from '../components/Toast'

const AREAS = ['Personal Trainer','Fisioterapia','Pilates',
               'Yoga','Crossfit','Natação','Dança','Outros']

export default function Cadastro() {
  const navigate  = useNavigate()
  const { login } = useAuth()
  const toast     = useToast()
  const [tipo, setTipo]       = useState(null)   
  const [loading, setLoading] = useState(false)
  const [form, setForm]       = useState({
    nome: '', email: '', senha: '',
    titulo: '', area: '', cidade: '', valor: '',
  })
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.nome.trim())          e.nome  = 'Nome é obrigatório'
    if (!form.email.trim())         e.email = 'Email é obrigatório'
    if (form.senha.length < 6)      e.senha = 'Mínimo 6 caracteres'
    if (tipo === 'profissional') {
      if (!form.titulo.trim())      e.titulo = 'Informe seu título'
      if (!form.area)               e.area   = 'Selecione uma área'
      if (!form.cidade.trim())      e.cidade = 'Informe sua cidade'
      if (!form.valor || Number(form.valor) <= 0) e.valor = 'Informe o valor por sessão'
    }
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      // 1. Cria o usuário
      await authAPI.cadastro({ nome: form.nome, email: form.email, senha: form.senha })

      // 2. Faz login automaticamente
      const dados = await login({ email: form.email, senha: form.senha })

      // 3. Se for profissional, cria o perfil já
      if (tipo === 'profissional' && dados?.user?.id) {
        await perfisAPI.criar(dados.user.id, {
          titulo:          form.titulo,
          areaAtuacao:     form.area,
          cidade:          form.cidade,
          valorPorSessao:  Number(form.valor),
          formaAtendimento:'Presencial',
          descricao:       '',
        })
      }

      toast?.show('Conta criada com sucesso!')
      navigate('/')
    } catch (err) {
      toast?.show(err.message || 'Erro ao criar conta', 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── Passo 1 — escolha o tipo ─────────────────────────────────
  if (!tipo) {
    return (
      <div className="center-page">
        <div style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'var(--primary)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, margin: '0 auto 16px',
          }}>V</div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 26, marginBottom: 8 }}>
            Criar sua conta
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>
            Como você quer usar o Vitta App?
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[
              { id: 'aluno',         emoji: '🎓', titulo: 'Sou Aluno',         sub: 'Quero contratar profissionais de saúde e bem-estar' },
              { id: 'profissional',  emoji: '💪', titulo: 'Sou Profissional',  sub: 'Quero oferecer meus serviços na plataforma' },
            ].map(op => (
              <button
                key={op.id}
                onClick={() => setTipo(op.id)}
                style={{
                  background: 'var(--surface)',
                  border: '2px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '24px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'center',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--primary)'
                  e.currentTarget.style.background  = 'var(--primary-dim)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background  = 'var(--surface)'
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 10 }}>{op.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{op.titulo}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.4 }}>{op.sub}</div>
              </button>
            ))}
          </div>

          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            Já tem conta?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // ── Passo 2 — formulário ─────────────────────────────────────
  return (
    <div className="center-page">
      <div className="card" style={{ width: '100%', maxWidth: 480 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => setTipo(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--muted)', fontSize: 18, padding: 0 }}
          >←</button>
          <div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20 }}>
              {tipo === 'aluno' ? '🎓 Cadastro de Aluno' : '💪 Cadastro de Profissional'}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>
              {tipo === 'aluno'
                ? 'Crie sua conta para contratar profissionais'
                : 'Crie sua conta e seu perfil profissional'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Campos comuns */}
          <div className="form-group">
            <label className="form-label">Nome completo</label>
            <input className="form-input" placeholder="Seu nome"
              value={form.nome} onChange={set('nome')} />
            {errors.nome && <span className="form-error">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="seu@email.com"
              value={form.email} onChange={set('email')} />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input className="form-input" type="password" placeholder="Mínimo 6 caracteres"
              value={form.senha} onChange={set('senha')} />
            {errors.senha && <span className="form-error">{errors.senha}</span>}
          </div>

          {/* Campos extras para profissional */}
          {tipo === 'profissional' && (
            <>
              <div className="divider" style={{ margin: '8px 0 16px' }} />
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
                Informações do seu perfil profissional:
              </p>

              <div className="form-group">
                <label className="form-label">Área de atuação</label>
                <select className="form-input" value={form.area} onChange={set('area')}>
                  <option value="">Selecione...</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                {errors.area && <span className="form-error">{errors.area}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Título profissional</label>
                <input className="form-input"
                  placeholder="Ex: Personal Trainer especializado em emagrecimento"
                  value={form.titulo} onChange={set('titulo')} />
                {errors.titulo && <span className="form-error">{errors.titulo}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Cidade</label>
                  <input className="form-input" placeholder="Ex: São Paulo - SP"
                    value={form.cidade} onChange={set('cidade')} />
                  {errors.cidade && <span className="form-error">{errors.cidade}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Valor/sessão (R$)</label>
                  <input className="form-input" type="number" min="1" placeholder="Ex: 150"
                    value={form.valor} onChange={set('valor')} />
                  {errors.valor && <span className="form-error">{errors.valor}</span>}
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary"
            disabled={loading} style={{ marginTop: 8, height: 44 }}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 16 }}>
            Já tem conta?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}