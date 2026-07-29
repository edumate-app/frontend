import { apiClient } from '@/app/api/apiClient';
import type {
  AnalyzeRequest,
  TranscriptResponse,
  UpdatePositionRequest,
  WordAnalyzedDto,
} from './video.types';

export const VideoApi = {
  getTranscript: (video_uuid: string) =>
    apiClient.get<TranscriptResponse>(`/video/transcript/${video_uuid}`),
  updatePosition: (video_uuid: string, req: UpdatePositionRequest) =>
    apiClient.patch(`/video/${video_uuid}/position`, req),
  analyze: (req: AnalyzeRequest, signal?: AbortSignal) =>
    apiClient
      .post<WordAnalyzedDto[]>('/expression/analyze', req, { signal })
      .then((response) => response.data),
};
