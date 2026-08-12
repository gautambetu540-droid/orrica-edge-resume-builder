'use client';

import { useState } from 'react';
import { Check, Download, Loader2, Printer, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';

function triggerBlobDownload(blob: Blob, fileName: string) {
  if (!blob.size) throw new Error('Generated PDF is empty.');
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName || 'Orrica_Edge_Resume.pdf';
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

async function downloadFromServer(resumeId: string, fileName: string) {
  const endpoint = `/api/resume/${encodeURIComponent(resumeId)}/pdf`;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 75_000);

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
      headers: { Accept: 'application/pdf, application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.message || body?.error || `PDF generation failed (${response.status})`);
    }

    const type = (response.headers.get('content-type') || '').toLowerCase();
    if (!type.includes('application/pdf')) throw new Error('Server returned a non-PDF response.');

    const blob = await response.blob();
    if (blob.size < 100) throw new Error('Server returned an empty PDF.');
    triggerBlobDownload(blob, fileName);
  } finally {
    window.clearTimeout(timeout);
  }
}

async function downloadFromBrowser(fileName: string) {
  const source = document.getElementById('resume-document-root');
  if (!source) throw new Error('Resume preview is not available. Please open the resume editor and try again.');

  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = html2pdfModule.default;

  // Capture a clean A4 clone rather than the scaled mobile preview.
  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.querySelectorAll('[data-pdf-ignore="true"]').forEach((node) => node.remove());
  clone.style.width = '210mm';
  clone.style.minHeight = '297mm';
  clone.style.height = 'auto';
  clone.style.margin = '0';
  clone.style.transform = 'none';
  clone.style.boxShadow = 'none';
  clone.style.border = '0';
  clone.style.position = 'fixed';
  clone.style.left = '-100000px';
  clone.style.top = '0';
  clone.style.zIndex = '-1';
  clone.style.background = '#ffffff';
  clone.style.overflow = 'visible';

  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '-100000px';
  host.style.top = '0';
  host.style.width = '210mm';
  host.style.background = '#fff';
  host.appendChild(clone);
  document.body.appendChild(host);

  try {
    await document.fonts.ready;
    await html2pdf()
      .set({
        margin: 0,
        filename: fileName || 'Orrica_Edge_Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: Math.min(2, window.devicePixelRatio || 1.5),
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: 794,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        pagebreak: {
          mode: ['css', 'legacy'],
          avoid: ['.break-inside-avoid-page'],
        },
      })
      .from(clone)
      .save();
  } finally {
    host.remove();
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
      // Primary path: browser-side PDF. This does not depend on Vercel
      // Chromium, Lambda binaries, Puppeteer, or server execution limits.
      await downloadFromBrowser(fileName);
      setDownloaded(true);
      window.setTimeout(() => setDownloaded(false), 2200);
      toast({ title: 'Resume downloaded', description: 'Your PDF is ready.' });
    } catch (clientError) {
      // Fallback: retain the server renderer for environments where the
      // browser cannot render/capture the resume.
      try {
        await downloadFromServer(resumeId, fileName);
        setDownloaded(true);
        window.setTimeout(() => setDownloaded(false), 2200);
        toast({ title: 'Resume downloaded', description: 'Your PDF is ready.' });
      } catch (serverError) {
        const message = serverError instanceof Error
          ? serverError.message
          : clientError instanceof Error
            ? clientError.message
            : 'Could not generate the PDF. Please try again.';
        toast({ title: 'Download failed', description: message, variant: 'error' });
      }
    } finally {
      setDownloading(false);
    }
  }

  return { download, downloading, downloaded };
}

export function DownloadButton({
  resumeId,
  fileName,
  variant = 'default',
  className,
}: {
  resumeId: string;
  fileName: string;
  variant?: 'default' | 'outline';
  className?: string;
}) {
  const { download, downloading, downloaded } = useDownloadPdf(resumeId, fileName);

  return (
    <Button
      onClick={download}
      disabled={downloading}
      variant={variant}
      className={[
        variant === 'default'
          ? 'relative overflow-hidden border-0 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-white shadow-[0_8px_28px_-12px_rgba(249,115,22,.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-12px_rgba(249,115,22,.9)]'
          : '',
        className || '',
      ].join(' ')}
    >
      {downloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : downloaded ? (
        <Check className="h-4 w-4 animate-scale-in" />
      ) : (
        <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
      )}
      <span>{downloading ? 'Creating PDF…' : downloaded ? 'Downloaded' : 'Download PDF'}</span>
      {!downloading && !downloaded && variant === 'default' && (
        <Sparkles className="ml-0.5 h-3.5 w-3.5 opacity-70" />
      )}
    </Button>
  );
}

export function PrintButton({ resumeId }: { resumeId: string }) {
  function openPrint() {
    window.open(`/resume/${resumeId}/print`, '_blank', 'noopener,noreferrer');
  }

  return (
    <Button
      variant="outline"
      onClick={openPrint}
      className="border-neutral-200 bg-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50"
    >
      <Printer className="h-4 w-4" />
      Print Resume
    </Button>
  );
}
