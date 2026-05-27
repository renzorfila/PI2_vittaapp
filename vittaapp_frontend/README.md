# Vitta App — React + Vite

Plataforma para contratação de profissionais de treino, com agendamento de sessões.

## 🚀 Instalação e execução

```bash
npm install
npm run dev        # http://localhost:5173
```

### Variável de ambiente (opcional)
Crie um `.env.local` para apontar para outro servidor:
```
VITE_API_URL=http://localhost:8080/api
```

---

## 📁 Estrutura

```
src/
├── context/AuthContext.jsx   # Estado de autenticação global
├── services/api.js           # Todas as chamadas HTTP (configurar base URL)
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   └── Toast.jsx
└── pages/
    ├── Home.jsx              # Lista de profissionais com busca e filtros
    ├── Login.jsx
    ├── Cadastro.jsx
    ├── PerfilDetalhe.jsx     # Detalhes do profissional + avaliação
    ├── PerfilProfissionalForm.jsx  # Criar/editar perfil profissional
    ├── Agenda.jsx            # Horários disponíveis + meus agendamentos
    ├── Inbox.jsx             # Lista de conversas
    ├── Conversation.jsx      # Chat com auto-refresh a cada 2s
    └── RedefinirSenha.jsx    # Fluxo 3 etapas: email → código → nova senha
```

---

## 🔌 API Contract (Spring Boot + MySQL)

Configure o backend para expor esses endpoints:

### Autenticação
| Método | URL | Body | Resposta |
|--------|-----|------|----------|
| POST | `/api/auth/cadastro` | `{ nome, email, senha }` | `201` |
| POST | `/api/auth/login` | `{ email, senha }` | `{ token, user }` |
| POST | `/api/auth/logout` | — | `204` |
| POST | `/api/auth/esqueci-senha` | `{ email }` | `200` |
| POST | `/api/auth/verificar-codigo` | `{ code }` | `200` |
| POST | `/api/auth/nova-senha` | `{ email, code, novaSenha }` | `200` |

### Usuário autenticado
Todos os requests abaixo precisam do header: `Authorization: Bearer {token}`

### Perfis Profissionais
| Método | URL | Notas |
|--------|-----|-------|
| GET | `/api/perfis?q=&area=&page=` | Lista paginada |
| GET | `/api/perfis/{id}` | Detalhe |
| POST | `/api/perfis` | Criar perfil |
| PUT | `/api/perfis/{id}` | Editar perfil |
| DELETE | `/api/perfis/{id}` | Deletar |
| POST | `/api/perfis/{id}/avaliar` | Body: `{ nota: 1-5 }` |
| GET | `/api/areas` | Lista de áreas de atuação |

**Resposta de `/api/perfis`:**
```json
{
  "content": [ { "id": 1, "usuario": { "name": "..." }, "titulo": "...", ... } ],
  "totalPages": 3
}
```

### Agenda
| Método | URL | Notas |
|--------|-----|-------|
| GET | `/api/agenda/slots?tutor=&start=&end=` | Slots disponíveis |
| POST | `/api/agenda/recorrentes` | Criar série recorrente |
| GET | `/api/agenda/recorrentes` | Minhas séries |
| DELETE | `/api/agenda/recorrentes/{id}` | Deletar série |
| POST | `/api/agenda/agendar` | Body: `{ slotId }` |
| GET | `/api/agenda/meus` | Meus agendamentos |
| PATCH | `/api/agenda/agendamentos/{id}/cancelar` | Cancelar agendamento |

### Chat
| Método | URL | Notas |
|--------|-----|-------|
| GET | `/api/mensagens/inbox` | Lista de conversas |
| GET | `/api/mensagens/conversa/{userId}` | Mensagens com usuário |
| POST | `/api/mensagens/enviar` | Body: `{ destinatarioId, texto }` |

---

## 📊 MySQL — Schema sugerido

```sql
-- Usuários
CREATE TABLE usuarios (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100),
  email VARCHAR(150) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  tem_perfil_profissional BOOLEAN DEFAULT FALSE,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Perfis profissionais
CREATE TABLE perfis_profissionais (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT REFERENCES usuarios(id),
  titulo VARCHAR(120),
  descricao TEXT,
  cidade VARCHAR(100),
  area VARCHAR(100),
  valor_por_sessao DECIMAL(8,2),
  forma_atendimento VARCHAR(50),
  experiencia VARCHAR(50),
  avaliacao_media DECIMAL(3,2) DEFAULT 0.00,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Slots recorrentes (modelo do Django mantido)
CREATE TABLE recurring_slots (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tutor_id BIGINT REFERENCES usuarios(id),
  title VARCHAR(150),
  weekday TINYINT,           -- 0=Segunda...6=Domingo
  start_time TIME,
  end_time TIME,
  start_date DATE,
  end_date DATE,
  capacity INT DEFAULT 1,
  active BOOLEAN DEFAULT TRUE,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Slots materializados
CREATE TABLE availability_slots (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tutor_id BIGINT REFERENCES usuarios(id),
  recurring_id BIGINT REFERENCES recurring_slots(id),
  start DATETIME,
  end DATETIME,
  capacity INT DEFAULT 1,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agendamentos
CREATE TABLE bookings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT REFERENCES usuarios(id),
  slot_id BIGINT REFERENCES availability_slots(id),
  status ENUM('pending','confirmed','cancelled') DEFAULT 'confirmed',
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Mensagens
CREATE TABLE mensagens (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sender_id BIGINT REFERENCES usuarios(id),
  recipient_id BIGINT REFERENCES usuarios(id),
  texto TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Avaliações
CREATE TABLE avaliacoes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT REFERENCES usuarios(id),
  perfil_id BIGINT REFERENCES perfis_profissionais(id),
  nota TINYINT,
  comentario TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_avaliacao (usuario_id, perfil_id)
);
```

---

## ⚠️ Dados mock

Enquanto o backend não está pronto, cada página usa dados estáticos locais.
Procure pelos comentários `/* Mock - remove when backend ready */` e substitua pelas chamadas da `api.js`.
