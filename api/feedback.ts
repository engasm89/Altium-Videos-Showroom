/**
 * Vercel serverless endpoint: POST /api/feedback
 *
 * Stores feedback centrally (not localStorage). Configure one of:
 * - FEEDBACK_WEBHOOK_URL  → POST JSON (JSONBin / Zapier / Make / n8n / Formspree)
 * - RESEND_API_KEY + FEEDBACK_TO_EMAIL → email via Resend
 * - GITHUB_TOKEN + GITHUB_FEEDBACK_REPO → open a GitHub issue (owner/repo)
 *
 * Body kinds:
 * - tutorial_feedback (default) — structured tutorial survey
 * - content_report — free-form “outdated / incorrect” report
 *
 * GET returns a short status probe for /feedback-inbox.
 */

export const config = { runtime: 'edge' };

const MAX_TEXT = 4000;

type UsefulAnswer = 'yes' | 'no' | 'partial';
type WorkflowAnswer = 'yes' | 'no' | 'partial' | 'n_a';
type AltiumProductAnswer =
  | 'Altium Designer'
  | 'Altium 365'
  | 'Altium Develop'
  | 'Multiple'
  | 'None yet';

type FeedbackKind = 'tutorial_feedback' | 'content_report';

interface IncomingBody {
  kind?: FeedbackKind | string;
  tutorialId?: string;
  tutorialSlug?: string;
  tutorialTitle?: string;
  useful?: UsefulAnswer;
  workflowWorked?: WorkflowAnswer;
  unclear?: string;
  nextWorkflow?: string;
  role?: string;
  altiumProduct?: AltiumProductAnswer;
  message?: string;
  pagePath?: string;
  contactEmail?: string;
  submittedAt?: string;
}

interface TutorialStored {
  kind: 'tutorial_feedback';
  tutorialId: string;
  tutorialSlug: string;
  tutorialTitle: string;
  useful: UsefulAnswer;
  workflowWorked: WorkflowAnswer;
  unclear: string;
  nextWorkflow: string;
  role: string;
  altiumProduct: AltiumProductAnswer;
  submittedAt: string;
  userAgent: string;
}

interface ContentStored {
  kind: 'content_report';
  message: string;
  tutorialId: string;
  tutorialSlug: string;
  tutorialTitle: string;
  pagePath: string;
  contactEmail: string;
  submittedAt: string;
  userAgent: string;
}

type StoredPayload = TutorialStored | ContentStored;

const USEFUL = new Set<UsefulAnswer>(['yes', 'no', 'partial']);
const WORKFLOW = new Set<WorkflowAnswer>(['yes', 'no', 'partial', 'n_a']);
const PRODUCTS = new Set<AltiumProductAnswer>([
  'Altium Designer',
  'Altium 365',
  'Altium Develop',
  'Multiple',
  'None yet',
]);

function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(request: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request),
    },
  });
}

function clip(value: unknown, max = MAX_TEXT): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function backendStatus() {
  const webhook = Boolean(process.env.FEEDBACK_WEBHOOK_URL);
  const resend = Boolean(process.env.RESEND_API_KEY && process.env.FEEDBACK_TO_EMAIL);
  const github = Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_FEEDBACK_REPO);
  return {
    configured: webhook || resend || github,
    backends: { webhook, resend, github },
  };
}

