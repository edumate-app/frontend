import { useEffect, useRef } from 'react';
import { VideoApi } from '../api/video.api';

const SAVE_INTERVAL_MS = 5000;

export function useSaveWatchPosition(
  videoUuid: string | undefined,
  currentTime: number,
) {
  const currentTimeRef = useRef(currentTime);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  const lastSavedRef = useRef(-1);

  useEffect(() => {
    if (!videoUuid) return;

    const save = () => {
      const seconds = Math.floor(currentTimeRef.current);
      // Never persist 0 — on mount / Strict Mode remount currentTime is still 0
      // and would wipe the saved resume position before seek completes.
      if (seconds <= 0 || seconds === lastSavedRef.current) return;

      lastSavedRef.current = seconds;
      VideoApi.updatePosition(videoUuid, { positionSeconds: seconds }).catch(
        () => {},
      );
    };

    const interval = setInterval(save, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      save();
    };
  }, [videoUuid]);
}
