/**
 * Vitta App — API Service
 * Conecta ao backend Spring Boot (localhost:8080 em desenvolvimento)
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return localStorage.getItem('vitta_token')
}

async function request(method, path, body = null, opts = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...opts.headers,
  }

  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const config = {
    method,
    headers,
  }

  if (body) config.body = JSON.stringify(body)

  const res = await fetch(`${BASE_URL}${path}`, config)

  if (!res.ok) {
    let errMsg = `Erro ${res.status}`
    try {
      const errData = await res.json()
      errMsg = errData.message || errData.erro || errMsg
    } catch {}
    throw new Error(errMsg)
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get:    (path, opts)       => request('GET',    path, null, opts),
  post:   (path, body, opts) => request('POST',   path, body, opts),
  put:    (path, body, opts) => request('PUT',    path, body, opts),
  patch:  (path, body, opts) => request('PATCH',  path, body, opts),
  delete: (path, opts)       => request('DELETE', path, null, opts),
}

/* ── Endpoints agrupados por domínio ── */

export const authAPI = {
  login:          (body) => api.post('/auth/login', body),
  cadastro:       (body) => api.post('/auth/cadastro', body),
  logout:         ()     => api.post('/auth/logout'),
  forgotPassword: (email)      => api.post('/auth/esqueci-senha', { email }),
  verifyCode:     (code)       => api.post('/auth/verificar-codigo', { code }),
  resetPassword:  (body)       => api.post('/auth/nova-senha', body),
}

export const perfisAPI = {
  listar:   (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return api.get(`/perfis${q ? '?' + q : ''}`)
  },
  buscar:       (id)              => api.get(`/perfis/${id}`),
  meuPerfil:    (usuarioId)       => api.get(`/perfis/usuario/${usuarioId}`),
  criar:        (usuarioId, body) => api.post(`/perfis?usuarioId=${usuarioId}`, body),
  atualizar:    (id, body)        => api.put(`/perfis/${id}`, body),
  deletar:  (id)          => api.delete(`/perfis/${id}`),
  avaliar:  (id, nota)    => api.post(`/perfis/${id}/avaliar`, { nota }),
  areas:    ()            => api.get('/areas'),
  adicionarImagem: (perfilId, imagem, ordem) => api.post(`/perfis/${perfilId}/imagens`, { imagem, ordem }),
  listarImagens:   (perfilId)                => api.get(`/perfis/${perfilId}/imagens`),  
}

export const agendaAPI = {
  listarSlots:       (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return api.get(`/agenda/slots${q ? '?' + q : ''}`)
  },

  // backend atual não tem endpoints /agenda/recorrentes

  criarRecorrente:   (body)        => api.post('/agenda/recorrentes', body),
  listarRecorrentes: ()            => api.get('/agenda/recorrentes'),
  deletarRecorrente: (id)          => api.delete(`/agenda/recorrentes/${id}`),

  // POST /api/agenda/agendar?slotId=1&studentId=2 
  agendar: (slotId, studentId) =>
  api.post(`/agenda/agendar?slotId=${slotId}&studentId=${studentId}`),

  // GET /api/agenda/meus?studentId=2
  meusAgendamentos:  (studentId)        => api.get(`/agenda/meus?studentId=${studentId}`),

  // PATCH /api/agenda/agendamentos/{id}/cancelar
  cancelar:          (bookingId)       => api.patch(`/agenda/agendamentos/${bookingId}/cancelar`),
}


export const chatAPI = {
  // GET /api/mensagens/inbox?userId=MEUID
  // retorna lista de conversas (somente profissionais)
  inbox: (userId) => api.get(`/mensagens/inbox?userId=${userId}`),



  // GET /api/mensagens/conversa/{outroId}?meId={meId}
  conversa: (outroId, meId) => api.get(`/mensagens/conversa/${outroId}?meId=${meId}`),

  // POST /api/mensagens/enviar  body: { remetenteId, destinatarioId, texto }
  enviar: (remetenteId, destinatarioId, texto) => api.post('/mensagens/enviar', { remetenteId, destinatarioId, texto }),
}

export const usuariosAPI = {
  perfil: (id) => api.get(`/usuarios/${id}`),
  atualizar: (id, body) => api.put(`/usuarios/${id}`, body),
}
