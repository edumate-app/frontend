import { useState } from 'react';
import { dashboardApi } from '../api/dashboard.api';
import { useNavigate } from 'react-router-dom';
import { extractYouTubeVideoId } from '@/features/video/utils/youtube';

export const useStartImport = () => {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImport(url: string, lang: string) {
    if (!url || !lang) return;

    setStarting(true);
    setError(null);

    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      setError('Nieprawidłowy link YouTube.');
      setStarting(false);
      return;
    }

    try {
      const { data } = await dashboardApi.add({
        videoId: videoId,
        targetLang: lang,
      });
      navigate(`/app/videos/import/${data.jobId}`, { replace: true });
    } catch {
      setError('Nie udało się rozpocząć importu.');
    } finally {
      setStarting(false);
    }
  }

  return { starting, error, handleImport };
};
