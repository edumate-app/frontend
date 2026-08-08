import { useEffect } from 'react';
import { toast } from 'sonner';
import {
  ImportTaskToast,
  type ImportTaskItem,
} from '@/features/dashboard/components/ImportTaskToast';
import { steps } from '../constants';
import { dashboardApi } from '../api/dashboard.api';
import type { ImportStatusResponse } from '../api/dashboard.types';

function stepLabel(step: string | undefined) {
  if (!step) return undefined;
  return steps.find((s) => s.match.includes(step as never))?.title;
}

export function showImportTaskToast(task: ImportTaskItem) {
  toast.custom((t) => <ImportTaskToast task={task} toastId={t} />, {
    id: task.id,
    duration: Infinity,
    position: 'top-right',
    unstyled: true,
    className: '!border-0 !bg-transparent !p-0 !shadow-none',
  });
}

function toTask(dto: ImportStatusResponse): ImportTaskItem {
  return {
    id: dto.jobId,
    title: dto.title?.trim() || 'Import filmu',
    status: dto.status,
    progress: dto.progress,
    stepLabel:
      dto.status === 'FAILED'
        ? (dto.error ?? 'Błąd importu')
        : stepLabel(dto.step),
  };
}

/**
 * UI-only: pokazuje mockowe toasty zadań importu.
 * setTimeout(0) — toast() musi pójść po subskrypcji Toastera (efekt dziecka
 * odpala się przed efektem rodzica, więc synchroniczne toast() ginie).
 */
export function useImportTasksToasts({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) {
  useEffect(() => {
    if (!enabled) {
      toast.dismiss();
      return;
    }
    const sources: EventSource[] = [];
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const { data: jobs } = await dashboardApi.listImportJobs();
          if (cancelled) return;

          const completedIds: string[] = [];

          for (const job of jobs) {
            showImportTaskToast(toTask(job));

            if (job.status === 'COMPLETED' || job.status === 'FAILED') {
              completedIds.push(job.jobId);
              continue;
            }

            const es = new EventSource(
              dashboardApi.importEventsUrl(job.jobId),
              { withCredentials: true },
            );
            sources.push(es);
            es.addEventListener('status', ((event: MessageEvent<string>) => {
              try {
                const data = JSON.parse(event.data) as ImportStatusResponse;
                showImportTaskToast(toTask(data));
                if (data.status === 'COMPLETED' || data.status === 'FAILED') {
                  es.close();
                  window.setTimeout(() => {
                    toast.dismiss(data.jobId);
                  }, 2000);
                }
              } catch {
                es.close();
              }
            }) as EventListener);
          }

          // Sonner dokłada na górę — ostatni w completedIds jest na wierzchu
          [...completedIds].reverse().forEach((id, i) => {
            window.setTimeout(
              () => {
                toast.dismiss(id);
              },
              2000 + i * 800,
            );
          });
        } catch {
          // brak listy jobów — UI milczy
        }
      })();
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      for (const es of sources) es.close();
    };
  }, [enabled]);
}
