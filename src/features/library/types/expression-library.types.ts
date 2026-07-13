import type { SentenceAnalysisWord } from '@/features/dashboard/types/sentence-analysis.types';

export type ExpressionContext = {
  id: string;
  targetSentence: string;
  nativeTranslation: string;
  videoId: string;
  videoTitle: string;
  startSeconds: number;
  savedAt: string;
};

export type LibraryExpression = SentenceAnalysisWord & {
  contexts: ExpressionContext[];
  addedAt: string;
};
