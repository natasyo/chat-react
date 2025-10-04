import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../../store/AuthStore.ts';
import Layout from './Layout.tsx';
import { MessageItems } from '../../components/messenger/MessageItems.tsx';
import { InputText } from '../../components/messenger/InputText.tsx';
import { refreshToken } from '../../functions/api.ts';

const MessengerPage = () => {
  const [messages, setMessages] = useState<
    { email: string; text: string }[]
  >([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const authStore = useAuthStore();

  const connectSocket = useCallback(
    (token: string | null) => {
      if (!token) return null;
      const newSocket = io('http://localhost:3000', {
        auth: { token },
        transports: ['websocket'],
      });
      newSocket.on('connect', () => {
        console.log('Connected to server', newSocket.id);
      });
      newSocket.on('disconnect', () => {
        console.log(
          'Disconnected from server',
          newSocket.id,
        );
      });
      newSocket.on(
        'message',
        (msg: { email: string; text: string }) => {
          setMessages((prev) => [...prev, msg]);
        },
      );
      newSocket.on('exception', async (err) => {
        console.log(err);
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
          newSocket.disconnect();
          connectSocket(response.data.accessToken);
        }
      });
      setSocket(newSocket);
      return newSocket;
    },
    [authStore],
  );

  useEffect(() => {
    connectSocket(authStore.jwt);
    const newSocket = io('http://localhost:3000', {
      auth: {
        token: authStore.jwt,
      },
      transports: ['websocket'],
    });
    setSocket(newSocket);
    newSocket.on('exception', async (err) => {
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
        newSocket.disconnect();
      }
    });
    newSocket.on(
      'message',
      (msg: { email: string; text: string }) => {
        setMessages((pev) => [...pev, msg]);
      },
    );
    return () => {
      newSocket.disconnect();
    };
  }, []);
  const sendMessage = (input: string) => {
    if (socket && input.trim()) {
      socket.emit('message', {
        text: input,
        email: authStore.email,
      });
    }
  };
  return (
    <Layout>
      <div
        className={`mx-auto h-full flex flex-col justify-end`}
      >
        <MessageItems messages={messages} />
        <InputText sendMessage={sendMessage} />
      </div>
    </Layout>
  );
};

export default MessengerPage;
