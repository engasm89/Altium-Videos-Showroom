import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { Tutorial } from '../types';
import { Button } from './ui';
import {
  AltiumProductAnswer,
  UsefulAnswer,
  WorkflowAnswer,
  submitTutorialFeedback,
} from '../utils/feedback';
import { trackEvent } from '../utils/analytics';

interface TutorialFeedbackFormProps {
  tutorial: Tutorial;
}

const ROLE_OPTIONS = [
  'Hardware & PCB Engineer',
  'Procurement & Component Specialist',
  'Manufacturing / Quality Engineer',
  'Product / Applications Engineer',
  'Engineering Manager / Lead',
  'Compliance / Sustainability',
  'Student / Educator',
  'Other',
] as const;

const fieldClass =
  'w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20';

const labelClass = 'block text-xs font-medium text-slate-300 mb-1.5';

export const TutorialFeedbackForm: React.FC<TutorialFeedbackFormProps> = ({ tutorial }) => {
  const [useful, setUseful] = useState<UsefulAnswer | ''>('');
  const [workflowWorked, setWorkflowWorked] = useState<WorkflowAnswer | ''>('');
  const [unclear, setUnclear] = useState('');
  const [nextWorkflow, setNextWorkflow] = useState('');
  const [role, setRole] = useState('');
  const [roleOther, setRoleOther] = useState('');
  const [altiumProduct, setAltiumProduct] = useState<AltiumProductAnswer | ''>('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setUseful('');
    setWorkflowWorked('');
    setUnclear('');
    setNextWorkflow('');
    setRole('');
    setRoleOther('');
    setAltiumProduct('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!useful || !workflowWorked || !altiumProduct) {
      setStatus('error');
      setErrorMessage('Please answer the required questions.');
      return;
    }

    const resolvedRole = role === 'Other' ? roleOther.trim() : role.trim();
    if (!resolvedRole) {
      setStatus('error');
      setErrorMessage('Please tell us your role.');
      return;
    }

    setStatus('submitting');
    const result = await submitTutorialFeedback({
      tutorialId: tutorial.id,
      tutorialSlug: tutorial.slug,
      tutorialTitle: tutorial.title,
      useful,
      workflowWorked,
      unclear: unclear.trim(),
      nextWorkflow: nextWorkflow.trim(),
      role: resolvedRole,
      altiumProduct,
    });

    if (result.ok === false) {
      setStatus('error');
      setErrorMessage(result.error);
      trackEvent('tutorial_feedback_error', { tutorialId: tutorial.id });
      return;
    }

    trackEvent('tutorial_feedback_submit', {
      tutorialId: tutorial.id,
      useful,
      workflowWorked,
      altiumProduct,
    });
    setStatus('success');
    resetForm();
  };

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-emerald-800/80 bg-emerald-950/40 p-5 space-y-3">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">Thanks — feedback sent</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your responses were stored centrally for the EET team (not in this browser). They help
              prioritize the next Altium Develop and Designer workflows we cover.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setStatus('idle')}
        >
          Send more feedback
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="text-sm font-semibold text-white">Tutorial feedback</h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Optional but valuable. Answers are sent to our central inbox — not saved in localStorage.
        </p>
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Was this useful? *</legend>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['yes', 'Yes'],
              ['partial', 'Somewhat'],
              ['no', 'No'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setUseful(value)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                useful === value
                  ? 'bg-brand/20 border-brand text-white'
                  : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Did the workflow work as demonstrated? *</legend>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['yes', 'Yes'],
              ['partial', 'Partially'],
              ['no', 'No'],
              ['n_a', 'Did not try'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setWorkflowWorked(value)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                workflowWorked === value
                  ? 'bg-brand/20 border-brand text-white'
                  : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`feedback-unclear-${tutorial.id}`} className={labelClass}>
          What was unclear?
        </label>
        <textarea
          id={`feedback-unclear-${tutorial.id}`}
          rows={3}
          value={unclear}
          onChange={(e) => setUnclear(e.target.value)}
          placeholder="Steps, UI labels, prerequisites, or missing context…"
          className={fieldClass}
          maxLength={4000}
        />
      </div>

      <div>
        <label htmlFor={`feedback-next-${tutorial.id}`} className={labelClass}>
          What Altium Develop workflow should we cover next?
        </label>
        <textarea
          id={`feedback-next-${tutorial.id}`}
          rows={2}
          value={nextWorkflow}
          onChange={(e) => setNextWorkflow(e.target.value)}
          placeholder="e.g. requirements linking, BOM collaboration, ECAD–MCAD…"
          className={fieldClass}
          maxLength={4000}
        />
      </div>

      <div>
        <label htmlFor={`feedback-role-${tutorial.id}`} className={labelClass}>
          What is your role? *
        </label>
        <select
          id={`feedback-role-${tutorial.id}`}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={fieldClass}
          required
        >
          <option value="">Select a role…</option>
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {role === 'Other' && (
          <input
            type="text"
            value={roleOther}
            onChange={(e) => setRoleOther(e.target.value)}
            placeholder="Your role / title"
            className={`${fieldClass} mt-2`}
            maxLength={200}
            required
          />
        )}
      </div>

      <div>
        <label htmlFor={`feedback-product-${tutorial.id}`} className={labelClass}>
          Are you using Altium Designer, Altium 365, or Altium Develop? *
        </label>
        <select
          id={`feedback-product-${tutorial.id}`}
          value={altiumProduct}
          onChange={(e) => setAltiumProduct(e.target.value as AltiumProductAnswer)}
          className={fieldClass}
          required
        >
          <option value="">Select…</option>
          <option value="Altium Designer">Altium Designer</option>
          <option value="Altium 365">Altium 365</option>
          <option value="Altium Develop">Altium Develop</option>
          <option value="Multiple">More than one</option>
          <option value="None yet">None yet</option>
        </select>
      </div>

      {status === 'error' && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-800/80 bg-rose-950/40 px-3 py-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-200 leading-relaxed">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="sm"
        disabled={status === 'submitting'}
        icon={
          status === 'submitting' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )
        }
      >
        {status === 'submitting' ? 'Sending…' : 'Send feedback'}
      </Button>
    </form>
  );
};
