import {
  isVerbWord,
  type SentenceAnalysisWord,
} from '@/features/dashboard/types/sentence-analysis.types';
import { STANZA_POS_POLISH_LABELS } from '@/features/dashboard/types/stanza-pos.types';
import { cn } from '@/lib/utils';

type ExpressionWordDetailsProps = {
  word: SentenceAnalysisWord;
  className?: string;
  size?: 'sm' | 'md';
};

export function ExpressionWordDetails({
  word,
  className,
  size = 'sm',
}: ExpressionWordDetailsProps) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <dl className={cn('space-y-1', textSize, className)}>
      <div className="flex gap-2">
        <dt className="shrink-0 text-muted-foreground">Tłumaczenie:</dt>
        <dd className="text-foreground">{word.translation}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="shrink-0 text-muted-foreground">
          {isVerbWord(word) ? 'Lemat (bezokolicznik):' : 'Lemat:'}
        </dt>
        <dd className="text-foreground">
          <span className="font-mono">{word.lemma}</span>
          {' — '}
          {word.lemmaTranslation}
        </dd>
      </div>
      <div className="flex gap-2">
        <dt className="shrink-0 text-muted-foreground">Część mowy:</dt>
        <dd className="text-foreground">
          {STANZA_POS_POLISH_LABELS[word.pos]}
        </dd>
      </div>
      <div className="flex gap-2">
        <dt className="shrink-0 text-muted-foreground">Forma:</dt>
        <dd className="text-foreground">{word.form}</dd>
      </div>
      {word.tense && (
        <div className="flex gap-2">
          <dt className="shrink-0 text-muted-foreground">Czas:</dt>
          <dd className="text-foreground">{word.tense}</dd>
        </div>
      )}
      {isVerbWord(word) && word.conjugation ? (
        <div>
          <dt className="text-muted-foreground">
            Odmiana (tryb oznajmujący, czas teraźniejszy):
          </dt>
          <dd className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5">
            {word.conjugation.map((entry) => {
              const isActivePerson = entry.person === word.conjugationPerson;

              return (
                <p key={entry.person} className="font-mono text-foreground">
                  <span
                    className={cn(
                      isActivePerson &&
                        'font-semibold underline decoration-2 underline-offset-2',
                    )}
                  >
                    {entry.person}
                  </span>{' '}
                  {entry.form}
                </p>
              );
            })}
          </dd>
        </div>
      ) : (
        word.family &&
        word.family.length > 1 && (
          <div>
            <dt className="text-muted-foreground">Rodzina:</dt>
            <dd className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5">
              {word.family.map((familyWord) => (
                <p key={familyWord} className="font-mono text-foreground">
                  {familyWord}
                </p>
              ))}
            </dd>
          </div>
        )
      )}
    </dl>
  );
}
