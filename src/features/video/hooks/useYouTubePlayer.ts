import { useCallback, useEffect, useRef, useState } from 'react';

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
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });

  return apiReadyPromise;
}

const POLL_INTERVAL_MS = 200;
const PRIME_FALLBACK_MS = 2500;

export function useYouTubePlayer(
  containerRef: React.RefObject<HTMLDivElement | null>,
  videoId: string,
  startSeconds = 0,
) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const startSecondsRef = useRef(startSeconds);
  startSecondsRef.current = startSeconds;

  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;
    let primeFallback: ReturnType<typeof setTimeout> | null = null;
    let isPriming = false;

    const stopPolling = () => {
      if (!interval) return;
      clearInterval(interval);
      interval = null;
    };

    const syncTime = () => {
      const time = playerRef.current?.getCurrentTime();
      if (typeof time === 'number') setCurrentTime(time);
    };

    const startPolling = () => {
      if (interval) return;
      interval = setInterval(syncTime, POLL_INTERVAL_MS);
    };

    const finishPriming = (player: YTPlayer) => {
      if (!isPriming || cancelled) return;
      isPriming = false;
      if (primeFallback) {
        clearTimeout(primeFallback);
        primeFallback = null;
      }
      player.pauseVideo();
      player.unMute();
      syncTime();
      setIsReady(true);
    };

    if (!videoId) return;

    let resizeObserver: ResizeObserver | null = null;
    const initialStart = Math.max(0, Math.floor(startSecondsRef.current));

    const syncPlayerSize = () => {
      const container = containerRef.current;
      const player = playerRef.current;
      if (!container || !player) return;

      const { width, height } = container.getBoundingClientRect();
      if (width > 0 && height > 0) {
        player.setSize(Math.floor(width), Math.floor(height));
      }
    };

    void loadYouTubeApi().then(() => {
      if (cancelled || !containerRef.current) return;

      const container = containerRef.current;

      playerRef.current = new window.YT.Player(container, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          rel: 0,
          modestbranding: 1,
          fs: 0,
          enablejsapi: 1,
          ...(initialStart > 0 ? { start: initialStart } : {}),
        },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            syncPlayerSize();
            resizeObserver = new ResizeObserver(syncPlayerSize);
            resizeObserver.observe(container);

            if (initialStart > 0) {
              setCurrentTime(initialStart);
            }

            // Mute + brief play forces a decoded frame at the resume
            // position instead of the default YouTube thumbnail.
            isPriming = true;
            const player = event.target;
            player.mute();
            if (initialStart > 0) {
              player.seekTo(initialStart, true);
            }
            player.playVideo();

            primeFallback = setTimeout(() => {
              finishPriming(player);
            }, PRIME_FALLBACK_MS);
          },
          onStateChange: (event) => {
            const { PLAYING, PAUSED, ENDED, BUFFERING } = window.YT.PlayerState;

            if (isPriming) {
              // Wait for an actual decoded frame before pausing.
              if (event.data === PLAYING) {
                finishPriming(event.target);
              }
              return;
            }

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
      isPriming = false;
      stopPolling();
      if (primeFallback) clearTimeout(primeFallback);
      resizeObserver?.disconnect();
      resizeObserver = null;
      playerRef.current?.destroy();
      playerRef.current = null;
      setIsReady(false);
    };
    // startSeconds is read once via ref when the player is created for videoId
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recreate only on videoId change
  }, [containerRef, videoId]);

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    setCurrentTime(seconds);
  }, []);

  return { currentTime, isReady, seekTo };
}
