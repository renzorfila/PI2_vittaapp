import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usuariosAPI } from '../services/api'
import { useToast } from '../components/Toast'

export default function EditarPerfilUsuario() {
  const { user, updateUser } = useAuth()
  const toast = useToast()

  const [nome, setNome]       = useState(user?.name  || '')
  const [foto, setFoto]       = useState(null)
  const [fotoSalva, setFotoSalva] = useState(user?.foto || null)
  const [loading, setLoading] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nome.trim()) { toast?.show('Nome é obrigatório', 'error'); return }

    setLoading(true)
    try {
      const atualizado = await usuariosAPI.atualizar(user.id, {
        nome,
        foto: foto || undefined,
      })
      updateUser({ name: atualizado.nome, foto: atualizado.foto })
      setFotoSalva(atualizado.foto)
      setFoto(null)
      toast?.show('Perfil atualizado!')
    } catch (err) {
      toast?.show(err.message || 'Erro ao atualizar', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fotoAtual = foto || fotoSalva

  return (
    <div className="center-page">
      <div className="card" style={{ width: '100%', maxWidth: 460 }}>
        <h2 style={{ fontFamily: 'var(--font-head)', marginBottom: 6 }}>Meu perfil</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 14 }}>
          Edite suas informações pessoais
        </p>

        {/* Avatar com upload */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: fotoAtual ? 'transparent' : 'var(--primary)',
            border: '3px solid var(--primary)',
            overflow: 'hidden', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 36, color: '#fff', fontWeight: 700,
          }}>
            {fotoAtual
              ? <img src={fotoAtual} alt="foto"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (user?.name || user?.email || 'U')[0].toUpperCase()
            }
          </div>

          <label style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
            background: 'var(--primary-dim)', color: 'var(--primary)',
            border: '1px solid var(--primary)', fontWeight: 600, fontSize: 13,
          }}>
            📷 Alterar foto
            <input type="file" accept="image/*"
              onChange={handleFoto} style={{ display: 'none' }} />
          </label>

          {foto && (
            <button type="button" onClick={() => setFoto(null)}
              style={{ fontSize: 12, color: 'var(--danger)', background: 'none',
                border: 'none', cursor: 'pointer' }}>
              ✕ Cancelar alteração
            </button>
          )}

          <span style={{ fontSize: 12, color: 'var(--muted)' }}>
            JPG, PNG ou WEBP — máximo 2MB
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input className="form-input" value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Seu nome completo" />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" value={user?.email || ''} disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              O email não pode ser alterado
            </span>
          </div>

          <button type="submit" className="btn btn-primary"
            disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </div>
  )
}