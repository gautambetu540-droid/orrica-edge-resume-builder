'use client';

import { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeDocument } from '@/components/templates/ResumeDocument';
import { ResumeData, ResumeSettings } from '@/lib/types/resume';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const PREVIEW_GUTTER = 24;

export function PreviewPane({ data, settings, activeSection = '' }: { data: ResumeData; settings: ResumeSettings; activeSection?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = useState(0.5);
  const [zoom, setZoom] = useState<number | null>(null);

  useEffect(() => {
    const recompute = () => {
      const el = containerRef.current;
      if (!el) return;
      const availableWidth = Math.max(0, el.clientWidth - PREVIEW_GUTTER * 2);
      const widthScale = availableWidth / A4_WIDTH_PX;
      // Fit to the available width; vertical scrolling keeps long resumes readable
      // instead of shrinking the entire document to fit the viewport height.
      setAutoScale(Math.max(0.42, Math.min(0.92, widthScale)));
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', recompute);
    return () => { ro.disconnect(); window.removeEventListener('resize', recompute); };
  }, []);

  const effectiveScale = zoom ?? autoScale;
  const canvasWidth = Math.round(A4_WIDTH_PX * effectiveScale);

  return (
    <div className="preview-pane flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-[#f5f6f8]">
      <div className="relative flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 no-print">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Sparkles className="h-4 w-4" /></span>
          <span>Live resume preview</span>
          <span className="hidden rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700 sm:inline-flex">Live</span>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white p-1 shadow-sm">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setZoom((z) => Math.max(0.42, (z ?? autoScale) - 0.08))} aria-label="Zoom out"><ZoomOut className="h-3.5 w-3.5" /></Button>
          <span className="w-11 text-center text-[11px] font-semibold tabular-nums text-neutral-500">{Math.round(effectiveScale * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setZoom((z) => Math.min(1.25, (z ?? autoScale) + 0.08))} aria-label="Zoom in"><ZoomIn className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setZoom(null)} aria-label="Fit to width"><Maximize2 className="h-3.5 w-3.5" /></Button>
        </div>
      </div>

      <div ref={containerRef} className="preview-canvas relative min-h-0 flex-1 overflow-auto px-3 py-4 sm:px-6 sm:py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(249,115,22,.07),transparent_28%),radial-gradient(circle_at_82%_25%,rgba(234,88,12,.06),transparent_30%)]" />
        <div className="relative flex min-h-full min-w-full items-start justify-center">
          <div className="relative shrink-0" style={{ width: canvasWidth }}>
            <div className="shadow-[0_22px_55px_-24px_rgba(15,23,42,.5)]" style={{ width: A4_WIDTH_PX, minHeight: A4_HEIGHT_PX, transform: `scale(${effectiveScale})`, transformOrigin: 'top left', marginBottom: `-${Math.round(A4_HEIGHT_PX * (1 - effectiveScale))}px` }}>
              <ResumeDocument data={data} settings={settings} activeSection={activeSection} />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .preview-pane,.preview-pane *{box-sizing:border-box}.preview-canvas{overscroll-behavior:contain;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch}
        @media (min-width:768px){
          .oe-editor-shell>.hidden.md\\:flex{overflow:hidden!important;align-items:stretch!important;min-height:0!important}
          .oe-editor-shell>.hidden.md\\:flex>[aria-label="Resume editor"]{height:100%!important;min-height:0!important;overflow:hidden!important}
          .oe-editor-shell>.hidden.md\\:flex>[aria-label="Resume editor"]>div{min-height:0!important;height:100%!important}
          .oe-editor-shell>.hidden.md\\:flex>[aria-label="Resume editor"]>div>div:last-child{min-height:0!important;overflow-y:auto!important}
          .oe-editor-shell>.hidden.md\\:flex>[aria-label="Live resume preview"]{min-width:0!important;min-height:0!important;height:100%!important;overflow:hidden!important;align-self:stretch!important}
          .oe-editor-shell>.hidden.md\\:flex>[aria-label="Live resume preview"]>.preview-pane{height:100%!important;min-height:0!important}
        }
        @media(max-width:767px){.oe-editor-shell{min-height:100dvh!important;height:100dvh!important;overflow:hidden!important}.oe-editor-shell .preview-pane{height:100%!important;min-height:0!important}}
        .preview-pane .text-sky-500,.preview-pane .text-sky-600{color:#f97316!important}.preview-pane .bg-sky-50{background-color:#fff7ed!important}.preview-pane .border-sky-200{border-color:#fed7aa!important}
      `}</style>
    </div>
  );
}
