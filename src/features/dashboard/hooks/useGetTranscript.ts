import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dashboardApi } from '../api/dashboard.api';
import type { TranscriptSegment } from '../api/dashboard.types';

export const useGetTranscript = () => {
  const { video_uuid } = useParams<{ video_uuid: string }>();
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [lastPositionSeconds, setLastPositionSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadedVideoUuid, setLoadedVideoUuid] = useState<string | null>(null);
  const navigate = useNavigate();

  const isLoading = Boolean(video_uuid && video_uuid !== loadedVideoUuid);

  useEffect(() => {
    if (!video_uuid) return;
    let cancelled = false;

    dashboardApi
      .getTranscript(video_uuid)
      .then((response) => {
        if (cancelled) return;
        setSegments(response.data.segments);
        setVideoId(response.data.video_id);
        setLastPositionSeconds(response.data.lastPositionSeconds);
        setLoadedVideoUuid(video_uuid);
        setError(null);
      })

      .catch((err) => {
        if (err.response?.status === 400) navigate('/app/settings');
        if (cancelled) return;
        setError('Nie udało się pobrać transkrypcji.');
        setLoadedVideoUuid(video_uuid);
      });

    return () => {
      cancelled = true;
    };
  }, [video_uuid, navigate]);

  if (!video_uuid) {
    return {
      segments: [],
      videoId: null,
      lastPositionSeconds: 0,
      isLoading: false,
      error: 'Brak identyfikatora wideo.',
    };
  }

  return {
    segments: segments,
    videoId: videoId,
    lastPositionSeconds: lastPositionSeconds,
    isLoading,
    error: error,
  };
};
