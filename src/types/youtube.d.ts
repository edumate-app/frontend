export {};

declare global {
  interface Window {
    YT: {
      Player: new (
        element: HTMLElement | string,
        options: YTPlayerOptions,
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }

  interface YTPlayer {
    destroy(): void;
    getCurrentTime(): number;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    setSize(width: number, height: number): void;
  }

  interface YTPlayerOptions {
    videoId?: string;
    width?: string | number;
    height?: string | number;
    playerVars?: Record<string, string | number>;
    events?: {
      onReady?: (event: { target: YTPlayer }) => void;
      onStateChange?: (event: { data: number; target: YTPlayer }) => void;
    };
  }
}
