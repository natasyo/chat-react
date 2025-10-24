import {
  type AuthState,
  useAuthStore,
} from '../../store/AuthStore.ts';
import Layout from './Layout.tsx';
import { MessageItems } from '../../components/messenger/MessageItems.tsx';
import { InputText } from '../../components/messenger/InputText.tsx';
import { useSocket } from '../../hooks/useSocket.ts';
import { Tabs } from '../../ui/tabs/Tabs.tsx';
import { Tab } from '../../ui/tabs/Tab.tsx';
import { useChatStore } from '../../store/ChatsStore.ts';
import { useEffect, useState } from 'react';
import type { User } from '../../types/prisma.ts';

const MessengerPage = () => {
  const authStore: AuthState = useAuthStore();

  const { socket, privateMessages } = useSocket(authStore);
  const [activeRecipient, setActiveRecipient] =
    useState<User | null>(null);
  const chatStore = useChatStore();
  function getPrivateMessages() {
    console.log(
      authStore.email,
      ' ',
      activeRecipient?.email,
    );
    if (socket && activeRecipient) {
      socket.emit('get_private_message', {
        sender: authStore.email,
        recipient: activeRecipient.email,
      });
    }
  }

  useEffect(() => {
    getPrivateMessages();
  }, [activeRecipient]);

  useEffect(() => {
    if (!socket) return;
    const sendIsOnline = () => {
      const users = chatStore.users.map(
        (user) => user.user,
      );
      console.log('is online');
      socket.emit('is_online', {
        users: users,
        sender: authStore.email,
      });
    };
    sendIsOnline();
    const interval = setInterval(sendIsOnline, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [socket]);

  const sendMessage = (input: string) => {
    if (socket && input.trim()) {
      if (activeRecipient) {
        socket.emit('private_message', {
          senderEmail: authStore.email,
          recipientEmail: activeRecipient.email,
          text: input.trim(),
        });
        console.log('private');
        return;
      }
      socket.emit('message', {
        text: input,
        email: authStore.email,
      });
    }
  };

  useEffect(() => {
    if (chatStore.users.length > 0)
      setActiveRecipient(chatStore.users[0].user);
  }, [chatStore.users]);
  return (
    <Layout>
      <>
        {chatStore.users.length > 0 && (
          <Tabs
            onRemoveTab={(value) => {
              const user = chatStore.users.find(
                (user) => user.user.email === value,
              );
              if (user) chatStore.removeUser(user.user);
            }}
            onSetActiveTab={(value) => {
              const user = chatStore.users.find(
                (user) => user.user.email === value,
              );
              if (user) setActiveRecipient(user.user);
            }}
          >
            {chatStore.users.map((user) => {
              return (
                <Tab
                  key={user.user.id}
                  value={user.user.email}
                  label={user.user.email}
                  isOnline={user.isOnline}
                >
                  <MessageItems
                    messages={privateMessages.map(
                      (msg) => ({
                        text: msg.text,
                        email: msg.senderEmail,
                      }),
                    )}
                    className={`flex-1 overflow-y-auto px-2 min-h-0`}
                  />
                  <InputText sendMessage={sendMessage} />
                </Tab>
              );
            })}
          </Tabs>
        )}
      </>
    </Layout>
  );
};

export default MessengerPage;
