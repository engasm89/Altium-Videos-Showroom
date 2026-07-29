/**
 * YouTube video IDs are 11 characters from [A-Za-z0-9_-].
 * Synthetic catalog placeholders like `eet_rec_016` or `kL_00192837` must never be treated as playable.
 */
const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

/** Placeholder IDs generated as `xx_` + long digit runs — not real YouTube uploads. */
const SYNTHETIC_PLACEHOLDER_RE = /^[A-Za-z]{2}_\d{5,}/;

export function isPlayableYoutubeId(youtubeId: string | undefined | null): boolean {
  if (!youtubeId) return false;
  if (youtubeId.startsWith('eet_') || youtubeId.startsWith('eet-')) return false;
  if (SYNTHETIC_PLACEHOLDER_RE.test(youtubeId)) return false;
  return YOUTUBE_ID_RE.test(youtubeId);
}

/**
 * Prefer catalog youtubeStatus when present: only `public` (oEmbed-confirmed) is embeddable.
 * Falls back to format check for legacy rows without status.
 */
export function isEmbeddableYoutube(
  youtubeId: string | undefined | null,
  youtubeStatus?: string | null
): boolean {
  if (!isPlayableYoutubeId(youtubeId)) return false;
  if (youtubeStatus && youtubeStatus !== 'public') return false;
  return true;
}
