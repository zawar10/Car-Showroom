import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const userApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('autovista_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUsersApi = () => userApi.get('/users/user').then(response => response.data?.data ?? response.data);
export const createUserApi = payload => userApi.post('/users/user', payload).then(response => response.data?.data ?? response.data);
export const updateUserApi = (id, payload) => userApi.put('/users/user', { id, ...payload }).then(response => response.data?.data ?? response.data);
export const deleteUserApi = id => userApi.delete(`/users/user/${id}`).then(response => response.data?.data ?? response.data);

export default userApi;
