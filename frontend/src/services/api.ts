import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      const token = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['X-User-ID'] = currentUser.uid;
    } catch (e) {
      config.headers['X-User-ID'] = currentUser.uid;
    }
  } else {
    // Session fallback for authenticated client session
    const storedUser = localStorage.getItem('user_id');
    if (storedUser) {
      config.headers['X-User-ID'] = storedUser;
    }
  }
  return config;
});

export default api;
