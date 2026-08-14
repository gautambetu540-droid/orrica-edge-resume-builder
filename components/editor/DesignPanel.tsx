'use client';

import { Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TEMPLATE_LIST } from '@/lib/templates/presets';
import { TemplatePreviewCard } from '@/components/landing/TemplatePreviewCard';
import { ResumeFont, ResumeSettings } from '@/lib/types/resume';
import { SectionManager } from './SectionManager';

const FONT_OPTIONS: { value: ResumeFont; label: string; hint: string }[] = [
  { value: 'inter', label: 'Inter', hint: 'Modern / Default' },
  { value: 'source-sans-3', label: 'Source Sans 3', hint: 'Professional' },
  { value: 'ibm-plex-sans', label: 'IBM Plex Sans', hint: 'Corporate / Technical' },
  { value: 'merriweather', label: 'Merriweather', hint: 'Classic / Executive' },
  { value: 'georgia', label: 'Georgia', hint: 'Traditional / Academic' },
];
const ACCENT_PRESETS = ['#4338ca', '#0369a1', '#15803d', '#7c2d12', '#1f2937', '#be123c', '#0891b2', '#a16207'];

export function DesignPanel({ settings, updateSettings, setTemplate }: { settings: ResumeSettings; updateSettings: (updater: (s: ResumeSettings) => ResumeSettings) => void; setTemplate: (t: ResumeSettings['template']) => void }) {
  const applyTemplate = (template: (typeof TEMPLATE_LIST)[number]) => {
    updateSettings((s) => ({ ...s, template: template.id, font: template.recommendedFont, fontSize: template.defaultFontSize, headingScale: template.defaultHeadingScale, lineSpacing: template.defaultLineSpacing, sectionSpacing: template.defaultSectionSpacing, margin: template.defaultMargin, accentColor: template.defaultAccentColor }));
    setTemplate(template.id);
  };

  return (
    <div className="space-y-8 pb-10">
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div><h3 className="text-sm font-semibold">Resume templates</h3><p className="mt-1 text-[11px] text-muted-foreground">Select a design to update the live resume instantly.</p></div>
          <span className="hidden rounded-full border bg-white px-2.5 py-1 text-[10px] font-semibold text-muted-foreground sm:inline-flex">{TEMPLATE_LIST.length} designs</span>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {TEMPLATE_LIST.map((t) => (
            <button key={t.id} type="button" onClick={() => applyTemplate(t)} className={`group relative rounded-xl border-2 bg-white p-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${settings.template === t.id ? 'border-primary bg-accent shadow-sm' : 'border-border hover:border-neutral-300'}`}>
              {settings.template === t.id && <span className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-md"><Check className="h-3.5 w-3.5" /></span>}
              <div className="mb-2 aspect-[3/4] overflow-hidden rounded-lg border bg-neutral-50" style={{ pointerEvents: 'none' }}><TemplatePreviewCard accent={t.defaultAccentColor} layout={t.layout} headerVariant={t.headerVariant} sidebarVariant={t.sidebarVariant} font={t.recommendedFont} compact /></div>
              <p className="px-0.5 text-xs font-semibold">{t.name}</p><p className="mt-0.5 px-0.5 line-clamp-2 text-[10px] leading-4 text-muted-foreground">{t.description}</p>
            </button>
          ))}
        </div>
      </section>
      <section><h3 className="mb-3 text-sm font-semibold">Typography</h3><div className="space-y-4"><div><Label>Font</Label><Select value={settings.font} onValueChange={(v) => updateSettings((s) => ({ ...s, font: v as ResumeFont }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{FONT_OPTIONS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label} <span className="text-muted-foreground">— {f.hint}</span></SelectItem>)}</SelectContent></Select></div><SliderField label="Font Size" value={settings.fontSize} min={9} max={12} step={0.5} unit="pt" onChange={(v) => updateSettings((s) => ({ ...s, fontSize: v }))} /><SliderField label="Heading Size" value={settings.headingScale} min={1} max={1.4} step={0.05} unit="×" onChange={(v) => updateSettings((s) => ({ ...s, headingScale: v }))} /><SliderField label="Line Spacing" value={settings.lineSpacing} min={1} max={1.6} step={0.05} unit="×" onChange={(v) => updateSettings((s) => ({ ...s, lineSpacing: v }))} /></div></section>
      <section><h3 className="mb-3 text-sm font-semibold">Spacing</h3><div className="space-y-4"><SliderField label="Section Spacing" value={settings.sectionSpacing} min={8} max={32} step={1} unit="px" onChange={(v) => updateSettings((s) => ({ ...s, sectionSpacing: v }))} /><SliderField label="Margins" value={settings.margin} min={10} max={25} step={1} unit="mm" onChange={(v) => updateSettings((s) => ({ ...s, margin: v }))} /></div></section>
      <section><h3 className="mb-3 text-sm font-semibold">Accent Color</h3><div className="flex flex-wrap gap-2">{ACCENT_PRESETS.map((c) => <button key={c} type="button" onClick={() => updateSettings((s) => ({ ...s, accentColor: c }))} className="flex h-8 w-8 items-center justify-center rounded-full border-2" style={{ backgroundColor: c, borderColor: settings.accentColor === c ? '#111' : 'transparent' }}>{settings.accentColor === c && <Check className="h-3.5 w-3.5 text-white" />}</button>)}<input type="color" value={settings.accentColor} onChange={(e) => updateSettings((s) => ({ ...s, accentColor: e.target.value }))} className="h-8 w-8 cursor-pointer overflow-hidden rounded-full border" aria-label="Custom accent color" /></div></section>
      <section><h3 className="mb-3 text-sm font-semibold">Sections</h3><SectionManager settings={settings} updateSettings={updateSettings} /></section>
    </div>
  );
}

function SliderField({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
  return <div><div className="mb-1.5 flex justify-between"><Label className="mb-0">{label}</Label><span className="text-xs tabular-nums text-muted-foreground">{value}{unit}</span></div><Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} /></div>;
}
