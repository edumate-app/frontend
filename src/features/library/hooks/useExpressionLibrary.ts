import { useEffect, useMemo, useState } from 'react';
import type {
  ExpressionContext,
  LibraryExpression,
} from '@/features/library/types/expression-library.types';
import { VideoApi } from '@/features/video/api/video.api';

function matchesSearch(
  expression: LibraryExpression,
  query: string,
  selectedLanguages: string[],
  nativeLang: string | undefined,
) {
  if (selectedLanguages.length === 0) {
    return false;
  }

  const q = query.trim().toLowerCase();
  const nativeSelected = Boolean(
    nativeLang && selectedLanguages.includes(nativeLang),
  );
  const onlyNativeSelected =
    nativeSelected && selectedLanguages.every((lang) => lang === nativeLang);
  const languageSelected = selectedLanguages.includes(expression.lang);

  // Only native → all expressions (search in translations).
  // Otherwise → expression.lang must be one of the selected codes
  // (including when that code is also the user's native language).
  if (!onlyNativeSelected && !languageSelected) {
    return false;
  }

  if (!q) {
    return true;
  }

  const inLemma = expression.lemma.toLowerCase().includes(q);
  const inTranslation = (expression.lemmaTranslation ?? '')
    .toLowerCase()
    .includes(q);

  if (onlyNativeSelected) {
    return inTranslation;
  }
  if (nativeSelected) {
    return inLemma || inTranslation;
  }
  return inLemma;
}

export function useExpressionLibrary() {
  const [expressions, setExpressions] = useState<LibraryExpression[]>([]);
  const [expressionError, setExpressionError] = useState<string | null>(null);
  const [expressionIsLoading, setExpressionIsLoading] = useState(true);

  const [contexts, setContexts] = useState<ExpressionContext[]>([]);
  const [contextsError, setContextsError] = useState<string | null>(null);
  const [contextsIsLoading, setContextsIsLoading] = useState(true);

  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const nativeLang = languages[0];

  const filteredExpressions = useMemo(
    () =>
      expressions.filter((expression) =>
        matchesSearch(expression, query, selectedLanguages, nativeLang),
      ),
    [expressions, query, selectedLanguages, nativeLang],
  );

  const selectedExpression =
    expressions.find((expression) => expression.id === selectedId) ?? null;
  const showDetailOnMobile = selectedId !== null;

  const toggleLanguage = (code: string) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(code)) {
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((lang) => lang !== code);
      }
      return [...prev, code];
    });
  };

  const fetchExpressionContexts = async (expressionId: string) => {
    setContextsIsLoading(true);
    setContextsError(null);
    VideoApi.getExpressionContexts(expressionId)
      .then((response) => {
        setContexts(response.data);
      })
      .catch(() => {
        setContextsError('Nie udało się pobrać kontekstów wyrażenia.');
        setContexts([]);
      });
  };

  const deleteExpression = async (expressionId: string) => {
    VideoApi.deleteExpression(expressionId);
    setContexts([]);
    setSelectedId(null);
    setExpressions((prev) =>
      prev.filter((expression) => expression.id !== expressionId),
    );
  };

  const deleteExpressionContext = async (
    expressionId: string,
    contextId: string,
  ) => {
    VideoApi.deleteExpressionContext(expressionId, contextId);
    setContexts((prev) => prev.filter((context) => context.id !== contextId));
  };

  const selectExpression = (expressionId: string | null) => {
    setSelectedId(expressionId);

    if (expressionId === null) {
      setContexts([]);
      setContextsError(null);
      setContextsIsLoading(false);
      return;
    }

    void fetchExpressionContexts(expressionId);
  };

  useEffect(() => {
    VideoApi.getExpressions()
      .then((response) => {
        setLanguages(response.data.languages);
        setExpressions(response.data.expressions);
        setSelectedLanguages(response.data.languages);
      })
      .catch(() => {
        setExpressionError('Nie udało się pobrać listy wyrażeń.');
      })
      .finally(() => {
        setExpressionIsLoading(false);
      });
  }, []);

  return {
    expressions,
    expressionError,
    expressionIsLoading,
    filteredExpressions,
    selectedExpression,
    showDetailOnMobile,
    selectExpression,
    query,
    setQuery,
    selectedLanguages,
    toggleLanguage,
    contexts,
    contextsError,
    contextsIsLoading,
    deleteExpression,
    deleteExpressionContext,
    languages,
    nativeLang,
  };
}
