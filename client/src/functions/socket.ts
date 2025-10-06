import { SERVER_URL } from '../../config.ts';
import { io } from 'socket.io-client';
import type { AuthState } from '../store/AuthStore.ts';
import { refreshToken } from './api.ts';

export const connectSocket = (authStore: AuthState) => {
  if (!authStore || !authStore.jwt) return null;
  const socket = io(SERVER_URL, {
    auth: {
      token: authStore.jwt,
    },
    transports: ['websocket'],
  });
  socket.on('connect', () => {
    console.log('Connected to server ', socket.id);
  });
  socket.on('disconnect', () => {
    console.log('Disconnected from server ', socket.id);
  });

  socket.on('exception', async (err) => {
    console.error(err);
    if (
      err.message === 'Access token expired' &&
      authStore.email &&
      authStore.refreshToken
    ) {
      const response = await refreshToken(
        authStore.email,
        authStore.refreshToken,
      );
      authStore.updateToken(
        response.data.accessToken,
        response.data.refreshToken,
      );
      socket.disconnect();
      connectSocket(response.data.accessToken);
    }
  });

  return socket;
};
