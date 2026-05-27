import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useToast } from '../components/Toast'

/* Step 1 — Email input */
function EsqueciSenha({ onNext }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  const submit = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Informe seu email'); return }
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      toast?.show('Código enviado para seu email!')
      onNext(email)
    } catch (err) {
      setError(err.message || 'Email não encontrado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 22, marginBottom: 6 }}>Esqueceu a senha?</h2>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
        Enviaremos um código de verificação para seu email.
      </p>
      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Email da conta</label>
          <input className="form-input" type="email" placeholder="seu@email.com" value={email} onChange={e => { setEmail(e.target.value); setError('') }} style={error ? { borderColor: 'var(--danger)' } : {}} />
          {error && <span className="form-error">{error}</span>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', height: 44 }}>
          {loading ? 'Enviando...' : 'Enviar código'}
        </button>
      </form>
    </>
  )
}

/* Step 2 — Code verification */
function VerificarCodigo({ email, onNext }) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  const handleChange = (i, val) => {
    if (val.length > 1) return
    const next = [...code]; next[i] = val; setCode(next)
    if (val && i < 5) document.getElementById(`code-${i + 1}`)?.focus()
  }

  const submit = async (e) => {
    e.preventDefault()
    const fullCode = code.join('')
    if (fullCode.length < 6) { setError('Informe todos os 6 dígitos'); return }
    setLoading(true)
    try {
      await authAPI.verifyCode(fullCode)
      onNext(fullCode)
    } catch {
      setError('Código inválido ou expirado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 22, marginBottom: 6 }}>Verificar código</h2>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
        Enviamos um código para <strong style={{ color: 'var(--text)' }}>{email}</strong>
      </p>
      <form onSubmit={submit}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
          {code.map((v, i) => (
            <input key={i} id={`code-${i}`}
              style={{
                width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700,
                background: 'var(--surface2)', border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: 8, color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-head)',
              }}
              maxLength={1} value={v}
              onChange={e => handleChange(i, e.target.value)}
              onFocus={e => e.target.select()}
            />
          ))}
        </div>
        {error && <p className="form-error" style={{ textAlign: 'center', marginBottom: 12 }}>{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', height: 44 }}>
          {loading ? 'Verificando...' : 'Confirmar código'}
        </button>
      </form>
    </>
  )
}

/* Step 3 — New password */
function NovaSenha({ email, code }) {
  const [form, setForm] = useState({ senha: '', confirmar: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (form.senha.length < 6) errs.senha = 'Mínimo 6 caracteres'
    if (form.senha !== form.confirmar) errs.confirmar = 'Senhas não coincidem'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await authAPI.resetPassword({ email, code, novaSenha: form.senha })
      setDone(true)
      toast?.show('Senha redefinida com sucesso!')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      toast?.show(err.message || 'Erro ao redefinir senha', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
      <h3 style={{ fontFamily: 'var(--font-head)', marginBottom: 6 }}>Senha redefinida!</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14 }}>Redirecionando para o login...</p>
    </div>
  )

  return (
    <>
      <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 22, marginBottom: 6 }}>Nova senha</h2>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Escolha uma senha forte para sua conta.</p>
      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Nova senha</label>
          <input className="form-input" type="password" placeholder="Mínimo 6 caracteres" value={form.senha}
            onChange={e => { setForm(f => ({ ...f, senha: e.target.value })); setErrors(err => ({ ...err, senha: '' })) }}
            style={errors.senha ? { borderColor: 'var(--danger)' } : {}} />
          {errors.senha && <span className="form-error">{errors.senha}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Confirmar senha</label>
          <input className="form-input" type="password" placeholder="Repita a senha" value={form.confirmar}
            onChange={e => { setForm(f => ({ ...f, confirmar: e.target.value })); setErrors(err => ({ ...err, confirmar: '' })) }}
            style={errors.confirmar ? { borderColor: 'var(--danger)' } : {}} />
          {errors.confirmar && <span className="form-error">{errors.confirmar}</span>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', height: 44 }}>
          {loading ? 'Salvando...' : 'Redefinir senha'}
        </button>
      </form>
    </>
  )
}

/* Main component — orchestrates steps */
export default function RedefinirSenha() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  const steps = [
    { label: 'Email', n: 1 },
    { label: 'Código', n: 2 },
    { label: 'Nova senha', n: 3 },
  ]

  return (
    <div className="center-page">
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 28 }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', fontSize: 12, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step > s.n ? 'var(--primary)' : step === s.n ? 'var(--primary-dim)' : 'var(--surface2)',
                color: step > s.n ? '#ffffff' : step === s.n ? 'var(--primary)' : 'var(--muted)',
                border: step === s.n ? '1px solid var(--primary)' : '1px solid var(--border)',
              }}>
                {step > s.n ? '✓' : s.n}
              </div>
              <span style={{ fontSize: 12, color: step >= s.n ? 'var(--text)' : 'var(--muted)' }}>{s.label}</span>
              {i < steps.length - 1 && <div style={{ width: 20, height: 1, background: 'var(--border)' }} />}
            </div>
          ))}
        </div>

        <div className="card">
          {step === 1 && <EsqueciSenha onNext={(e) => { setEmail(e); setStep(2) }} />}
          {step === 2 && <VerificarCodigo email={email} onNext={(c) => { setCode(c); setStep(3) }} />}
          {step === 3 && <NovaSenha email={email} code={code} />}
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/login" style={{ color: 'var(--muted)', fontSize: 13 }}>← Voltar ao login</Link>
        </div>
      </div>
    </div>
  )
}
