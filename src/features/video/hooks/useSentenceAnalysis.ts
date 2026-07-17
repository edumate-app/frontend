import { useEffect, useRef, useState } from 'react';
import type { SentenceAnalysis } from '@/features/dashboard/types/sentence-analysis.types';
import type { TranscriptSegment } from '@/features/video/api/video.types';
import { VideoApi } from '@/features/video/api/video.api';
import { createPreviewWords, mapWordAnalyzed } from '../utils/mapWordAnalyzed';

export type SentenceAnalysisStatus =
  'idle' | 'preview' | 'loading' | 'complete' | 'error';

export type SentenceAnalysisState = {
  analysis: SentenceAnalysis | null;
  status: SentenceAnalysisStatus;
  error: string | null;
};

type UseSentenceAnalysisOptions = {
  activeSegment: TranscriptSegment | null;
  lang?: string;
};

const analysisCache = new Map<string, SentenceAnalysis>();

function getSegmentKey(segment: TranscriptSegment) {
  return `${segment.start}:${segment.targetText}`;
}

function createPreviewAnalysis(segment: TranscriptSegment): SentenceAnalysis {
  return {
    startSeconds: segment.start,
    targetTranslation: segment.nativeText,
    words: createPreviewWords(segment.targetText),
  };
}

async function loadAnalysis(
  segment: TranscriptSegment,
  lang: string,
  signal: AbortSignal,
): Promise<SentenceAnalysis> {
  const preview = createPreviewAnalysis(segment);

  const tokens = await VideoApi.analyze(
    { text: segment.targetText, lang },
    signal,
  );

  const words = tokens.map((token, tokenIndex) =>
    mapWordAnalyzed(token, tokenIndex),
  );

  return {
    ...preview,
    words,
  };
}

export function useSentenceAnalysis({
  activeSegment,
  lang,
}: UseSentenceAnalysisOptions): SentenceAnalysisState {
  const [state, setState] = useState<SentenceAnalysisState>({
    analysis: null,
    status: 'idle',
    error: null,
  });
  const requestIdRef = useRef(0);

  const cachedAnalysis = activeSegment
    ? analysisCache.get(getSegmentKey(activeSegment))
    : null;

  useEffect(() => {
    if (!activeSegment || !lang) {
      return;
    }

    const segmentKey = getSegmentKey(activeSegment);

    if (cachedAnalysis) {
      return;
    }

    const preview = createPreviewAnalysis(activeSegment);
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const controller = new AbortController();

    const debounceId = window.setTimeout(() => {
      setState({
        analysis: preview,
        status: 'loading',
        error: null,
      });

      loadAnalysis(activeSegment, lang, controller.signal)
        .then((analysis) => {
          if (requestIdRef.current !== requestId) {
            return;
          }

          analysisCache.set(segmentKey, analysis);

          setState({
            analysis,
            status: 'complete',
            error: null,
          });
        })
        .catch((error: unknown) => {
          if (requestIdRef.current !== requestId) {
            return;
          }

          if (error instanceof DOMException && error.name === 'AbortError') {
            return;
          }

          setState({
            analysis: preview,
            status: 'error',
            error: 'Failed to analyze the sentence.',
          });
        });
    }, 250);

    return () => {
      window.clearTimeout(debounceId);
      controller.abort();
    };
  }, [activeSegment, lang, cachedAnalysis]);

  if (!activeSegment) {
    return {
      analysis: null,
      status: 'idle',
      error: null,
    };
  }

  if (cachedAnalysis) {
    return {
      analysis: cachedAnalysis,
      status: 'complete',
      error: null,
    };
  }

  return state;
}
