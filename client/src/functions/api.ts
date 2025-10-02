import axios from 'axios';
import type { Profile } from '../types/prisma.ts';
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

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
  console.log(password);
  return await api.post('/auth/login', { email, password });
}

export async function logoutUser(
  email: string,
  refreshToken: string,
) {
  console.log('logout');
  return await api.post('/auth/logout', {
    email,
    refreshToken,
  });
}

export async function refreshToken(
  email: string,
  refreshToken: string,
) {
  return await api.post('/auth/refresh-token', {
    email,
    refreshToken,
  });
}
export async function getUser(email: string) {
  return await api.get('/users?email=' + email);
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
