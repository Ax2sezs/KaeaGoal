// src/utils/api.js
import axios from 'axios';

// Base API instance
const api = axios.create({
  baseURL: 'http://192.168.2.19/KaeaGoal-api/api/', // Change this to your base URL
  headers: {
    'Content-Type': 'application/json',
    withCredentials: true, // สำคัญ: ส่ง HttpOnly Cookie ไปด้วย

  },
});

// Add the token to each request's Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
