import { Button } from '@/components/ui/button';
import { BookmarkPlus, X } from 'lucide-react';

function selectionLabel(count: number) {
  if (count === 1) return '1 zaznaczone słowo';
  if (count >= 2 && count <= 4) return `${count} zaznaczone słowa`;
  return `${count} zaznaczonych słów`;
}

export default function SelectionBar({
  count,
  onClear,
  onSubmit,
}: {
  count: number;
  onClear: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-3 border-t border-amber-200/80 bg-amber-50/80 px-6 py-2.5">
      <p className="text-sm font-medium tabular-nums text-amber-950">
        {selectionLabel(count)}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onClear}
          className="h-8 gap-1.5 px-2.5 text-xs text-amber-950 hover:bg-amber-100 hover:text-amber-950"
        >
          <X className="h-3.5 w-3.5" />
          Wyczyść
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onSubmit}
          className="h-8 gap-1.5 px-2.5 text-xs"
        >
          <BookmarkPlus className="h-3.5 w-3.5" />
          Zapisz do biblioteki
        </Button>
      </div>
    </div>
  );
}
