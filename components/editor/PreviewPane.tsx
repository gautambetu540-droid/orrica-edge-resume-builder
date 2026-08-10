'use client';

import { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeDocument } from '@/components/templates/ResumeDocument';
import { ResumeData, ResumeSettings } from '@/lib/types/resume';

const A4_WIDTH_PX = 794; // 210mm at 96dpi
const A4_HEIGHT_PX = 1123; // 297mm at 96dpi

export function PreviewPane({ data, settings }: { data: ResumeData; settings: ResumeSettings }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = useState(1);
  const [zoom, setZoom] = useState<number | null>(null); // null = fit to screen

  useEffect(() => {
    function recompute() {
      const el = containerRef.current;
      if (!el) return;
      const padding = 32;
      const availableWidth = el.clientWidth - padding;
      const scale = Math.min(1, availableWidth / A4_WIDTH_PX);
      setAutoScale(scale);
    }
    recompute();
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recompute);
    };
  }, []);

  const effectiveScale = zoom ?? autoScale;

  return (
    <div className="flex flex-col h-full bg-neutral-100">
      <div className="flex items-center justify-center gap-1 py-2 border-b bg-white no-print">
        <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.max(0.4, (z ?? autoScale) - 0.1))}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs w-12 text-center tabular-nums text-muted-foreground">
          {Math.round(effectiveScale * 100)}%
        </span>
        <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.min(2, (z ?? autoScale) + 0.1))}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setZoom(null)} aria-label="Fit to screen">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      <div ref={containerRef} className="flex-1 overflow-auto flex justify-center py-6">
        <div
          style={{
            width: A4_WIDTH_PX * effectiveScale,
            height: A4_HEIGHT_PX * effectiveScale,
          }}
        >
          <div
            style={{
              width: A4_WIDTH_PX,
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top left',
            }}
          >
            <ResumeDocument data={data} settings={settings} />
          </div>
        </div>
      </div>
    </div>
  );
}
