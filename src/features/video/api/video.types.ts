import type {
  NumberType,
  VerbConjugationForm,
} from '@/features/dashboard/types/sentence-analysis.types';
import type {
  StanzaMood,
  StanzaPos,
} from '@/features/dashboard/types/stanza-tags.types';

export type TranscriptSegment = {
  id: string;
  nativeText: string;
  targetText: string;
  start: number;
  duration: number;
};

export type TranscriptResponse = {
  video_id: string;
  segments: TranscriptSegment[];
  lastPositionSeconds: number;
  lang: string;
};

export type UpdatePositionRequest = {
  positionSeconds: number;
};

export type AnalyzeRequest = {
  transcriptSegmentUUID: string;
  text: string;
  lang: string;
};

export type WordAnalyzedDto = {
  text: string;
  lemma: string;
  pos: StanzaPos;
  tense?: string | null;
  mood?: StanzaMood | null;
  gender?: string | null;

  conjugation: VerbConjugationForm[];
  person: number;
  number?: NumberType | null;
};

export type Expression = {
  text: string;
  lemma: string;
  lemmaTranslation: string;
  pos: StanzaPos;
  conjugation: VerbConjugationForm[];
};

export type AddExpressionRequest = {
  expressions: Expression[];
  contextIndex: number;
  video_uuid: string;
};

export type ImportHint = {
  videoId: string;
  lang: string;
};
