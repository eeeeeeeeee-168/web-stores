import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 - redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ========== Auth ==========
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   ()     => api.post('/auth/logout'),
  me:       ()     => api.get('/auth/me'),
};

// ========== Products ==========
export const productAPI = {
  getAll:    (params) => api.get('/products', { params }),
  getFeatured: ()     => api.get('/products/featured'),
  getOne:    (id)     => api.get(`/products/${id}`),
  create:    (data)   => api.post('/admin/products', data),
  update:    (id, data) => api.put(`/admin/products/${id}`, data),
  delete:    (id)     => api.delete(`/admin/products/${id}`),
};

// ========== Categories ==========
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data)    => api.post('/admin/categories', data),
  update: (id, data)=> api.put(`/admin/categories/${id}`, data),
  delete: (id)      => api.delete(`/admin/categories/${id}`),
};

// ========== Orders ==========
export const orderAPI = {
  getAll:       ()       => api.get('/orders'),
  getOne:       (id)     => api.get(`/orders/${id}`),
  create:       (data)   => api.post('/orders', data),
  cancel:       (id)     => api.post(`/orders/${id}/cancel`),
  adminGetAll:  (params) => api.get('/admin/orders', { params }),
  updateStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
};

export default api;
