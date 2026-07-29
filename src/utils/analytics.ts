/** Production analytics — no-ops unless VITE_POSTHOG_KEY and/or VITE_GA_ID are set. */

type AnalyticsProps = Record<string, string | number | boolean | undefined | null>;

export interface TrafficAttribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_path?: string;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer: unknown[];
    posthog?: {
      capture: (event: string, props?: AnalyticsProps) => void;
      init?: (key: string, opts?: Record<string, unknown>) => void;
      register?: (props: AnalyticsProps) => void;
      identify?: (id: string, props?: AnalyticsProps) => void;
    };
  }
}

const SESSION_KEY = 'eet_anon_session_id';
const TRAFFIC_KEY = 'eet_traffic_attribution_v1';

let initialized = false;

function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Anonymous session ID persisted for this browser (not PII). */
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = randomId();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return randomId();
  }
}

function readQueryAttribution(): TrafficAttribution {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const pick = (key: string) => params.get(key)?.trim() || undefined;
  const ref = document.referrer?.trim();
  return {
    utm_source: pick('utm_source'),
    utm_medium: pick('utm_medium'),
    utm_campaign: pick('utm_campaign'),
    utm_content: pick('utm_content'),
    utm_term: pick('utm_term'),
    referrer: ref && !ref.includes(window.location.hostname) ? ref : undefined,
    landing_path: window.location.pathname + window.location.search,
  };
}

/** First-touch traffic source / campaign (UTM + referrer), persisted once per browser. */
export function getTrafficAttribution(): TrafficAttribution {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(TRAFFIC_KEY);
    if (raw) {
      return JSON.parse(raw) as TrafficAttribution;
    }
  } catch {
    // fall through and capture fresh
  }

  const fresh = readQueryAttribution();
  const hasSignal = Boolean(
    fresh.utm_source ||
      fresh.utm_medium ||
      fresh.utm_campaign ||
      fresh.utm_content ||
      fresh.utm_term ||
      fresh.referrer
  );

  if (hasSignal) {
    try {
      localStorage.setItem(TRAFFIC_KEY, JSON.stringify(fresh));
    } catch {
      // ignore quota / private mode
    }
  }
  return fresh;
}

export function getPosthogKey(): string | undefined {
  const key = (import.meta.env.VITE_POSTHOG_KEY as string | undefined)?.trim();
  return key || undefined;
}

export function getGaId(): string | undefined {
  const id = (import.meta.env.VITE_GA_ID as string | undefined)?.trim();
  return id || undefined;
}

export function isAnalyticsEnabled(): boolean {
  return Boolean(getPosthogKey() || getGaId());
}

export function getAnalyticsProviders(): { posthog: boolean; ga4: boolean } {
  return {
    posthog: Boolean(getPosthogKey()),
    ga4: Boolean(getGaId()),
  };
}

function enrichProps(props: AnalyticsProps = {}): AnalyticsProps {
  const traffic = getTrafficAttribution();
  return {
    session_id: getSessionId(),
    utm_source: traffic.utm_source,
    utm_medium: traffic.utm_medium,
    utm_campaign: traffic.utm_campaign,
    utm_content: traffic.utm_content,
    utm_term: traffic.utm_term,
    referrer: traffic.referrer,
    ...props,
  };
}

function loadPosthogSnippet(key: string): void {
  // Official PostHog array.js loader (US cloud). No-op until key is set.
  const w = window;
  if (w.posthog?.init) {
    w.posthog.init(key, {
      api_host: 'https://us.i.posthog.com',
      capture_pageview: false,
      persistence: 'localStorage+cookie',
    });
    w.posthog.register?.({ session_id: getSessionId(), ...getTrafficAttribution() });
    return;
  }

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://us.i.posthog.com/static/array.js';
  s.onload = () => {
    w.posthog?.init?.(key, {
      api_host: 'https://us.i.posthog.com',
      capture_pageview: false,
      persistence: 'localStorage+cookie',
    });
    w.posthog?.register?.({ session_id: getSessionId(), ...getTrafficAttribution() });
  };
  document.head.appendChild(s);
}

function loadGa4(gaId: string): void {
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', gaId, {
    send_page_view: false,
    anonymize_ip: true,
  });
}

export function initAnalytics(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  // Always establish session + first-touch attribution (local only if analytics off).
  getSessionId();
  getTrafficAttribution();

  const posthogKey = getPosthogKey();
  const gaId = getGaId();
  if (!posthogKey && !gaId) return;

  if (posthogKey) loadPosthogSnippet(posthogKey);
  if (gaId) loadGa4(gaId);
}

export function trackEvent(event: string, props: AnalyticsProps = {}): void {
  if (typeof window === 'undefined') return;
  if (!isAnalyticsEnabled()) return;

  const payload = enrichProps(props);
  try {
    window.posthog?.capture?.(event, payload);
    if (window.gtag && getGaId()) {
      window.gtag('event', event, payload);
    }
  } catch {
    // analytics must never break UX
  }
}

export function trackPageView(path: string, title?: string): void {
  trackEvent('page_view', { path, title: title || (typeof document !== 'undefined' ? document.title : '') });
}

/** Convenience wrappers for required product events. */
export function trackTutorialStart(tutorialId: string, slug: string): void {
  trackEvent('tutorial_start', { tutorialId, slug });
}

export function trackPlaybackMilestone(tutorialId: string, milestone: 25 | 50 | 75 | 100): void {
  trackEvent('playback_milestone', { tutorialId, milestone, percent: milestone });
  trackEvent(`playback_${milestone}`, { tutorialId });
}

export function trackTutorialComplete(tutorialId: string, slug?: string): void {
  trackEvent('tutorial_complete', { tutorialId, slug });
}

export function trackPathProgression(
  pathId: string,
  completed: number,
  total: number,
  percentage: number
): void {
  trackEvent('path_progression', { pathId, completed, total, percentage });
}

export function trackPersonaSelected(personaId: string, personaTitle?: string): void {
  trackEvent('persona_selected', { personaId, personaTitle });
}

export function trackAltiumCtaClick(props: AnalyticsProps): void {
  trackEvent('cta_click', props);
  trackEvent('altium_cta_click', props);
}

export function trackSearch(query: string, resultCount: number): void {
  trackEvent('search', { query, resultCount });
  if (resultCount === 0) {
    trackEvent('search_zero_results', { query });
  }
}
