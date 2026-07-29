import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import {
  type SentenceAnalysis,
  type SentenceAnalysisWord,
} from '@/features/dashboard/types/sentence-analysis.types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ExpressionWordDetails } from './expression-word-details';
import type { SentenceAnalysisStatus } from '../hooks/useSentenceAnalysis';
import { Loader2, Pin, PinOff } from 'lucide-react';
import SelectionBar from './SelectionBar';
import ExpressionLegend from './ExpressionLegend';
import useSaveExpressions from '../hooks/useSaveExpressions';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

type SentenceAnalysisPanelProps = {
  analysis: SentenceAnalysis | null;
  status: SentenceAnalysisStatus;
  isPinned?: boolean;
  onTogglePin?: () => void;
};

function WordDetailCard({ token }: { token: SentenceAnalysisWord }) {
  const titleId = useId();

  return (
    <div
      role="tooltip"
      aria-labelledby={titleId}
      className="absolute bottom-[calc(100%+0.5rem)] left-1/2 z-20 w-72 -translate-x-1/2 animate-fade-in rounded-lg border bg-popover p-3 text-left shadow-md"
    >
      <p
        id={titleId}
        className="font-mono text-sm font-semibold text-foreground"
      >
        {token.text.replace(/[.,!?]$/, '')}
      </p>
      <ExpressionWordDetails word={token} className="mt-2" />
    </div>
  );
}

function WordBlock({
  token,
  isHovered,
  isSelected,
  onHover,
  onLeave,
  onClick,
}: {
  token: SentenceAnalysisWord;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (event: MouseEvent<HTMLButtonElement>) => void;
  onLeave: () => void;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <span className="relative inline">
      <button
        type="button"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onClick}
        aria-expanded={isHovered}
        aria-pressed={isSelected}
        className={cn(
          'cursor-pointer rounded-sm px-0.5 transition-colors',
          'hover:bg-muted/70 focus-visible:outline-none focus-visible:shadow-focus',
          // Analysis preview (hover / pinned tooltip)
          isHovered && !isSelected && 'bg-muted ring-1 ring-ring/30',
          // Selection for library save
          isSelected &&
            'bg-amber-100/90 text-amber-950 ring-1 ring-amber-400/70 hover:bg-amber-200/80',
          // Familiar (seen 5+)
          !isSelected &&
            token.userStatus === 'familiar' &&
            'bg-blue-100/90 text-blue-900 hover:bg-blue-200/80',
          // New in library / unknown
          !isSelected &&
            (token.userStatus === 'new' || token.userStatus === 'unknown') &&
            'bg-emerald-100/90 text-emerald-900 hover:bg-emerald-200/80',
        )}
      >
        {token.text}
      </button>
      {isHovered && <WordDetailCard token={token} />}
    </span>
  );
}

