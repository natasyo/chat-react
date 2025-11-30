import type { AuthState } from '../store/AuthStore.ts';
import { useEffect, useState } from 'react';
import { connectSocket } from '../functions/socket.ts';
import type { Socket } from 'socket.io-client';
import type { DefaultEventsMap } from 'socket.io';
import type { Message } from '../types/prisma.ts';
import { useChatStore } from '../store/ChatsStore.ts';
import { useUsers } from '../store/UsersStore.ts';

export function useSocket(authStore: AuthState) {
  const chats = useChatStore();
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);
  const [messages, setMessages] = useState<
    { email: string; text: string }[]
  >([]);
  const [privateMessages, setPrivateMessages] = useState<
    Message[]
  >([]);
  const usersState = useUsers();
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
    newSocket?.on('private_message', (data: Message) => {
      if (data) {
        setPrivateMessages((prev) => [...prev, data]);
      }
    });
    newSocket?.on('get_private_message', (data) => {
      setPrivateMessages(data ?? '');
    });

    // newSocket?.on(
    //   'set_message_status',
    //   (data: { status: MessageState; id: string }) => {},
    // );

    newSocket?.on('get_count_new_messages', (data) => {
      usersState.setCountNewMessages(data);
    });
    newSocket?.on('is_online', (data) => {
      chats.changeOnline(data);
    });

    return () => {
      newSocket?.disconnect();
    };
  }, [authStore]);
  return { socket, messages, privateMessages };
}
