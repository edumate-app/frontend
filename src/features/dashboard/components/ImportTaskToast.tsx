import { toast } from 'sonner';
import { Check, Loader2, X } from 'lucide-react';
import type { ImportJobStatus } from '@/features/dashboard/api/dashboard.types';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export type ImportTaskItem = {
  id: string;
  title: string;
  status: ImportJobStatus;
  progress: number;
  stepLabel?: string;
};

function statusMeta(status: ImportJobStatus) {
  switch (status) {
    case 'RUNNING':
      return {
        label: 'W toku',
        icon: Loader2,
        iconClass: 'animate-spin text-primary',
        progressClass: 'bg-primary',
      };
    case 'PENDING':
      return {
        label: 'Oczekuje',
        icon: Loader2,
        iconClass: 'text-muted-foreground',
        progressClass: 'bg-muted-foreground/40',
      };
    case 'COMPLETED':
      return {
        label: 'Gotowe',
        icon: Check,
        iconClass: 'text-primary',
        progressClass: 'bg-primary',
      };
    case 'FAILED':
      return {
        label: 'Błąd',
        icon: X,
        iconClass: 'text-destructive',
        progressClass: 'bg-destructive',
      };
  }
}

export function ImportTaskToast({
  task,
  toastId,
}: {
  task: ImportTaskItem;
  toastId: string | number;
}) {
  const meta = statusMeta(task.status);
  const Icon = meta.icon;
  const showPercent = task.status === 'RUNNING' || task.status === 'PENDING';

  return (
    <Link
      to={`/app/videos/import/${task.id}`}
      className="flex w-80 items-start gap-3 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md"
    >
      <Icon
        className={cn('mt-0.5 h-4 w-4 shrink-0', meta.iconClass)}
        aria-hidden
      />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{task.title}</p>
            {task.stepLabel ? (
              <p className="truncate text-xs text-muted-foreground">
                {task.stepLabel}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {showPercent ? (
              <span className="text-xs tabular-nums text-muted-foreground">
                {task.progress}%
              </span>
            ) : (
              <span
                className={cn(
                  'text-xs',
                  task.status === 'FAILED'
                    ? 'text-destructive'
                    : 'text-muted-foreground',
                )}
              >
                {meta.label}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.dismiss(toastId);
              }}
              className="text-muted-foreground/70 transition-colors hover:text-foreground"
              aria-label="Zamknij"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        {task.status !== 'COMPLETED' ? (
          <Progress
            value={task.progress}
            className="h-1"
            indicatorClassName={meta.progressClass}
          />
        ) : null}
      </div>
    </Link>
  );
}
