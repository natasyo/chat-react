import { SERVER_URL } from '../../config.ts';
import { io } from 'socket.io-client';
import type { AuthState } from '../store/AuthStore.ts';
import { refreshToken } from './api.ts';

export const connectSocket = (authStore: AuthState) => {
  if (!authStore || !authStore.user) return null;
  const socket = io(SERVER_URL, {
    withCredentials: true,
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
      authStore.user
    ) {
      const response = await refreshToken();

      socket.disconnect();
      connectSocket(response.data.accessToken);
    }
  });

  return socket;
};
