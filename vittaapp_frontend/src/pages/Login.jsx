import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', senha: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showSenha, setShowSenha] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Informe seu email'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.senha) e.senha = 'Informe sua senha'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError('')
    try {
      await login(form.email, form.senha)
      navigate(from, { replace: true })
    } catch (err) {
      setApiError(err.message || 'Email ou senha incorretos')
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
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 24, color: '#ffffff',
            margin: '0 auto 12px',
          }}>V</div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 26 }}>Entrar</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
            Acesse sua conta para agendar sessões
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} noValidate>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Senha</label>
                <Link to="/esqueci-senha" style={{ fontSize: 12, color: 'var(--primary)' }}>Esqueceu?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showSenha ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
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
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, color: 'var(--muted)', fontSize: 14 }}>
            Não tem conta?{' '}
            <Link to="/cadastro" style={{ color: 'var(--primary)', fontWeight: 600 }}>Criar conta</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
