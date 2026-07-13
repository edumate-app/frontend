import { useMemo, useState } from 'react';
import { MOCK_EXPRESSION_LIBRARY } from '@/features/library/mocks/expression-library.mock';
import type { LibraryExpression } from '@/features/library/types/expression-library.types';

function matchesSearch(
  expression: LibraryExpression,
  targetQuery: string,
  nativeQuery: string,
) {
  const target = targetQuery.trim().toLowerCase();
  const native = nativeQuery.trim().toLowerCase();

  const matchesTarget =
    !target ||
    expression.text.toLowerCase().includes(target) ||
    expression.lemma.toLowerCase().includes(target) ||
    expression.contexts.some((context) =>
      context.targetSentence.toLowerCase().includes(target),
    );

  const matchesNative =
    !native ||
    expression.translation.toLowerCase().includes(native) ||
    expression.lemmaTranslation.toLowerCase().includes(native) ||
    expression.contexts.some((context) =>
      context.nativeTranslation.toLowerCase().includes(native),
    );

  return matchesTarget && matchesNative;
}

export function useExpressionLibrary(
  initialExpressions = MOCK_EXPRESSION_LIBRARY,
) {
  const [expressions, setExpressions] =
    useState<LibraryExpression[]>(initialExpressions);
  const [targetQuery, setTargetQuery] = useState('');
  const [nativeQuery, setNativeQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(
    initialExpressions[0]?.id ?? null,
  );

  const filteredExpressions = useMemo(
    () =>
      expressions.filter((expression) =>
        matchesSearch(expression, targetQuery, nativeQuery),
      ),
    [expressions, targetQuery, nativeQuery],
  );

  const selectedExpression =
    filteredExpressions.find((expression) => expression.id === selectedId) ??
    null;

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
    targetQuery,
    setTargetQuery,
    nativeQuery,
    setNativeQuery,
    removeExpression,
    removeContext,
  };
}
