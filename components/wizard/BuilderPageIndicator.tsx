'use client';

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

export function BuilderPageIndicator() {
  const [pages, setPages] = useState(1);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const measure = () => {
      const root = document.getElementById('resume-document-root');
      if (root) setPages(Math.max(1, Math.ceil(root.scrollHeight / 1123)));
      timer = setTimeout(measure, 500);
    };
    measure();
    return () => timer && clearTimeout(timer);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[70] -translate-x-1/2 lg:bottom-6">
      <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white/95 px-3 py-2 text-[11px] font-semibold text-neutral-700 shadow-[0_18px_50px_-25px_rgba(15,23,42,.5)] backdrop-blur-xl">
        <FileText className="h-3.5 w-3.5 text-orange-500" />
        <span>A4 · {pages} {pages === 1 ? 'page' : 'pages'}</span>
      </div>
    </div>
  );
}
