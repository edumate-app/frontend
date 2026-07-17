import type { TranscriptSegment } from '@/features/video/api/video.types';

export function getActiveSegmentIndex(
  segments: TranscriptSegment[],
  time: number,
): number {
  const exact = segments.findIndex(
    (segment) =>
      time >= segment.start && time < segment.start + segment.duration,
  );
  if (exact !== -1) return exact;

  for (let index = segments.length - 1; index >= 0; index -= 1) {
    if (time >= segments[index].start) return index;
  }

  return -1;
}
