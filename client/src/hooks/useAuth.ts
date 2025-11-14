import { useEffect } from 'react';
import { checkAuth } from '../functions/api.ts';
import { useAuthStore } from '../store/AuthStore.ts';

export const useAuth = () => {
  const user = useAuthStore();
  useEffect(() => {
    (async () => {
      const result = await checkAuth();
      console.log(result);
      if (result && result.data) {
        user.setUser(result.data);
      }
    })();
  }, []);
  return { user };
};
