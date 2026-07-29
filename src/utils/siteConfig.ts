/** Canonical public site URL and shared SEO / chrome constants. */

const FALLBACK_SITE_URL = 'https://learn.eduengteam.com';
const VERCEL_FALLBACK_URL = 'https://eet-electronics-product-dev-library.vercel.app';

function normalizeSiteUrl(raw: string): string {
  return raw.replace(/\/+$/, '');
}

/** Canonical host — override with VITE_SITE_URL (e.g. Vercel preview). */
export const SITE_URL = normalizeSiteUrl(
  import.meta.env.VITE_SITE_URL || FALLBACK_SITE_URL
);

/** Documented Vercel fallback while custom DNS is pending. */
export const VERCEL_SITE_URL = VERCEL_FALLBACK_URL;

export const SITE_NAME = 'EET Electronics Product Development Library';

export const SITE_DESCRIPTION =
  'An independent educational library of structured electronics product development tutorials, learning paths, and engineering role guides from the Educational Engineering Team (EET).';

/** From package.json via Vite define; falls back for type-safe defaults. */
export const APP_VERSION =
  (typeof import.meta.env.VITE_APP_VERSION === 'string' &&
    import.meta.env.VITE_APP_VERSION) ||
  '0.1.0';

/** Visible launch-trust label until we drop the beta badge. */
export const APP_STAGE_LABEL = 'Beta';

export const OG_IMAGE_PATH = '/og-image.png';

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function ogImageUrl(): string {
  return absoluteUrl(OG_IMAGE_PATH);
}