export function SentenceAnalysisPanel({
  analysis = null,
  status = 'idle',
  isPinned = false,
  onTogglePin,
}: SentenceAnalysisPanelProps) {
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null,
  );
  const [isCtrlHeld, setIsCtrlHeld] = useState(false);
  const wordsRef = useRef<HTMLParagraphElement>(null);
  const [isSingleLine, setIsSingleLine] = useState(true);

  const { saveExpressions } = useSaveExpressions();

  useEffect(() => {
    const syncCtrl = (event: KeyboardEvent) => {
      setIsCtrlHeld(event.ctrlKey);
      if (event.ctrlKey) {
        setHoveredId(null);
        setPinnedId(null);
      }
    };
    const clearCtrl = () => setIsCtrlHeld(false);

    window.addEventListener('keydown', syncCtrl);
    window.addEventListener('keyup', syncCtrl);
    window.addEventListener('blur', clearCtrl);
    return () => {
      window.removeEventListener('keydown', syncCtrl);
      window.removeEventListener('keyup', syncCtrl);
      window.removeEventListener('blur', clearCtrl);
    };
  }, []);

  useLayoutEffect(() => {
    const el = wordsRef.current;
    if (!el) return;

    const update = () => {
      const styles = getComputedStyle(el);
      let lineHeight = parseFloat(styles.lineHeight);
      if (Number.isNaN(lineHeight)) {
        lineHeight = parseFloat(styles.fontSize) * 1.5;
      }
      setIsSingleLine(el.getBoundingClientRect().height <= lineHeight * 1.25);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [analysis?.words]);

  if (!analysis) {
    return null;
  }

  const { index, startSeconds, targetTranslation, words } = analysis;

  const handleWordClick = (
    token: SentenceAnalysisWord,
    wordIndex: number,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    if (!event.ctrlKey) {
      setPinnedId((current) => (current === token.id ? null : token.id));
      return;
    }

    setHoveredId(null);
    setPinnedId(null);

    let next: string[];

    if (
      event.shiftKey &&
      lastSelectedIndex != null &&
      lastSelectedIndex !== wordIndex
    ) {
      const from = Math.min(lastSelectedIndex, wordIndex);
      const to = Math.max(lastSelectedIndex, wordIndex);
      const rangeIds = words.slice(from, to + 1).map((word) => word.id);
      next = Array.from(new Set([...selectedIds, ...rangeIds]));
    } else if (selectedIds.includes(token.id)) {
      next = selectedIds.filter((id) => id !== token.id);
    } else {
      next = [...selectedIds, token.id];
    }

    setSelectedIds(next);
    setLastSelectedIndex(wordIndex);
  };

  const activeTooltipId = isCtrlHeld ? null : (pinnedId ?? hoveredId);

  return (
    <div className="flex shrink-0 flex-col border-t bg-canvas">
      <div className="pl-6 pr-2 pt-2">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
                Analiza zdania {index + 1}
              </p>
              {status === 'loading' ? (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              ) : (
                <div className="h-3 w-3 shrink-0" aria-hidden />
              )}
              {isPinned ? (
                <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-2xs font-medium text-primary">
                  Przypięta
                </span>
              ) : (
                <span
                  className="invisible rounded-sm px-1.5 py-0.5 text-2xs font-medium"
                  aria-hidden
                >
                  Przypięta
                </span>
              )}
            </div>
            <p className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
              {formatTime(startSeconds)}
            </p>
          </div>
          {onTogglePin && (
            <Button
              type="button"
              size="sm"
              variant={isPinned ? 'secondary' : 'ghost'}
              onClick={onTogglePin}
              className="h-8 shrink-0 gap-1.5 px-2.5 text-xs"
              aria-pressed={isPinned}
              title={
                isPinned
                  ? 'Śledź ponownie odtwarzanie'
                  : 'Zostań przy tej analizie podczas oglądania'
              }
            >
              {isPinned ? (
                <>
                  <PinOff className="h-3.5 w-3.5" />
                  Śledź wideo
                </>
              ) : (
                <>
                  <Pin className="h-3.5 w-3.5" />
                  Zostań tutaj
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
          <div
            className={cn(
              'h-full px-6',
              // Largest: single line, no selection bar
              // Medium: wrapped only, or selection bar only
              // Smallest: wrapped + selection bar
              !isSingleLine && selectedIds.length > 0
                ? 'pt-2'
                : !isSingleLine || selectedIds.length > 0
                  ? 'pt-4'
                  : 'pt-7',
            )}
          >
            <p
              ref={wordsRef}
              className="text-center text-xl font-medium leading-relaxed text-foreground sm:text-2xl"
            >
              {words.map((token, index) => (
                <span key={token.id}>
                  <WordBlock
                    token={token}
                    isHovered={activeTooltipId === token.id}
                    isSelected={selectedIds.includes(token.id)}
                    onHover={(event) => {
                      if (event.ctrlKey || isCtrlHeld) return;
                      setHoveredId(token.id);
                    }}
                    onLeave={() => setHoveredId(null)}
                    onClick={(event) => handleWordClick(token, index, event)}
                  />
                  {index < words.length - 1 && ' '}
                </span>
              ))}
            </p>
            <p className="mt-3 text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
              {targetTranslation}
            </p>
          </div>
          {selectedIds.length > 0 && (
            <SelectionBar
              count={selectedIds.length}
              onClear={() => {
                setSelectedIds([]);
                setLastSelectedIndex(null);
              }}
              onSubmit={async () => {
                console.log(
                  'saving expressions',
                  words
                    .filter((w) => selectedIds.includes(w.id))
                    .map((w) => ({
                      text: w.text,
                      lemma: w.lemma,
                      translation: w.translation,
                      pos: w.pos,
                      conjugation: w.conjugation,
                    })),
                );
                await saveExpressions(
                  words
                    .filter((w) => selectedIds.includes(w.id))
                    .map((w) => ({
                      text: w.text,
                      lemma: w.lemma,
                      lemmaTranslation: w.lemmaTranslation,
                      pos: w.pos,
                      conjugation: w.conjugation,
                    })),
                  index,
                );

                setSelectedIds([]);
                setLastSelectedIndex(null);
              }}
            />
          )}
        </div>
        <ExpressionLegend />
      </div>
    </div>
  );
}
