import api from './userApi';

const unwrap = (response) => response.data?.data ?? response.data;

export const getVehiclesApi = (available = false) => api.get(`/vehicles${available ? '?available=true' : ''}`).then(unwrap);
export const getApplicationsApi = (params = {}) => api.get('/applications', { params }).then(unwrap);
export const getApplicationApi = (id) => api.get(`/applications/${id}`).then(unwrap);
export const createApplicationApi = (payload) => api.post('/applications', payload).then(unwrap);
export const updateApplicationStatusApi = (id, payload) => api.patch(`/applications/${id}/status`, payload).then(unwrap);
export const assignManagerApi = (id, managerId) => api.patch(`/applications/${id}/assign-manager`, { managerId }).then(unwrap);
export const verifyCustomerApi = (id, verificationStatus) => api.patch(`/applications/${id}/verify-customer`, { verificationStatus }).then(unwrap);
export const selectVehicleApi = (id, vehicleId) => api.patch(`/applications/${id}/vehicle`, { vehicleId }).then(unwrap);
export const createFinanceApi = (id, payload) => api.post(`/applications/${id}/finance`, payload).then(unwrap);
export const recordPaymentApi = (applicationId, payload) => api.post(`/applications/${applicationId}/payments`, { applicationId, ...payload }).then(unwrap);
export const getManagersApi = () => api.get('/applications/managers').then(unwrap);
