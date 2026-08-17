'use client';

import { useMemo, useState } from 'react';
import { Check, RotateCcw, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TEMPLATE_LIST } from '@/lib/templates/presets';
import { TemplatePreviewCard } from '@/components/landing/TemplatePreviewCard';
import { ResumeFont, ResumeSettings } from '@/lib/types/resume';
import { SectionManager } from './SectionManager';

const FONT_OPTIONS: { value: ResumeFont; label: string; family: string; category: 'Sans Serif' | 'Serif'; recommended?: boolean; preview: string }[] = [
  { value: 'inter', label: 'Inter', family: 'Inter, Arial, sans-serif', category: 'Sans Serif', recommended: true, preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'aptos', label: 'Aptos', family: 'Aptos, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'arial', label: 'Arial', family: 'Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'calibri', label: 'Calibri', family: 'Calibri, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'helvetica', label: 'Helvetica', family: 'Helvetica, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'roboto', label: 'Roboto', family: 'Roboto, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'ibm-plex-sans', label: 'IBM Plex Sans', family: 'IBM Plex Sans, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'source-sans-3', label: 'Source Sans 3', family: 'Source Sans 3, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'noto-sans', label: 'Noto Sans', family: 'Noto Sans, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'open-sans', label: 'Open Sans', family: 'Open Sans, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'lato', label: 'Lato', family: 'Lato, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'montserrat', label: 'Montserrat', family: 'Montserrat, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'poppins', label: 'Poppins', family: 'Poppins, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'nunito-sans', label: 'Nunito Sans', family: 'Nunito Sans, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'work-sans', label: 'Work Sans', family: 'Work Sans, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'manrope', label: 'Manrope', family: 'Manrope, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'dm-sans', label: 'DM Sans', family: 'DM Sans, Arial, sans-serif', category: 'Sans Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'merriweather', label: 'Merriweather', family: 'Merriweather, Georgia, serif', category: 'Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'georgia', label: 'Georgia', family: 'Georgia, serif', category: 'Serif', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'times-new-roman', label: 'Times New Roman', family: '"Times New Roman", Times, serif', category: 'Serif', preview: 'The quick brown fox jumps over the lazy dog' },
];

const ACCENT_PRESETS = ['#F97316', '#4338CA', '#0369A1', '#15803D', '#7C2D12', '#1F2937', '#BE123C', '#0891B2', '#A16207'];

const isValidHex = (value: string) => /^#[0-9A-F]{6}$/i.test(value);

export function DesignPanel({ settings, updateSettings, setTemplate }: { settings: ResumeSettings; updateSettings: (updater: (s: ResumeSettings) => ResumeSettings) => void; setTemplate: (t: ResumeSettings['template']) => void }) {
  const [fontQuery, setFontQuery] = useState('');
  const filteredFonts = useMemo(() => {
    const q = fontQuery.trim().toLowerCase();
    if (!q) return FONT_OPTIONS;
    return FONT_OPTIONS.filter((font) => `${font.label} ${font.category} ${font.recommended ? 'recommended' : ''}`.toLowerCase().includes(q));
  }, [fontQuery]);

  const updateColor = (key: 'accentColor' | 'textColor' | 'headingColor' | 'mutedColor' | 'dividerColor', value: string) => {
    if (!isValidHex(value)) return;
    updateSettings((s) => ({ ...s, [key]: value }));
  };

  const applyTemplate = (template: (typeof TEMPLATE_LIST)[number]) => {
    updateSettings((s) => ({ ...s, template: template.id, font: template.recommendedFont, fontSize: template.defaultFontSize, headingScale: template.defaultHeadingScale, lineSpacing: template.defaultLineSpacing, sectionSpacing: template.defaultSectionSpacing, margin: template.defaultMargin, accentColor: template.defaultAccentColor, headingColor: template.defaultAccentColor, dividerColor: template.defaultAccentColor }));
    setTemplate(template.id);
  };

  const resetDesign = () => updateSettings((s) => ({ ...s, font: 'inter', fontSize: 10.5, headingScale: 1.15, lineSpacing: 1.35, sectionSpacing: 16, margin: 16, accentColor: '#F97316', textColor: '#20242a', headingColor: '#20242a', mutedColor: '#5f6873', dividerColor: '#F97316', sectionColors: {} }));

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

      <section>
        <div className="mb-3 flex items-center justify-between"><div><h3 className="text-sm font-semibold">Font Family</h3><p className="mt-1 text-[11px] text-muted-foreground">Choose a professional resume font.</p></div><span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-700">{FONT_OPTIONS.length} fonts</span></div>
        <div className="rounded-xl border border-orange-100 bg-white p-3 shadow-sm">
          <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input aria-label="Search fonts" value={fontQuery} onChange={(e) => setFontQuery(e.target.value)} placeholder="Search fonts..." className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100" /></div>
          <div className="mt-3 max-h-[410px] space-y-4 overflow-y-auto pr-1" role="listbox" aria-label="Resume fonts">
            {(['Sans Serif', 'Serif'] as const).map((category) => {
              const items = filteredFonts.filter((font) => font.category === category);
              if (!items.length) return null;
              return <div key={category}><div className="mb-2 px-1 text-[10px] font-black uppercase tracking-[0.14em] text-neutral-400">{category}</div><div className="grid gap-2 sm:grid-cols-2">{items.map((font) => { const selected = settings.font === font.value; return <button key={font.value} type="button" role="option" aria-selected={selected} onClick={() => updateSettings((s) => ({ ...s, font: font.value }))} className={`group rounded-lg border p-2.5 text-left transition ${selected ? 'border-orange-400 bg-orange-50 ring-1 ring-orange-200' : 'border-neutral-200 bg-white hover:border-orange-200 hover:bg-orange-50/40'}`}><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-neutral-900">{font.label}</span>{font.recommended && <span className="rounded-full bg-orange-500 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">Recommended</span>}{selected && <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white" aria-label="Selected"><Check className="h-3 w-3" /></span>}</div><div className="mt-1 text-[12px] leading-5 text-neutral-600" style={{ fontFamily: font.family }}>{font.preview}</div></button>; })}</div></div>;
            })}
            {!filteredFonts.length && <div className="rounded-lg border border-dashed border-neutral-200 px-4 py-8 text-center text-xs text-neutral-500">No fonts found.</div>}
          </div>
        </div>
      </section>

      <section><h3 className="mb-3 text-sm font-semibold">Typography</h3><div className="space-y-4"><SliderField label="Font Size" value={settings.fontSize} min={9} max={12} step={0.5} unit="pt" onChange={(v) => updateSettings((s) => ({ ...s, fontSize: v }))} /><SliderField label="Heading Size" value={settings.headingScale} min={1} max={1.4} step={0.05} unit="×" onChange={(v) => updateSettings((s) => ({ ...s, headingScale: v }))} /><SliderField label="Line Spacing" value={settings.lineSpacing} min={1} max={1.6} step={0.05} unit="×" onChange={(v) => updateSettings((s) => ({ ...s, lineSpacing: v }))} /></div></section>
      <section><h3 className="mb-3 text-sm font-semibold">Spacing</h3><div className="space-y-4"><SliderField label="Section Spacing" value={settings.sectionSpacing} min={8} max={32} step={1} unit="px" onChange={(v) => updateSettings((s) => ({ ...s, sectionSpacing: v }))} /><SliderField label="Margins" value={settings.margin} min={10} max={25} step={1} unit="mm" onChange={(v) => updateSettings((s) => ({ ...s, margin: v }))} /></div></section>

      <section>
        <div className="mb-3 flex items-center justify-between"><div><h3 className="text-sm font-semibold">Colors</h3><p className="mt-1 text-[11px] text-muted-foreground">Change the resume colors and see the result instantly.</p></div></div>
        <div className="space-y-4 rounded-xl border bg-white p-4">
          <ColorField label="Accent / Section label" value={settings.accentColor} onChange={(v) => updateColor('accentColor', v)} presets={ACCENT_PRESETS} />
          <ColorField label="Heading color" value={settings.headingColor || '#20242a'} onChange={(v) => updateColor('headingColor', v)} />
          <ColorField label="Body text color" value={settings.textColor || '#20242a'} onChange={(v) => updateColor('textColor', v)} />
          <ColorField label="Muted text color" value={settings.mutedColor || '#5f6873'} onChange={(v) => updateColor('mutedColor', v)} />
          <ColorField label="Divider / border color" value={settings.dividerColor || settings.accentColor} onChange={(v) => updateColor('dividerColor', v)} />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between"><div><h3 className="text-sm font-semibold">Sections</h3><p className="mt-1 text-[11px] text-muted-foreground">Manage section order and visibility.</p></div></div>
        <SectionManager settings={settings} updateSettings={updateSettings} />
      </section>

      <button type="button" onClick={resetDesign} className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"><RotateCcw className="h-4 w-4" />Reset design</button>
    </div>
  );
}

function ColorField({ label, value, onChange, presets = [] }: { label: string; value: string; onChange: (value: string) => void; presets?: string[] }) {
  return <div>
    <div className="mb-2 flex items-center justify-between gap-3"><Label>{label}</Label><span className="text-[11px] font-mono text-neutral-500">{value}</span></div>
    <div className="flex items-center gap-2">
      <input aria-label={`${label} color picker`} type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-neutral-200 bg-white p-1" />
      <input aria-label={`${label} HEX value`} value={value} onChange={(e) => onChange(e.target.value)} maxLength={7} className="h-10 min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 font-mono text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="#000000" />
    </div>
    {presets.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{presets.map((c) => <button key={c} type="button" aria-label={`Use ${c}`} onClick={() => onChange(c)} className="h-7 w-7 rounded-full border-2" style={{ backgroundColor: c, borderColor: value.toLowerCase() === c.toLowerCase() ? '#111827' : 'transparent' }} />)}</div>}
  </div>;
}

function SliderField({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
  return <div><div className="mb-1.5 flex justify-between"><Label className="mb-0">{label}</Label><span className="text-xs tabular-nums text-muted-foreground">{value}{unit}</span></div><Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} /></div>;
}
