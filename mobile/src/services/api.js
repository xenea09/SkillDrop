import axios from 'axios';

const API_URL = 'http://192.168.0.27:8080';

const api = axios.create({
    baseURL: API_URL,
});

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