import { apiClient } from '@/app/api/apiClient';
import type {
  ImportRequest,
  ImportResponse,
  LanguageDto,
  VideoDto,
} from './dashboard.types';
import type { UserDto } from '@/features/auth/api/auth.types';

export const dashboardApi = {
  validateYtUrl: (url: string) =>
    apiClient.post<LanguageDto[]>(`/video/validation?url=${url}`),
  add: (req: ImportRequest) =>
    apiClient.post<ImportResponse>(`/video/import`, req),
  updateNativeLang: (lang: string) =>
    apiClient.patch(`/user/native-lang`, { lang: lang }),
  getVideos: () => apiClient.get<VideoDto[]>(`/video`),
  updateProfilePhoto: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.put<UserDto>('/user/avatar', formData);
  },
  deleteProfilePhoto: () => {
    return apiClient.delete<UserDto>('/user/avatar');
  },
};
