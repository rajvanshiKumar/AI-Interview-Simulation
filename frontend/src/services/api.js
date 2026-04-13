import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const healthCheck = () => api.get('/health/');
export const login = (data) => api.post('/auth/login/', data);
export const register = (data) => api.post('/auth/register/', data);
export const createSession = (data) => api.post('/session/create/', data);
export const submitAnswer = (sessionId, data) => api.post(`/session/${sessionId}/submit/`, data);
export const getResults = (sessionId) => api.get(`/session/${sessionId}/results/`);
export const getDashboardData = () => api.get('/dashboard/');

export default api;