function validateTutorial(
  body: IncomingBody,
  userAgent: string
): { ok: true; data: TutorialStored } | { ok: false; error: string } {
  const tutorialId = clip(body.tutorialId, 120);
  if (!tutorialId) return { ok: false, error: 'tutorialId is required.' };

  if (!body.useful || !USEFUL.has(body.useful)) {
    return { ok: false, error: 'useful must be yes, no, or partial.' };
  }
  if (!body.workflowWorked || !WORKFLOW.has(body.workflowWorked)) {
    return { ok: false, error: 'workflowWorked must be yes, no, partial, or n_a.' };
  }
  if (!body.altiumProduct || !PRODUCTS.has(body.altiumProduct)) {
    return { ok: false, error: 'altiumProduct is required.' };
  }

  const role = clip(body.role, 200);
  if (!role) return { ok: false, error: 'role is required.' };

  return {
    ok: true,
    data: {
      kind: 'tutorial_feedback',
      tutorialId,
      tutorialSlug: clip(body.tutorialSlug, 200),
      tutorialTitle: clip(body.tutorialTitle, 300),
      useful: body.useful,
      workflowWorked: body.workflowWorked,
      unclear: clip(body.unclear),
      nextWorkflow: clip(body.nextWorkflow),
      role,
      altiumProduct: body.altiumProduct,
      submittedAt: new Date().toISOString(),
      userAgent,
    },
  };
}

function validateContentReport(
  body: IncomingBody,
  userAgent: string
): { ok: true; data: ContentStored } | { ok: false; error: string } {
  const message = clip(body.message);
  if (!message) return { ok: false, error: 'message is required.' };

  return {
    ok: true,
    data: {
      kind: 'content_report',
      message,
      tutorialId: clip(body.tutorialId, 120),
      tutorialSlug: clip(body.tutorialSlug, 200),
      tutorialTitle: clip(body.tutorialTitle, 300),
      pagePath: clip(body.pagePath, 300),
      contactEmail: clip(body.contactEmail, 200),
      submittedAt: clip(body.submittedAt, 40) || new Date().toISOString(),
      userAgent,
    },
  };
}

function summaryLine(payload: StoredPayload): string {
  if (payload.kind === 'tutorial_feedback') {
    return `[Tutorial feedback] ${payload.tutorialTitle || payload.tutorialId} · useful=${payload.useful}`;
  }
  return `[Content report] ${payload.tutorialTitle || payload.tutorialId || payload.pagePath || 'site'}`;
}

function plainText(payload: StoredPayload): string {
  if (payload.kind === 'tutorial_feedback') {
    return [
      `Kind: tutorial_feedback`,
      `Tutorial: ${payload.tutorialTitle || '(untitled)'}`,
      `ID: ${payload.tutorialId}`,
      `Slug: ${payload.tutorialSlug || '—'}`,
      `Useful: ${payload.useful}`,
      `Workflow worked: ${payload.workflowWorked}`,
      `Role: ${payload.role}`,
      `Altium product: ${payload.altiumProduct}`,
      '',
      'What was unclear:',
      payload.unclear || '(none)',
      '',
      'Cover next:',
      payload.nextWorkflow || '(none)',
      '',
      `Submitted: ${payload.submittedAt}`,
      `UA: ${payload.userAgent || '—'}`,
    ].join('\n');
  }

  return [
    `Kind: content_report`,
    `Tutorial: ${payload.tutorialTitle || '(none)'}`,
    `ID: ${payload.tutorialId || '—'}`,
    `Slug: ${payload.tutorialSlug || '—'}`,
    `Page: ${payload.pagePath || '—'}`,
    `Contact: ${payload.contactEmail || '—'}`,
    '',
    'Report:',
    payload.message,
    '',
    `Submitted: ${payload.submittedAt}`,
    `UA: ${payload.userAgent || '—'}`,
  ].join('\n');
}

