import type { User } from '../types/prisma.ts';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ChatState = {
  users: User[];
  currentUser?: User;
  addUser: (user: User) => void;
  removeUser: (user: User) => void;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      users: [],
      addUser: (user: User) => {
        const users = get().users;
        if (users.some((u) => u.id === user.id)) return;
        set({
          users: [user, ...users],
        });
      },
      removeUser: (user: User) => {
        set((state) => ({
          users: state.users.filter(
            (u) => u.id !== user.id,
          ),
        }));
      },
    }),
    {
      name: 'chat',
    },
  ),
);
