export type LanguageDto = {
  language: string;
  language_code: string;
};

export type TranscriptSegment = {
  nativeText: string;
  targetText: string;
  start: number;
  duration: number;
};
