'use client';

import { Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TEMPLATE_LIST } from '@/lib/templates/presets';
import { SampleResumeCard } from '@/components/landing/SampleResumeCard';
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

export function DesignPanel({
  settings,
  updateSettings,
  setTemplate,
}: {
  settings: ResumeSettings;
  updateSettings: (updater: (s: ResumeSettings) => ResumeSettings) => void;
  setTemplate: (t: ResumeSettings['template']) => void;
}) {
  return (
    <div className="space-y-8 pb-10">
      <section>
        <h3 className="font-semibold mb-3 text-sm">Template</h3>
        <div className="grid grid-cols-2 gap-3">
          {TEMPLATE_LIST.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`relative rounded-lg border-2 p-3 text-left transition-colors ${
                settings.template === t.id ? 'border-primary bg-accent' : 'border-border hover:border-neutral-300'
              }`}
            >
              {settings.template === t.id && (
                <span className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <div
                className="aspect-[3/4] rounded mb-2 overflow-hidden border"
                style={{ pointerEvents: 'none' }}
              >
                <SampleResumeCard accent={t.defaultAccentColor} layout={t.layout} compact />
              </div>
              <p className="text-xs font-medium">{t.name}</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-3 text-sm">Typography</h3>
        <div className="space-y-4">
          <div>
            <Label>Font</Label>
            <Select value={settings.font} onValueChange={(v) => updateSettings((s) => ({ ...s, font: v as ResumeFont }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label} <span className="text-muted-foreground">— {f.hint}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <SliderField
            label="Font Size"
            value={settings.fontSize}
            min={9}
            max={12}
            step={0.5}
            unit="pt"
            onChange={(v) => updateSettings((s) => ({ ...s, fontSize: v }))}
          />
          <SliderField
            label="Heading Size"
            value={settings.headingScale}
            min={1}
            max={1.4}
            step={0.05}
            unit="×"
            onChange={(v) => updateSettings((s) => ({ ...s, headingScale: v }))}
          />
          <SliderField
            label="Line Spacing"
            value={settings.lineSpacing}
            min={1}
            max={1.6}
            step={0.05}
            unit="×"
            onChange={(v) => updateSettings((s) => ({ ...s, lineSpacing: v }))}
          />
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-3 text-sm">Spacing</h3>
        <div className="space-y-4">
          <SliderField
            label="Section Spacing"
            value={settings.sectionSpacing}
            min={8}
            max={32}
            step={1}
            unit="px"
            onChange={(v) => updateSettings((s) => ({ ...s, sectionSpacing: v }))}
          />
          <SliderField
            label="Margins"
            value={settings.margin}
            min={10}
            max={25}
            step={1}
            unit="mm"
            onChange={(v) => updateSettings((s) => ({ ...s, margin: v }))}
          />
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-3 text-sm">Accent Color</h3>
        <div className="flex flex-wrap gap-2">
          {ACCENT_PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => updateSettings((s) => ({ ...s, accentColor: c }))}
              className="h-8 w-8 rounded-full border-2 flex items-center justify-center"
              style={{ backgroundColor: c, borderColor: settings.accentColor === c ? '#111' : 'transparent' }}
            >
              {settings.accentColor === c && <Check className="h-3.5 w-3.5 text-white" />}
            </button>
          ))}
          <input
            type="color"
            value={settings.accentColor}
            onChange={(e) => updateSettings((s) => ({ ...s, accentColor: e.target.value }))}
            className="h-8 w-8 rounded-full overflow-hidden border cursor-pointer"
            aria-label="Custom accent color"
          />
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-3 text-sm">Sections</h3>
        <SectionManager settings={settings} updateSettings={updateSettings} />
      </section>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <Label className="mb-0">{label}</Label>
        <span className="text-xs text-muted-foreground tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}
