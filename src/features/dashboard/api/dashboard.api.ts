import { apiClient } from "@/app/api/apiClient";
import type {
  ImportRequest,
  ImportResponse,
  LanguageDto,
} from "./dashboard.types";

export const dashboardApi = {
  validateYtUrl: (url: string) =>
    apiClient.post<LanguageDto[]>(`/video/validation?url=${url}`),
  add: (req: ImportRequest) =>
    apiClient.post<ImportResponse>(`/video/import`, req),
};
