/** Universal POS tags (UPOS) used by Stanza — https://universaldependencies.org/u/pos/ */
export type StanzaPos =
  | 'ADJ'
  | 'ADP'
  | 'ADV'
  | 'AUX'
  | 'CCONJ'
  | 'DET'
  | 'INTJ'
  | 'NOUN'
  | 'NUM'
  | 'PART'
  | 'PRON'
  | 'PROPN'
  | 'PUNCT'
  | 'SCONJ'
  | 'SYM'
  | 'VERB'
  | 'X';

export const STANZA_POS_POLISH_LABELS: Record<StanzaPos, string> = {
  ADJ: 'przymiotnik',
  ADP: 'przyimek',
  ADV: 'przysłówek',
  AUX: 'czasownik posiłkowy',
  CCONJ: 'spójnik współrzędny',
  DET: 'określnik',
  INTJ: 'wykrzyknik',
  NOUN: 'rzeczownik',
  NUM: 'liczebnik',
  PART: 'partykuła',
  PRON: 'zaimek',
  PROPN: 'nazwa własna',
  PUNCT: 'interpunkcja',
  SCONJ: 'spójnik podrzędny',
  SYM: 'symbol',
  VERB: 'czasownik',
  X: 'inne',
};
