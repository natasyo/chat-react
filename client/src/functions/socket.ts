import { SERVER_URL } from '../../config.ts';
import { io, type Socket } from 'socket.io-client';
import {
  type AuthState,
  useAuthStore,
} from '../store/AuthStore.ts';
import { refreshToken } from './api.ts';

let socket: Socket | null = null;
let isReconnecting = false;

export const connectSocket = (authStore: AuthState) => {
  // const authStore = useAuthStore.getState();
  if (!authStore || !authStore.user) return null;
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  const newSocket = io(SERVER_URL, {
    withCredentials: true,
    transports: ['websocket'],
  });
  newSocket.on('connect', () => {
    console.log('Connected to server ', newSocket.id);
  });
  newSocket.on('disconnect', () => {
    isReconnecting = false;
    console.log('Disconnected from server ', newSocket.id);
  });

  newSocket.on('exception', async (err) => {
    console.error(err);
    if (
      err.message === 'Access token expired' &&
      authStore.user &&
      !isReconnecting
    ) {
      try {
        isReconnecting = false;
        await refreshToken();
        await new Promise((r) => setTimeout(r, 100));
        connectSocket(authStore);
      } catch {
        console.log('Refresh token failed. Logging out.');
        useAuthStore.getState().deleteUser();
      }
    }
  });
  socket = newSocket;
  return socket;
};
