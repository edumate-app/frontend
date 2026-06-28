import { dashboardApi } from "../api/dashboard.api";

export const useImportVideo = () => {
  const importVideo = async (url: string) => {
    await dashboardApi.add(url);
  };

  return { importVideo };
};
