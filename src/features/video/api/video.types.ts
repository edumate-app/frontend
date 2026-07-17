import type { StanzaPos } from '@/features/dashboard/types/stanza-pos.types';

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
  /** Prefer `mod`; NLP may still send `mood`. */
  mod?: string | null;
  mood?: string | null;
  gender?: string | null;
};
