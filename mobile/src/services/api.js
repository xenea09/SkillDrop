import axios from 'axios';
import { getToken, getRefreshToken, saveToken } from './storage';

const API_URL = 'http://192.168.0.27:8080';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            try {
                const refreshToken = await getRefreshToken();
                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
                await saveToken(response.data.token, response.data.refreshToken);
                error.config.headers['Authorization'] = `Bearer ${response.data.token}`;
                return api.request(error.config);
            } catch (e) {
                // Refresh fehlgeschlagen — ausloggen
            }
        }
        return Promise.reject(error);
    }
);

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (userName, email, password) => {
    const response = await api.post('/auth/register', { userName, email, password });
    return response.data;
};

export const getFeed = async (token) => {
    const response = await api.get('/api/drops/feed', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getCreators = async (token) => {
    const response = await api.get('/api/creators', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export default api;