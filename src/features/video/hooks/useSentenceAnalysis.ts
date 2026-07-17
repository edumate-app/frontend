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
  isPinned: boolean;
  togglePin: () => void;
  unpin: () => void;
};

type UseSentenceAnalysisOptions = {
  activeSegment: TranscriptSegment | null;
  lang?: string;
  resetKey?: string;
};

type AnalysisLoadState = {
  analysis: SentenceAnalysis | null;
  status: SentenceAnalysisStatus;
  error: string | null;
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

  console.log(tokens);

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
  resetKey,
}: UseSentenceAnalysisOptions): SentenceAnalysisState {
  const [state, setState] = useState<AnalysisLoadState>({
    analysis: null,
    status: 'idle',
    error: null,
  });
  const [pinState, setPinState] = useState<{
    resetKey: string | undefined;
    segment: TranscriptSegment | null;
  }>({ resetKey, segment: null });
  const requestIdRef = useRef(0);

  const pinnedSegment =
    pinState.resetKey === resetKey ? pinState.segment : null;
  const analysisSegment = pinnedSegment ?? activeSegment;
  const isPinned = pinnedSegment !== null;

  const cachedAnalysis = analysisSegment
    ? analysisCache.get(getSegmentKey(analysisSegment))
    : null;

  useEffect(() => {
    if (!analysisSegment || !lang) {
      return;
    }

    const segmentKey = getSegmentKey(analysisSegment);

    if (cachedAnalysis) {
      return;
    }

    const preview = createPreviewAnalysis(analysisSegment);
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const controller = new AbortController();
    const segmentToLoad = analysisSegment;

    const debounceId = window.setTimeout(() => {
      setState({
        analysis: preview,
        status: 'loading',
        error: null,
      });

      loadAnalysis(segmentToLoad, lang, controller.signal)
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
  }, [analysisSegment, lang, cachedAnalysis]);

  const unpin = () => setPinState({ resetKey, segment: null });

  const togglePin = () => {
    setPinState((current) => {
      const currentPinned =
        current.resetKey === resetKey ? current.segment : null;
      if (currentPinned) {
        return { resetKey, segment: null };
      }
      return { resetKey, segment: analysisSegment };
    });
  };

  const controls = { isPinned, togglePin, unpin };

  if (!analysisSegment) {
    return {
      analysis: null,
      status: 'idle',
      error: null,
      ...controls,
    };
  }

  if (cachedAnalysis) {
    return {
      analysis: cachedAnalysis,
      status: 'complete',
      error: null,
      ...controls,
    };
  }

  return {
    ...state,
    ...controls,
  };
}
