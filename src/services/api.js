import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {BASE_API_URI} from '../constant/API';

export const TOKEN_KEY = 'usertoken';

export const api = axios.create({
  baseURL: BASE_API_URI,
  timeout: 20000,
  headers: {Accept: 'application/json'},
});

api.interceptors.request.use(async config => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    const serverMessage =
      error?.response?.data?.error || error?.response?.data?.message;

    if (serverMessage) {
      error.message = serverMessage;
    } else if (error?.code === 'ECONNABORTED') {
      error.message = 'The request timed out. Please try again.';
    } else if (!error?.response) {
      error.message =
        'Unable to reach the server. Check your connection and try again.';
    }

    error.status = error?.response?.status;

    return Promise.reject(error);
  },
);

export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);

export const setToken = token => AsyncStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => AsyncStorage.removeItem(TOKEN_KEY);

export default api;
