import { PersonalInfo } from '@/lib/types/resume';
import { TemplatePreset } from '@/lib/templates/presets';

function ContactLine({ info }: { info: PersonalInfo }) {
  const parts = [
    [info.city, info.country].filter(Boolean).join(', '),
    info.email,
    info.phone,
    info.linkedin,
    info.portfolio,
    info.github,
  ].filter(Boolean);

  return (
    <div className="text-[0.88em] text-[var(--resume-muted)] flex flex-wrap gap-x-2 leading-snug">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-2">
          {p}
          {i < parts.length - 1 && <span className="text-neutral-300">|</span>}
        </span>
      ))}
    </div>
  );
}

export function ResumeHeader({ info, preset }: { info: PersonalInfo; preset: TemplatePreset }) {
  const showPhoto = preset.photoAllowed && info.photoUrl;
  const centered = preset.headerAlign === 'center';

  return (
    <div
      className={`flex gap-4 mb-5 ${centered ? 'flex-col items-center text-center' : 'items-center justify-between flex-wrap'}`}
    >
      <div className={centered ? '' : 'flex items-center gap-4'}>
        {showPhoto && !centered && (
          <img src={info.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border border-neutral-200" />
        )}
        <div>
          <h1
            className="font-bold leading-[1.05] tracking-[-0.035em]"
            style={{ fontSize: 'calc(1.9em * var(--heading-scale))', color: '#111827' }}
          >
            {info.fullName || 'Your Name'}
          </h1>
          {info.professionalTitle && (
            <p className="font-medium mt-1" style={{ color: 'var(--accent)', fontSize: '1.02em' }}>
              {info.professionalTitle}
            </p>
          )}
        </div>
      </div>
      <ContactLine info={info} />
    </div>
  );
}
