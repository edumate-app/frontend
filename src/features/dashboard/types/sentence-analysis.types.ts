import type { StanzaPos } from '@/features/dashboard/types/stanza-pos.types';

export type userStatus = 'known' | 'fresh' | 'unknown';

export type VerbConjugationForm = {
  person: string;
  form: string;
};

export type SentenceAnalysisWord = {
  id: string;
  pos: StanzaPos;
  text: string;
  translation: string;
  lemma: string;
  lemmaTranslation: string;
  form: string;
  userStatus: userStatus;

  // for verbs and auxiliaries
  tense?: string;
  conjugation?: VerbConjugationForm[];
  conjugationPerson?: string;

  // for non-verbs
  family?: string[];
};

export function isVerbWord(token: SentenceAnalysisWord) {
  return token.pos === 'VERB' || token.pos === 'AUX';
}

export type SentenceAnalysis = {
  startSeconds: number;
  targetTranslation: string;
  words: SentenceAnalysisWord[];
};
