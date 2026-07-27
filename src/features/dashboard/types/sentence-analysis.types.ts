import type { StanzaMood, StanzaPos } from './stanza-tags.types';

export type userStatus = 'new' | 'familiar' | 'unknown';

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
  userStatus?: userStatus;

  // for verbs and auxiliaries
  tense?: string;
  conjugation?: VerbConjugationForm[];
  conjugationPerson?: string;
  mood?: StanzaMood;

  // for non-verbs
  family?: string[];
};

export function isVerbWord(token: SentenceAnalysisWord) {
  return token.pos === 'VERB' || token.pos === 'AUX';
}

export type SentenceAnalysis = {
  index: number;
  startSeconds: number;
  targetTranslation: string;
  words: SentenceAnalysisWord[];
};
