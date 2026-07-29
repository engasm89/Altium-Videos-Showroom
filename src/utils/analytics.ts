/** Lightweight analytics stub — no-ops unless env keys are set. */

type AnalyticsProps = Record<string, string | number | boolean | undefined | null>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    posthog?: {
      capture: (event: string, props?: AnalyticsProps) => void;
      init?: (key: string, opts?: Record<string, unknown>) => void;
    };
  }
}

let initialized = false;

export function initAnalytics(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const posthogKey = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  const gaId = import.meta.env.VITE_GA_ID as string | undefined;

  if (posthogKey) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://us.i.posthog.com/static/array.js';
    s.onload = () => {
      window.posthog?.init?.(posthogKey, {
        api_host: 'https://us.i.posthog.com',
        capture_pageview: false,
      });
    };
    document.head.appendChild(s);
  }

  if (gaId) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId, { send_page_view: false });
  }
}

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export function trackEvent(event: string, props: AnalyticsProps = {}): void {
  if (typeof window === 'undefined') return;
  try {
    window.posthog?.capture?.(event, props);
    if (window.gtag && import.meta.env.VITE_GA_ID) {
      window.gtag('event', event, props);
    }
  } catch {
    // analytics must never break UX
  }
}

export function trackPageView(path: string, title?: string): void {
  trackEvent('page_view', { path, title: title || document.title });
}
