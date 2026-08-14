export default function ResumeNewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="oe-builder-polished">{children}</div>
      <style dangerouslySetInnerHTML={{ __html: `
        .oe-builder-polished,
        .oe-builder-polished input,
        .oe-builder-polished textarea,
        .oe-builder-polished button,
        .oe-builder-polished select {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .oe-builder-polished .text-neutral-400 { color:#667085 !important; }
        .oe-builder-polished .text-neutral-500 { color:#475467 !important; }
        .oe-builder-polished .text-neutral-600 { color:#344054 !important; }
        .oe-builder-polished .text-neutral-700 { color:#1f2937 !important; }
        .oe-builder-polished input,
        .oe-builder-polished textarea,
        .oe-builder-polished select { color:#101828 !important; }
        .oe-builder-polished input::placeholder,
        .oe-builder-polished textarea::placeholder { color:#98A2B3 !important; opacity:1 !important; }
        .oe-builder-polished label { color:#344054 !important; }
        .oe-builder-polished .oe-wizard-panel { border:1px solid #E4E7EC; background:rgba(255,255,255,.96); box-shadow:0 18px 55px -38px rgba(16,24,40,.35); }
        .oe-builder-polished .oe-quick-action { border-color:#E4E7EC !important; background:#fff !important; }
        .oe-builder-polished .oe-quick-action:hover { border-color:#F2C6A8 !important; }
        .oe-builder-polished .oe-glass { border-color:#E4E7EC !important; background:rgba(255,255,255,.96) !important; }
        .oe-builder-polished .oe-preview-frame { background:#F2F4F7; border:1px solid #E4E7EC; }
        .oe-builder-polished h1 { color:#101828 !important; }
        @media(max-width:767px){
          .oe-builder-polished main { padding-bottom:76px !important; }
          .oe-builder-polished .oe-wizard-panel { border-radius:18px !important; padding:18px !important; }
          .oe-builder-polished .oe-quick-start { border:1px solid #E4E7EC; background:#fff; box-shadow:0 12px 35px -28px rgba(16,24,40,.35); }
        }
      ` }} />
    </>
  );
}
