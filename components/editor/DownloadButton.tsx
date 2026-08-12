'use client';

import { useState } from 'react';
import { Check, Download, Loader2, Printer, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';

export function useDownloadPdf(resumeId: string, fileName: string) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  async function download() {
    if (downloading) return;
    setDownloading(true);
    setDownloaded(false);

    try {
      const endpoint = `/api/resume/${encodeURIComponent(resumeId)}/pdf`;
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 75_000);

      const response = await fetch(endpoint, {
        method: 'GET',
        cache: 'no-store',
        credentials: 'include',
        headers: { Accept: 'application/pdf, application/json' },
        signal: controller.signal,
      });

      window.clearTimeout(timeout);

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        let message = `PDF generation failed (${response.status})`;
        if (contentType.includes('application/json')) {
          const body = await response.json().catch(() => null);
          if (body?.message) message = body.message;
          else if (body?.error) message = body.error;
        } else {
          const text = await response.text().catch(() => '');
          if (text) message = text.slice(0, 240);
        }
        throw new Error(message);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.toLowerCase().includes('application/pdf')) {
        throw new Error('The server returned an invalid PDF response. Please try again.');
      }

      const blob = await response.blob();
      if (!blob.size) {
        throw new Error('The generated PDF is empty. Please try again.');
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName || 'Orrica_Edge_Resume.pdf';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
      setDownloaded(true);
      window.setTimeout(() => setDownloaded(false), 2200);
      toast({ title: 'Resume downloaded', description: 'Your PDF is ready.' });
    } catch (error) {
      const message = error instanceof Error && error.name === 'AbortError'
        ? 'PDF generation timed out. Please try again.'
        : error instanceof Error
          ? error.message
          : 'Could not generate the PDF. Please try again.';

      toast({
        title: 'Download failed',
        description: message,
        variant: 'error',
      });
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
      <span>{downloading ? 'Preparing PDF…' : downloaded ? 'Downloaded' : 'Download PDF'}</span>
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
