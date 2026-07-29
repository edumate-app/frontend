import { useParams } from 'react-router-dom';
import type { Expression } from '../api/video.types';
import { VideoApi } from '../api/video.api';

export default function useSaveExpressions() {
  const { video_uuid } = useParams<{ video_uuid: string }>();

  const saveExpressions = async (
    expressions: Expression[],
    index: number,
  ) => {
    if (!video_uuid) return;
    await VideoApi.addExpressionsToLibrary({
      expressions,
      contextIndex: index,
      video_uuid,
    });
  };

  return { saveExpressions };
}
