import { useCallback, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { refreshToken } from '../functions/api.ts';
import { useAuthStore } from '../store/AuthStore.ts';

export const useAuth = (
  initialToken: string | null = null,
) => {
  const [accessToken, setAccessToken] = useState<
    string | null
  >(initialToken);
  const authStore = useAuthStore();
  const isTokenValid = useCallback(
    (token: string | null) => {
      if (!token) return;
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        return decoded.exp && decoded.exp > now;
      } catch {
        return false;
      }
    },
    [],
  );
  useEffect(() => {
    if (!accessToken) return;
    const decoded = jwtDecode(accessToken);
    if (!decoded.exp) return;
    const now = Date.now() / 1000;
    const timeLeft = decoded.exp - now;
    const timeout = (timeLeft - 5) / 1000;
    console.log('timeout', timeout);
    const timer = setTimeout(async () => {
      const data = await refreshToken(
        authStore.email!,
        authStore.refreshToken!,
      );
      console.log(data);
    }, timeout);
    return clearTimeout(timer);
  }, [accessToken]);
  return { accessToken, isTokenValid };
};
