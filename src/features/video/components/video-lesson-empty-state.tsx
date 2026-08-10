import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Film, Loader2 } from 'lucide-react';
import { languageLabel } from '@/features/library/utils/languageLabel';
import type { ImportHint } from '../api/video.types';

type VideoLessonEmptyStateProps = {
  error: string | null;
  importError: string | null;
  importHint: ImportHint | null;
  starting: boolean;
  handleImport: (videoId: string, lang: string) => void;
};

export function VideoLessonEmptyState({
  error,
  importError,
  importHint,
  starting,
  handleImport,
}: VideoLessonEmptyStateProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <Film className="h-10 w-10 text-muted-foreground/30" />
          <div className="space-y-2">
            <h1 className="font-display text-lg font-semibold tracking-tight">
              Nie udało się otworzyć lekcji
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {error}
            </p>
          </div>
        </div>

        {importHint ? (
          <p className="rounded-md bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
            Dostępny język materiału:{' '}
            <span className="font-medium text-foreground">
              {languageLabel(importHint.lang)}
            </span>
          </p>
        ) : null}

        {importError ? (
          <p className="text-sm text-destructive">{importError}</p>
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-2">
          {importHint ? (
            <Button
              disabled={starting}
              onClick={() => handleImport(importHint.videoId, importHint.lang)}
            >
              {starting ? <Loader2 className="animate-spin" /> : null}
              {starting
                ? 'Uruchamianie importu…'
                : `Zaimportuj film · ${languageLabel(importHint.lang)}`}
            </Button>
          ) : (
            <Button asChild>
              <Link to="/app/videos/new">Zaimportuj materiał</Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link to="/app/videos">Wróć do filmów</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
