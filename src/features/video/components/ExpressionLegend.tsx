import { cn } from '@/lib/utils';

function LegendSwatch({ className }: { className: string }) {
  return (
    <span
      className={cn(
        'mt-0.5 inline-block h-2.5 w-3.5 shrink-0 rounded-sm ring-1',
        className,
      )}
    />
  );
}

export default function ExpressionLegend() {
  return (
    <aside className="flex shrink-0 flex-col gap-2 border-l px-2 text-2xs text-muted-foreground">
      <p className="font-semibold uppercase tracking-wide">Legenda</p>

      <span className="flex items-start gap-1.5">
        <LegendSwatch className="bg-muted ring-ring/30" />
        <span>
          <span className="block font-medium text-foreground">Podgląd</span>
          Hover lub klik — szczegóły analizy
        </span>
      </span>

      <span className="flex items-start gap-1.5">
        <LegendSwatch className="bg-amber-100 ring-amber-400/70" />
        <span>
          <span className="block font-medium text-foreground">Zaznaczone</span>
          Ctrl+klik, Shift = zakres
        </span>
      </span>

      <span className="flex items-start gap-1.5">
        <LegendSwatch className="bg-emerald-100/90 ring-emerald-200/80" />
        <span>
          <span className="block font-medium text-foreground">
            Nowe w bibliotece
          </span>
          Dopiero dodane wyrażenie
        </span>
      </span>

      <span className="flex items-start gap-1.5">
        <LegendSwatch className="bg-blue-100/90 ring-blue-200/80" />
        <span>
          <span className="block font-medium text-foreground">Znane (5+)</span>
          Spotkane wielokrotnie
        </span>
      </span>
    </aside>
  );
}
