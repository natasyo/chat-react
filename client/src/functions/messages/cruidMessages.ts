import type { Socket } from 'socket.io-client';
import type { ChatState } from '../../store/ChatsStore.ts';
import type { AuthState } from '../../store/AuthStore.ts';
import type { IGetMessagesDto } from '@chat/shared';

export function getPrivateMessages(
  messagesData: IGetMessagesDto,
  socket: Socket | undefined,
) {
  if (socket && messagesData.sender) {
    socket.emit('get_private_message', {
      ...messagesData,
    });
  }
}

export function getCountNewMessages(socket?: Socket) {
  if (socket) {
    socket.emit('get_count_new_messages');
    console.log('get_count_new_messages');
  }
}

export const sendMessage = (
  input: string,
  chatStore: ChatState,
  authStore: AuthState,
  socket?: Socket,
) => {
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

export const sendIsOnline = (
  chatStore: ChatState,
  authStore: AuthState,
  socket: Socket,
) => {
  const users = chatStore.users.map((user) => user.user);
  socket.emit('is_online', {
    users: users,
    sender: authStore.user!.email,
  });
};
