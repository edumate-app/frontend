import type {
  StanzaMood,
  StanzaPos,
} from '@/features/dashboard/types/stanza-tags.types';

export type TranscriptSegment = {
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
  text: string;
  lang: string;
};

export type WordAnalyzedDto = {
  text: string;
  lemma: string;
  pos: StanzaPos;
  number?: string | null;
  tense?: string | null;
  mood?: StanzaMood | null;
  gender?: string | null;
};
