import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  jwt: string;
  login: (jwt: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      jwt: '',
      login: (jwt: string) => set({ jwt }),
    }),
    { name: 'jwt' },
  ),
);
