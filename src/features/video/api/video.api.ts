import { apiClient } from '@/app/api/apiClient';
import type {
  AddExpressionRequest,
  AnalyzeRequest,
  TranscriptResponse,
  UpdatePositionRequest,
  WordAnalyzedDto,
} from './video.types';
import type {
  ExpressionContext,
  LibraryExpression,
} from '@/features/library/types/expression-library.types';

export const VideoApi = {
  getTranscript: (video_uuid: string) =>
    apiClient.get<TranscriptResponse>(`/video/transcript/${video_uuid}`),
  updatePosition: (video_uuid: string, req: UpdatePositionRequest) =>
    apiClient.patch(`/video/${video_uuid}/position`, req),
  analyze: (req: AnalyzeRequest, signal?: AbortSignal) =>
    apiClient
      .post<WordAnalyzedDto[]>('/expression/analyze', req, { signal })
      .then((response) => response.data),
  addExpressionsToLibrary: (req: AddExpressionRequest) =>
    apiClient.post('/expression', req),
  getExpressions: () => apiClient.get<LibraryExpression[]>('/expression'),
  getExpressionContexts: (expressionId: string) =>
    apiClient.get<ExpressionContext[]>(`/expression/${expressionId}/contexts`),
};
