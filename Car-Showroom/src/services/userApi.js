import axios from 'axios'
import { generateId, getData, setData, STORAGE_KEYS } from './localStorageService'

const API_URL = import.meta.env.VITE_API_URL
const useDemoFallback = import.meta.env.VITE_USE_DEMO_FALLBACK !== 'false'
const userApi = axios.create({
  baseURL: API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

const demoUsers = () => getData(STORAGE_KEYS.users) || []
const fallback = (operation) => {
  if (!useDemoFallback) throw new Error('API unavailable')
  return operation()
}
const request = async (apiCall, demoOperation) => {
  if (!API_URL && useDemoFallback) return demoOperation()
  try {
    const response = await apiCall()
    return response.data?.data ?? response.data
  } catch (error) {
    if (error.response && error.response.status >= 400 && error.response.status < 500) throw error
    return fallback(demoOperation)
  }
}

export const getUsersApi = () => request(() => userApi.get('/users'), () => demoUsers())
export const createUserApi = (payload) => request(() => userApi.post('/users', payload), () => {
  const users = demoUsers()
  const user = { ...payload, id: generateId('USR'), createdAt: new Date().toISOString() }
  setData(STORAGE_KEYS.users, [user, ...users])
  return user
})
export const updateUserApi = (id, payload) => request(() => userApi.put(`/users/${id}`, payload), () => {
  const users = demoUsers()
  const user = { ...users.find(item => item.id === id), ...payload, id }
  setData(STORAGE_KEYS.users, users.map(item => item.id === id ? user : item))
  return user
})
export const deleteUserApi = (id) => request(() => userApi.delete(`/users/${id}`), () => {
  setData(STORAGE_KEYS.users, demoUsers().filter(item => item.id !== id))
  return { id }
})

export default userApi
