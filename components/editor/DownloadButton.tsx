'use client';

import { useState } from 'react';
import { Check, Download, Loader2, Printer, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';

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
    if (blob.size < 100) throw new Error('Server returned an empty PDF.');
    triggerBlobDownload(blob, fileName);
  } finally { window.clearTimeout(timeout); }
}

/**
 * The visible ResumeDocument is the single source of truth.
 * We clone that exact DOM, keep it fully renderable, and export the clone at
 * A4 CSS width. No alternate resume template/data is used for the PDF.
 */
async function downloadExactPreview(fileName: string) {
  const source = document.getElementById('resume-document-root');
  if (!source) throw new Error('Resume preview is not available.');

  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = (html2pdfModule as typeof html2pdfModule & { default?: typeof html2pdfModule }).default ?? html2pdfModule;
  if (typeof html2pdf !== 'function') throw new Error('PDF renderer failed to load.');

  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.style.width = '794px';
  clone.style.maxWidth = '794px';
  clone.style.minWidth = '794px';
  clone.style.height = 'auto';
  clone.style.minHeight = '1123px';
  clone.style.margin = '0';
  clone.style.transform = 'none';
  clone.style.boxShadow = 'none';
  clone.style.border = '0';
  clone.style.overflow = 'visible';
  clone.style.background = '#fff';
  clone.style.position = 'relative';
  clone.style.visibility = 'visible';
  clone.style.opacity = '1';
  clone.querySelectorAll('[data-pdf-ignore="true"]').forEach((node) => node.remove());

  // Put the fully visible clone below the current document rather than behind
  // the page. z-index:-1/visibility:hidden can cause html2canvas to paint white
  // pages on mobile Chrome. It is outside the user's viewport, but remains a
  // normal renderable element for the browser's layout/paint engine.
  const capture = document.createElement('div');
  capture.style.position = 'absolute';
  capture.style.left = '0';
  capture.style.top = `${Math.max(document.documentElement.scrollHeight, window.innerHeight) + 64}px`;
  capture.style.width = '794px';
  capture.style.height = 'auto';
  capture.style.overflow = 'visible';
  capture.style.background = '#fff';
  capture.style.pointerEvents = 'none';
  capture.style.zIndex = '0';
  capture.appendChild(clone);
  document.body.appendChild(capture);

  try {
    await document.fonts.ready;
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const rect = clone.getBoundingClientRect();
    if (rect.width < 700 || rect.height < 500) throw new Error('Preview could not be prepared for PDF export.');

    await html2pdf().set({
      margin: 0,
      filename: fileName || 'Orrica_Edge_Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: Math.max(Math.ceil(rect.height), 1123),
        width: 794,
        onclone: (clonedDocument: Document) => {
          const root = clonedDocument.querySelector('[data-resume-font]') as HTMLElement | null;
          if (root) {
            root.style.width = '794px';
            root.style.maxWidth = '794px';
            root.style.minWidth = '794px';
            root.style.height = 'auto';
            root.style.minHeight = '1123px';
            root.style.overflow = 'visible';
            root.style.transform = 'none';
          }
        },
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: { mode: ['css', 'legacy'], avoid: ['.break-inside-avoid-page'] },
    }).from(clone).save();
  } finally {
    capture.remove();
  }
}

export function useDownloadPdf(resumeId: string, fileName: string) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  async function download() {
    if (downloading) return;
    setDownloading(true);
    setDownloaded(false);
    try {
      await downloadExactPreview(fileName);
      setDownloaded(true);
      window.setTimeout(() => setDownloaded(false), 2200);
      toast({ title: 'Resume downloaded', description: 'The PDF matches your current preview.' });
    } catch (previewError) {
      try {
        await downloadFromServer(resumeId, fileName);
        setDownloaded(true);
        window.setTimeout(() => setDownloaded(false), 2200);
        toast({ title: 'Resume downloaded', description: 'Your complete resume PDF is ready.' });
      } catch (serverError) {
        const message = serverError instanceof Error ? serverError.message : previewError instanceof Error ? previewError.message : 'Could not generate the PDF.';
        console.error('Resume PDF download failed', { previewError, serverError });
        toast({ title: 'Download failed', description: message, variant: 'error' });
      }
    } finally { setDownloading(false); }
  }

  return { download, downloading, downloaded };
}

export function DownloadButton({ resumeId, fileName, variant = 'default', className }: { resumeId: string; fileName: string; variant?: 'default' | 'outline'; className?: string }) {
  const { download, downloading, downloaded } = useDownloadPdf(resumeId, fileName);
  return (
    <Button onClick={download} disabled={downloading} variant={variant} className={[variant === 'default' ? 'group relative overflow-hidden border-0 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-white shadow-[0_8px_28px_-12px_rgba(249,115,22,.8)] transition-all duration-300 hover:-translate-y-0.5' : '', className || ''].join(' ')}>
      {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : downloaded ? <Check className="h-4 w-4 animate-scale-in" /> : <Download className="h-4 w-4" />}
      <span>{downloading ? 'Creating PDF…' : downloaded ? 'Downloaded' : 'Download PDF'}</span>
      {!downloading && !downloaded && variant === 'default' && <Sparkles className="ml-0.5 h-3.5 w-3.5 opacity-70" />}
    </Button>
  );
}

export function PrintButton({ resumeId }: { resumeId: string }) {
  return <Button variant="outline" onClick={() => window.open(`/resume/${resumeId}/print`, '_blank', 'noopener,noreferrer')} className="border-neutral-200 bg-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50"><Printer className="h-4 w-4" />Print Resume</Button>;
}
