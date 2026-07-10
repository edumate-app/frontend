import { cn } from '@/lib/utils';

export function TranscriptLoadingSkeleton({
  isFullscreen = false,
}: {
  isFullscreen?: boolean;
}) {
  return (
    <div className="divide-y">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-2 px-4 py-3">
          <div
            className={cn(
              'skeleton h-3 w-10 rounded',
              isFullscreen && 'bg-white/10',
            )}
          />
          <div
            className={cn(
              'skeleton h-4 w-full rounded',
              isFullscreen && 'bg-white/10',
            )}
          />
          <div
            className={cn(
              'skeleton h-4 w-4/5 rounded',
              isFullscreen && 'bg-white/10',
            )}
          />
        </div>
      ))}
    </div>
  );
}

export function LessonLoadingPanel() {
  return (
    <div className="flex shrink-0 flex-col justify-center gap-4 border-t bg-canvas px-6 py-6">
      <div className="mx-auto w-full max-w-md space-y-3">
        <div className="skeleton mx-auto h-5 w-56 rounded" />
        <div className="skeleton mx-auto h-4 w-full max-w-sm rounded" />
        <div className="skeleton mx-auto h-4 w-4/5 max-w-xs rounded" />
      </div>
    </div>
  );
}
