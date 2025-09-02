import axios from 'axios';
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
  await api.post('/auth/login', { email, password });
}
