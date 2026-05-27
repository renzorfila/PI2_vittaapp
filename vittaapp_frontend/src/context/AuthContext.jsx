import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('vitta_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = async (email, senha) => {
    const data = await api.post('/auth/login', { email, senha })
    setUser(data.user)
    localStorage.setItem('vitta_user', JSON.stringify(data.user))
    localStorage.setItem('vitta_token', data.token)
    return data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('vitta_user')
    localStorage.removeItem('vitta_token')
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('vitta_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
