import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  ChevronRight,
  Film,
  Search,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { STANZA_POS_POLISH_LABELS } from '@/features/dashboard/types/stanza-tags.types';
import { formatDuration } from '@/features/dashboard/utils/time';
import {
  useExpressionLibrary,
  type SearchLanguage,
} from '@/features/library/hooks/useExpressionLibrary';
import { LibraryExpressionDetails } from '@/features/library/components/library-expression-details';
import type {
  ExpressionContext,
  LibraryExpression,
} from '@/features/library/types/expression-library.types';
import { cn } from '@/lib/utils';
import ConfirmDeleteDialog from './confirm-delete-dialog';

function StatusBadge({ expression }: { expression: LibraryExpression }) {
  if (expression.userStatus === 'new') {
    return (
      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-50">
        Nowe
      </Badge>
    );
  }

  if (expression.userStatus === 'familiar') {
    return (
      <Badge className="border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-50">
        Znane
      </Badge>
    );
  }

  return null;
}

function ExpressionListItem({
  expression,
  isSelected,
  onSelect,
}: {
  expression: LibraryExpression;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-3 border-y px-3 py-3 text-left transition-colors',
        isSelected
          ? 'border-primary/30 bg-primary-50/60'
          : 'border-transparent hover:border-border hover:bg-secondary/50',
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-sm font-semibold text-foreground">
            {expression.lemma}
          </p>
          <StatusBadge expression={expression} />
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {expression.lemmaTranslation}
        </p>
        <p className="mt-1.5 text-2xs text-muted-foreground/80">
          {STANZA_POS_POLISH_LABELS[expression.pos]} · {expression.contextCount}{' '}
          {expression.contextCount === 1 ? 'kontekst' : 'konteksty'}
        </p>
      </div>
      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
    </button>
  );
}

