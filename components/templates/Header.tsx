import { PersonalInfo } from '@/lib/types/resume';
import { TemplatePreset } from '@/lib/templates/presets';

function ContactLine({ info, inverse = false }: { info: PersonalInfo; inverse?: boolean }) {
  const parts = [[info.city, info.country].filter(Boolean).join(', '), info.email, info.phone, info.linkedin, info.portfolio, info.github].filter(Boolean);
  return <div className={`flex flex-wrap gap-x-2 gap-y-0.5 leading-snug text-[0.84em] ${inverse ? 'text-white/90' : 'text-[var(--resume-muted)]'}`}>
    {parts.map((p, i) => <span key={i} className="flex items-center gap-2 break-all">{p}{i < parts.length - 1 && <span className={inverse ? 'text-white/40' : 'text-neutral-300'}>|</span>}</span>)}
  </div>;
}

export function ResumeHeader({ info, preset }: { info: PersonalInfo; preset: TemplatePreset }) {
  const showPhoto = preset.photoAllowed && info.photoUrl;
  const centered = preset.headerAlign === 'center';
  const title = info.professionalTitle || '';
  const printClass = `resume-print-header resume-print-header--${preset.headerVariant}`;

  if (preset.headerVariant === 'banner') return <div className={`${printClass} mb-6 -mx-[0px] bg-[var(--accent)] px-[10mm] py-6 text-center text-white`}>
    <h1 className="font-serif font-bold leading-none tracking-[0.09em]" style={{ fontSize: 'calc(2.25em * var(--heading-scale))' }}>{info.fullName || 'Your Name'}</h1>
    {title && <p className="mt-2 font-serif italic tracking-wide" style={{ fontSize: '1.05em' }}>{title}</p>}
    <div className="mx-auto mt-3 max-w-[92%]"><ContactLine info={info} inverse /></div>
  </div>;

  if (preset.headerVariant === 'editorial') return <div className={`${printClass} mb-6 border-b-2 pb-4`} style={{ borderColor: 'var(--accent)' }}>
    <div className={centered ? 'text-center' : ''}><h1 className="font-bold leading-[0.98] tracking-[-0.04em]" style={{ fontSize: 'calc(2.05em * var(--heading-scale))', color: '#111827' }}>{info.fullName || 'Your Name'}</h1>{title && <p className="mt-1 font-medium" style={{ color: 'var(--accent)', fontSize: '1.02em' }}>{title}</p>}</div>
    <div className="mt-3"><ContactLine info={info} /></div>
  </div>;

  if (preset.headerVariant === 'compact') return <div className={`${printClass} mb-4 border-t-[5px] pt-4`} style={{ borderColor: 'var(--accent)' }}>
    <div className="flex items-end justify-between gap-5"><div className="min-w-0"><h1 className="font-bold leading-none tracking-[-0.04em]" style={{ fontSize: 'calc(2em * var(--heading-scale))', color: '#111827' }}>{info.fullName || 'Your Name'}</h1>{title && <p className="mt-1 font-medium text-[var(--resume-muted)]" style={{ fontSize: '0.98em' }}>{title}</p>}</div><div className="max-w-[58%] text-right"><ContactLine info={info} /></div></div>
  </div>;

  return <div className={`${printClass} flex gap-4 mb-5 ${centered ? 'flex-col items-center text-center' : 'items-center justify-between flex-wrap'}`}>
    <div className={centered ? '' : 'flex items-center gap-4'}>
      {showPhoto && !centered && <img src={info.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border border-neutral-200" />}
      <div><h1 className="font-bold leading-[1.05] tracking-[-0.035em]" style={{ fontSize: 'calc(1.9em * var(--heading-scale))', color: '#111827' }}>{info.fullName || 'Your Name'}</h1>{title && <p className="font-medium mt-1" style={{ color: 'var(--accent)', fontSize: '1.02em' }}>{title}</p>}</div>
    </div>
    <ContactLine info={info} />
  </div>;
}
