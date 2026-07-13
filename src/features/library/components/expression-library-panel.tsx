import { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExpressionWordDetails } from '@/features/dashboard/components/expression-word-details';
import { STANZA_POS_POLISH_LABELS } from '@/features/dashboard/types/stanza-pos.types';
import { formatDuration } from '@/features/dashboard/utils/time';
import {
  useExpressionLibrary,
  type SearchLanguage,
} from '@/features/library/hooks/useExpressionLibrary';
import type {
  ExpressionContext,
  LibraryExpression,
} from '@/features/library/types/expression-library.types';
import { cn } from '@/lib/utils';

type DeleteTarget =
  | { type: 'expression'; expression: LibraryExpression }
  | {
      type: 'context';
      expression: LibraryExpression;
      context: ExpressionContext;
    };

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
        Znane ({expression.encounterCount}×)
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
        'flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left transition-colors',
        isSelected
          ? 'border-primary/30 bg-primary-50/60'
          : 'border-transparent hover:border-border hover:bg-secondary/50',
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-sm font-semibold text-foreground">
            {expression.text}
          </p>
          <StatusBadge expression={expression} />
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {expression.translation}
        </p>
        <p className="mt-1.5 text-2xs text-muted-foreground/80">
          {STANZA_POS_POLISH_LABELS[expression.pos]} ·{' '}
          {expression.contexts.length}{' '}
          {expression.contexts.length === 1 ? 'kontekst' : 'konteksty'}
        </p>
      </div>
      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
    </button>
  );
}

function ContextCard({
  context,
  highlightedText,
  onDelete,
}: {
  context: ExpressionContext;
  highlightedText: string;
  onDelete: () => void;
}) {
  const highlightSource = highlightedText.replace(/[.,!?]$/, '');
  const highlightPattern = new RegExp(
    `(${highlightSource.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi',
  );
  const sentenceParts = context.targetSentence.split(highlightPattern);

  return (
    <Card className="overflow-hidden shadow-none">
      <CardContent className="p-4">
        <p className="text-sm leading-relaxed text-foreground">
          {sentenceParts.map((part, index) =>
            part.toLowerCase() === highlightSource.toLowerCase() ? (
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
            to={`/app/videos/${context.videoId}`}
            className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Film className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{context.videoTitle}</span>
            <span className="shrink-0 font-mono tabular-nums">
              · {formatDuration(context.startSeconds)}
            </span>
          </Link>

          <Button
            variant="ghost"
            size="xs"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Usuń kontekst
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExpressionDetail({
  expression,
  onBack,
  onDeleteExpression,
  onDeleteContext,
}: {
  expression: LibraryExpression;
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
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-mono text-xl font-semibold text-foreground">
                {expression.text.replace(/[.,!?]$/, '')}
              </h2>
              <StatusBadge expression={expression} />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onDeleteExpression}
          >
            <Trash2 className="h-4 w-4" />
            Usuń wyrażenie
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="p-4 border-b">
          <ExpressionWordDetails word={expression} size="md" />
        </div>

        {/* <Card className="shrink-0 shadow-none">
          <CardContent className="p-4">
            <ExpressionWordDetails word={expression} size="md" />
          </CardContent>
        </Card> */}

        <div className="px-4 py-4 sm:px-5">
          <p className="mb-3 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Konteksty ({expression.contexts.length})
          </p>

          {expression.contexts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Brak zapisanych kontekstów dla tego wyrażenia.
            </p>
          ) : (
            <ScrollArea className="h-75 w-full">
              <div className="space-y-3 pr-3">
                {expression.contexts.map((context) => (
                  <ContextCard
                    key={context.id}
                    context={context}
                    highlightedText={expression.text}
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

function DeleteConfirmDialog({
  target,
  onClose,
  onConfirm,
}: {
  target: DeleteTarget | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!target) {
    return null;
  }

  const isExpression = target.type === 'expression';

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isExpression ? 'Usunąć wyrażenie?' : 'Usunąć kontekst?'}
          </DialogTitle>
          <DialogDescription>
            {isExpression ? (
              <>
                Wyrażenie{' '}
                <span className="font-mono font-medium text-foreground">
                  {target.expression.text}
                </span>{' '}
                zostanie trwale usunięte z biblioteki wraz ze wszystkimi
                kontekstami ({target.expression.contexts.length}).
              </>
            ) : (
              <>
                Kontekst z filmu{' '}
                <span className="font-medium text-foreground">
                  {target.context.videoTitle}
                </span>{' '}
                zostanie usunięty.
                {target.expression.contexts.length === 1 &&
                  ' To ostatni kontekst — wyrażenie również zostanie usunięte.'}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Anuluj
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Usuń
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ExpressionLibraryPanel() {
  const {
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
  } = useExpressionLibrary();

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const showDetailOnMobile = selectedId !== null;

  function handleDeleteConfirm() {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'expression') {
      removeExpression(deleteTarget.expression.id);
    } else {
      removeContext(deleteTarget.expression.id, deleteTarget.context.id);
    }

    setDeleteTarget(null);
  }

  return (
    <>
      <div className="flex min-h-[32rem] flex-col overflow-hidden rounded-lg border border-border bg-card lg:min-h-[36rem] lg:flex-row">
        <div
          className={cn(
            'flex min-h-0 w-full flex-col border-border lg:w-[22rem] lg:shrink-0 lg:border-r xl:w-[26rem]',
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

          <ScrollArea className="h-128 w-full">
            <div className="space-y-1 p-2 pr-3">
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
                    isSelected={selectedId === expression.id}
                    onSelect={() => setSelectedId(expression.id)}
                  />
                ))
              )}
            </div>
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
              onBack={() => setSelectedId(null)}
              onDeleteExpression={() =>
                setDeleteTarget({
                  type: 'expression',
                  expression: selectedExpression,
                })
              }
              onDeleteContext={(contextId) => {
                const context = selectedExpression.contexts.find(
                  (item) => item.id === contextId,
                );
                if (!context) return;

                setDeleteTarget({
                  type: 'context',
                  expression: selectedExpression,
                  context,
                });
              }}
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

      <DeleteConfirmDialog
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
