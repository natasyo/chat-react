import { create } from 'zustand';
import type { User } from '../types/prisma.ts';

export interface UserState extends User {
  countNewMessages?: number;
}

export interface UsersState {
  users: UserState[];
  addUsers: (users: UserState[]) => void;
  setCountNewMessages: (
    data: {
      senderEmail: string;
      count: string;
    }[],
  ) => void;
}

export const useUsers = create<UsersState>((set, get) => ({
  users: [],
  addUsers: (users: User[]) => set({ users }),
  setCountNewMessages: (
    data: {
      senderEmail: string;
      count: string;
    }[],
  ) => {
    const map = new Map(
      data.map((item) => [item.senderEmail, item.count]),
    );

    console.log(map);
    const users = get().users;
  },
}));
