import { TemplateLayout } from '@/lib/templates/presets';

const SKILLS = ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Product Strategy', 'Accessibility'];

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
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold tracking-tight text-neutral-900" style={{ fontSize: compact ? '9px' : '15px' }}>Alex Morgan</div>
          <div className="mt-0.5 font-semibold" style={{ color: accent, fontSize: compact ? '6px' : '10px' }}>Senior Product Designer</div>
        </div>
        <div className="h-6 w-6 shrink-0 rounded-full" style={{ backgroundColor: accent, opacity: 0.15 }} />
      </div>

      <div className="mt-1.5 text-neutral-400" style={{ fontSize: compact ? '5px' : '8px' }}>
        alex.morgan@email.com · San Francisco, CA · linkedin.com/in/alexmorgan · alexmorgan.design
      </div>
      <div className="my-3 h-px bg-neutral-100" />

      <SectionTitle accent={accent} compact>Profile</SectionTitle>
      <p className="mb-3 text-neutral-500">
        Product designer with 7+ years of experience turning complex workflows into clear, accessible digital products. Strong across product strategy, design systems, research and cross-functional delivery.
      </p>

      <SectionTitle accent={accent} compact>Experience</SectionTitle>
      <Experience title="Lead Product Designer" company="Northwind Co." dates="2022 — Present" compact={compact} bullets={[
        'Redesigned onboarding and activation journeys, improving activation by 24%.',
        'Led a team of 4 designers across 3 product lines and established a shared design review process.',
        'Partnered with product and engineering to launch a self-serve workflow used by 80K+ monthly users.',
      ]} />
      <Experience title="Product Designer" company="Fieldstone Labs" dates="2019 — 2022" compact={compact} bullets={[
        'Built and shipped a design system adopted across 6 customer-facing applications.',
        'Ran user interviews and usability studies that reduced checkout friction and support requests.',
      ]} />

      <SectionTitle accent={accent} compact>Selected projects</SectionTitle>
      <div className="mb-3">
        <div className="font-semibold text-neutral-800">Northwind Design System <span className="font-normal text-neutral-400">· 2023</span></div>
        <p className="mt-0.5 text-neutral-500">Created reusable patterns, accessibility guidance and contribution standards for a 12-person product organization.</p>
      </div>

      <SectionTitle accent={accent} compact>Education</SectionTitle>
      <div className="mb-3"><div className="font-semibold text-neutral-800">B.A. Interaction Design</div><div className="text-neutral-500">California College of the Arts · 2019</div></div>

      <SectionTitle accent={accent} compact>Skills</SectionTitle>
      <div className="flex flex-wrap gap-1">
        {SKILLS.map((skill) => <span key={skill} className="rounded-full px-1.5 py-0.5 font-medium text-neutral-600" style={{ backgroundColor: `${accent}14`, fontSize: compact ? '5px' : '8px' }}>{skill}</span>)}
      </div>

      {!compact && <>
        <SectionTitle accent={accent} compact>Certifications</SectionTitle>
        <div className="text-neutral-500">Google UX Design Certificate · Nielsen Norman Group UX Certification</div>
      </>}
    </div>
  );

  if (layout === 'two-column') {
    return <div className="relative flex h-full w-full overflow-hidden bg-white"><div className="w-[30%] shrink-0" style={{ backgroundColor: accent }} /><div className="flex-1">{body}</div>{scoreBadge && <ScoreBadge accent={accent} />}</div>;
  }

  return <div className="relative h-full w-full overflow-hidden bg-white">{body}{scoreBadge && <ScoreBadge accent={accent} />}</div>;
}

function SectionTitle({ accent, compact, children }: { accent: string; compact: boolean; children: React.ReactNode }) {
  return <div className="mb-1.5 font-semibold uppercase tracking-wide" style={{ color: accent, fontSize: compact ? '5.5px' : '9px' }}>{children}</div>;
}

function Experience({ title, company, dates, bullets, compact }: { title: string; company: string; dates: string; bullets: string[]; compact: boolean }) {
  return <div className="mb-3"><div className="flex items-start justify-between gap-2 font-medium text-neutral-800"><span>{title} — {company}</span><span className="shrink-0 text-neutral-400">{dates}</span></div><ul className="mt-1 space-y-0.5 text-neutral-500">{bullets.map((bullet) => <li key={bullet}>• {bullet}</li>)}</ul></div>;
}

function ScoreBadge({ accent }: { accent: string }) {
  return <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-lg animate-fade-in-up"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: accent }}>87%</div><div className="leading-tight"><div className="text-[9px] font-semibold text-neutral-800">Resume Score</div><div className="text-[7px] font-medium text-emerald-600">ATS-ready example</div></div></div>;
}
