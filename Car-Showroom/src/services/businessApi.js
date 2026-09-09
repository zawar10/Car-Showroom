import api from './userApi';

const unwrap = (response) => response.data?.data ?? response.data;

export const getDashboardApi = () => api.get('/dashboard').then(unwrap);
export const getAuditLogsApi = () => api.get('/dashboard/audit').then(unwrap);
export const getVehiclesApi = (params = {}) => api.get('/vehicles', { params }).then(unwrap);
export const getVehicleApi = (id) => api.get(`/vehicles/${id}`).then(unwrap);
export const createVehicleApi = (payload) => api.post('/vehicles', payload).then(unwrap);
export const updateVehicleApi = (id, payload) => api.put(`/vehicles/${id}`, payload).then(unwrap);
export const deleteVehicleApi = (id) => api.delete(`/vehicles/${id}`).then(unwrap);
export const getUsersApi = () => api.get('/users/user').then(unwrap);
export const getApplicationsApi = (params = {}) => api.get('/applications', { params }).then(unwrap);
