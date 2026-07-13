import { useMemo, useState } from 'react';
import { MOCK_EXPRESSION_LIBRARY } from '@/features/library/mocks/expression-library.mock';
import type { LibraryExpression } from '@/features/library/types/expression-library.types';

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
    return (
      expression.text.toLowerCase().includes(normalizedQuery) ||
      expression.lemma.toLowerCase().includes(normalizedQuery)
    );
  }

  return (
    expression.translation.toLowerCase().includes(normalizedQuery) ||
    expression.lemmaTranslation.toLowerCase().includes(normalizedQuery)
  );
}

export function useExpressionLibrary(
  initialExpressions = MOCK_EXPRESSION_LIBRARY,
) {
  const [expressions, setExpressions] =
    useState<LibraryExpression[]>(initialExpressions);
  const [query, setQuery] = useState('');
  const [searchLanguage, setSearchLanguage] = useState<SearchLanguage>('target');
  const [selectedId, setSelectedId] = useState<string | null>(
    initialExpressions[0]?.id ?? null,
  );

  const filteredExpressions = useMemo(
    () =>
      expressions.filter((expression) =>
        matchesSearch(expression, query, searchLanguage),
      ),
    [expressions, query, searchLanguage],
  );

  const selectedExpression =
    expressions.find((expression) => expression.id === selectedId) ?? null;

  function removeExpression(expressionId: string) {
    setExpressions((current) =>
      current.filter((expression) => expression.id !== expressionId),
    );
    setSelectedId((current) => (current === expressionId ? null : current));
  }

  function removeContext(expressionId: string, contextId: string) {
    setExpressions((current) =>
      current.flatMap((expression) => {
        if (expression.id !== expressionId) {
          return expression;
        }

        const contexts = expression.contexts.filter(
          (context) => context.id !== contextId,
        );

        if (contexts.length === 0) {
          return [];
        }

        return [
          {
            ...expression,
            contexts,
            encounterCount: Math.max(1, expression.encounterCount - 1),
          },
        ];
      }),
    );
  }

  return {
    expressions,
    filteredExpressions,
    selectedExpression,
    selectedId,
    setSelectedId,
    query,
    setQuery,
    searchLanguage,
    setSearchLanguage,
    removeExpression,
    removeContext,
  };
}
