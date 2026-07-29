import { trackEvent } from './analytics';

export type UsefulAnswer = 'yes' | 'no' | 'partial';
export type WorkflowAnswer = 'yes' | 'no' | 'partial' | 'n_a';
export type AltiumProductAnswer =
  | 'Altium Designer'
  | 'Altium 365'
  | 'Altium Develop'
  | 'Multiple'
  | 'None yet';

export type TutorialFeedbackPayload = {
  tutorialId: string;
  tutorialSlug?: string;
  tutorialTitle?: string;
  useful: UsefulAnswer;
  workflowWorked: WorkflowAnswer;
  unclear?: string;
  nextWorkflow?: string;
  role: string;
  altiumProduct: AltiumProductAnswer;
};

export type ContentFeedbackPayload = {
  message: string;
  tutorialId?: string;
  slug?: string;
  title?: string;
  pagePath?: string;
  contactEmail?: string;
};

export type SubmitResult = { ok: true; delivered?: string[] } | { ok: false; error: string };

function feedbackUrl(): string {
  const external = (import.meta.env.VITE_FEEDBACK_ENDPOINT as string | undefined)?.trim();
  return external || '/api/feedback';
}

async function postFeedback(body: Record<string, unknown>): Promise<SubmitResult> {
  try {
    const res = await fetch(feedbackUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      delivered?: string[];
    };
    if (!res.ok || data.ok === false) {
      return { ok: false, error: data.error || `Request failed (${res.status})` };
    }
    return { ok: true, delivered: data.delivered };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error sending feedback.',
    };
  }
}

/** Structured tutorial feedback → `/api/feedback` (or VITE_FEEDBACK_ENDPOINT). */
export async function submitTutorialFeedback(
  payload: TutorialFeedbackPayload
): Promise<SubmitResult> {
  return postFeedback({ kind: 'tutorial_feedback', ...payload });
}

/**
 * Free-form “report outdated / incorrect content” → same API with kind=content_report.
 * Queues locally if the API is unavailable so the control never dead-ends.
 */
export async function submitContentFeedback(
  payload: ContentFeedbackPayload
): Promise<{ ok: boolean; via: 'api' | 'local'; error?: string }> {
  const body = {
    kind: 'content_report' as const,
    message: payload.message.trim(),
    tutorialId: payload.tutorialId,
    tutorialSlug: payload.slug,
    tutorialTitle: payload.title,
    pagePath: payload.pagePath || (typeof window !== 'undefined' ? window.location.pathname : ''),
    contactEmail: payload.contactEmail,
    submittedAt: new Date().toISOString(),
  };

  trackEvent('content_feedback', {
    tutorialId: body.tutorialId,
    slug: body.tutorialSlug,
    hasMessage: Boolean(body.message),
  });

  const result = await postFeedback(body);
  if (result.ok === true) return { ok: true, via: 'api' };

  const apiError = result.ok === false ? result.error : 'Feedback API unavailable';
  try {
    const key = 'eet_feedback_queue';
    const prev = JSON.parse(localStorage.getItem(key) || '[]');
    const next = Array.isArray(prev) ? [...prev, body].slice(-40) : [body];
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // ignore quota
  }

  return { ok: true, via: 'local', error: apiError };
}

/** GET probe used by /feedback-inbox. */
export async function probeFeedbackBackend(): Promise<{
  configured: boolean;
  backends?: { webhook: boolean; resend: boolean; github: boolean };
  error?: string;
}> {
  const external = (import.meta.env.VITE_FEEDBACK_ENDPOINT as string | undefined)?.trim();
  if (external) {
    return {
      configured: true,
      backends: { webhook: true, resend: false, github: false },
    };
  }

  try {
    const res = await fetch('/api/feedback', { method: 'GET' });
    const data = (await res.json().catch(() => ({}))) as {
      configured?: boolean;
      backends?: { webhook: boolean; resend: boolean; github: boolean };
      error?: string;
    };
    if (!res.ok) {
      return { configured: false, error: data.error || `HTTP ${res.status}` };
    }
    return {
      configured: Boolean(data.configured),
      backends: data.backends,
    };
  } catch (err) {
    return {
      configured: false,
      error: err instanceof Error ? err.message : 'Probe failed',
    };
  }
}
