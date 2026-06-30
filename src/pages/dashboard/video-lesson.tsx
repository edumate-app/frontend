import { useEffect, useMemo, useRef, useState } from "react";
import type { TranscriptSegment } from "@/features/dashboard/api/dashboard.types";
import { useYouTubePlayer } from "@/features/dashboard/hooks/useYouTubePlayer";
import { getActiveSegmentIndex } from "@/features/dashboard/utils/transcript";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2 } from "lucide-react";

const VIDEO_ID = "MAydh43X4RQ";

const transcript: TranscriptSegment[] = [
  {
    start: 0,
    duration: 4.2,
    nativeText: "We're no strangers to love.",
    targetText: "Nie jesteśmy obcy miłości.",
  },
  {
    start: 4.2,
    duration: 3.8,
    nativeText: "You know the rules and so do I.",
    targetText: "Znasz zasady i ja też.",
  },
  {
    start: 8,
    duration: 4.5,
    nativeText: "A full commitment's what I'm thinking of.",
    targetText: "Myślę o pełnym zaangażowaniu.",
  },
  {
    start: 12.5,
    duration: 3.9,
    nativeText: "You wouldn't get this from any other guy.",
    targetText: "Tego nie dostaniesz od żadnego innego faceta.",
  },
  {
    start: 16.4,
    duration: 4.1,
    nativeText: "I just wanna tell you how I'm feeling.",
    targetText: "Chcę ci tylko powiedzieć, co czuję.",
  },
  {
    start: 20.5,
    duration: 3.2,
    nativeText: "Gotta make you understand.",
    targetText: "Muszę sprawić, żebyś zrozumiała.",
  },
  {
    start: 23.7,
    duration: 4.8,
    nativeText: "Never gonna give you up, never gonna let you down.",
    targetText: "Nigdy cię nie opuszczę, nigdy cię nie zawiodę.",
  },
  {
    start: 28.5,
    duration: 4.6,
    nativeText: "Never gonna run around and desert you.",
    targetText: "Nigdy nie będę biegał i cię nie porzucę.",
  },
  {
    start: 33.1,
    duration: 4.4,
    nativeText: "Never gonna make you cry, never gonna say goodbye.",
    targetText: "Nigdy nie sprawię, że zapłaczesz, nigdy nie powiem żegnaj.",
  },
  {
    start: 37.5,
    duration: 4.7,
    nativeText: "Never gonna tell a lie and hurt you.",
    targetText: "Nigdy nie skłamię i nie zranię cię.",
  },
  {
    start: 42.2,
    duration: 4.3,
    nativeText: "We've known each other for so long.",
    targetText: "Znamy się tak długo.",
  },
  {
    start: 46.5,
    duration: 4.9,
    nativeText: "Your heart's been aching, but you're too shy to say it.",
    targetText:
      "Twoje serce bolało, ale jesteś zbyt nieśmiała, by to powiedzieć.",
  },
  {
    start: 51.4,
    duration: 4.2,
    nativeText: "Inside we both know what's been going on.",
    targetText: "W środku oboje wiemy, co się dzieje.",
  },
  {
    start: 55.6,
    duration: 4.5,
    nativeText: "We know the game and we're gonna play it.",
    targetText: "Znamy grę i zamierzamy w nią grać.",
  },
  {
    start: 60.1,
    duration: 4.0,
    nativeText: "And if you ask me how I'm feeling.",
    targetText: "A jeśli zapytasz mnie, co czuję.",
  },
  {
    start: 64.1,
    duration: 3.5,
    nativeText: "Don't tell me you're too blind to see.",
    targetText: "Nie mów mi, że jesteś zbyt ślepa, by to zobaczyć.",
  },
];

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

function FullscreenView({
  onExit,
  videoSlotRef,
  transcriptProps,
}: {
  onExit: () => void;
  videoSlotRef: React.RefObject<HTMLDivElement | null>;
  transcriptProps: TranscriptListProps;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onExit]);

  return (
    <div className="fixed inset-0 z-50 flex bg-black">
      <div
        ref={videoSlotRef}
        className="flex min-w-0 flex-1 items-center justify-center p-4"
      />
      <div className="flex w-72 shrink-0 flex-col border-l border-white/10 xl:w-80">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <h2 className="font-display text-base font-semibold text-white">
            Transkrypcja
          </h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onExit}
            className="shrink-0 gap-1.5 border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <Minimize2 className="h-3.5 w-3.5" /> Wyjdź
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin [&_button:hover]:bg-white/5 [&_.bg-primary\/10]:bg-white/10 [&_p]:text-white/90 [&_.text-muted-foreground]:text-white/40">
          <TranscriptList {...transcriptProps} />
        </div>
      </div>
    </div>
  );
}

