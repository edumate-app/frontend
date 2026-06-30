import { dashboardApi } from "../api/dashboard.api";

export const useImportVideo = () => {
  const importVideo = async (url: string) => {
    const response = await dashboardApi.add(url);
    return response.data.video_uuid;
  };

  return { importVideo };
};
