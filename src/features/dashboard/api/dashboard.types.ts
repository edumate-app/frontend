export type LanguageDto = {
  language: string;
  language_code: string;
  alreadyImported: boolean;
};

export type ImportResponse = {
  jobId: string;
};

export type ImportJobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export type ImportJobStep =
  | 'QUEUED'
  | 'FETCH_VIDEO_INFO'
  | 'FETCH_TRANSCRIPT'
  | 'SAVE_VIDEO'
  | 'ENSURE_LANGUAGE'
  | 'TOKENIZE_SEGMENTS'
  | 'COMPLETED';

export type ImportStatusResponse = {
  jobId: string;
  type: string;
  status: ImportJobStatus;
  step: ImportJobStep | string;
  progress: number;
  video_uuid: string | null;
  error: string | null;
  title: string | null;
};

export type ImportRequest = {
  url: string;
  targetLang: string;
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
