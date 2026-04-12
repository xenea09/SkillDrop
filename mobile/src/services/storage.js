import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token, refreshToken) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);
};

export const getToken = async () => {
    return await AsyncStorage.getItem('token');
};

export const getRefreshToken = async () => {
    return await AsyncStorage.getItem('refreshToken');
};

export const saveProfile = async (email, profile) => {
    await AsyncStorage.setItem(`profile_${email}`, JSON.stringify(profile));
};

export const getProfile = async (email) => {
    const profile = await AsyncStorage.getItem(`profile_${email}`);
    return profile ? JSON.parse(profile) : null;
};

export const clearAuth = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
};

export const clearStorage = async () => {
    await AsyncStorage.clear();
};