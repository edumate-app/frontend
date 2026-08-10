import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, MoreHorizontal, Play, Trash2 } from 'lucide-react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { timeAgo, formatDuration } from '@/features/dashboard/utils/time';
import type { VideoDto } from '@/features/dashboard/api/dashboard.types';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getYouTubeThumbnailUrl } from '@/features/video/utils/youtube';

export type VideosView = 'list' | 'grid';

type VideosListProps = {
  videos: VideoDto[];
  isLoading: boolean;
  error: string | null;
  onRemove: (uuid: string) => void;
  view?: VideosView;
};

function progressPercent(video: VideoDto) {
  if (!video.duration) return 0;
  return Math.round((video.lastPositionSeconds / video.duration) * 100);
}

function VideoActionsMenu({
  video,
  onDelete,
}: {
  video: VideoDto;
  onDelete: () => void;
}) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem
          onSelect={() => navigate(`/app/videos/${video.uuid}`)}
        >
          <Play className="h-4 w-4" /> Otwórz
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => window.open(`/app/videos/${video.uuid}`, '_blank')}
        >
          <ExternalLink className="h-4 w-4" /> Otwórz w nowej karcie
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={onDelete}
        >
          <Trash2 className="h-4 w-4" /> Usuń
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function VideoListRow({
  video,
  onDelete,
}: {
  video: VideoDto;
  onDelete: () => void;
}) {
  const percent = progressPercent(video);

  return (
    <Link
      to={`/app/videos/${video.uuid}`}
      className="flex items-center gap-4 px-4 py-3 hover:bg-surface-hover transition-colors"
    >
      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md">
        <img
          src={getYouTubeThumbnailUrl(video.videoId)}
          alt={video.title}
          className="h-full w-full object-cover"
        />
        <Play className="absolute inset-0 m-auto h-4 w-4 fill-white text-white drop-shadow" />
        <span className="absolute bottom-0.5 right-0.5 rounded bg-black/75 px-1 py-px text-[10px] font-medium leading-tight text-white">
          {formatDuration(video.duration)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{video.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {video.author} · {video.targetLang.toUpperCase()}
        </p>
      </div>
      <div className="hidden w-40 items-center gap-2 sm:flex">
        <Progress value={percent} className="h-1.5" />
        <span className="w-9 shrink-0 text-right text-xs text-muted-foreground">
          {percent}%
        </span>
      </div>
      <span className="hidden w-28 shrink-0 text-right text-2xs text-muted-foreground md:block">
        {timeAgo(video.lastOpenedAt)}
      </span>
      <VideoActionsMenu video={video} onDelete={onDelete} />
    </Link>
  );
}

function VideoGridCard({
  video,
  onDelete,
}: {
  video: VideoDto;
  onDelete: () => void;
}) {
  const percent = progressPercent(video);

  return (
    <Card className="overflow-hidden p-0">
      <Link to={`/app/videos/${video.uuid}`} className="group block">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={getYouTubeThumbnailUrl(video.videoId)}
            alt={video.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
          <Play className="absolute inset-0 m-auto h-8 w-8 fill-white text-white drop-shadow opacity-90" />
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium leading-tight text-white">
            {formatDuration(video.duration)}
          </span>
        </div>
      </Link>
      <div className="flex items-start gap-2 p-3">
        <Link to={`/app/videos/${video.uuid}`} className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium leading-snug">
            {video.title}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {video.author} · {video.targetLang.toUpperCase()}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Progress value={percent} className="h-1.5 flex-1" />
            <span className="shrink-0 text-2xs text-muted-foreground">
              {percent}%
            </span>
          </div>
          <p className="mt-1.5 text-2xs text-muted-foreground">
            {timeAgo(video.lastOpenedAt)}
          </p>
        </Link>
        <VideoActionsMenu video={video} onDelete={onDelete} />
      </div>
    </Card>
  );
}

export function VideosList({
  videos,
  isLoading,
  error,
  onRemove,
  view = 'list',
}: VideosListProps) {
  const [videoToDelete, setVideoToDelete] = useState<VideoDto | null>(null);

  if (isLoading) {
    return <p className="p-4 text-sm text-muted-foreground">Ładowanie...</p>;
  }

  if (error) {
    return <p className="p-4 text-sm text-destructive">{error}</p>;
  }

  if (videos.length === 0) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        Nie masz jeszcze żadnych filmów.
      </p>
    );
  }

  return (
    <>
      <div
        className={cn(
          view === 'grid'
            ? 'grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3'
            : 'divide-y divide-border',
        )}
      >
        {videos.map((video) =>
          view === 'grid' ? (
            <VideoGridCard
              key={video.uuid}
              video={video}
              onDelete={() => setVideoToDelete(video)}
            />
          ) : (
            <VideoListRow
              key={video.uuid}
              video={video}
              onDelete={() => setVideoToDelete(video)}
            />
          ),
        )}
      </div>

      <ConfirmDeleteDialog
        open={videoToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setVideoToDelete(null);
        }}
        title="Usunąć film?"
        description={
          videoToDelete
            ? `Film „${videoToDelete.title}” zostanie trwale usunięty. Tej operacji nie można cofnąć.`
            : ''
        }
        confirmLabel="Usuń film"
        onConfirm={() => {
          if (!videoToDelete) return;
          onRemove(videoToDelete.uuid);
          setVideoToDelete(null);
        }}
      />
    </>
  );
}
