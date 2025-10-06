import {
  type AuthState,
  useAuthStore,
} from '../../store/AuthStore.ts';
import Layout from './Layout.tsx';
import { MessageItems } from '../../components/messenger/MessageItems.tsx';
import { InputText } from '../../components/messenger/InputText.tsx';
import { useSocket } from '../../hooks/useSocket.ts';

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
