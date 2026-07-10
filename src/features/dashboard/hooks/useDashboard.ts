import { dashboardApi } from "../api/dashboard.api";
import { useEffect, useState } from "react";
import type { VideoDto } from "../api/dashboard.types";

export const useDashboard = () => {
  const [videos, setVideos] = useState<VideoDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    dashboardApi
      .getVideos()
      .then((response) => {
        if (cancelled) return;
        setVideos(response.data);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Nie udało się pobrać listy filmów.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { videos, error, isLoading };
};
