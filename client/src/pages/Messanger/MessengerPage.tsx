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
import type { User } from '../../types/prisma.ts';
import { useUsers } from '../../store/UsersStore.ts';

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

  function getPrivateMessages() {
    if (socket && chatStore.activeRecipient) {
      socket.emit('get_private_message', {
        sender: authStore.user!.email,
        recipient: chatStore.activeRecipient.email,
      });
    }
  }

  function getCountNewMessages() {
    if (socket) {
      socket.emit('get_count_new_messages');
      console.log('get_count_new_messages');
    }
  }

  useEffect(() => {
    if (chatStore.activeRecipient) {
      getPrivateMessages();
    }
  }, [chatStore.activeRecipient, socket]);

  useEffect(() => {
    getCountNewMessages();
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    const sendIsOnline = () => {
      const users = chatStore.users.map(
        (user) => user.user,
      );
      socket.emit('is_online', {
        users: users,
        sender: authStore.user!.email,
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
      if (
        chatStore.activeRecipient &&
        authStore.user?.email
      ) {
        socket.emit('private_message', {
          senderEmail: authStore.user.email,
          recipientEmail: chatStore.activeRecipient.email,
          text: input.trim(),
        });
        console.log('private');
        return;
      }
      socket.emit('message', {
        text: input,
        email: authStore.user!.email,
      });
    }
  };
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
