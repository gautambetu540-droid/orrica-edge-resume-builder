import { TemplateLayout } from '@/lib/templates/presets';

export function SampleResumeCard({
  accent = '#4338ca',
  layout = 'single-column',
  compact = false,
  scoreBadge = false,
}: {
  accent?: string;
  layout?: TemplateLayout;
  compact?: boolean;
  scoreBadge?: boolean;
}) {
  const body = (
    <div className={compact ? 'p-3 text-[6px] leading-tight' : 'p-6 text-[10px] leading-snug'}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-bold text-neutral-900" style={{ fontSize: compact ? '9px' : '15px' }}>
            Alex Morgan
          </div>
          <div className="font-medium" style={{ color: accent, fontSize: compact ? '6px' : '10px' }}>
            Senior Product Designer
          </div>
        </div>
        <div className="h-6 w-6 rounded-full" style={{ backgroundColor: accent, opacity: 0.15 }} />
      </div>
      <div className="text-neutral-400 mb-3" style={{ fontSize: compact ? '5px' : '8px' }}>
        alex@email.com &nbsp;·&nbsp; San Francisco, CA &nbsp;·&nbsp; linkedin.com/in/alexmorgan
      </div>
      <div className="h-px bg-neutral-100 mb-3" />

      <div className="font-semibold uppercase tracking-wide mb-1.5" style={{ color: accent, fontSize: compact ? '5.5px' : '9px' }}>
        Experience
      </div>
      <div className="mb-2.5">
        <div className="flex justify-between font-medium text-neutral-800">
          <span>Lead Product Designer — Northwind Co.</span>
          <span className="text-neutral-400">2022 — Now</span>
        </div>
        <ul className="mt-1 space-y-0.5 text-neutral-500">
          <li>• Redesigned core onboarding flow, improving activation by 24%</li>
          <li>• Led a team of 4 designers across 3 product lines</li>
        </ul>
      </div>
      <div className="mb-3">
        <div className="flex justify-between font-medium text-neutral-800">
          <span>Product Designer — Fieldstone Labs</span>
          <span className="text-neutral-400">2019 — 2022</span>
        </div>
        <ul className="mt-1 space-y-0.5 text-neutral-500">
          <li>• Built and shipped the design system used across 6 apps</li>
        </ul>
      </div>

      <div className="font-semibold uppercase tracking-wide mb-1.5" style={{ color: accent, fontSize: compact ? '5.5px' : '9px' }}>
        Skills
      </div>
      <div className="flex flex-wrap gap-1">
        {['Figma', 'Design Systems', 'User Research', 'Prototyping'].map((s) => (
          <span key={s} className="px-1.5 py-0.5 rounded-full text-neutral-600" style={{ backgroundColor: `${accent}14`, fontSize: compact ? '5px' : '8px' }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );

  if (layout === 'two-column') {
    return (
      <div className="bg-white h-full w-full flex overflow-hidden relative">
        <div className="w-[32%] shrink-0" style={{ backgroundColor: accent }} />
        <div className="flex-1">{body}</div>
        {scoreBadge && <ScoreBadge accent={accent} />}
      </div>
    );
  }

  return (
    <div className="bg-white h-full w-full overflow-hidden relative">
      {body}
      {scoreBadge && <ScoreBadge accent={accent} />}
    </div>
  );
}

function ScoreBadge({ accent }: { accent: string }) {
  return (
    <div className="absolute bottom-3 right-3 bg-white rounded-xl shadow-lg border px-3 py-2 flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
      <div
        className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
        style={{ backgroundColor: accent }}
      >
        87%
      </div>
      <div className="leading-tight">
        <div className="text-[9px] font-semibold text-neutral-800">Resume Score</div>
        <div className="text-[7px] text-green-600 font-medium">ATS Perfect</div>
      </div>
    </div>
  );
}
