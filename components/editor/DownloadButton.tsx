'use client';

import { useState } from 'react';
import { Download, Loader2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';

export function useDownloadPdf(resumeId: string, fileName: string) {
  const [downloading, setDownloading] = useState(false);

  async function download() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/resume/${resumeId}/pdf`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'PDF generation failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast({ title: 'Could not generate PDF', description: (err as Error).message, variant: 'error' });
    } finally {
      setDownloading(false);
    }
  }

  return { download, downloading };
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
  const { download, downloading } = useDownloadPdf(resumeId, fileName);

  return (
    <Button onClick={download} disabled={downloading} variant={variant} className={className}>
      {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      Download PDF
    </Button>
  );
}

export function PrintButton({ resumeId }: { resumeId: string }) {
  function openPrint() {
    window.open(`/resume/${resumeId}/print`, '_blank', 'noopener,noreferrer');
  }
  return (
    <Button variant="outline" onClick={openPrint}>
      <Printer className="h-4 w-4" /> Print Resume
    </Button>
  );
}
