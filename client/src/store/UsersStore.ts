import { create } from 'zustand';
import type { User } from '@chat/shared';

export interface UserState extends User {
  countNewMessages?: number;
}

export interface UsersState {
  users: UserState[];
  addUsers: (users: UserState[]) => void;
  setCountNewMessages: (
    data: {
      senderEmail: string;
      count: number;
    }[],
  ) => void;
}

export const useUsers = create<UsersState>((set, get) => ({
  users: [],
  addUsers: (users: User[]) => set({ users }),
  setCountNewMessages: (
    data: {
      senderEmail: string;
      count: number;
    }[],
  ) => {
    const map = new Map(
      data.map((item) => [item.senderEmail, item.count]),
    );
    const users = get().users;
    const newUsers = users.map((user) => ({
      ...user,
      countNewMessages: map.get(user.email),
    }));
    set({ users: newUsers });
  },
}));
