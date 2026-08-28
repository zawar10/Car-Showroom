import { useState } from 'react'
import { getData, setData, STORAGE_KEYS, seedInitialData } from '../services/localStorageService'
import { AuthContext } from './context'

seedInitialData()

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getData(STORAGE_KEYS.session))
  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedPassword = password.trim()
    const user = getData(STORAGE_KEYS.users)?.find((candidate) => candidate.email?.toLowerCase() === normalizedEmail && candidate.password === normalizedPassword)
    if (!user) return { ok: false, message: 'Those credentials do not match a seeded AUTOVISTA account.' }
    const active = { ...user, password: undefined }
    setData(STORAGE_KEYS.session, active)
    setSession(active)
    return { ok: true, user: active }
  }
  const logout = () => { localStorage.removeItem(STORAGE_KEYS.session); setSession(null) }
  return <AuthContext.Provider value={{ session, login, logout, isAuthenticated: Boolean(session) }}>{children}</AuthContext.Provider>
}
