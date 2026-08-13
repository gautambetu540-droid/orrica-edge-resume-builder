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
    const response = await fetch(`/api/resume/${encodeURIComponent(resumeId)}/pdf`, { method: 'GET', cache: 'no-store', credentials: 'include', headers: { Accept: 'application/pdf, application/json' }, signal: controller.signal });
    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (!response.ok) {
      const body = contentType.includes('application/json') ? await response.json().catch(() => null) : null;
      throw new Error(body?.message || body?.error || `PDF generation failed (${response.status})`);
    }
    if (!contentType.includes('application/pdf')) throw new Error('Server returned a non-PDF response.');
    const blob = await response.blob();
    if (blob.size < 100 || blob.type && !blob.type.toLowerCase().includes('pdf')) throw new Error('Server returned an invalid PDF.');
    triggerBlobDownload(blob, fileName);
  } finally { window.clearTimeout(timeout); }
}

const nextFrame = () => new Promise<void>((resolve) => {
  requestAnimationFrame(() => { requestAnimationFrame(() => resolve()); });
});

async function downloadExactPreview(fileName: string) {
  const source = document.getElementById('resume-document-root') as HTMLElement | null;
  if (!source) throw new Error('Resume preview is not available.');
  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = (html2pdfModule as typeof html2pdfModule & { default?: typeof html2pdfModule }).default ?? html2pdfModule;
  if (typeof html2pdf !== 'function') throw new Error('PDF renderer failed to load.');

  await document.fonts.ready;
  await Promise.all(Array.from(source.querySelectorAll('img')).map((img) => img.complete ? Promise.resolve() : new Promise<void>((resolve) => {
    const done = () => { img.removeEventListener('load', done); img.removeEventListener('error', done); resolve(); };
    img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true });
  })));
  await nextFrame();

  const capture = document.createElement('div');
  Object.assign(capture.style, { position: 'fixed', left: '0', top: '0', width: '794px', margin: '0', padding: '0', overflow: 'visible', background: '#fff', pointerEvents: 'none', zIndex: '2147483647', opacity: '0.001' });
  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  Object.assign(clone.style, { width: '794px', maxWidth: '794px', minWidth: '794px', height: 'auto', minHeight: '1122px', margin: '0', transform: 'none', boxShadow: 'none', border: '0', overflow: 'visible', background: '#fff', visibility: 'visible', opacity: '1' });
  clone.querySelectorAll('[data-pdf-ignore="true"]').forEach((node) => node.remove());
  capture.appendChild(clone); document.body.appendChild(capture);

  try {
    await nextFrame();
    const rect = clone.getBoundingClientRect();
    if (rect.width < 700 || rect.height < 500) throw new Error('Resume preview is not ready for PDF export.');
    const a4HeightPx = 1122.52;
    const contentPages = Math.max(1, Math.ceil((rect.height - 1) / a4HeightPx));
    await html2pdf().set({
      margin: 0,
      filename: fileName || 'Orrica_Edge_Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, allowTaint: false, backgroundColor: '#ffffff', logging: false, scrollX: 0, scrollY: 0, windowWidth: 794, windowHeight: Math.max(1123, Math.ceil(rect.height)), width: 794 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: { mode: ['css'], avoid: ['.break-inside-avoid-page', '.avoid-page-break'] },
    }).from(clone).save();
    if (contentPages < 1) throw new Error('Could not determine PDF page count.');
  } finally { capture.remove(); }
}

export function useDownloadPdf(resumeId: string, fileName: string) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  async function download() {
    if (downloading) return;
    setDownloading(true); setDownloaded(false);
    let success = false;
    try {
      await downloadFromServer(resumeId, fileName);
      success = true;
      setDownloaded(true); window.setTimeout(() => setDownloaded(false), 2200);
      toast({ title: 'Resume downloaded', description: 'The PDF uses the same A4 layout as your preview.' });
    } catch (serverError) {
      try {
        await downloadExactPreview(fileName);
        success = true;
        setDownloaded(true); window.setTimeout(() => setDownloaded(false), 2200);
        toast({ title: 'Resume downloaded', description: 'PDF exported from the live preview.' });
      } catch (previewError) {
        const message = serverError instanceof Error ? serverError.message : previewError instanceof Error ? previewError.message : 'Could not generate the PDF.';
        console.error('Resume PDF download failed', { serverError, previewError });
        toast({ title: 'Download failed', description: message, variant: 'error' });
      }
    } finally {
      setDownloading(false);
      if (success) window.setTimeout(() => setFeedbackOpen(true), 700);
    }
  }

  return { download, downloading, downloaded, feedbackOpen, setFeedbackOpen };
}

export function DownloadButton({ resumeId, fileName, variant = 'default', className }: { resumeId: string; fileName: string; variant?: 'default' | 'outline'; className?: string }) {
  const { download, downloading, downloaded, feedbackOpen, setFeedbackOpen } = useDownloadPdf(resumeId, fileName);
  return (
    <>
      <Button
        onClick={download}
        disabled={downloading}
        variant={variant === 'default' ? 'outline' : variant}
        className={[
          'h-10 rounded-lg border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-none transition-colors hover:bg-neutral-50 hover:text-neutral-950',
          className || '',
        ].join(' ')}
      >
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
