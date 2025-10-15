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
    useState<User>();

  function getPrivateMessages() {
    console.log(
      authStore.email,
      ' ',
      activeRecipient?.email,
    );
    if (socket && activeRecipient) {
      socket.emit('get_private_message', {
        userA: authStore.email,
        userB: activeRecipient.email,
      });
    }
  }

  useEffect(() => {
    getPrivateMessages();
  }, [activeRecipient]);

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
  const chatStore = useChatStore();
  useEffect(() => {
    console.log(chatStore.users);
    setActiveRecipient(chatStore.users[0]);
  }, [chatStore.users]);
  return (
    <Layout>
      <>
        {chatStore.users.length > 0 && (
          <Tabs
            onRemoveTab={(value) => {
              const user = chatStore.users.find(
                (user) => user.email === value,
              );
              if (user) chatStore.removeUser(user);
              console.log(user);
            }}
            onSetActiveTab={(value) => {
              const user = chatStore.users.find(
                (user) => user.email === value,
              );
              if (user) setActiveRecipient(user);
            }}
          >
            {chatStore.users.map((user) => (
              <Tab
                key={user.id}
                value={user.email}
                label={user.email}
              >
                {/*<div className="flex flex-col h-full max-h-full ">*/}
                <MessageItems
                  messages={privateMessages.map((msg) => ({
                    text: msg.text,
                    email: msg.senderEmail,
                  }))}
                  className={`flex-1 overflow-y-auto px-2 min-h-0`}
                />
                <InputText sendMessage={sendMessage} />
                {/*</div>*/}
              </Tab>
            ))}
          </Tabs>
        )}
      </>
    </Layout>
  );
};

export default MessengerPage;
