import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logoutUser } from '../functions/api.ts';
import type { User } from '../types/prisma.ts';

export type AuthState = {
  jwt: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (
    jwt: string,
    refreshToken: string,
    user: User,
  ) => void;
  logout: () => void;
  updateToken: (jwt: string, refreshToken: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      jwt: null,
      refreshToken: null,
      email: null,
      user: null,
      login: (
        jwt: string,
        refreshToken: string,
        user: User,
      ) => set({ jwt, refreshToken, user }),
      logout: async () => {
        const { refreshToken, user } =
          useAuthStore.getState();
        if (user && refreshToken)
          await logoutUser(user.email, refreshToken);
        set({ jwt: null, user: null, refreshToken: null });
      },
      updateToken: (jwt: string, refreshToken: string) =>
        set({ refreshToken: refreshToken, jwt }),
    }),
    { name: 'token' },
  ),
);
