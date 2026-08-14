'use client';

import { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeDocument } from '@/components/templates/ResumeDocument';
import { ResumeData, ResumeSettings } from '@/lib/types/resume';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export function PreviewPane({ data, settings }: { data: ResumeData; settings: ResumeSettings }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = useState(1);
  const [zoom, setZoom] = useState<number | null>(null);

  useEffect(() => {
    function recompute() {
      const el = containerRef.current;
      if (!el) return;
      const padding = 56;
      const availableWidth = el.clientWidth - padding;
      setAutoScale(Math.min(1, Math.max(0.35, availableWidth / A4_WIDTH_PX)));
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
    <div className="flex h-full flex-col bg-[#f5f6f8]">
      <div className="relative flex items-center justify-between border-b border-white/70 bg-white/80 px-4 py-2.5 shadow-[0_1px_0_rgba(15,23,42,.04)] backdrop-blur-xl no-print">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-500">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span>Live preview</span>
          <span className="hidden text-neutral-300 sm:inline">•</span>
          <span className="hidden text-neutral-400 sm:inline">A4 · ready to export</span>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-neutral-200/80 bg-white/90 p-1 shadow-sm">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setZoom((z) => Math.max(0.4, (z ?? autoScale) - 0.1))} aria-label="Zoom out">
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="w-11 text-center text-[11px] font-semibold tabular-nums text-neutral-500">
            {Math.round(effectiveScale * 100)}%
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setZoom((z) => Math.min(2, (z ?? autoScale) + 0.1))} aria-label="Zoom in">
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setZoom(null)} aria-label="Fit to screen">
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div ref={containerRef} className="hero-grid relative flex-1 overflow-auto px-4 py-7 sm:px-7">
        <div className="pointer-events-none absolute left-[12%] top-8 h-28 w-28 rounded-full bg-orange-300/10 blur-3xl animate-float" />
        <div className="pointer-events-none absolute right-[10%] top-[18%] h-36 w-36 rounded-full bg-blue-300/10 blur-3xl animate-float-slow" />
        <div className="relative mx-auto w-fit animate-scale-in" style={{ paddingBottom: 12 }}>
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

      <style jsx global>{`
        /* Desktop editor workspace: the sidebar stays pinned while everything on
           the right (editor + live preview) uses the single page scroll. */
        @media (min-width: 768px) {
          .oe-editor-shell > .hidden.md\\:flex {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            align-items: flex-start !important;
            min-height: 0 !important;
          }

          .oe-editor-shell > .hidden.md\\:flex > .oe-editor-sidebar {
            position: sticky !important;
            top: 0 !important;
            align-self: flex-start !important;
            height: calc(100vh - 64px) !important;
            max-height: calc(100vh - 64px) !important;
            overflow: hidden !important;
            z-index: 20;
          }

          .oe-editor-shell > .hidden.md\\:flex > [aria-label="Resume editor"] {
            overflow: visible !important;
            height: auto !important;
            min-height: calc(100vh - 64px) !important;
          }

          .oe-editor-shell > .hidden.md\\:flex > [aria-label="Live resume preview"] {
            overflow: visible !important;
            height: auto !important;
            min-height: calc(100vh - 64px) !important;
            align-self: stretch !important;
          }

          .oe-editor-shell > .hidden.md\\:flex > [aria-label="Live resume preview"] > div {
            height: auto !important;
            min-height: calc(100vh - 64px) !important;
            overflow: visible !important;
          }

          .oe-editor-shell > .hidden.md\\:flex > [aria-label="Live resume preview"] .hero-grid {
            overflow: visible !important;
            min-height: calc(100vh - 120px) !important;
          }
        }
      `}</style>
    </div>
  );
}
