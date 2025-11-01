import type { User } from '../types/prisma.ts';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ChatUser = { user: User; isOnline?: boolean };

type ChatState = {
  users: { user: User; isOnline?: boolean }[];
  currentUser?: User;
  addUser: (user: User) => void;
  removeUser: (user: User) => void;
  changeOnline: (users: ChatUser[]) => void;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => {
      return {
        users: [],
        addUser: (user: User) => {
          const users = get().users;
          if (users.some((u) => u.user.id === user.id))
            return;
          set({
            users: [{ user, isOnline: false }, ...users],
          });
        },
        removeUser: (user: User) => {
          set((state) => ({
            users: state.users.filter(
              (u) => u.user.id !== user.id,
            ),
          }));
        },
        changeOnline: (users: ChatUser[]) => {
          set(() => ({
            users,
          }));
        },
      };
    },
    {
      name: 'chat',
    },
  ),
);
