import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../../store/AuthStore.ts';
import Layout from './Layout.tsx';
import { MessageItems } from '../../components/messenger/MessageItems.tsx';
import { InputText } from '../../components/messenger/InputText.tsx';

const MessengerPage = () => {
  const [messages, setMessages] = useState<
    { email: string; text: string }[]
  >([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const authStore = useAuthStore();
  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      auth: {
        token: authStore.jwt,
      },
    });
    setSocket(newSocket);
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
