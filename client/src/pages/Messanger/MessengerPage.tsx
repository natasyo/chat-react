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

const MessengerPage = () => {
  const authStore: AuthState = useAuthStore();

  const { socket, messages } = useSocket(authStore);

  const sendMessage = (input: string) => {
    if (socket && input.trim()) {
      socket.emit('message', {
        text: input,
        email: authStore.email,
      });
    }
  };
  const chatStore = useChatStore();
  useEffect(() => {
    console.log(chatStore.users);
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
          >
            {chatStore.users.map((user) => (
              <Tab
                key={user.id}
                value={user.email}
                label={user.email}
              >
                <div className="flex flex-col h-full max-h-full ">
                  <MessageItems
                    messages={messages}
                    className={`flex-1 overflow-y-auto px-2`}
                  />
                  <h1>{user.email}</h1>
                  <InputText sendMessage={sendMessage} />
                </div>
              </Tab>
            ))}
          </Tabs>
        )}
      </>
    </Layout>
  );
};

export default MessengerPage;
