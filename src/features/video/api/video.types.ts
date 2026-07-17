export type TranscriptSegment = {
  nativeText: string;
  targetText: string;
  start: number;
  duration: number;
};

export type TranscriptResponse = {
  video_id: string;
  segments: TranscriptSegment[];
  lastPositionSeconds: number;
};

export type UpdatePositionRequest = {
  positionSeconds: number;
};
