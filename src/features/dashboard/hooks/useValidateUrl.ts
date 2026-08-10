import { useRef, useState } from 'react';
import type { ClipboardEvent } from 'react';
import { dashboardApi } from '../api/dashboard.api';
import type { LanguageDto } from '../api/dashboard.types';
import { extractYouTubeVideoId } from '@/features/video/utils/youtube';

export const useValidateUrl = () => {
  const [lang, setLang] = useState('');
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastValidatedVideoId = useRef<string | null>(null);

  async function validateUrl(videoUrl: string) {
    const trimmed = videoUrl.trim();
    if (!trimmed) {
      setLanguages([]);
      setLang('');
      setVideoId(null);
      setError(null);
      lastValidatedVideoId.current = null;
      return;
    }

    const extracted = extractYouTubeVideoId(trimmed);
    if (!extracted) {
      setLanguages([]);
      setLang('');
      setVideoId(null);
      setError('Nieprawidłowy link YouTube.');
      return;
    }
    if (extracted === lastValidatedVideoId.current) {
      setVideoId(extracted);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await dashboardApi.validateYtUrl(extracted);
      lastValidatedVideoId.current = extracted;
      setVideoId(extracted);
      setLanguages(data);
      const firstAvailable = data.find((l) => !l.alreadyImported);
      setLang(firstAvailable?.language_code ?? '');
    } catch {
      setLanguages([]);
      setLang('');
      setVideoId(null);
      setError('Nie udało się pobrać dostępnych języków dla tego filmu.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleUrlPaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text').trim();
    if (pasted) void validateUrl(pasted);
  }

  return {
    lang,
    setLang,
    languages,
    isLoading,
    error,
    validateUrl,
    videoId,
    handleUrlPaste,
  };
};
