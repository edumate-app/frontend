import { apiClient } from '@/app/api/apiClient';
import type {
  ImportRequest,
  ImportResponse,
  LanguageDto,
  TranscriptResponse,
  UpdatePositionRequest,
  VideoDto,
} from './dashboard.types';

export const dashboardApi = {
  validateYtUrl: (url: string) =>
    apiClient.post<LanguageDto[]>(`/video/validation?url=${url}`),
  add: (req: ImportRequest) =>
    apiClient.post<ImportResponse>(`/video/import`, req),
  getTranscript: (video_uuid: string) =>
    apiClient.get<TranscriptResponse>(`/video/transcript/${video_uuid}`),
  updateNativeLang: (lang: string) =>
    apiClient.patch(`/user/native-lang`, { lang: lang }),
  getVideos: () => apiClient.get<VideoDto[]>(`/video`),
  updatePosition: (video_uuid: string, req: UpdatePositionRequest) =>
    apiClient.patch(`/video/${video_uuid}/position`, req),
};
