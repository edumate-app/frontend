import { useAuthStore } from '@/features/auth/store/auth.store';
import { dashboardApi } from '../api/dashboard.api';
import { authApi } from '@/features/auth/api/auth.api';

export const useUpdateNativeLang = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const updateNativeLang = async (lang: string) => {
    await dashboardApi.updateNativeLang(lang);

    await authApi.me().then((response) => {
      const user = response.data;
      setAuth({
        email: user.email,
        name: user.name,
        nativeLang: user.nativeLang,
        avatarUrl: user.avatarUrl,
      });
    });
  };

  return { updateNativeLang };
};
