import { HeaderVariant, SidebarVariant, TemplateLayout, TemplatePreset } from '@/lib/templates/presets';
import { getSampleResume } from '@/lib/templates/sample-resumes';

export function TemplatePreviewCard({
  accent,
  layout,
  headerVariant,
  sidebarVariant,
  font,
  compact = false,
  template,
}: {
  accent: string;
  layout: TemplateLayout;
  headerVariant: HeaderVariant;
  sidebarVariant: SidebarVariant;
  font: string;
  compact?: boolean;
  template?: TemplatePreset;
}) {
  // The Orrica Edge orange belongs to the product UI, not every resume design.
  // When a real template is supplied, always use its curated professional accent.
  const resolvedAccent = template?.defaultAccentColor || accent;
  const profile = getSampleResume(template?.category);
  const serif = font === 'merriweather' || font === 'georgia' || font === 'times-new-roman';
  const text = serif ? 'font-serif' : 'font-sans';
  const heading = compact ? 'text-[9px]' : 'text-[14px]';
  const sectionClass = compact ? 'text-[5px]' : 'text-[7px]';

  const main = (
    <div className={`${text} h-full w-full bg-white p-4 ${compact ? 'p-2.5' : ''}`}>
      {headerVariant === 'banner' ? (
        <div className="-mx-4 -mt-4 mb-3 px-4 py-3 text-center text-white" style={{ backgroundColor: resolvedAccent }}>
          <div className={`${heading} font-bold tracking-[0.12em]`}>{profile.name.toUpperCase()}</div>
          <div className="mt-0.5 text-[5px] italic opacity-90">{profile.title}</div>
        </div>
      ) : headerVariant === 'compact' ? (
        <div className="mb-2 border-t-2 pt-2" style={{ borderColor: resolvedAccent }}>
          <div className={`${heading} font-bold`}>{profile.name.toUpperCase()}</div>
          <div className="text-[5px] text-neutral-500">{profile.title}</div>
        </div>
      ) : (
        <div className={`mb-2 ${headerVariant === 'centered' ? 'text-center' : ''} ${headerVariant === 'editorial' ? 'border-b-2 pb-2' : ''}`} style={headerVariant === 'editorial' ? { borderColor: resolvedAccent } : undefined}>
          <div className={`${heading} font-bold tracking-tight`}>{profile.name.toUpperCase()}</div>
          <div className="mt-0.5 text-[5px] font-medium" style={{ color: resolvedAccent }}>{profile.title}</div>
        </div>
      )}

      <div className="mb-2 text-[4.5px] text-neutral-400">{profile.email} · {profile.phone} · {profile.location} · {profile.linkedin}</div>

      <section className="mb-2">
        <div className={`${sectionClass} mb-1 font-bold tracking-[0.12em]`} style={{ color: resolvedAccent }}>SUMMARY</div>
        <p className="text-[5px] leading-[1.35] text-neutral-600">{profile.summary}</p>
      </section>

      <section className="mb-2">
        <div className={`${sectionClass} mb-1 font-bold tracking-[0.12em]`} style={{ color: resolvedAccent }}>EXPERIENCE</div>
        {profile.experience.map((item) => (
          <div key={item.role} className="mb-1.5">
            <div className="text-[5.5px] font-bold text-neutral-900">{item.role}</div>
            <div className="text-[4.5px] text-neutral-500">{item.company} · {item.dates}</div>
            <div className="mt-0.5 text-[4.5px] leading-[1.25] text-neutral-600">{item.detail}</div>
          </div>
        ))}
      </section>

      <section className="mb-2">
        <div className={`${sectionClass} mb-1 font-bold tracking-[0.12em]`} style={{ color: resolvedAccent }}>EDUCATION</div>
        <div className="text-[4.7px] text-neutral-600">{profile.education}</div>
      </section>

      <section className="mb-2">
        <div className={`${sectionClass} mb-1 font-bold tracking-[0.12em]`} style={{ color: resolvedAccent }}>SKILLS</div>
        <div className="text-[4.5px] leading-4 text-neutral-600">{profile.skills.join(' · ')}</div>
      </section>

      {!compact && (
        <>
          <section className="mb-2">
            <div className={`${sectionClass} mb-1 font-bold tracking-[0.12em]`} style={{ color: resolvedAccent }}>PROJECT</div>
            <div className="text-[4.5px] leading-[1.3] text-neutral-600">{profile.project}</div>
          </section>
          <section className="mb-2">
            <div className={`${sectionClass} mb-1 font-bold tracking-[0.12em]`} style={{ color: resolvedAccent }}>CERTIFICATION</div>
            <div className="text-[4.5px] text-neutral-600">{profile.certification}</div>
          </section>
        </>
      )}
    </div>
  );

  if (layout === 'two-column') {
    return (
      <div className="flex h-full w-full overflow-hidden bg-white">
        <aside className="w-[31%] shrink-0 p-2" style={{ backgroundColor: sidebarVariant === 'solid' ? resolvedAccent : '#f3f4f6' }}>
          <div className={`${compact ? 'text-[7px]' : 'text-[10px]'} font-bold ${sidebarVariant === 'solid' ? 'text-white' : 'text-neutral-900'}`}>
            {profile.name.split(' ').map((part) => <span key={part} className="block">{part}</span>)}
          </div>
          <div className={`mt-3 space-y-1 ${sidebarVariant === 'solid' ? 'text-white/80' : 'text-neutral-500'}`} style={{ fontSize: compact ? '4px' : '5px' }}>
            CONTACT<br />SKILLS<br />EDUCATION<br />CERTIFICATIONS<br />LANGUAGES
          </div>
        </aside>
        <div className="min-w-0 flex-1">{main}</div>
      </div>
    );
  }

  return main;
}
