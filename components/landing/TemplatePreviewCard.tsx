import { HeaderVariant, SidebarVariant, TemplateLayout } from '@/lib/templates/presets';

export function TemplatePreviewCard({ accent, layout, headerVariant, sidebarVariant, font, compact = false }: { accent: string; layout: TemplateLayout; headerVariant: HeaderVariant; sidebarVariant: SidebarVariant; font: string; compact?: boolean }) {
  const serif = font === 'merriweather' || font === 'georgia';
  const text = serif ? 'font-serif' : 'font-sans';
  const scale = compact ? 'text-[5px]' : 'text-[8px]';
  const heading = compact ? 'text-[9px]' : 'text-[15px]';
  const sections = ['SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS'];
  const lines = Array.from({ length: compact ? 5 : 8 });

  const main = (
    <div className={`${text} h-full w-full bg-white p-4 ${compact ? 'p-2.5' : ''}`}>
      {headerVariant === 'banner' ? (
        <div className="-mx-4 -mt-4 mb-3 px-4 py-3 text-center text-white" style={{ backgroundColor: accent }}><div className={`${heading} font-bold tracking-[0.12em]`}>ALEX MORGAN</div><div className="mt-0.5 text-[5px] italic opacity-90">DIRECTOR OF SOFTWARE ENGINEERING</div></div>
      ) : headerVariant === 'compact' ? (
        <div className="mb-2 border-t-2 pt-2" style={{ borderColor: accent }}><div className={`${heading} font-bold`}>ALEX MORGAN</div><div className="text-[5px] text-neutral-500">Senior Product Designer</div></div>
      ) : (
        <div className={`mb-2 ${headerVariant === 'centered' ? 'text-center' : ''} ${headerVariant === 'editorial' ? 'border-b-2 pb-2' : ''}`} style={headerVariant === 'editorial' ? { borderColor: accent } : undefined}><div className={`${heading} font-bold tracking-tight`}>ALEX MORGAN</div><div className="mt-0.5 text-[5px] font-medium" style={{ color: accent }}>Senior Product Designer</div></div>
      )}
      <div className="mb-2 text-[4.5px] text-neutral-400">alex@email.com · +91 90000 00000 · Mumbai, India · LinkedIn</div>
      {sections.map((section) => <div key={section} className="mb-2"><div className={`${scale} mb-1 font-bold tracking-[0.12em]`} style={{ color: accent }}>{section}</div>{lines.slice(0, section === 'EXPERIENCE' ? 4 : 2).map((_, i) => <div key={i} className="mb-0.5 h-[3px] rounded bg-neutral-200" style={{ width: `${68 + (i % 3) * 10}%` }} />)}</div>)}
    </div>
  );

  if (layout === 'two-column') {
    return <div className="flex h-full w-full overflow-hidden bg-white"><aside className="w-[31%] shrink-0 p-2" style={{ backgroundColor: sidebarVariant === 'solid' ? accent : '#f3f4f6' }}><div className={`${compact ? 'text-[7px]' : 'text-[11px]'} font-bold ${sidebarVariant === 'solid' ? 'text-white' : 'text-neutral-900'}`}>ALEX<br />MORGAN</div><div className={`mt-3 space-y-1 ${sidebarVariant === 'solid' ? 'text-white/70' : 'text-neutral-500'}`} style={{ fontSize: compact ? '4px' : '6px' }}>CONTACT<br />SKILLS<br />LANGUAGES<br />EDUCATION</div></aside><div className="min-w-0 flex-1">{main}</div></div>;
  }

  return main;
}
