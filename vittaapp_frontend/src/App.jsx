import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import PerfilDetalhe from './pages/PerfilDetalhe'
import PerfilProfissionalForm from './pages/PerfilProfissionalForm'
import Agenda from './pages/Agenda'
import Inbox from './pages/Inbox'
import Conversation from './pages/Conversation'
import RedefinirSenha from './pages/RedefinirSenha'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueci-senha" element={<RedefinirSenha />} />
            <Route path="/profissionais/:id" element={<PerfilDetalhe />} />

            {/* Protected */}
            <Route path="/perfil/editar" element={
              <ProtectedRoute><PerfilProfissionalForm /></ProtectedRoute>
            } />
            <Route path="/agenda" element={
              <ProtectedRoute><Agenda /></ProtectedRoute>
            } />
            <Route path="/profissionais/:id/agenda" element={
              <ProtectedRoute><Agenda /></ProtectedRoute>
            } />
            <Route path="/mensagens" element={
              <ProtectedRoute><Inbox /></ProtectedRoute>
            } />
            <Route path="/mensagens/:userId" element={
              <ProtectedRoute><Conversation /></ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={
              <div className="center-page" style={{ flexDirection: 'column', gap: 12, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 64, color: 'var(--border)' }}>404</div>
                <h2>Página não encontrada</h2>
                <a href="/" className="btn btn-primary" style={{ marginTop: 8 }}>Voltar ao início</a>
              </div>
            } />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
