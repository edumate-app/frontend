import { dashboardApi } from '../api/dashboard.api';

export const useImportVideo = () => {
  const importVideo = async (url: string, targetLang: string) => {
    const response = await dashboardApi.add({
      url,
      targetLang,
    });
    return response.data.video_uuid;
  };

  return { importVideo };
};
