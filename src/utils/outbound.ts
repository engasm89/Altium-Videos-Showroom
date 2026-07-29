/** Shared UTM params for Altium evaluation / docs outbound clicks. */
export const EET_UTM = {
  utm_source: 'eet_learning_hub',
  utm_medium: 'tutorial',
  utm_campaign: 'altium_develop_library',
} as const;

const DEFAULT_TRIAL =
  'https://www.altium.com/free-trial?utm_source=eet_learning_hub&utm_medium=tutorial&utm_campaign=altium_develop_library';

export function defaultAltiumTrialUrl(contentSlug?: string): string {
  if (!contentSlug) return DEFAULT_TRIAL;
  const url = new URL(DEFAULT_TRIAL);
  url.searchParams.set('utm_content', contentSlug);
  return url.toString();
}

/**
 * Ensure Altium outbound URLs carry EET campaign params for partnership reporting.
 * Non-Altium URLs are returned unchanged.
 */
export function withEetUtm(rawUrl: string, contentSlug?: string): string {
  try {
    const url = new URL(rawUrl);
    if (!url.hostname.endsWith('altium.com')) return rawUrl;
    if (!url.searchParams.get('utm_source')) {
      url.searchParams.set('utm_source', EET_UTM.utm_source);
    }
    if (!url.searchParams.get('utm_medium')) {
      url.searchParams.set('utm_medium', EET_UTM.utm_medium);
    }
    if (!url.searchParams.get('utm_campaign')) {
      url.searchParams.set('utm_campaign', EET_UTM.utm_campaign);
    }
    if (contentSlug && !url.searchParams.get('utm_content')) {
      url.searchParams.set('utm_content', contentSlug);
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}
