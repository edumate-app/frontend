import { useRef, useState } from 'react';
import type { ClipboardEvent } from 'react';
import { dashboardApi } from '../api/dashboard.api';
import type { LanguageDto } from '../api/dashboard.types';

function isValidHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export const useValidateUrl = () => {
  const [lang, setLang] = useState('');
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastValidatedUrl = useRef<string | null>(null);

  async function validateUrl(videoUrl: string) {
    const trimmed = videoUrl.trim();
    if (!trimmed) {
      setLanguages([]);
      setLang('');
      setError(null);
      lastValidatedUrl.current = null;
      return;
    }

    if (!isValidHttpsUrl(trimmed)) {
      setLanguages([]);
      setLang('');
      setError(null);
      return;
    }

    if (trimmed === lastValidatedUrl.current) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await dashboardApi.validateYtUrl(trimmed);
      lastValidatedUrl.current = trimmed;
      setLanguages(data);
      const firstAvailable = data.find((l) => !l.alreadyImported);
      setLang(firstAvailable?.language_code ?? '');
    } catch {
      setLanguages([]);
      setLang('');
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
    handleUrlPaste,
  };
};
