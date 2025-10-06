import type { AuthState } from '../store/AuthStore.ts';
import { useEffect, useState } from 'react';
import { connectSocket } from '../functions/socket.ts';
import type { Socket } from 'socket.io-client';
import type { DefaultEventsMap } from 'socket.io';

export function useSocket(authStore: AuthState) {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);
  const [messages, setMessages] = useState<
    { email: string; text: string }[]
  >([]);
  useEffect(() => {
    if (!authStore) return;
    const newSocket = connectSocket(authStore);
    setSocket(newSocket);

    newSocket?.on(
      'message',
      (data: { email: string; text: string }) => {
        setMessages((prev) => [...prev, data]);
      },
    );

    return () => {
      newSocket?.disconnect();
    };
  }, [authStore]);
  return { socket, messages };
}
