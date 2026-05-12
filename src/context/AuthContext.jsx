import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await api.get('/users/current-user')
      setUser(res.data.data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (data) => {
    const res = await api.post('/users/login', data)
    setUser(res.data.data.user)
    return res.data
  }

  const logout = async () => {
    await api.post('/users/logout')
    setUser(null)
  }

  const register = async (formData) => {
    const res = await api.post('/users/register', formData)
    return res.data
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
