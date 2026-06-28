import { useState } from "react";
import type { ClipboardEvent } from "react";
import { dashboardApi } from "../api/dashboard.api";
import type { LanguageDto } from "../api/dashboard.types";

export const useValidateUrl = () => {
  const [lang, setLang] = useState("");
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function validateUrl(videoUrl: string) {
    const trimmed = videoUrl.trim();
    if (!trimmed) {
      setLanguages([]);
      setLang("");
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await dashboardApi.validateYtUrl(trimmed);
      setLanguages(data);
      setLang(data[0]?.language_code ?? "");
    } catch {
      setLanguages([]);
      setLang("");
      setError("Nie udało się pobrać dostępnych języków dla tego filmu.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleUrlPaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").trim();
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
