declare module '@/lib/templates/presets' {
  interface TemplatePreset {
    /** Optional landing-page preview image. Runtime consumers should provide a fallback when absent. */
    previewSrc?: string;
  }
}
