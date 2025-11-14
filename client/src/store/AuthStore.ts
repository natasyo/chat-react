import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logoutUser } from '../functions/api.ts';

export type UserStore = {
  userId: string;
  email: string;
};
export type AuthState = {
  user: UserStore | null;
  setUser: (user: UserStore) => void;
  deleteUser: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: UserStore) => set({ user }),
      deleteUser: async () => {
        await logoutUser();
        set({ user: null });
      },
    }),
    { name: 'user' },
  ),
);
