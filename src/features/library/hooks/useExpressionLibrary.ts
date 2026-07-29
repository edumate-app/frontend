import { useEffect, useMemo, useState } from 'react';
import type {
  ExpressionContext,
  LibraryExpression,
} from '@/features/library/types/expression-library.types';
import { VideoApi } from '@/features/video/api/video.api';

export type SearchLanguage = 'target' | 'native';

function matchesSearch(
  expression: LibraryExpression,
  query: string,
  searchLanguage: SearchLanguage,
) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  if (searchLanguage === 'target') {
    return expression.lemma.toLowerCase().includes(normalizedQuery);
  }

  return expression.lemmaTranslation.toLowerCase().includes(normalizedQuery);
}

export function useExpressionLibrary() {
  const [expressions, setExpressions] = useState<LibraryExpression[]>([]);
  const [expressionError, setExpressionError] = useState<string | null>(null);
  const [expressionIsLoading, setExpressionIsLoading] = useState(true);

  const [contexts, setContexts] = useState<ExpressionContext[]>([]);
  const [contextsError, setContextsError] = useState<string | null>(null);
  const [contextsIsLoading, setContextsIsLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [searchLanguage, setSearchLanguage] =
    useState<SearchLanguage>('target');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredExpressions = useMemo(
    () =>
      expressions.filter((expression) =>
        matchesSearch(expression, query, searchLanguage),
      ),
    [expressions, query, searchLanguage],
  );

  const selectedExpression =
    expressions.find((expression) => expression.id === selectedId) ?? null;
  const showDetailOnMobile = selectedId !== null;

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
        setExpressions(response.data);
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
    searchLanguage,
    setSearchLanguage,
    contexts,
    contextsError,
    contextsIsLoading,
  };
}
