import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { TranscriptSegment } from "@/features/dashboard/api/dashboard.types";
import { useYouTubePlayer } from "@/features/dashboard/hooks/useYouTubePlayer";
import { useSaveWatchPosition } from "@/features/dashboard/hooks/useSaveWatchPosition";
import { getActiveSegmentIndex } from "@/features/dashboard/utils/transcript";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Maximize2, Minimize2 } from "lucide-react";
import { useGetTranscript } from "@/features/dashboard/hooks/useGetTranscript";
import { SentenceAnalysisPanel } from "@/features/dashboard/components/sentence-analysis-panel";
import {
  LessonLoadingPanel,
  TranscriptLoadingSkeleton,
} from "@/features/dashboard/components/video-lesson-loading";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type TranscriptListProps = {
  segments: TranscriptSegment[];
  activeIndex: number;
  onSegmentClick: (segment: TranscriptSegment) => void;
};

type TranscriptPanelProps = {
  isLoading: boolean;
  error: string | null;
  transcriptProps: TranscriptListProps;
  errorClassName?: string;
};

function TranscriptPanel({
  isLoading,
  error,
  transcriptProps,
  errorClassName = "text-destructive",
  isFullscreen = false,
}: TranscriptPanelProps & { isFullscreen?: boolean }) {
  if (isLoading) {
    return <TranscriptLoadingSkeleton isFullscreen={isFullscreen} />;
  }

  if (error) {
    return <div className={cn("p-4 text-sm", errorClassName)}>{error}</div>;
  }

  return <TranscriptList {...transcriptProps} />;
}

function TranscriptList({
  segments,
  activeIndex,
  onSegmentClick,
}: TranscriptListProps) {
  const activeItemRef = useRef<HTMLLIElement>(null);
  const prevActiveIndexRef = useRef(activeIndex);

  useEffect(() => {
    if (activeIndex < 0 || activeIndex === prevActiveIndexRef.current) return;
    prevActiveIndexRef.current = activeIndex;
    activeItemRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [activeIndex]);

  return (
    <ul className="divide-y">
      {segments.map((segment, index) => {
        const isActive = index === activeIndex;

        return (
          <li
            key={`${segment.start}-${index}`}
            ref={isActive ? activeItemRef : undefined}
          >
            <button
              type="button"
              onClick={() => onSegmentClick(segment)}
              className={cn(
                "flex w-full gap-3 px-4 pl-2 py-3 text-left transition-colors hover:bg-muted/40",
                isActive && "bg-primary/10",
              )}
            >
              <div className="flex shrink-0 items-start gap-2 pt-0.5 font-mono text-2xs tabular-nums">
                <span
                  className={cn(
                    "w-4 text-right",
                    isActive
                      ? "text-primary/60"
                      : "text-muted-foreground/50",
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    "w-9",
                    isActive
                      ? "font-medium text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {formatTime(segment.start)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm leading-snug",
                    isActive ? "font-semibold text-foreground" : "font-medium",
                  )}
                >
                  {segment.nativeText}
                </p>
                <p
                  className={cn(
                    "mt-1 text-sm leading-snug",
                    isActive ? "text-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {segment.targetText}
                </p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function VideoLessonPage() {
  const { video_uuid } = useParams<{ video_uuid: string }>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const hasSeekedToSavedPosition = useRef(false);

  const { segments, videoId, lastPositionSeconds, isLoading, error } =
    useGetTranscript();

  const { currentTime, seekTo, isReady } = useYouTubePlayer(
    playerContainerRef,
    videoId ?? "",
  );

  useEffect(() => {
    hasSeekedToSavedPosition.current = false;
  }, [video_uuid]);

  useEffect(() => {
    if (
      !isReady ||
      hasSeekedToSavedPosition.current ||
      lastPositionSeconds <= 0
    ) {
      return;
    }

    hasSeekedToSavedPosition.current = true;
    seekTo(lastPositionSeconds);
  }, [isReady, lastPositionSeconds, seekTo]);

  useSaveWatchPosition(video_uuid, currentTime);

  const activeIndex = useMemo(
    () => getActiveSegmentIndex(segments, currentTime),
    [currentTime, segments],
  );

  const transcriptProps: TranscriptListProps = {
    segments,
    activeIndex,
    onSegmentClick: (segment) => seekTo(segment.start),
  };

  const isPlayerLoading = isLoading || Boolean(videoId && !isReady);

  const transcriptPanelProps: TranscriptPanelProps = {
    isLoading,
    error,
    transcriptProps,
  };

  useEffect(() => {
    if (!isFullscreen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreen]);

  return (
    <div
      className={cn(
        isFullscreen
          ? "fixed inset-0 z-50 flex bg-black"
          : "flex h-full min-h-0 w-full flex-col",
      )}
    >
      <div
        className={cn(
          "flex min-h-0 min-w-0",
          isFullscreen ? "flex-1" : "h-full flex-col lg:flex-row",
        )}
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div
            className={cn(
              "group relative min-h-0 overflow-hidden bg-black",
              isFullscreen
                ? "flex flex-1 items-center justify-center p-4"
                : "min-h-0 flex-1",
            )}
          >
            <div
              ref={playerContainerRef}
              className={cn(
                "overflow-hidden [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0",
                isFullscreen
                  ? "aspect-video max-h-full w-full"
                  : "h-full w-full",
              )}
            />
            {isPlayerLoading && (
              <div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black px-6 text-center"
                role="status"
                aria-live="polite"
              >
                <Loader2 className="h-8 w-8 animate-spin text-white/70" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">
                    Przygotowujemy lekcję
                  </p>
                  <p className="max-w-xs text-xs text-white/60">
                    Pobieramy transkrypcję i ładujemy odtwarzacz — to może
                    potrwać kilka sekund.
                  </p>
                </div>
              </div>
            )}
            {!isFullscreen && (
              <>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsFullscreen(true)}
                  className="absolute right-3 top-3 z-10 h-8 gap-1.5 bg-black/60 px-2.5 text-white backdrop-blur-sm hover:bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Maximize2 className="h-3.5 w-3.5" /> Pełny ekran
                </Button>
              </>
            )}
          </div>

          {!isFullscreen &&
            (isLoading ? <LessonLoadingPanel /> : <SentenceAnalysisPanel />)}
        </div>

        <div
          className={cn(
            "flex min-h-0 w-full shrink-0 flex-col border-l",
            isFullscreen
              ? "w-72 border-white/10 xl:w-80"
              : "min-h-48 flex-1 border-t lg:h-full lg:max-h-none lg:flex-none lg:border-t-0 lg:w-80 xl:w-96",
          )}
        >
          {isFullscreen && (
            <>
              <div
                className={cn(
                  "flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3",
                  isFullscreen && "border-white/10",
                )}
              >
                <h2
                  className={cn(
                    "font-display text-base font-semibold",
                    isFullscreen && "text-white",
                  )}
                >
                  Transkrypcja
                </h2>
                {isFullscreen && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsFullscreen(false)}
                    className="shrink-0 gap-1.5 border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Minimize2 className="h-3.5 w-3.5" /> Wyjdź
                  </Button>
                )}
              </div>
            </>
          )}
          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto scrollbar-thin",
              isFullscreen &&
                "[&_button:hover]:bg-white/5 [&_.bg-primary\\/10]:bg-white/10 [&_p]:text-white/90 [&_.text-muted-foreground]:text-white/40",
            )}
          >
            <TranscriptPanel
              {...transcriptPanelProps}
              isFullscreen={isFullscreen}
              errorClassName={
                isFullscreen ? "text-red-400" : "text-destructive"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
