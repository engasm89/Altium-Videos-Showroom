import { useEffect } from 'react';
import {
  APP_STAGE_LABEL,
  APP_VERSION,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  ogImageUrl,
} from './siteConfig';

function ensureMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function ensureLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export interface PageMetaOptions {
  title?: string | null;
  description?: string | null;
  path?: string | null;
  image?: string | null;
  type?: 'website' | 'article' | 'video.other';
}

/** Update document.title + Open Graph / Twitter / canonical for the active route. */
export function applyPageMeta(options: PageMetaOptions = {}): void {
  const title = options.title ? `${options.title} · ${SITE_NAME}` : SITE_NAME;
  const description = options.description?.trim() || SITE_DESCRIPTION;
  const url = absoluteUrl(options.path || '/');
  const image = options.image || ogImageUrl();
  const type = options.type || 'website';

  document.title = title;
  ensureMeta('name', 'description', description);
  ensureMeta('property', 'og:title', title);
  ensureMeta('property', 'og:description', description);
  ensureMeta('property', 'og:url', url);
  ensureMeta('property', 'og:image', image);
  ensureMeta('property', 'og:type', type);
  ensureMeta('property', 'og:site_name', SITE_NAME);
  ensureMeta('name', 'twitter:card', 'summary_large_image');
  ensureMeta('name', 'twitter:title', title);
  ensureMeta('name', 'twitter:description', description);
  ensureMeta('name', 'twitter:image', image);
  ensureLink('canonical', url);
}

/** Update document.title for the active route (and sync social meta). */
export function useDocumentTitle(
  title?: string | null,
  description?: string | null,
  path?: string | null
): void {
  useEffect(() => {
    const prev = document.title;
    applyPageMeta({ title, description, path });
    return () => {
      document.title = prev;
    };
  }, [title, description, path]);
}

/** Short chrome label: "Beta · v0.1.0" */
export function appReleaseLabel(): string {
  return `${APP_STAGE_LABEL} · v${APP_VERSION}`;
}

export { SITE_URL };
