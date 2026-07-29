import type {
  userStatus,
  VerbConjugationForm,
} from '@/features/dashboard/types/sentence-analysis.types';
import type { StanzaPos } from '@/features/dashboard/types/stanza-tags.types';

export type ExpressionContext = {
  id: string;
  targetSentence: string;
  nativeTranslation: string;
  videoId: string;
  videoTitle: string;
  startSeconds: number;
  savedAt: string;
};

export type LibraryExpression = {
  id: string;
  lemma: string;
  lemmaTranslation: string;
  pos: StanzaPos;
  conjugation: VerbConjugationForm[];
  contexts: ExpressionContext[];
  addedAt: string;
  userStatus?: userStatus;
  family?: string[];
};
