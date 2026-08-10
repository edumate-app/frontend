import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/app/layouts/dashboard/components/page-header';
import {
  VideosList,
  type VideosView,
} from '@/features/dashboard/components/videos-list';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { cn } from '@/lib/utils';

export default function MyVideosPage() {
  const { videos, isLoading, error, removeVideo } = useDashboard();
  const [view, setView] = useState<VideosView>('list');

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <PageHeader
        title="Moje filmy"
        description="Wszystkie zaimportowane materiały do nauki."
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Moje filmy' }]}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md border border-border p-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8',
                  view === 'list' && 'bg-secondary text-foreground',
                )}
                aria-label="Widok listy"
                aria-pressed={view === 'list'}
                onClick={() => setView('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8',
                  view === 'grid' && 'bg-secondary text-foreground',
                )}
                aria-label="Widok kratki"
                aria-pressed={view === 'grid'}
                onClick={() => setView('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <Button asChild>
              <Link to="/app/videos/new">
                <Plus className="h-4 w-4" /> Dodaj nowy film
              </Link>
            </Button>
          </div>
        }
      />

      {view === 'list' ? (
        <Card className="overflow-hidden">
          <VideosList
            videos={videos}
            isLoading={isLoading}
            error={error}
            onRemove={removeVideo}
            view="list"
          />
        </Card>
      ) : (
        <VideosList
          videos={videos}
          isLoading={isLoading}
          error={error}
          onRemove={removeVideo}
          view="grid"
        />
      )}
    </div>
  );
}
