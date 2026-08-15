import '@/lib/templates/presets';

declare module '@/lib/templates/presets' {
  interface TemplatePreset {
    /** Optional landing-page preview image. */
    previewSrc?: string;
  }
}
