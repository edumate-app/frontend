import { useEffect, useRef } from "react";
import { dashboardApi } from "../api/dashboard.api";

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
      if (seconds === lastSavedRef.current) return;

      lastSavedRef.current = seconds;
      dashboardApi.updatePosition(videoUuid, { positionSeconds: seconds }).catch(() => {});
    };

    const interval = setInterval(save, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      save();
    };
  }, [videoUuid]);
}
