import type { SentenceAnalysisWord } from '@/features/dashboard/types/sentence-analysis.types';
import type { WordAnalyzedDto } from '../api/video.types';

function buildFormLabel(word: WordAnalyzedDto) {
  const mood = word.mod ?? word.mood;
  const parts = [word.tense, mood, word.number, word.gender].filter(Boolean);

  return parts.length > 0 ? parts.join(' · ') : '—';
}

export function mapWordAnalyzed(
  word: WordAnalyzedDto,
  index: number,
): SentenceAnalysisWord {
  const mapped: SentenceAnalysisWord = {
    id: `${word.lemma}-${index}`,
    text: word.text,
    translation: '…',
    lemma: word.lemma,
    lemmaTranslation: '…',
    pos: word.pos,
    form: buildFormLabel(word),
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
    form: '—',
  }));
}
