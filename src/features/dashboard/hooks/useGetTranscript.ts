import { useEffect, useState } from "react";
import { dashboardApi } from "../api/dashboard.api";
import type { TranscriptSegment } from "../api/dashboard.types";
import { useParams } from "react-router-dom";

export const useGetTranscript = () => {
  const { video_uuid } = useParams<{ video_uuid: string }>();
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [videoId, setVideoId] = useState<string | null>(null);
  const getTranscript = async (video_uuid: string) => {
    const response = await dashboardApi.getTranscript(video_uuid);
    console.log(response.data);
    setSegments(response.data.segments);
    setVideoId(response.data.video_id);
  };

  useEffect(() => {
    console.log(video_uuid);
    if (!video_uuid) return;
    getTranscript(video_uuid);
  }, [video_uuid]);

  return { segments, videoId };
};
