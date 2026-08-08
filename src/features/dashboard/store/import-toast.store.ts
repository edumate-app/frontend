import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ImportToastState = {
  dismissedJobIds: string[];
  dismiss: (jobId: string) => void;
  isDismissed: (jobId: string) => boolean;
};

export const useImportToastStore = create<ImportToastState>()(
  persist(
    (set, get) => ({
      dismissedJobIds: [],
      dismiss: (jobId) =>
        set((s) =>
          s.dismissedJobIds.includes(jobId)
            ? s
            : { dismissedJobIds: [...s.dismissedJobIds, jobId] },
        ),
      isDismissed: (jobId) => get().dismissedJobIds.includes(jobId),
    }),
    {
      name: 'import-toast-dismissed',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
