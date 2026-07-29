import React, { useId, useRef, useState } from 'react';
import { Flag, X } from 'lucide-react';
import { submitContentFeedback } from '../utils/feedback';
import { useModalA11y } from '../utils/useModalA11y';

interface ReportContentControlProps {
  tutorialId?: string;
  slug?: string;
  title?: string;
  compact?: boolean;
}

/** Lets visitors report outdated or incorrect catalog content into the feedback API. */
export const ReportContentControl: React.FC<ReportContentControlProps> = ({
  tutorialId,
  slug,
  title,
  compact = false,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'sent_local' | 'error'>('idle');
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useModalA11y(open, dialogRef, () => setOpen(false));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus('sending');
    try {
      const result = await submitContentFeedback({
        message,
        tutorialId,
        slug,
        title,
        contactEmail: email.trim() || undefined,
      });
      setStatus(result.via === 'local' ? 'sent_local' : 'sent');
      setMessage('');
      setTimeout(() => {
        setOpen(false);
        setStatus('idle');
      }, 1400);
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          compact
            ? 'inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-amber-300 transition-colors'
            : 'inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-amber-800/60 rounded-lg px-2.5 py-1.5 transition-colors'
        }
      >
        <Flag className="w-3 h-3" />
        <span>Report outdated or incorrect content</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4 shadow-2xl text-slate-100"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id={titleId} className="text-sm font-bold text-white">
                  Report outdated or incorrect content
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Tell us what is wrong{title ? ` on “${title}”` : ''}. Reports go to the library
                  feedback endpoint (or email fallback).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Close report form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <label className="block space-y-1">
                <span className="text-[11px] font-mono uppercase text-slate-500">What is wrong?</span>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  placeholder="Wrong video, outdated steps, broken link, incorrect product tag…"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-mono uppercase text-slate-500">
                  Email (optional)
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  placeholder="so we can follow up"
                />
              </label>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-slate-500 font-mono">
                  {status === 'sent'
                    ? 'Thanks — report received by API.'
                    : status === 'sent_local'
                      ? 'Saved locally (API unavailable); we will sync later.'
                      : status === 'error'
                        ? 'Could not send; try again.'
                        : slug
                          ? `slug: ${slug}`
                          : 'site-wide report'}
                </p>
                <button
                  type="submit"
                  disabled={status === 'sending' || !message.trim()}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold"
                >
                  {status === 'sending' ? 'Sending…' : 'Submit report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