function githubMarkdown(payload: StoredPayload): string {
  if (payload.kind === 'tutorial_feedback') {
    return [
      '## Tutorial feedback',
      '',
      `| Field | Value |`,
      `| --- | --- |`,
      `| Tutorial | ${payload.tutorialTitle || '—'} |`,
      `| ID | \`${payload.tutorialId}\` |`,
      `| Slug | \`${payload.tutorialSlug || '—'}\` |`,
      `| Useful? | ${payload.useful} |`,
      `| Workflow worked? | ${payload.workflowWorked} |`,
      `| Role | ${payload.role} |`,
      `| Altium product | ${payload.altiumProduct} |`,
      `| Submitted | ${payload.submittedAt} |`,
      '',
      '### What was unclear?',
      payload.unclear || '_None_',
      '',
      '### Cover next',
      payload.nextWorkflow || '_None_',
    ].join('\n');
  }

  return [
    '## Content report',
    '',
    `| Field | Value |`,
    `| --- | --- |`,
    `| Tutorial | ${payload.tutorialTitle || '—'} |`,
    `| ID | \`${payload.tutorialId || '—'}\` |`,
    `| Slug | \`${payload.tutorialSlug || '—'}\` |`,
    `| Page | ${payload.pagePath || '—'} |`,
    `| Contact | ${payload.contactEmail || '—'} |`,
    `| Submitted | ${payload.submittedAt} |`,
    '',
    '### Report',
    payload.message,
  ].join('\n');
}

async function deliverWebhook(payload: StoredPayload): Promise<void> {
  const url = process.env.FEEDBACK_WEBHOOK_URL;
  if (!url) return;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Webhook failed (${res.status}): ${text.slice(0, 200)}`);
  }
}

async function deliverResend(payload: StoredPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.FEEDBACK_TO_EMAIL;
  if (!apiKey || !to) return;

  const from = process.env.FEEDBACK_FROM_EMAIL || 'EET Library Feedback <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: summaryLine(payload).slice(0, 200),
      text: plainText(payload),
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Resend failed (${res.status}): ${errText.slice(0, 200)}`);
  }
}

async function deliverGitHub(payload: StoredPayload): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_FEEDBACK_REPO;
  if (!token || !repo) return;

  const label = payload.kind === 'content_report' ? 'content-report' : 'tutorial-feedback';
  const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      title: summaryLine(payload).slice(0, 200),
      body: githubMarkdown(payload),
      labels: [label],
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`GitHub issue failed (${res.status}): ${errText.slice(0, 200)}`);
  }
}

async function storeFeedback(payload: StoredPayload): Promise<string[]> {
  const status = backendStatus();
  if (!status.configured) {
    throw new Error(
      'Feedback backend not configured. Set FEEDBACK_WEBHOOK_URL, or RESEND_API_KEY + FEEDBACK_TO_EMAIL, or GITHUB_TOKEN + GITHUB_FEEDBACK_REPO.'
    );
  }

  const delivered: string[] = [];
  if (status.backends.webhook) {
    await deliverWebhook(payload);
    delivered.push('webhook');
  }
  if (status.backends.resend) {
    await deliverResend(payload);
    delivered.push('resend');
  }
  if (status.backends.github) {
    await deliverGitHub(payload);
    delivered.push('github');
  }
  return delivered;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  if (request.method === 'GET') {
    const status = backendStatus();
    return json(request, {
      ok: true,
      service: 'tutorial-feedback',
      ...status,
      inboxHint:
        'Submissions are stored on the configured backend (webhook / Resend / GitHub Issues). This endpoint does not list past feedback.',
    });
  }

  if (request.method !== 'POST') {
    return json(request, { ok: false, error: 'Method not allowed.' }, 405);
  }

  let body: IncomingBody;
  try {
    body = (await request.json()) as IncomingBody;
  } catch {
    return json(request, { ok: false, error: 'Invalid JSON body.' }, 400);
  }

  const userAgent = clip(request.headers.get('user-agent') || '', 500);
  const kind = (body.kind || 'tutorial_feedback') as FeedbackKind;

  const validated =
    kind === 'content_report' ? validateContentReport(body, userAgent) : validateTutorial(body, userAgent);

  if (validated.ok === false) {
    return json(request, { ok: false, error: validated.error }, 400);
  }

  try {
    const delivered = await storeFeedback(validated.data);
    return json(request, { ok: true, delivered, kind: validated.data.kind });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to store feedback.';
    console.error('[api/feedback]', message);
    return json(request, { ok: false, error: message }, 502);
  }
}
