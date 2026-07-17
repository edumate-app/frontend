import type { SentenceAnalysisWord } from '@/features/dashboard/types/sentence-analysis.types';
import type { WordAnalyzedDto } from '../api/video.types';

export function mapWordAnalyzed(
  word: WordAnalyzedDto,
  index: number,
): SentenceAnalysisWord {
  const mapped: SentenceAnalysisWord = {
    id: `${word.lemma}-${index}`,
    pos: word.pos,
    text: word.text,
    translation: '…',
    lemma: word.lemma,
    lemmaTranslation: '…',

    mood: word.mood ?? '…',
    tense: word.tense ?? undefined,
  };

  return mapped;
}

export function createPreviewWords(sentence: string): SentenceAnalysisWord[] {
  return sentence.split(/\s+/).map((text, index) => ({
    id: `preview-${index}`,
    text,
    translation: '',
    lemma: text.replace(/[.,!?]$/, ''),
    lemmaTranslation: '',
    pos: 'X',
    mood: '—',
  }));
}
