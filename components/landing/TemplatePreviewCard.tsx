import { HeaderVariant, SidebarVariant, TemplateLayout, TemplatePreset } from '@/lib/templates/presets';
import { getSampleResume } from '@/lib/templates/sample-resumes';

const FONT_FAMILY: Record<string, string> = {
  'times-new-roman': 'Times New Roman, Times, serif', merriweather: 'Merriweather, Georgia, serif', georgia: 'Georgia, Times New Roman, serif',
  montserrat: 'Montserrat, Arial, sans-serif', poppins: 'Poppins, Arial, sans-serif', manrope: 'Manrope, Arial, sans-serif',
  'ibm-plex-sans': 'IBM Plex Sans, Arial, sans-serif', 'source-sans-3': 'Source Sans 3, Arial, sans-serif', 'proxima-nova': 'Proxima Nova, Arial, sans-serif', inter: 'Inter, Arial, sans-serif',
};

export function TemplatePreviewCard({ accent, layout, headerVariant, sidebarVariant, font, compact = false, template }: {
  accent: string; layout: TemplateLayout; headerVariant: HeaderVariant; sidebarVariant: SidebarVariant; font: string; compact?: boolean; template?: TemplatePreset;
}) {
  const resolvedAccent = template?.defaultAccentColor || accent;
  const profile = getSampleResume(template?.category);
  const family = FONT_FAMILY[font] || 'Inter, Arial, sans-serif';
  const serif = font === 'merriweather' || font === 'georgia' || font === 'times-new-roman';
  const headingSize = compact ? 9 : 14;
  const bodySize = compact ? 4.5 : 5;
  const sectionSize = compact ? 5 : 7;
  const underline = template?.sectionHeadingStyle === 'uppercase-underline' || template?.sectionHeadingStyle === 'small-caps-line';

  const Header = () => {
    if (headerVariant === 'banner') return <div className="-mx-4 -mt-4 mb-3 px-4 py-3 text-center text-white" style={{ backgroundColor: resolvedAccent, fontFamily: family }}><div style={{ fontSize: headingSize, fontWeight: 800, letterSpacing: '0.1em' }}>{profile.name.toUpperCase()}</div><div className="mt-0.5 text-[5px] italic opacity-90">{profile.title}</div></div>;
    if (headerVariant === 'compact') return <div className="mb-2 border-t-2 pt-2" style={{ borderColor: resolvedAccent, fontFamily: family }}><div style={{ fontSize: headingSize, fontWeight: 800 }}>{profile.name.toUpperCase()}</div><div className="text-[5px] text-neutral-500">{profile.title}</div></div>;
    return <div className={`mb-2 ${headerVariant === 'centered' ? 'text-center' : ''} ${headerVariant === 'editorial' ? 'border-b-2 pb-2' : ''}`} style={{ borderColor: headerVariant === 'editorial' ? resolvedAccent : undefined, fontFamily: family }}><div style={{ fontSize: headingSize, fontWeight: 800, letterSpacing: serif ? '0.02em' : '-0.01em' }}>{profile.name.toUpperCase()}</div><div className="mt-0.5 font-semibold" style={{ fontSize: 5, color: resolvedAccent }}>{profile.title}</div></div>;
  };

  const SectionTitle = ({ children }: { children: string }) => <div className="mb-1 font-bold tracking-[0.12em]" style={{ color: resolvedAccent, fontSize: sectionSize, borderBottom: underline ? `1px solid ${resolvedAccent}` : undefined, paddingBottom: underline ? 1 : undefined }}>{children}</div>;

  const main = <div className="h-full w-full bg-white p-4" style={{ fontFamily: family }}>
    <Header />
    <div className="mb-2 text-neutral-400" style={{ fontSize: 4.5 }}>{profile.email} · {profile.phone} · {profile.location} · {profile.linkedin}</div>
    <section className="mb-2"><SectionTitle>SUMMARY</SectionTitle><p className="leading-[1.35] text-neutral-600" style={{ fontSize: bodySize }}>{profile.summary}</p></section>
    <section className="mb-2"><SectionTitle>EXPERIENCE</SectionTitle>{profile.experience.map((item) => <div key={item.role} className="mb-1.5"><div className="font-bold text-neutral-900" style={{ fontSize: 5.5 }}>{item.role}</div><div className="text-neutral-500" style={{ fontSize: 4.5 }}>{item.company} · {item.dates}</div><div className="mt-0.5 leading-[1.25] text-neutral-600" style={{ fontSize: 4.5 }}>{item.detail}</div></div>)}</section>
    <section className="mb-2"><SectionTitle>EDUCATION</SectionTitle><div className="text-neutral-600" style={{ fontSize: 4.7 }}>{profile.education}</div></section>
    <section className="mb-2"><SectionTitle>SKILLS</SectionTitle><div className="leading-4 text-neutral-600" style={{ fontSize: 4.5 }}>{profile.skills.join(' · ')}</div></section>
    {!compact && <><section className="mb-2"><SectionTitle>PROJECT</SectionTitle><div className="leading-[1.3] text-neutral-600" style={{ fontSize: 4.5 }}>{profile.project}</div></section><section className="mb-2"><SectionTitle>CERTIFICATION</SectionTitle><div className="text-neutral-600" style={{ fontSize: 4.5 }}>{profile.certification}</div></section></>}
  </div>;

  if (layout === 'two-column') return <div className="flex h-full w-full overflow-hidden bg-white" style={{ fontFamily: family }}><aside className="w-[31%] shrink-0 p-2" style={{ backgroundColor: sidebarVariant === 'solid' ? resolvedAccent : '#f3f4f6', color: sidebarVariant === 'solid' ? '#fff' : '#111827' }}><div className="font-bold" style={{ fontSize: compact ? 7 : 10 }}>{profile.name.split(' ').map((part) => <span key={part} className="block">{part}</span>)}</div><div className="mt-3 space-y-1" style={{ fontSize: compact ? 4 : 5, opacity: sidebarVariant === 'solid' ? 0.82 : 0.65 }}>CONTACT<br />SKILLS<br />EDUCATION<br />CERTIFICATIONS<br />LANGUAGES</div></aside><div className="min-w-0 flex-1">{main}</div></div>;
  return main;
}
