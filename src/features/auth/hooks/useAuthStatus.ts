import { useEffect } from 'react';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export const useAuthStatus = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setAuthChecked = useAuthStore((state) => state.setAuthChecked);
  const hasCheckedAuth = useAuthStore((state) => state.hasCheckedAuth);
  useEffect(() => {
    if (hasCheckedAuth) return;
    authApi
      .me()
      .then(({ data }) => {
        setAuth({
          email: data.email,
          name: data.name,
          nativeLang: data.nativeLang,
          avatarUrl: data.avatarUrl,
        });
      })
      .finally(() => {
        setAuthChecked();
      });
  }, [hasCheckedAuth, setAuth, setAuthChecked]);
};
