import type { AuthState } from '../store/AuthStore.ts';
import { useEffect, useState } from 'react';
import { connectSocket } from '../functions/socket.ts';
import type { Message } from '../types/prisma.ts';
import { useChatStore } from '../store/ChatsStore.ts';
import { useUsers } from '../store/UsersStore.ts';
import { useSocketStore } from '../store/SocketStore.ts';

export function useSocket(authStore: AuthState) {
  const chats = useChatStore();
  const socketStore = useSocketStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [privateMessages, setPrivateMessages] = useState<
    Message[]
  >([]);
  const usersState = useUsers();
  useEffect(() => {
    if (!authStore) return;
    const newSocket = connectSocket(authStore);
    socketStore.setSocket(newSocket);

    newSocket?.on('message', (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });
    newSocket?.on('set_status_read', (data: Message) => {
      // newSocket?.emit('get_private_message', data);
      // const msg=messages.find(item=>item.email===data.)
      setPrivateMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.id
            ? { ...msg, state: data.state }
            : msg,
        ),
      );
    });
    newSocket?.on('private_message', (data: Message) => {
      if (data) {
        setPrivateMessages((prev) => [...prev, data]);
      }
    });

    newSocket?.on(
      'get_new_private_message',
      (data: Message) => {
        if (data)
          setPrivateMessages((prev) => [...prev, data]);
        console.log('message');
      },
    );
    newSocket?.on('get_private_message', (data) => {
      setPrivateMessages(data ?? '');
    });
    newSocket?.on(
      'get_count_new_messages',
      (data: { senderEmail: string; count: number }[]) => {
        usersState.setCountNewMessages(data);
      },
    );
    newSocket?.on('is_online', (data) => {
      chats.changeOnline(data);
    });

    return () => {
      newSocket?.disconnect();
    };
  }, [authStore]);
  return {
    socket: socketStore.socket,
    messages,
    privateMessages,
  };
}