function NormalView({
  onEnterFullscreen,
  videoSlotRef,
  transcriptProps,
}: {
  onEnterFullscreen: () => void;
  videoSlotRef: React.RefObject<HTMLDivElement | null>;
  transcriptProps: TranscriptListProps;
}) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-0 lg:flex-row lg:min-h-[calc(100vh-7rem)]">
        {/* LEFT: video + analysis panel */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Video */}
          <div className="group relative overflow-hidden">
            <div ref={videoSlotRef} className="aspect-video w-full bg-black" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onEnterFullscreen}
              className="absolute right-3 top-3 z-10 h-8 gap-1.5 bg-black/60 px-2.5 text-white backdrop-blur-sm hover:bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Maximize2 className="h-3.5 w-3.5" /> Pełny ekran
            </Button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-2 border-t bg-canvas px-6 py-10 text-center">
            <p className="text-base font-medium text-foreground">
              Wybierz zdanie z transkrypcji
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Kliknij dowolną linię po prawej, aby zobaczyć pełną analizę
              gramatyczną i słownikową każdego słowa.
            </p>
          </div>
        </div>

        {/* RIGHT: transcript sidebar */}
        <div className="flex w-full shrink-0 flex-col border-l lg:w-80 xl:w-96 lg:max-h-[calc(100vh-4rem)]">
          <div className="shrink-0 border-b px-4 py-3">
            <h2 className="font-display text-base font-semibold">
              Transkrypcja
            </h2>
            {/* <p className="text-xs text-muted-foreground">
              {
                ? `Analizujesz: ${formatTime(transcript[selectedIndex].start)}`
                : "Kliknij zdanie, aby je przeanalizować."}
            </p> */}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
            <TranscriptList {...transcriptProps} />
          </div>

          {/* Vocabulary counter */}
          {/* <div className="shrink-0 border-t px-4 py-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Słowa do zapamiętania</span>
              <span className="font-medium text-foreground">14%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${Math.min((15 / 30) * 100, 100)}%`,
                }}
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
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
                "w-full px-4 py-3 text-left transition-colors hover:bg-muted/40",
                isActive && "bg-primary/10",
              )}
            >
              <span
                className={cn(
                  "font-mono text-2xs",
                  isActive
                    ? "font-medium text-primary"
                    : "text-muted-foreground",
                )}
              >
                {formatTime(segment.start)}
              </span>
              <p
                className={cn(
                  "mt-1 text-sm leading-snug",
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
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function VideoLessonPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoSlotRef = useRef<HTMLDivElement>(null);

  const { currentTime, seekTo } = useYouTubePlayer(
    playerContainerRef,
    VIDEO_ID,
  );

  const activeIndex = useMemo(
    () => getActiveSegmentIndex(transcript, currentTime),
    [currentTime],
  );

  const transcriptProps: TranscriptListProps = {
    segments: transcript,
    activeIndex,
    onSegmentClick: (segment) => seekTo(segment.start),
  };

  useEffect(() => {
    let raf: number;

    function sync() {
      const slot = videoSlotRef.current;
      const player = playerContainerRef.current;
      if (slot && player) {
        const r = slot.getBoundingClientRect();
        player.style.position = "fixed";
        player.style.top = `${r.top}px`;
        player.style.left = `${r.left}px`;
        player.style.width = `${r.width}px`;
        player.style.height = `${r.height}px`;
        player.style.zIndex = isFullscreen ? "51" : "1";
      }
      raf = requestAnimationFrame(sync);
    }

    raf = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(raf);
  }, [isFullscreen]);

  return (
    <>
      <div
        ref={playerContainerRef}
        className="overflow-hidden bg-black [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
        }}
      />

      {isFullscreen ? (
        <FullscreenView
          onExit={() => setIsFullscreen(false)}
          videoSlotRef={videoSlotRef}
          transcriptProps={transcriptProps}
        />
      ) : (
        <NormalView
          onEnterFullscreen={() => setIsFullscreen(true)}
          videoSlotRef={videoSlotRef}
          transcriptProps={transcriptProps}
        />
      )}
    </>
  );
}
