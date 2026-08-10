// Per request: this credit appears ONLY on the resume document itself
// (live preview + exported PDF/print) — never in the app's own UI chrome
// (navbar, dashboard, etc.), which uses the standalone logo instead
// (see components/landing/SiteHeader.tsx). Text-only, small, centered.
export function BrandFooter() {
  return (
    <div
      className="text-center pt-4 mt-2 opacity-50"
      style={{ fontSize: '7pt', fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      Made with Orrica Edge
    </div>
  );
}
