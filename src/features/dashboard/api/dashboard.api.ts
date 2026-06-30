import { apiClient } from "@/app/api/apiClient";
import type { ImportResponse, LanguageDto } from "./dashboard.types";

export const dashboardApi = {
  validateYtUrl: (url: string) =>
    apiClient.post<LanguageDto[]>(`/video/validation?url=${url}`),
  add: (url: string) => apiClient.post<ImportResponse>(`/video/add?url=${url}`),
};
