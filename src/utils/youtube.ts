/**
 * YouTube video IDs are 11 characters from [A-Za-z0-9_-].
 * Synthetic catalog placeholders like `eet_rec_016` must never be treated as playable.
 */
const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

export function isPlayableYoutubeId(youtubeId: string | undefined | null): boolean {
  if (!youtubeId) return false;
  if (youtubeId.startsWith('eet_') || youtubeId.startsWith('eet-')) return false;
  return YOUTUBE_ID_RE.test(youtubeId);
}
