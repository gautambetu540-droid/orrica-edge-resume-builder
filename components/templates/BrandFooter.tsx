// Small text-only credit rendered inside the resume document and exported PDF.
export function BrandFooter() {
  return (
    <div
      className="mt-5 border-t border-neutral-200/70 pt-3 text-center"
      style={{ fontSize: '7pt', fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif", color: '#7b8490', letterSpacing: '0.01em' }}
    >
      Crafted with Orrica Edge Resume Builder
    </div>
  );
}
