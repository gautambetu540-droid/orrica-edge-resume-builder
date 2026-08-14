'use client';

import { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeDocument } from '@/components/templates/ResumeDocument';
import { ResumeData, ResumeSettings } from '@/lib/types/resume';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export function PreviewPane({ data, settings, activeSection = '' }: { data: ResumeData; settings: ResumeSettings; activeSection?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = useState(1);
  const [zoom, setZoom] = useState<number | null>(null);
  const [documentHeight, setDocumentHeight] = useState(A4_HEIGHT_PX);

  useEffect(() => {
    const recompute = () => {
      const el = containerRef.current;
      if (!el) return;
      const widthScale = Math.min(1, Math.max(0.34, (el.clientWidth - 44) / A4_WIDTH_PX));
      const heightScale = Math.min(1, Math.max(0.34, (el.clientHeight - 44) / Math.max(A4_HEIGHT_PX, documentHeight)));
      setAutoScale(Math.min(widthScale, heightScale));
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', recompute);
    return () => { ro.disconnect(); window.removeEventListener('resize', recompute); };
  }, [documentHeight]);

  useEffect(() => {
    const el = documentRef.current;
    if (!el) return;
    const measure = () => setDocumentHeight(Math.max(A4_HEIGHT_PX, el.scrollHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data, settings]);

  const effectiveScale = zoom ?? autoScale;

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f5f6f8]">
      <div className="relative flex shrink-0 items-center justify-between border-b border-white/70 bg-white/80 px-4 py-2.5 shadow-[0_1px_0_rgba(15,23,42,.04)] backdrop-blur-xl no-print">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-500">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-500"><Sparkles className="h-3.5 w-3.5" /></span>
          <span>Live preview</span>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-neutral-200/80 bg-white/90 p-1 shadow-sm">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setZoom((z) => Math.max(0.4, (z ?? autoScale) - 0.1))} aria-label="Zoom out"><ZoomOut className="h-3.5 w-3.5" /></Button>
          <span className="w-11 text-center text-[11px] font-semibold tabular-nums text-neutral-500">{Math.round(effectiveScale * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setZoom((z) => Math.min(1.25, (z ?? autoScale) + 0.1))} aria-label="Zoom in"><ZoomIn className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setZoom(null)} aria-label="Fit to screen"><Maximize2 className="h-3.5 w-3.5" /></Button>
        </div>
      </div>

      <div ref={containerRef} className="hero-grid relative flex min-h-0 flex-1 items-start justify-center overflow-hidden px-4 py-5 sm:px-7 sm:py-6">
        <div className="pointer-events-none absolute left-[12%] top-8 h-28 w-28 rounded-full bg-sky-300/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[10%] top-[18%] h-36 w-36 rounded-full bg-orange-300/10 blur-3xl" />
        <div className="relative w-fit shrink-0" style={{ height: A4_HEIGHT_PX * effectiveScale, width: A4_WIDTH_PX * effectiveScale }}>
          <div ref={documentRef} className="absolute left-0 top-0 origin-top-left shadow-[0_22px_55px_-24px_rgba(15,23,42,.5)]" style={{ width: A4_WIDTH_PX, transform: `scale(${effectiveScale})`, transformOrigin: 'top left' }}>
            <ResumeDocument data={data} settings={settings} activeSection={activeSection} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (min-width: 768px) {
          .oe-editor-shell > .hidden.md\\:flex { overflow-y: auto !important; overflow-x: hidden !important; align-items: flex-start !important; min-height: 0 !important; }
          .oe-editor-shell > .hidden.md\\:flex > .oe-editor-sidebar { position: sticky !important; top: 0 !important; align-self: flex-start !important; height: calc(100vh - 64px) !important; max-height: calc(100vh - 64px) !important; overflow: hidden !important; z-index: 20; }
          .oe-editor-shell > .hidden.md\\:flex > [aria-label="Resume editor"] { overflow: visible !important; height: auto !important; min-height: calc(100vh - 64px) !important; }
          .oe-editor-shell > .hidden.md\\:flex > [aria-label="Live resume preview"] { overflow: visible !important; height: auto !important; min-height: calc(100vh - 64px) !important; align-self: stretch !important; }
          .oe-editor-shell > .hidden.md\\:flex > [aria-label="Live resume preview"] > div { height: auto !important; min-height: calc(100vh - 64px) !important; overflow: visible !important; }
          .oe-editor-shell > .hidden.md\\:flex > [aria-label="Live resume preview"] .hero-grid { overflow: visible !important; min-height: calc(100vh - 120px) !important; }
        }
        @media (max-width: 767px) {
          .oe-editor-shell { min-height: 100dvh !important; height: 100dvh !important; overflow: hidden !important; }
          .oe-editor-shell > .flex.min-h-0.flex-1.flex-col.md\\:hidden { min-height: 0 !important; overflow: hidden !important; }
        }
      `}</style>
    </div>
  );
}
