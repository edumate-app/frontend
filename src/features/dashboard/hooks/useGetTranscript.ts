import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dashboardApi } from "../api/dashboard.api";
import type { TranscriptSegment } from "../api/dashboard.types";

export const useGetTranscript = () => {
  const { video_uuid } = useParams<{ video_uuid: string }>();
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [lastPositionSeconds, setLastPositionSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!video_uuid) {
      setIsLoading(false);
      setError("Brak identyfikatora wideo.");
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setVideoId(null);
    setSegments([]);
    setLastPositionSeconds(0);

    dashboardApi
      .getTranscript(video_uuid)
      .then((response) => {
        if (cancelled) return;
        setSegments(response.data.segments);
        setVideoId(response.data.video_id);
        setLastPositionSeconds(response.data.lastPositionSeconds);
      })
      .catch((err) => {
        if (err.response.status === 400) navigate("/app/settings");
        if (cancelled) return;
        setError("Nie udało się pobrać transkrypcji.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [video_uuid]);

  return { segments, videoId, lastPositionSeconds, isLoading, error };
};
