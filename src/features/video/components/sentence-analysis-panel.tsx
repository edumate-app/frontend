import { useId, useState } from 'react';
import {
  type SentenceAnalysis,
  type SentenceAnalysisWord,
} from '@/features/dashboard/types/sentence-analysis.types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ExpressionWordDetails } from './expression-word-details';
import type { SentenceAnalysisStatus } from '../hooks/useSentenceAnalysis';
import { Loader2, Pin, PinOff } from 'lucide-react';

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
  isActive,
  onHover,
  onLeave,
  onClick,
}: {
  token: SentenceAnalysisWord;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  return (
    <span className="relative inline">
      <button
        type="button"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onClick}
        aria-expanded={isActive}
        className={cn(
          'cursor-pointer rounded-sm px-0.5 transition-colors',
          'hover:bg-muted/70 focus-visible:outline-none focus-visible:shadow-focus',
          isActive && 'bg-muted ring-1 ring-ring/30',
          token.userStatus === 'familiar' &&
            'bg-blue-100/90 text-blue-900 hover:bg-blue-200/80',
          token.userStatus === 'unknown' &&
            'bg-emerald-100/90 text-emerald-900 hover:bg-emerald-200/80',
        )}
      >
        {token.text}
      </button>
      {isActive && <WordDetailCard token={token} />}
    </span>
  );
}

function ExpressionLegend() {
  return (
    <aside className="flex shrink-0 flex-col gap-3 border-l pl-4 text-xs text-muted-foreground">
      <p className="font-semibold uppercase tracking-wide text-2xs">Legenda</p>
      <span className="flex items-start gap-2">
        <span className="mt-0.5 inline-block h-3 w-5 shrink-0 rounded-sm bg-emerald-100 ring-1 ring-emerald-200/80" />
        <span>
          <span className="block font-medium text-foreground">
            Nowe w bibliotece
          </span>
          Dopiero dodane wyrażenie
        </span>
      </span>
      <span className="flex items-start gap-2">
        <span className="mt-0.5 inline-block h-3 w-5 shrink-0 rounded-sm bg-blue-100 ring-1 ring-blue-200/80" />
        <span>
          <span className="block font-medium text-foreground">Znane (5+)</span>
          Spotkane wielokrotnie w materiałach
        </span>
      </span>
    </aside>
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

  const activeId = pinnedId ?? hoveredId;

  if (!analysis) {
    return null;
  }

  const { startSeconds, targetTranslation, words } = analysis;

  return (
    <div className="flex shrink-0 flex-col border-t bg-canvas">
      <div className="px-6 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
                Analiza zdania
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

      <div className="flex items-start gap-6 px-6 py-5 pt-0">
        <div className="min-w-0 flex-1">
          <p className="text-center text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
            {words.map((token, index) => (
              <span key={token.id}>
                <WordBlock
                  token={token}
                  isActive={activeId === token.id}
                  onHover={() => setHoveredId(token.id)}
                  onLeave={() => setHoveredId(null)}
                  onClick={() =>
                    setPinnedId((current) =>
                      current === token.id ? null : token.id,
                    )
                  }
                />
                {index < words.length - 1 && ' '}
              </span>
            ))}
          </p>
          <p className="mt-3 text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            {targetTranslation}
          </p>
        </div>

        <ExpressionLegend />
      </div>
    </div>
  );
}
