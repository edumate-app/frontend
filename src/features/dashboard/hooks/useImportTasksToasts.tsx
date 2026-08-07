import { useEffect } from 'react';
import { toast } from 'sonner';
import {
  ImportTaskToast,
  type ImportTaskItem,
} from '@/features/dashboard/components/ImportTaskToast';

/** Mock — podmienić na dane z API. */
const MOCK_TASKS: ImportTaskItem[] = [
  {
    id: '1',
    title: 'How to Learn Any Language in 6 Months',
    status: 'RUNNING',
    progress: 62,
    stepLabel: 'Tłumaczymy i wyjaśniamy',
  },
  {
    id: '2',
    title: 'Spanish Conversation Practice',
    status: 'RUNNING',
    progress: 28,
    stepLabel: 'Pobieramy transkrypcję',
  },
  {
    id: '3',
    title: 'German Grammar Basics',
    status: 'PENDING',
    progress: 0,
    stepLabel: 'W kolejce',
  },
  {
    id: '4',
    title: 'French Pronunciation Guide',
    status: 'COMPLETED',
    progress: 100,
  },
  {
    id: '5',
    title: 'Italian for Beginners',
    status: 'FAILED',
    progress: 45,
    stepLabel: 'Brak napisów',
  },
];

function toastIdFor(taskId: string) {
  return `import-task-${taskId}`;
}

export function showImportTaskToast(task: ImportTaskItem) {
  const id = toastIdFor(task.id);
  toast.custom((t) => <ImportTaskToast task={task} toastId={t} />, {
    id,
    duration: Infinity,
    position: 'top-right',
    unstyled: true,
    className: '!border-0 !bg-transparent !p-0 !shadow-none',
  });
}

/**
 * UI-only: pokazuje mockowe toasty zadań importu.
 * setTimeout(0) — toast() musi pójść po subskrypcji Toastera (efekt dziecka
 * odpala się przed efektem rodzica, więc synchroniczne toast() ginie).
 */
export function useImportTasksToasts({
  tasks = MOCK_TASKS,
  enabled = true,
}: {
  tasks?: ImportTaskItem[];
  enabled?: boolean;
} = {}) {
  useEffect(() => {
    if (!enabled) {
      for (const task of tasks) {
        toast.dismiss(`import-task-${task.id}`);
      }
      return;
    }

    const timer = window.setTimeout(() => {
      for (const task of tasks) {
        showImportTaskToast(task);
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      // for (const task of tasks) {
      //   toast.dismiss(`import-task-${task.id}`);
      // }
    };
  }, [tasks, enabled]);
}
