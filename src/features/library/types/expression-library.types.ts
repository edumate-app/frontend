import type {
  userStatus,
  VerbConjugationForm,
} from '@/features/dashboard/types/sentence-analysis.types';
import type { StanzaPos } from '@/features/dashboard/types/stanza-tags.types';

export type ExpressionContext = {
  id: string;
  targetSentence: string;
  nativeTranslation: string;
  video_uuid: string;
  videoTitle: string;
  matchedForms: string[];
  startSeconds: number;
};

export type LibraryExpression = {
  id: string;
  lemma: string;
  lemmaTranslation: string;
  pos: StanzaPos;
  conjugation: VerbConjugationForm[];
  addedAt: string;
  userStatus?: userStatus;
  family?: string[];
  contextCount: number;
};
