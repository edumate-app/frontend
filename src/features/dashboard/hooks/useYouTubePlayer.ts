import { useCallback, useEffect, useRef, useState } from "react";

let apiReadyPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (apiReadyPromise) return apiReadyPromise;

  apiReadyPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    if (!document.querySelector('script[src*="iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });

  return apiReadyPromise;
}

const POLL_INTERVAL_MS = 200;

export function useYouTubePlayer(
  containerRef: React.RefObject<HTMLDivElement | null>,
  videoId: string,
) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    const stopPolling = () => {
      if (!interval) return;
      clearInterval(interval);
      interval = null;
    };

    const syncTime = () => {
      const time = playerRef.current?.getCurrentTime();
      if (typeof time === "number") setCurrentTime(time);
    };

    const startPolling = () => {
      if (interval) return;
      interval = setInterval(syncTime, POLL_INTERVAL_MS);
    };

    void loadYouTubeApi().then(() => {
      if (cancelled || !containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          fs: 0,
          enablejsapi: 1,
        },
        events: {
          onReady: () => {
            if (!cancelled) setIsReady(true);
          },
          onStateChange: (event) => {
            const { PLAYING, PAUSED, ENDED, BUFFERING } =
              window.YT.PlayerState;

            if (event.data === PLAYING) {
              startPolling();
              return;
            }

            if (
              event.data === PAUSED ||
              event.data === ENDED ||
              event.data === BUFFERING
            ) {
              stopPolling();
              syncTime();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      stopPolling();
      playerRef.current?.destroy();
      playerRef.current = null;
      setIsReady(false);
    };
  }, [containerRef, videoId]);

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    setCurrentTime(seconds);
  }, []);

  return { currentTime, isReady, seekTo };
}
