'use client';

import { useState } from 'react';
import { Check, Download, Loader2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { DownloadFeedback } from './DownloadFeedback';

function triggerBlobDownload(blob: Blob, fileName: string) {
  if (!blob.size) throw new Error('Generated PDF is empty.');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'Orrica_Edge_Resume.pdf';
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

async function downloadFromServer(resumeId: string, fileName: string) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 75_000);
  try {
    const response = await fetch(`/api/resume/${encodeURIComponent(resumeId)}/pdf`, {
      method: 'GET', cache: 'no-store', credentials: 'include',
      headers: { Accept: 'application/pdf, application/json' }, signal: controller.signal,
    });
    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (!response.ok) {
      const body = contentType.includes('application/json') ? await response.json().catch(() => null) : null;
      throw new Error(body?.message || body?.error || `PDF generation failed (${response.status})`);
    }
    if (!contentType.includes('application/pdf')) throw new Error('Server returned a non-PDF response.');
    const blob = await response.blob();
    if (blob.size < 100 || (blob.type && !blob.type.toLowerCase().includes('pdf'))) throw new Error('Server returned an invalid PDF.');
    triggerBlobDownload(blob, fileName);
  } finally { window.clearTimeout(timeout); }
}

export function useDownloadPdf(resumeId: string, fileName: string) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  async function download() {
    if (downloading) return;
    setDownloading(true); setDownloaded(false);
    try {
      await downloadFromServer(resumeId, fileName);
      setDownloaded(true);
      window.setTimeout(() => setDownloaded(false), 2200);
      toast({ title: 'Resume downloaded', description: 'High-quality A4 PDF exported from the same resume source used by the live preview.' });
      window.setTimeout(() => setFeedbackOpen(true), 700);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not generate the PDF.';
      console.error('Resume PDF download failed', error);
      toast({ title: 'Download failed', description: message, variant: 'error' });
    } finally { setDownloading(false); }
  }

  return { download, downloading, downloaded, feedbackOpen, setFeedbackOpen };
}

export function DownloadButton({ resumeId, fileName, variant = 'default', className }: { resumeId: string; fileName: string; variant?: 'default' | 'outline'; className?: string }) {
  const { download, downloading, downloaded, feedbackOpen, setFeedbackOpen } = useDownloadPdf(resumeId, fileName);
  return (
    <>
      <Button onClick={download} disabled={downloading} variant={variant === 'default' ? 'outline' : variant} className={['h-10 rounded-lg border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-none transition-colors hover:bg-neutral-50 hover:text-neutral-950', className || ''].join(' ')}>
        {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : downloaded ? <Check className="h-4 w-4 text-emerald-600" /> : <Download className="h-4 w-4" />}
        <span>{downloading ? 'Creating PDF…' : downloaded ? 'Downloaded' : 'Download PDF'}</span>
      </Button>
      <DownloadFeedback resumeId={resumeId} open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
}

export function PrintButton({ resumeId }: { resumeId: string }) {
  return <Button variant="outline" onClick={() => window.open(`/resume/${resumeId}/print`, '_blank', 'noopener,noreferrer')} className="h-10 rounded-lg border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-none hover:bg-neutral-50 hover:text-neutral-950"><Printer className="h-4 w-4" />Print Resume</Button>;
}
