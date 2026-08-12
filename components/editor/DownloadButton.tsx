'use client';

import { useState } from 'react';
import { Check, Download, Loader2, Printer, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';

export function useDownloadPdf(resumeId: string, fileName: string) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  function download() {
    if (downloading) return;
    setDownloading(true);
    setDownloaded(false);

    // Start the real GET request directly from the user gesture. This avoids
    // mobile browsers blocking a synthetic `a.click()` after an async fetch.
    // The API responds with Content-Disposition: attachment, so the browser
    // owns the actual file download and streams it directly to Downloads.
    const endpoint = `/api/resume/${encodeURIComponent(resumeId)}/pdf`;
    const link = document.createElement('a');
    link.href = endpoint;
    link.download = fileName;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();

    // The server validates the generated PDF before returning it. We mark the
    // client action as started rather than pretending that a Blob was created.
    window.setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      window.setTimeout(() => setDownloaded(false), 2200);
      toast({ title: 'PDF download started', description: 'Your resume is being saved as a PDF.' });
    }, 350);
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
