import { apiClient } from '@/app/api/apiClient';
import { env } from '@/utils/env';
import type {
  ImportRequest,
  ImportResponse,
  ImportStatusResponse,
  LanguageDto,
  VideoDto,
} from './dashboard.types';

export const dashboardApi = {
  validateYtUrl: (url: string) =>
    apiClient.post<LanguageDto[]>(`/video/validation?url=${url}`),
  add: (req: ImportRequest) =>
    apiClient.post<ImportResponse>(`/video/import`, req),
  getImportStatus: (jobId: string) =>
    apiClient.get<ImportStatusResponse>(`/video/import/${jobId}/status`),
  importEventsUrl: (jobId: string) =>
    `${env.VITE_BASE_URL}/video/import/${jobId}/events`,
  updateNativeLang: (lang: string) =>
    apiClient.patch(`/user/native-lang`, { lang: lang }),
  getVideos: () => apiClient.get<VideoDto[]>(`/video`),
  removeVideo: (uuid: string) => apiClient.delete(`/video/${uuid}`),
  listImportJobs: () =>
    apiClient.get<ImportStatusResponse[]>(`/video/import/jobs`),
};
