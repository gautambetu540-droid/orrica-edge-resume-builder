import { TemplateLayout, TemplatePreset } from '@/lib/templates/presets';

const SKILLS = ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Product Strategy', 'Accessibility'];

export function SampleResumeCard({
  template,
  accent = '#4338ca',
  layout = 'single-column',
  compact = false,
  scoreBadge = false,
}: {
  template?: TemplatePreset;
  accent?: string;
  layout?: TemplateLayout;
  compact?: boolean;
  scoreBadge?: boolean;
}) {
  const resolvedAccent = template?.defaultAccentColor ?? accent;
  const resolvedLayout = template?.layout ?? layout;
  const isTeal = resolvedAccent.toLowerCase() === '#2f7f78' || resolvedAccent.toLowerCase() === '#08736f';
  const isPurple = resolvedAccent.toLowerCase() === '#4527a0';
  const isOrange = resolvedAccent.toLowerCase() === '#c2410c';
  const serif = isTeal || isPurple;
  const fontFamily = serif ? "Georgia, 'Times New Roman', serif" : "var(--font-source-sans-3), Arial, sans-serif";
  const shellStyle = { fontFamily } as React.CSSProperties;

  const showcaseStyles = (
    <style jsx global>{`
      /* Homepage-only template showcase refinement. The selector is anchored to
         the carousel so these rules do not affect resume previews elsewhere. */
      section:has(#oe-template-carousel) {
        padding-top: 3.5rem !important;
        padding-bottom: 4rem !important;
      }

      section:has(#oe-template-carousel) > div {
        max-width: 1320px !important;
      }

      section:has(#oe-template-carousel) h2 {
        max-width: 920px !important;
        margin-inline: auto !important;
        font-family: var(--oe-font-ui) !important;
        font-size: clamp(2rem, 3.3vw, 2.65rem) !important;
        line-height: 1.04 !important;
        letter-spacing: -.045em !important;
      }

      section:has(#oe-template-carousel) h2 + p {
        max-width: 760px !important;
        margin-top: .75rem !important;
        font-size: .9rem !important;
        line-height: 1.55 !important;
        font-weight: 500 !important;
        color: rgba(255,255,255,.78) !important;
      }

      /* Replace the generic SaaS sentence visually with a more direct Orrica
         benefit statement while keeping the existing templates link clickable. */
      section:has(#oe-template-carousel) h2 + p {
        font-size: 0 !important;
        line-height: 1.55 !important;
      }
      section:has(#oe-template-carousel) h2 + p::before {
        content: 'Choose an ATS-friendly, recruiter-ready design and build a polished, job-ready resume for the role you want.';
        font-size: .9rem;
        line-height: 1.55;
        font-weight: 500;
        color: rgba(255,255,255,.78);
      }
      section:has(#oe-template-carousel) h2 + p a {
        display: inline-block;
        width: 0;
        overflow: hidden;
        font-size: 0 !important;
        text-decoration: none !important;
        vertical-align: middle;
      }

      section:has(#oe-template-carousel) > div > div:has(> #oe-template-carousel) {
        margin-top: 1.6rem !important;
      }

      section:has(#oe-template-carousel) #oe-template-carousel {
        display: grid !important;
        grid-auto-flow: column !important;
        grid-auto-columns: calc((100% - 3.75rem) / 4) !important;
        gap: 1.25rem !important;
        width: 100% !important;
        padding: .35rem .15rem .8rem !important;
        margin: 0 !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        scroll-padding-inline: .15rem !important;
        scroll-snap-type: x mandatory !important;
        overscroll-behavior-inline: contain;
      }

      section:has(#oe-template-carousel) #oe-template-carousel > a {
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
        scroll-snap-align: start !important;
      }

      section:has(#oe-template-carousel) #oe-template-carousel > a > div:first-child {
        height: 430px !important;
        border-radius: 14px !important;
        border: 1px solid rgba(15,23,42,.10);
        box-shadow: 0 22px 45px -28px rgba(0,0,0,.65) !important;
      }

      section:has(#oe-template-carousel) #oe-template-carousel > a > div:first-child > div {
        transform: none !important;
        transform-origin: top center !important;
      }

      section:has(#oe-template-carousel) #oe-template-carousel > a > div:first-child > div > div {
        min-height: 100%;
      }

      section:has(#oe-template-carousel) #oe-template-carousel > a > div:last-child {
        margin-top: .7rem !important;
      }

      section:has(#oe-template-carousel) #oe-template-carousel > a > div:last-child > div:first-child {
        font-size: .88rem !important;
        line-height: 1.25 !important;
        font-weight: 700 !important;
      }

      section:has(#oe-template-carousel) #oe-template-carousel > a > div:last-child > div:last-child {
        margin-top: .25rem !important;
        font-size: .68rem !important;
        color: rgba(255,255,255,.58) !important;
      }

      section:has(#oe-template-carousel) #oe-template-carousel + * {
        margin-top: 1.25rem !important;
      }

      section:has(#oe-template-carousel) #oe-template-carousel ~ div a {
        height: 2.65rem !important;
        border-radius: .7rem !important;
      }

      section:has(#oe-template-carousel) #oe-template-carousel ~ div a:first-child {
        padding-inline: 1.25rem !important;
        font-size: .78rem !important;
      }

      @media (min-width: 1024px) {
        section:has(#oe-template-carousel) {
          padding-top: 3.75rem !important;
          padding-bottom: 4.25rem !important;
        }
      }

      @media (min-width: 768px) and (max-width: 1023px) {
        section:has(#oe-template-carousel) #oe-template-carousel {
          grid-auto-columns: calc((100% - 1.25rem) / 2) !important;
          gap: 1.25rem !important;
        }
        section:has(#oe-template-carousel) #oe-template-carousel > a > div:first-child {
          height: 410px !important;
        }
      }

      @media (max-width: 767px) {
        section:has(#oe-template-carousel) {
          padding-top: 2.75rem !important;
          padding-bottom: 3.25rem !important;
        }
        section:has(#oe-template-carousel) > div {
          padding-inline: 1rem !important;
        }
        section:has(#oe-template-carousel) h2 {
          max-width: 22rem !important;
          font-size: 1.9rem !important;
          line-height: 1.05 !important;
        }
        section:has(#oe-template-carousel) h2 + p::before {
          font-size: .82rem;
          line-height: 1.5;
        }
        section:has(#oe-template-carousel) > div > div:has(> #oe-template-carousel) {
          margin-top: 1.15rem !important;
        }
        section:has(#oe-template-carousel) #oe-template-carousel {
          grid-auto-columns: 100% !important;
          gap: .85rem !important;
          padding-inline: 0 !important;
          scroll-padding-inline: 0 !important;
        }
        section:has(#oe-template-carousel) #oe-template-carousel > a > div:first-child {
          height: 390px !important;
          border-radius: 12px !important;
        }
        section:has(#oe-template-carousel) #oe-template-carousel > a > div:last-child > div:first-child {
          font-size: .85rem !important;
        }
        section:has(#oe-template-carousel) #oe-template-carousel > a > div:last-child > div:last-child {
          font-size: .65rem !important;
        }
        section:has(#oe-template-carousel) #oe-template-carousel ~ div {
          margin-top: .9rem !important;
        }
        section:has(#oe-template-carousel) #oe-template-carousel ~ div a {
          height: 2.55rem !important;
          font-size: .76rem !important;
        }
      }
    `}</style>
  );

  const body = (
    <div className={compact ? 'p-3 text-[6px] leading-[1.22]' : 'p-6 text-[10px] leading-[1.28]'} style={shellStyle}>
      <div className={`flex items-start justify-between gap-3 ${isTeal ? 'border-b-0' : ''}`}>
        <div className="min-w-0">
          <div className="font-bold leading-none tracking-[-0.035em] text-neutral-950" style={{ fontSize: compact ? '10px' : '22px' }}>Alex Morgan</div>
          <div className="mt-1 font-medium" style={{ color: resolvedAccent, fontSize: compact ? '6px' : '11px' }}>Senior Product Designer</div>
        </div>
        {resolvedLayout !== 'two-column' && <div className="shrink-0 text-right text-neutral-400" style={{ fontSize: compact ? '4.5px' : '7px' }}>alex@email.com<br />San Francisco, CA<br />linkedin.com/in/alexmorgan</div>}
      </div>

      {isTeal ? (
        <div className="mt-3 px-3 py-2 text-white" style={{ backgroundColor: resolvedAccent }}>
          <div className="font-bold tracking-[0.08em]" style={{ fontSize: compact ? '8px' : '16px' }}>ALEX MORGAN</div>
          <div className="mt-0.5 italic" style={{ fontSize: compact ? '5px' : '9px' }}>Senior Product Designer</div>
        </div>
      ) : (
        <div className="mt-2 h-px w-full" style={{ backgroundColor: isOrange ? resolvedAccent : '#d1d5db' }} />
      )}

      <SectionTitle accent={resolvedAccent} compact={compact}>Profile</SectionTitle>
      <p className="mb-3 text-neutral-600">
        Product designer with 7+ years of experience turning complex workflows into clear, accessible digital products. Strong across product strategy, design systems, research and cross-functional delivery.
      </p>

      <SectionTitle accent={resolvedAccent} compact={compact}>Experience</SectionTitle>
      <Experience title="Lead Product Designer" company="Northwind Co." dates="2022 — Present" compact={compact} />
      <Experience title="Product Designer" company="Fieldstone Labs" dates="2019 — 2022" compact={compact} />
      <Experience title="UX Designer" company="Studio North" dates="2017 — 2019" compact={compact} />

      <SectionTitle accent={resolvedAccent} compact={compact}>Education</SectionTitle>
      <div className="mb-3"><div className="font-semibold text-neutral-900">B.A. Interaction Design</div><div className="text-neutral-500">California College of the Arts · 2019</div></div>

      <SectionTitle accent={resolvedAccent} compact={compact}>Skills</SectionTitle>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {SKILLS.map((skill) => <span key={skill} className="text-neutral-600">{isPurple ? '• ' : '— '}{skill}</span>)}
      </div>

      {!compact && <>
        <SectionTitle accent={resolvedAccent} compact={compact}>Certifications</SectionTitle>
        <div className="text-neutral-500">Google UX Design Certificate · Nielsen Norman Group UX Certification</div>
      </>}
    </div>
  );

  if (resolvedLayout === 'two-column') {
    return (
      <div className="relative flex h-full w-full overflow-hidden bg-white" style={shellStyle}>
        <aside className="w-[31%] shrink-0 border-r p-3" style={{ backgroundColor: resolvedAccent === '#111827' ? '#f7f7f7' : `${resolvedAccent}10`, borderColor: `${resolvedAccent}35` }}>
          <div className="font-bold uppercase tracking-[0.12em]" style={{ color: resolvedAccent, fontSize: compact ? '5px' : '8px' }}>CONTACT</div>
          <div className="mt-2 space-y-1 text-neutral-600" style={{ fontSize: compact ? '4.5px' : '7px' }}>alex@email.com<br />+91 98765 43210<br />San Francisco, CA<br />linkedin.com</div>
          <div className="mt-4 border-t pt-3" style={{ borderColor: `${resolvedAccent}30` }}><div className="font-bold uppercase tracking-[0.12em]" style={{ color: resolvedAccent, fontSize: compact ? '5px' : '8px' }}>EDUCATION</div><div className="mt-2 text-neutral-600" style={{ fontSize: compact ? '4.5px' : '7px' }}>B.A. Interaction Design<br />2019</div></div>
          <div className="mt-4 border-t pt-3" style={{ borderColor: `${resolvedAccent}30` }}><div className="font-bold uppercase tracking-[0.12em]" style={{ color: resolvedAccent, fontSize: compact ? '5px' : '8px' }}>SKILLS</div><div className="mt-2 space-y-1 text-neutral-600" style={{ fontSize: compact ? '4.5px' : '7px' }}>{SKILLS.slice(0,5).map((skill) => <div key={skill}>{skill}</div>)}</div></div>
        </aside>
        <div className="min-w-0 flex-1">{body}</div>
        {scoreBadge && <ScoreBadge accent={resolvedAccent} />}
        {showcaseStyles}
      </div>
    );
  }

  return <div className="relative h-full w-full overflow-hidden bg-white">{body}{scoreBadge && <ScoreBadge accent={resolvedAccent} />}{showcaseStyles}</div>;
}

function SectionTitle({ accent, compact, children }: { accent: string; compact: boolean; children: React.ReactNode }) {
  return <div className="mb-1.5 mt-3 border-b pb-1 font-bold uppercase tracking-[0.08em]" style={{ color: accent, borderColor: `${accent}55`, fontSize: compact ? '5.5px' : '8.5px' }}>{children}</div>;
}

function Experience({ title, company, dates, compact }: { title: string; company: string; dates: string; compact: boolean }) {
  return <div className="mb-3"><div className="flex items-start justify-between gap-2 font-semibold text-neutral-900"><span>{title}<span className="font-normal text-neutral-500"> · {company}</span></span><span className="shrink-0 font-normal text-neutral-400">{dates}</span></div><ul className="mt-1 space-y-0.5 text-neutral-600"><li>• Redesigned core workflows, improving activation and usability.</li><li>• Partnered with product and engineering to ship measurable improvements.</li></ul></div>;
}

function ScoreBadge({ accent }: { accent: string }) {
  return <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-lg animate-fade-in-up"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: accent }}>87%</div><div className="leading-tight"><div className="text-[9px] font-semibold text-neutral-800">Resume Score</div><div className="text-[7px] font-medium text-emerald-600">ATS-ready example</div></div></div>;
}
