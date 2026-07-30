import { useState } from 'react';
import { dashboardApi } from '../api/dashboard.api';
import { useAuthStore } from '@/features/auth/store/auth.store';

export const useUpdateProfilePhoto = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfilePhoto = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await dashboardApi.updateProfilePhoto(file);

      setAuth({
        email: data.email,
        name: data.name,
        nativeLang: data.nativeLang,
        avatarUrl: data.avatarUrl,
      });
    } catch {
      setError('Nie udało się zaktualizować zdjęcia profilowego.');
      throw new Error('PROFILE_PHOTO_UPDATE_FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProfilePhoto = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await dashboardApi.deleteProfilePhoto();

      setAuth({
        email: data.email,
        name: data.name,
        nativeLang: data.nativeLang,
        avatarUrl: data.avatarUrl,
      });
    } catch {
      setError('Nie udało się usunąć zdjęcia profilowego.');
      throw new Error('PROFILE_PHOTO_DELETE_FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfilePhoto, deleteProfilePhoto, isLoading, error };
};
