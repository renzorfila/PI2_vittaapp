import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

export default function Cadastro() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showSenha, setShowSenha] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Informe seu nome completo'
    if (!form.email.trim()) e.email = 'Informe seu email'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (form.senha.length < 6) e.senha = 'Senha deve ter pelo menos 6 caracteres'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError('')
    try {
      await authAPI.cadastro({ nome: form.nome, email: form.email, senha: form.senha })
      await login(form.email, form.senha)
      navigate('/')
    } catch (err) {
      setApiError(err.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
    setApiError('')
  }

  return (
    <div className="center-page">
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 20, color: '#ffffff',
            }}>VA</div>
          </div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 26 }}>Criar conta</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
            Rápido e seguro — gerencie agendamentos e serviços
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <input
                className="form-input"
                type="text"
                autoComplete="name"
                placeholder="João da Silva"
                value={form.nome}
                onChange={set('nome')}
                style={errors.nome ? { borderColor: 'var(--danger)' } : {}}
              />
              {errors.nome && <span className="form-error">{errors.nome}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={set('email')}
                style={errors.email ? { borderColor: 'var(--danger)' } : {}}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showSenha ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  value={form.senha}
                  onChange={set('senha')}
                  style={errors.senha ? { borderColor: 'var(--danger)' } : {}}
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(s => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--muted)', fontSize: 16, padding: 0,
                  }}
                >
                  {showSenha ? '🙈' : '👁'}
                </button>
              </div>
              {errors.senha && <span className="form-error">{errors.senha}</span>}
              {/* Password strength bar */}
              {form.senha && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ height: 3, borderRadius: 99, background: 'var(--surface2)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: form.senha.length < 6 ? '33%' : form.senha.length < 10 ? '66%' : '100%',
                      background: form.senha.length < 6 ? 'var(--danger)' : form.senha.length < 10 ? '#f59e0b' : 'var(--primary)',
                      transition: 'all 0.3s',
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {form.senha.length < 6 ? 'Fraca' : form.senha.length < 10 ? 'Média' : 'Forte'}
                  </span>
                </div>
              )}
            </div>

            {apiError && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 8, padding: '10px 14px', fontSize: 13,
                color: '#fca5a5', marginBottom: 16,
              }}>
                {apiError}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', height: 44, fontSize: 15 }}>
              {loading ? 'Criando conta...' : 'Criar conta grátis'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, color: 'var(--muted)', fontSize: 14 }}>
            Já tem conta?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Entrar</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
