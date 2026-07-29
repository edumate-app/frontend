import { STANZA_POS_POLISH_LABELS } from '@/features/dashboard/types/stanza-tags.types';
import type { LibraryExpression } from '@/features/library/types/expression-library.types';
import { cn } from '@/lib/utils';

type LibraryExpressionDetailsProps = {
  expression: LibraryExpression;
  className?: string;
  size?: 'sm' | 'md';
  layout?: 'stack' | 'split';
};

export function LibraryExpressionDetails({
  expression,
  className,
  size = 'sm',
  layout = 'stack',
}: LibraryExpressionDetailsProps) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const hasRightColumn =
    Boolean(expression.conjugation?.length) ||
    Boolean(expression.family && expression.family.length > 1);

  const baseDetails = (
    <>
      <div className="flex gap-2">
        <dt className="shrink-0 text-muted-foreground">Tlumaczenie:</dt>
        <dd className="text-foreground">{expression.lemmaTranslation}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="shrink-0 text-muted-foreground">Lemat:</dt>
        <dd className="font-mono text-foreground">{expression.lemma}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="shrink-0 text-muted-foreground">Czesc mowy:</dt>
        <dd className="text-foreground">
          {STANZA_POS_POLISH_LABELS[expression.pos]}
        </dd>
      </div>
    </>
  );

  const extraDetails = expression.conjugation?.length ? (
    <>
      <dt className="text-muted-foreground">Odmiana:</dt>
      <dd className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5">
        {expression.conjugation.map((entry) => (
          <p key={entry.person} className="font-mono text-foreground">
            <span className="font-semibold">{entry.person}</span> {entry.form}
          </p>
        ))}
      </dd>
    </>
  ) : expression.family && expression.family.length > 1 ? (
    <>
      <dt className="text-muted-foreground">Rodzina:</dt>
      <dd className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5">
        {expression.family.map((familyWord) => (
          <p key={familyWord} className="font-mono text-foreground">
            {familyWord}
          </p>
        ))}
      </dd>
    </>
  ) : null;

  if (layout === 'split') {
    return (
      <div
        className={cn(
          'grid gap-4',
          hasRightColumn ? 'sm:grid-cols-2' : 'grid-cols-1',
          textSize,
          className,
        )}
      >
        <dl className="space-y-2">{baseDetails}</dl>
        {hasRightColumn && <dl className="space-y-1">{extraDetails}</dl>}
      </div>
    );
  }

  return (
    <dl className={cn('space-y-1', textSize, className)}>
      {baseDetails}
      {extraDetails && <div>{extraDetails}</div>}
    </dl>
  );
}
