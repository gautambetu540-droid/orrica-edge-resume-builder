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
      const res = await fetch(`/api/resume/${resumeId}/pdf`, {
        method: 'GET',
        cache: 'no-store',
        credentials: 'include',
        headers: { Accept: 'application/pdf, application/json' },
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || `PDF generation failed (${res.status})`);
      }

      const blob = await res.blob();
      if (!blob.size || blob.type !== 'application/pdf') {
        throw new Error('The PDF response was empty or invalid. Please try again.');
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Keep the object URL alive briefly so Chromium completes the download.
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setDownloaded(true);
      window.setTimeout(() => setDownloaded(false), 2200);
      toast({ title: 'Resume downloaded', description: 'Your PDF is ready.' });
    } catch (err) {
      toast({
        title: 'Could not generate PDF',
        description: (err as Error).message,
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
