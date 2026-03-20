import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

export const getUserPreferences = (email) => API.post('/users/preferences', { email });

export const updateUserPreferences = (email, preferences) => API.put('/users/preferences', { email, preferences });

export const updateUserPassword = (email, currentPassword, newPassword) => API.put('/users/password', { email, currentPassword, newPassword });
