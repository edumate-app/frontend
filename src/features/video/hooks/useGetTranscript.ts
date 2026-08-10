import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VideoApi } from '../api/video.api';
import type { ImportHint, TranscriptSegment } from '../api/video.types';

export const useGetTranscript = () => {
  const { video_uuid } = useParams<{ video_uuid: string }>();
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [lastPositionSeconds, setLastPositionSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadedVideoUuid, setLoadedVideoUuid] = useState<string | null>(null);
  const [videoLang, setVideoLang] = useState<string | null>(null);
  const navigate = useNavigate();

  const [importHint, setImportHint] = useState<ImportHint | null>(null);

  const isLoading = Boolean(video_uuid && video_uuid !== loadedVideoUuid);

  useEffect(() => {
    if (!video_uuid) return;
    let cancelled = false;

    VideoApi.getTranscript(video_uuid)
      .then((response) => {
        if (cancelled) return;
        setSegments(response.data.segments);
        setVideoId(response.data.video_id);
        setLastPositionSeconds(response.data.lastPositionSeconds);
        setLoadedVideoUuid(video_uuid);
        setVideoLang(response.data.lang);
        setError(null);
      })

      .catch((err) => {
        if (cancelled) return;
        console.log(err.response);

        const data = err.response?.data;
        const code = data?.code;

        if (code === 'NATIVE_LANGUAGE_NOT_SET') {
          navigate('/app/settings');
          return;
        } else if (code === 'VIDEO_NOT_IMPORTED') {
          setError(
            'Ten materiał nie jest zaimportowany. Zaimportuj go, aby zobaczyć lekcję.',
          );
          setImportHint({
            videoId: data.details.videoId,
            lang: data.details.targetLang,
          });
        } else {
          setError('Nie udało się pobrać transkrypcji.');
          setImportHint(null);
        }

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
      videoLang: null,
      importHint: null,
    };
  }

  return {
    segments: segments,
    videoId: videoId,
    lastPositionSeconds: lastPositionSeconds,
    isLoading,
    error: error,
    videoLang,
    importHint,
  };
};
