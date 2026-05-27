import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { perfisAPI } from '../services/api'


const GRAD_COLORS = [
  'linear-gradient(135deg,#16c784,#0ea5e9)',
  'linear-gradient(135deg,#8b5cf6,#ec4899)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#06b6d4,#3b82f6)',
  'linear-gradient(135deg,#10b981,#22d3ee)',
  'linear-gradient(135deg,#a855f7,#6366f1)',
]

function Stars({ value }) {
  const full = Math.round(value)
  return (
    <span className="stars">
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      <span style={{ color: 'var(--muted)', marginLeft: 4, fontSize: 12 }}>{value}</span>
    </span>
  )
}

function ProfCard({ perfil, index }) {
  return (
    <Link to={`/profissionais/${perfil.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        transition: 'transform 0.18s, box-shadow 0.18s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 16px 48px rgba(124,58,237,0.15)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {/* Image / Gradient placeholder */}
        <div style={{
          height: 180,
          background: perfil.imagem ? `url(${perfil.imagem}) center/cover` : GRAD_COLORS[index % GRAD_COLORS.length],
          position: 'relative',
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(30,27,75,0.55) 0%, transparent 60%)',
          }} />
          <div style={{
            position: 'relative', padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: '#fff',
              border: '2px solid rgba(255,255,255,0.3)',
            }}>
              {perfil.usuario.name[0]}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{perfil.usuario.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{perfil.cidade}</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>
            {perfil.titulo}
          </div>
          <span className="chip" style={{ marginBottom: 10, fontSize: 12 }}>
            {perfil.area_atuacao?.nome || 'Geral'}
          </span>

          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginTop: 8, paddingTop: 10,
            borderTop: '1px solid var(--border)',
          }}>
            <Stars value={perfil.avaliacao_media} />
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--primary)', fontSize: 15 }}>
              R$ {Number(perfil.valor_por_sessao).toFixed(0)}<span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>/h</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [perfis, setPerfis] = useState([])
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || '')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const PER_PAGE = 9

const fetchData = useCallback(() => {
  setLoading(true)
  perfisAPI.listar({ q: search, area: selectedArea, page })
    .then(data => {
      // Spring Boot retorna { content: [...], totalPages: N }
      const lista = data.content ?? data
      setPerfis(lista)
      setAreas([...new Set(lista.map(p => p.area_atuacao?.nome).filter(Boolean))])
      setTotalPages(data.totalPages ?? 1)
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false))
}, [search, selectedArea, page])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setSearchParams({ ...(search && { q: search }), ...(selectedArea && { area: selectedArea }) })
  }

  const handleArea = (area) => {
    setSelectedArea(prev => prev === area ? '' : area)
    setPage(1)
  }

  // Group by area
  const grouped = perfis.reduce((acc, p) => {
    const key = p.area_atuacao?.nome || 'Outros'
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {})

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-h))' }}>
      {/* Hero search */}
      {!search && !selectedArea && (
        <div style={{
          background: 'linear-gradient(180deg, rgba(124,58,237,0.06) 0%, transparent 100%)',
          padding: '60px 24px 40px',
          textAlign: 'center',
          borderBottom: '1px solid var(--border)',
        }}>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(28px,5vw,52px)', fontWeight: 800, marginBottom: 8 }}>
            Encontre seu <span style={{ color: 'var(--primary)' }}>profissional</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 28 }}>
            Personal trainers, fisioterapeutas, nutricionistas e muito mais
          </p>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, maxWidth: 540, margin: '0 auto' }}>
            <input
              className="form-input"
              style={{ flex: 1, fontSize: 15 }}
              placeholder="🔍 Buscar profissional ou especialidade..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Buscar</button>
          </form>
        </div>
      )}

      <div className="page" style={{ paddingTop: 28 }}>
        {/* Area chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          <button
            className={`chip${!selectedArea ? ' active' : ''}`}
            onClick={() => { setSelectedArea(''); setPage(1) }}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            Todas
          </button>
          {areas.map(a => (
            <button
              key={a}
              className={`chip${selectedArea === a ? ' active' : ''}`}
              onClick={() => handleArea(a)}
              style={{ border: '1px solid var(--border)', cursor: 'pointer' }}
            >
              {a}
            </button>
          ))}
        </div>

        {/* If searching, show search bar inline */}
        {(search || selectedArea) && (
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, maxWidth: 480, marginBottom: 28 }}>
            <input
              className="form-input"
              style={{ flex: 1 }}
              placeholder="🔍 Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Buscar</button>
            {(search || selectedArea) && (
              <button type="button" className="btn btn-ghost" onClick={() => { setSearch(''); setSelectedArea(''); setSearchParams({}); setPage(1) }}>
                Limpar
              </button>
            )}
          </form>
        )}

        {loading ? (
          <div className="spinner" />
        ) : perfis.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum profissional encontrado</h3>
            <p>Tente buscar com outros termos ou remova os filtros.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([area, list]) => (
            <div key={area} style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>{area}</h2>
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>{list.length} profissional{list.length !== 1 ? 'is' : ''}</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 18,
              }}>
                {list.map((p, i) => <ProfCard key={p.id} perfil={p} index={i} />)}
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              ← Anterior
            </button>
            <span style={{ padding: '7px 14px', color: 'var(--muted)', fontSize: 13 }}>
              {page} / {totalPages}
            </span>
            <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              Próxima →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
