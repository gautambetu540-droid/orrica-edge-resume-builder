'use client';

import { useState } from 'react';
import { Check, MessageSquare, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

const RATING_COPY = ['Very poor', 'Poor', 'Okay', 'Good', 'Excellent'];

export function DownloadFeedback({ resumeId, open, onOpenChange }: { resumeId: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submit() {
    if (!rating || submitting || submitted) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, rating, feedback }),
      });
      if (!response.ok) throw new Error('Could not save feedback');
      setSubmitted(true);
      window.setTimeout(() => onOpenChange(false), 1200);
    } catch (error) {
      console.error('Feedback submission failed', error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border border-neutral-200 p-0 shadow-2xl">
        {submitted ? (
          <div className="px-6 py-10 text-center sm:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-neutral-950">Thanks for the feedback</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Your feedback helps us make the resume builder better for everyone.</p>
          </div>
        ) : (
          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <MessageSquare className="h-5 w-5" />
            </div>
            <DialogTitle className="mt-5 text-2xl tracking-tight text-neutral-950">How was your resume-building experience?</DialogTitle>
            <DialogDescription className="mt-2 mb-0 leading-6">Your PDF is ready. One quick rating helps us understand what worked and what we should improve.</DialogDescription>

            <div className="mt-6">
              <div className="flex items-center justify-center gap-2" role="radiogroup" aria-label="Resume building experience rating">
                {RATING_COPY.map((label, index) => {
                  const value = index + 1;
                  const selected = rating >= value;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setRating(value)}
                      aria-label={`${value} out of 5, ${label}`}
                      aria-checked={rating === value}
                      role="radio"
                      className="rounded-xl p-2 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                    >
                      <Star className={`h-7 w-7 ${selected ? 'fill-orange-400 text-orange-400' : 'text-neutral-300'}`} />
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-center text-xs font-medium text-neutral-400">
                {rating ? RATING_COPY[rating - 1] : 'Tap a star to rate'}
              </div>
            </div>

            <label className="mt-6 block">
              <span className="text-xs font-bold text-neutral-700">What did you like, or what should we improve?</span>
              <textarea
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                maxLength={1200}
                rows={4}
                placeholder="The templates were great… / The PDF export could be faster…"
                className="mt-2 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm text-neutral-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
              />
              <span className="mt-1 block text-right text-[10px] text-neutral-400">{feedback.length}/1200</span>
            </label>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-10 rounded-lg border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-600 hover:bg-neutral-50">Maybe later</Button>
              <Button type="button" onClick={submit} disabled={!rating || submitting} className="h-10 rounded-lg bg-orange-500 px-5 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? 'Sending…' : 'Send feedback'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
