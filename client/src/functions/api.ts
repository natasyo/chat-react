import axios from 'axios';
import { UserModelSchema } from '../../../shared/generated/zod/schemas';
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
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
  return await api.post('/auth/login', { email, password });
}

export async function logoutUser(
  email: string,
  refreshToken: string,
) {
  return await api.post('/auth/logout', {
    email,
    refreshToken,
  });
}

export async function refreshToken(
  email: string,
  refreshToken: string,
) {
  console.log(refreshToken, email);
  return await api.post('/auth/refresh-token', {
    email,
    refreshToken,
  });
}

export async function getUser(email: string) {
  const data = await api.get(`/users?email=${email}`);
  return UserModelSchema.parse(data);
}
