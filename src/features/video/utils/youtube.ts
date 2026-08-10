type YouTubeThumbnailQuality =
  'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault';

export function getYouTubeThumbnailUrl(
  videoId: string,
  quality: YouTubeThumbnailQuality = 'mqdefault',
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

const YOUTUBE_VIDEO_ID_RE = /^[\w-]{11}$/;

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'www.youtu.be',
]);

export function isYouTubeVideoId(value: string): boolean {
  return YOUTUBE_VIDEO_ID_RE.test(value);
}

export function extractYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (isYouTubeVideoId(trimmed)) return trimmed;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (!YOUTUBE_HOSTS.has(url.hostname)) return null;
  const fromQuery = url.searchParams.get('v');
  if (fromQuery && isYouTubeVideoId(fromQuery)) return fromQuery;
  const segment = url.pathname.split('/').filter(Boolean)[0];
  const idFromPath = url.hostname.includes('youtu.be')
    ? segment
    : ['embed', 'shorts', 'live', 'v'].includes(segment ?? '')
      ? url.pathname.split('/').filter(Boolean)[1]
      : null;
  return idFromPath && isYouTubeVideoId(idFromPath) ? idFromPath : null;
}
