import { useId, useState } from 'react';
import { MOCK_SENTENCE_ANALYSIS } from '@/features/dashboard/mocks/sentence-analysis.mock';
import { ExpressionWordDetails } from '@/features/dashboard/components/expression-word-details';
import {
  type SentenceAnalysis,
  type SentenceAnalysisWord,
} from '@/features/dashboard/types/sentence-analysis.types';
import { cn } from '@/lib/utils';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

type SentenceAnalysisPanelProps = {
  analysis?: SentenceAnalysis | null;
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
  analysis = MOCK_SENTENCE_ANALYSIS,
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
        <p className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
          Analiza zdania
        </p>
        <p className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
          {formatTime(startSeconds)}
        </p>
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
