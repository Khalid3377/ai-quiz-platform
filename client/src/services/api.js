import axios from 'axios';

const API = axios.create({ baseURL: 'https://ai-quiz-backend-dbhw.onrender.com/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register        = (data) => API.post('/auth/register', data);
export const login           = (data) => API.post('/auth/login', data);

// Quizzes
export const getQuizzes      = ()     => API.get('/quizzes');
export const getQuiz         = (id)   => API.get(`/quizzes/${id}`);
export const generateQuiz    = (data) => API.post('/quizzes/generate', data);

// Results
export const submitResult    = (data) => API.post('/results/submit', data);
export const getLeaderboard  = ()     => API.get('/results/leaderboard');
export const getHistory      = ()     => API.get('/results/history');

// Profile
export const getProfile      = ()     => API.get('/profile');

// PDF
export const generateFromPDF = (formData) =>
  API.post('/pdf/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

// Admin
export const getAdminStats   = ()     => API.get('/admin/stats');
export const getAdminUsers   = ()     => API.get('/admin/users');
export const getAdminQuizzes = ()     => API.get('/admin/quizzes');
export const deleteUser      = (id)   => API.delete(`/admin/users/${id}`);
export const deleteQuiz      = (id)   => API.delete(`/admin/quizzes/${id}`);
export const makeAdmin       = (id)   => API.put(`/admin/users/${id}/make-admin`);
export const joinQuizByTestId    = (testId) => API.get(`/quizzes/join/${testId}`);
export const getTestResults      = (testId) => API.get(`/results/test/${testId}`);