import { apiClient } from '@/app/api/apiClient';
import type { TranscriptResponse, UpdatePositionRequest } from './video.types';

export const VideoApi = {
  getTranscript: (video_uuid: string) =>
    apiClient.get<TranscriptResponse>(`/video/transcript/${video_uuid}`),
  updatePosition: (video_uuid: string, req: UpdatePositionRequest) =>
    apiClient.patch(`/video/${video_uuid}/position`, req),
};
