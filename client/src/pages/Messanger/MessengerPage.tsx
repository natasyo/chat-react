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
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { getUsers } from '../../functions/api.ts';
import type { User } from '@chat/shared';
import { useUsers } from '../../store/UsersStore.ts';
import {
  getCountNewMessages,
  getPrivateMessages,
  sendIsOnline,
  sendMessage,
} from '../../functions/messages/cruidMessages.ts';

const MessengerPage = () => {
  useAuth();
  const usersStore = useUsers();
  const authStore: AuthState = useAuthStore();
  const { socket, privateMessages } = useSocket(authStore);
  const chatStore = useChatStore();
  useEffect(() => {
    (async () => {
      const usersData = await getUsers();
      usersStore.addUsers(usersData.data as User[]);
    })();
  }, []);

  useEffect(() => {
    if (chatStore.activeRecipient && authStore.user) {
      getPrivateMessages(
        {
          sender: authStore.user.email,
          recipient: chatStore.activeRecipient.email,
          take: 20,
        },
        socket,
      );
    }
  }, [chatStore.activeRecipient, socket]);

  useEffect(() => {
    getCountNewMessages(socket);
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    sendIsOnline(chatStore, authStore, socket);
    const interval = setInterval(() => {
      sendIsOnline(chatStore, authStore, socket);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [socket]);

  return (
    <Layout>
      <>
        {chatStore.users.length > 0 && (
          <Tabs
            onRemoveTab={(email) => {
              const user = chatStore.users.find(
                (user) => user.user.email === email,
              );
              if (user) chatStore.removeUser(user.user);
            }}
            onSetActiveTab={(email) => {
              const user = chatStore.users.find(
                (user) => user.user.email === email,
              );
              if (user) {
                chatStore.changeActiveRecipient(user.user);
              }
            }}
            activeTab={chatStore.activeRecipient?.email}
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
                    messages={privateMessages}
                    className={`flex-1 overflow-y-auto px-2 min-h-0`}
                  />
                  <InputText
                    sendMessage={(input) => {
                      sendMessage(
                        input,
                        chatStore,
                        authStore,
                        socket,
                      );
                    }}
                  />
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
