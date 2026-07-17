export type LanguageDto = {
  language: string;
  language_code: string;
  alreadyImported: boolean;
};

export type ImportResponse = {
  video_uuid: string;
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
