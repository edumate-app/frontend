import { dashboardApi } from "../api/dashboard.api";
import { useEffect, useState } from "react";
import type { VideoDto } from "../api/dashboard.types";

export const useDashboard = () => {
  const [videos, setVideos] = useState<VideoDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setVideos([]);

    dashboardApi.getVideos().then((response) => {
      console.log("Videos:", response.data);
      setVideos(response.data);
    });
  }, []);

  return { videos, error, isLoading };
};
