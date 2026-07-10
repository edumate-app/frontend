export type WordFamiliarity = "known" | "fresh";

export type VerbConjugationForm = {
  person: string;
  form: string;
};

type SentenceAnalysisWordBase = {
  id: string;
  text: string;
  translation: string;
  lemma: string;
  lemmaTranslation: string;
  form: string;
  tense?: string;
  familiarity?: WordFamiliarity;
};

export type SentenceAnalysisWord =
  | (SentenceAnalysisWordBase & {
      pos: "czasownik";
      conjugation: VerbConjugationForm[];
      conjugationPerson: string;
    })
  | (SentenceAnalysisWordBase & {
      pos: string;
      family: string[];
    });

export function isVerbWord(
  token: SentenceAnalysisWord,
): token is SentenceAnalysisWordBase & {
  pos: "czasownik";
  conjugation: VerbConjugationForm[];
  conjugationPerson: string;
} {
  return token.pos === "czasownik";
}

export type SentenceAnalysis = {
  startSeconds: number;
  targetTranslation: string;
  words: SentenceAnalysisWord[];
};
