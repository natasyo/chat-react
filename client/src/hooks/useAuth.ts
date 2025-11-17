import { useEffect } from 'react';
import { checkAuth } from '../functions/api.ts';
import { useAuthStore } from '../store/AuthStore.ts';

export const useAuth = () => {
  const user = useAuthStore();
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const result = await checkAuth();
      if (!isMounted) return;
      console.log(result);
      if (result && result.data) {
        user.setUser(result.data);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);
  return { user };
};
