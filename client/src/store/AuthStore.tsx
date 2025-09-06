import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  jwt: string | null;
  email: string | null;
  login: (jwt: string, email: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      jwt: '',
      email: '',
      login: (jwt: string, email: string) =>
        set({ jwt, email }),
      logout: () => set({ jwt: null, email: null }),
    }),
    { name: 'token' },
  ),
);
