import type { User } from '../types/prisma.ts';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ChatUser = { user: User; isOnline?: boolean };

type ChatState = {
  users: { user: User; isOnline?: boolean }[];
  activeRecipient?: User;
  changeActiveRecipient: (user: User) => void;
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

          set((state) => {
            state.activeRecipient = user;
            return {
              users: [{ user, isOnline: false }, ...users],
            };
          });
        },
        removeUser: (user: User) => {
          const { users, activeRecipient } = get();
          const index = users.findIndex(
            (u) => u.user.id === user.id,
          );
          const newUsers = users.filter(
            (u) => u.user.id !== user.id,
          );
          let newActive: User | undefined;

          if (activeRecipient?.id === user.id) {
            if (newUsers.length > 0) {
              const newIndex = index === 0 ? 0 : index - 1;
              newActive = newUsers[newIndex].user;
            }
          } else {
            newActive = activeRecipient;
          }
          set(() => ({
            activeRecipient: newActive,
            users: newUsers,
          }));
        },
        changeOnline: (users: ChatUser[]) => {
          set((state) => {
            const updateMap = new Map(
              users.map((u) => [u.user.id, u.isOnline]),
            );
            return {
              users: state.users.map((u) => ({
                ...u,
                isOnline:
                  updateMap.get(u.user.id) ?? u.isOnline,
              })),
            };
          });
        },
        changeActiveRecipient: (user: User) => {
          set((state) => ({
            ...state,
            activeRecipient: user,
          }));
        },
      };
    },
    {
      name: 'chat',
    },
  ),
);
