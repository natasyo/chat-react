import axios, { type AxiosError } from 'axios';
import type { Profile } from '@chat/shared';
import { useAuthStore } from '../store/AuthStore.ts';
import { SERVER_URL } from '../../config.ts';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}
let isRefreshing = false;
let refreshSubscribes: (() => void)[] = [];
const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

const plainApi = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

function onRefreshed() {
  refreshSubscribes.forEach((cb) => cb());
  refreshSubscribes = [];
}

function addRefreshSubscribes(callback: () => void) {
  refreshSubscribes.push(callback);
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.log('interseptors', error.message);
    const originRequest = error.config;

    if (
      error.response?.status === 401 &&
      originRequest &&
      !originRequest?._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscribes(() =>
            resolve(api(originRequest)),
          );
        });
      }
      originRequest._retry = true;
      isRefreshing = true;
      try {
        await refreshToken();
        onRefreshed();
        isRefreshing = false;
        return api(originRequest);
      } catch (refreshError) {
        console.log('-------------error');
        isRefreshing = false;
        await logoutUser();
        return Promise.reject(refreshError);
      }
    }
    console.log('-************', originRequest?._retry);
    return Promise.reject(error);
  },
);

export async function registerUser(
  email: string,
  password: string,
  confirmPassword: string,
) {
  return await api.post('/auth/register', {
    email,
    password,
    confirmPassword,
  });
}

export async function loginUser(
  email: string,
  password: string,
) {
  return await api.post('/auth/login', { email, password });
}

export async function logoutUser() {
  const authStore = useAuthStore.getState();
  try {
    return await plainApi.post('/auth/logout');
  } finally {
    authStore.deleteUser();
  }
}

export async function refreshToken() {
  try {
    const result = await plainApi.post(
      '/auth/refresh-token',
    );
    return result;
  } catch (error) {
    console.error('refresh field');
    throw error;
  }
}
export async function getUser(email: string) {
  return await api.get('/users/by-email?email=' + email);
}

export async function getUsers() {
  return await api.get('/users');
}

export async function updateProfile(
  id: string,
  user: Profile,
  file?: File,
) {
  const formData = new FormData();
  if (file) {
    formData.append('photo', file);
  }
  formData.append('user', JSON.stringify(user));
  return await api.put(`/users/${id}`, formData);
}

export async function checkAuth() {
  return await api.get('/auth/me');
}
