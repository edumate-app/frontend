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

export type TranscriptResponse = {
  video_id: string;
  segments: TranscriptSegment[];
  lastPositionSeconds: number;
};

export type VideoDto = {
  uuid: string;
  targetLang: string;
  videoId: string;
  author: string;
  title: string;
  duration: number;
  lastOpenedAt: string | null;
  lastPositionSeconds: number;
};

export type UpdatePositionRequest = {
  positionSeconds: number;
};