function ContextCard({
  context,
  highlightedTexts,
  onDelete,
}: {
  context: ExpressionContext;
  highlightedTexts: string[];
  onDelete: () => void;
}) {
  const sanitizedHighlights = highlightedTexts
    .map((text) => text.replace(/[.,!?]$/, '').trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  const highlightPattern =
    sanitizedHighlights.length > 0
      ? new RegExp(
          `(?<![\\p{L}\\p{N}_])(${sanitizedHighlights
            .map((text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('|')})(?![\\p{L}\\p{N}_])`,
          'giu',
        )
      : null;
  const sentenceParts = highlightPattern
    ? context.targetSentence.split(highlightPattern)
    : [context.targetSentence];

  return (
    <Card className="overflow-hidden shadow-none">
      <CardContent className="p-4">
        <p className="text-sm leading-relaxed text-foreground">
          {sentenceParts.map((part, index) =>
            sanitizedHighlights.some(
              (highlight) => part.toLowerCase() === highlight.toLowerCase(),
            ) ? (
              <mark
                key={index}
                className="rounded-sm bg-primary-100/80 px-0.5 font-medium text-primary-900"
              >
                {part}
              </mark>
            ) : (
              <span key={index}>{part}</span>
            ),
          )}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {context.nativeTranslation}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
          <Link
            to={`/app/videos/${context.video_uuid}?lastPositionSeconds=${Math.floor(context.startSeconds)}`}
            className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Film className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{context.videoTitle}</span>
            <span className="shrink-0 font-mono tabular-nums">
              · {formatDuration(context.startSeconds)}
            </span>
          </Link>

          <ConfirmDeleteDialog
            title="Usunąć kontekst?"
            description="Ten kontekst zostanie trwale usunięty z wyrażenia. Tej operacji nie można cofnąć."
            confirmLabel="Usuń kontekst"
            onConfirm={onDelete}
            trigger={
              <Button
                variant="ghost"
                size="xs"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Usuń kontekst
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ExpressionDetail({
  expression,
  contexts,
  onBack,
  onDeleteExpression,
  onDeleteContext,
}: {
  expression: LibraryExpression;
  contexts: ExpressionContext[];
  onBack: () => void;
  onDeleteExpression: () => void;
  onDeleteContext: (contextId: string) => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-border px-4 py-4 sm:px-5">
        <Button
          variant="ghost"
          size="sm"
          className="mb-3 -ml-2 lg:hidden"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć do listy
        </Button>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h2 className="font-mono text-xl font-semibold text-foreground">
                {expression.lemma.replace(/[.,!?]$/, '')}
              </h2>
              <StatusBadge expression={expression} />
              <span className="text-sm text-muted-foreground">
                · Dodano{' '}
                {new Date(expression.addedAt).toLocaleDateString('pl-PL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          <ConfirmDeleteDialog
            title="Usunąć wyrażenie?"
            description={`Wyrażenie „${expression.lemma.replace(/[.,!?]$/, '')}” oraz wszystkie jego konteksty zostaną trwale usunięte. Tej operacji nie można cofnąć.`}
            confirmLabel="Usuń wyrażenie"
            onConfirm={onDeleteExpression}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Usuń wyrażenie
              </Button>
            }
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="border-b p-4">
          <LibraryExpressionDetails
            expression={expression}
            size="md"
            layout="split"
          />
        </div>

        <div className="px-4 py-4 sm:px-5">
          <p className="mb-3 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Konteksty ({contexts.length})
          </p>

          {contexts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Brak zapisanych kontekstów dla tego wyrażenia.
            </p>
          ) : (
            <ScrollArea className="h-120 w-full">
              <div className="space-y-3">
                {contexts.map((context) => (
                  <ContextCard
                    key={context.id}
                    context={context}
                    highlightedTexts={
                      context.matchedForms.length > 0
                        ? context.matchedForms
                        : [expression.lemma]
                    }
                    onDelete={() => onDeleteContext(context.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}

export function ExpressionLibraryPanel() {
  const {
    filteredExpressions,
    selectedExpression,
    showDetailOnMobile,
    selectExpression,
    query,
    setQuery,
    searchLanguage,
    setSearchLanguage,
    contexts,
    deleteExpression,
    deleteExpressionContext,
  } = useExpressionLibrary();

  return (
    <>
      <div className="flex min-h-144 max-h-144 flex-col overflow-hidden rounded-lg border border-border bg-card lg:min-h-160 lg:max-h-188 lg:flex-row">
        <div
          className={cn(
            'flex min-h-0 w-full flex-col border-border lg:w-88 lg:shrink-0 lg:border-r xl:w-104',
            showDetailOnMobile && 'hidden lg:flex',
          )}
        >
          <div className="space-y-3 border-b border-border p-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  searchLanguage === 'target'
                    ? 'Szukaj po hiszpańsku…'
                    : 'Szukaj po polsku…'
                }
                className="pl-8"
              />
            </div>
            <NativeSelect
              value={searchLanguage}
              onChange={(event) =>
                setSearchLanguage(event.target.value as SearchLanguage)
              }
              aria-label="Język wyszukiwania"
              className="w-full"
            >
              <NativeSelectOption value="target">Hiszpański</NativeSelectOption>
              <NativeSelectOption value="native">Polski</NativeSelectOption>
            </NativeSelect>
            <p className="text-2xs text-muted-foreground">
              {filteredExpressions.length}{' '}
              {filteredExpressions.length === 1 ? 'wyrażenie' : 'wyrażeń'}
            </p>
          </div>

          <ScrollArea className="h-150 w-full">
            {filteredExpressions.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
                <Bookmark className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm font-medium text-foreground">
                  Brak wyników
                </p>
                <p className="text-xs text-muted-foreground">
                  Zmień kryteria wyszukiwania lub dodaj wyrażenia podczas
                  oglądania filmów.
                </p>
              </div>
            ) : (
              filteredExpressions.map((expression) => (
                <ExpressionListItem
                  key={expression.id}
                  expression={expression}
                  isSelected={selectedExpression?.id === expression.id}
                  onSelect={() => selectExpression(expression.id)}
                />
              ))
            )}
          </ScrollArea>
        </div>

        <div
          className={cn(
            'flex min-h-0 min-w-0 flex-1 flex-col bg-canvas/40',
            !showDetailOnMobile && 'hidden lg:flex',
          )}
        >
          {selectedExpression ? (
            <ExpressionDetail
              expression={selectedExpression}
              contexts={contexts}
              onBack={() => selectExpression(null)}
              onDeleteExpression={() => deleteExpression(selectedExpression.id)}
              onDeleteContext={(contextId: string) =>
                deleteExpressionContext(selectedExpression.id, contextId)
              }
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <Bookmark className="h-10 w-10 text-muted-foreground/30" />
              <p className="font-medium text-foreground">
                Wybierz wyrażenie z listy
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Zobaczysz tu wszystkie zapisane zdania-konteksty, z których
                pochodzi dane słowo lub fraza.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
