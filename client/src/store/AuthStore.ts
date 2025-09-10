import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logoutUser } from '../functions/api.ts';

type AuthState = {
  jwt: string | null;
  refreshToken: string | null;
  email: string | null;
  login: (
    jwt: string,
    refreshToken: string,
    email: string,
  ) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      jwt: null,
      refreshToken: null,
      email: null,
      login: (
        jwt: string,
        refreshToken: string,
        email: string,
      ) => set({ jwt, refreshToken, email }),
      logout: async () => {
        const { refreshToken, email } =
          useAuthStore.getState();
        if (email && refreshToken)
          await logoutUser(email, refreshToken);
        set({ jwt: null, email: null, refreshToken: null });
      },
    }),
    { name: 'token' },
  ),
);
