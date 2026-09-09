import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login as loginRequest } from '../features/auth/authSlice'
import { getData, setData, STORAGE_KEYS } from '../services/localStorageService'
import { AuthContext } from './context'

const portalRole = (role) => role === 'SUPER_ADMIN' || role === 'SUPER ADMIN' ? 'Admin' : role === 'MANAGER' ? 'Sales Manager' : role

export function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const [session, setSession] = useState(() => {
    const stored = getData(STORAGE_KEYS.session)
    return stored ? { ...stored, role: portalRole(stored.role) } : null
  })
  const login = async (email, password) => {
    try {
      const result = await dispatch(loginRequest({ email: email.trim(), password })).unwrap()
      const active = { ...result.user, role: portalRole(result.user.role), password: undefined }
      setData(STORAGE_KEYS.session, active)
      setSession(active)
      return { ok: true, user: active }
    } catch (error) {
      return { ok: false, message: error || 'Unable to sign in. Please try again.' }
    }
  }
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.session)
    localStorage.removeItem('autovista_token')
    setSession(null)
  }
  return <AuthContext.Provider value={{ session, login, logout, isAuthenticated: Boolean(session) }}>{children}</AuthContext.Provider>
}
