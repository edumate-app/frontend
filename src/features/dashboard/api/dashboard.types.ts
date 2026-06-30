export type LanguageDto = {
  language: string;
  language_code: string;
  alreadyImported: boolean;
};

export type TranscriptSegment = {
  nativeText: string;
  targetText: string;
  start: number;
  duration: number;
};

export type ImportResponse = {
  video_uuid: string;
};

export type ImportRequest = {
  url: string;
  targetLang: string;
};
