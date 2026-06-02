import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchValue.trim()) navigate(`/?q=${encodeURIComponent(searchValue.trim())}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const hasPerfil = user?.temPerfilProfissional

  return (
    <header style={{
      position: 'sticky', 
      top: 0, 
      zIndex: 1000,
      height: 'var(--nav-h)', // CORREÇÃO: Altura travada em 64px para evitar que a tela trema
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: scrolled ? '10px 24px' : '16px 24px',
      background: '#7c3aed',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.12)',
      boxShadow: scrolled ? '0 4px 24px rgba(124,58,237,0.35)' : 'none',
      transition: 'padding 0.22s ease, box-shadow 0.22s ease',
      gap: 16,
    }}>
      {/* Logo */}
      <Link to="/" style={{
        fontFamily: 'var(--font-head)',
        fontWeight: 800,
        fontSize: 20,
        color: '#ffffff',
        letterSpacing: '-0.5px',
        display: 'flex', alignItems: 'center', gap: 8,
        flexShrink: 0,
      }}>
        <span style={{
          width: 30, height: 30,
          background: 'rgba(255,255,255,0.20)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ffffff', fontWeight: 900, fontSize: 14,
          border: '1px solid rgba(255,255,255,0.3)',
        }}>V</span>
        Vitta App
      </Link>

      {/* Search (shown when scrolled on home) */}
      {scrolled && location.pathname === '/' && (
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 360, display: 'flex' }}>
          <input
            style={{
              height: 36, fontSize: 14, padding: '0 12px',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 8, color: '#ffffff', outline: 'none',
              width: '100%', fontFamily: 'var(--font-body)',
            }}
            placeholder="Buscar profissional..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        </form>
      )}

      {/* Nav links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {!user ? (
          <>
            <Link to="/cadastro" style={{
              padding: '7px 14px', borderRadius: 6, fontSize: 13,
              fontWeight: 600, color: '#ffffff', border: '1px solid rgba(255,255,255,0.35)',
              background: 'transparent', transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >Cadastrar</Link>
            <Link to="/login" style={{
              padding: '7px 14px', borderRadius: 6, fontSize: 13,
              fontWeight: 600, color: '#7c3aed', background: '#ffffff',
              border: 'none', transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Entrar</Link>
          </>
        ) : (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 8,
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
                transition: 'background 0.15s',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                border: '1.5px solid rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#ffffff', fontWeight: 700,
              }}>
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </div>
              <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name || user.email}
              </span>
              <span style={{ fontSize: 10, opacity: 0.8 }}>▼</span>
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '8px 0',
                minWidth: 210, boxShadow: 'var(--shadow)',
                animation: 'slideIn 0.15s ease',
              }}>
                <NavMenuItem to="/mensagens" label="💬 Mensagens" />
                <NavMenuItem
                  to="/perfil/editar"
                  label={hasPerfil ? '🧑‍💼 Meu Perfil Profissional' : '➕ Criar Perfil Profissional'}
                />
                <NavMenuItem to="/agenda" label="📅 Minha Agenda" />
                <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '10px 18px', background: 'none', border: 'none',
                    color: 'var(--danger)', fontSize: 14, fontFamily: 'inherit',
                    fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  🚪 Sair
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

function NavMenuItem({ to, label }) {
  return (
    <Link
      to={to}
      style={{
        display: 'block', padding: '10px 18px',
        fontSize: 14, fontWeight: 500, color: 'var(--text)',
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      {label}
    </Link>
  )
}