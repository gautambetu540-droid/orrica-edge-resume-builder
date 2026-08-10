import { ResumeData, ResumeSectionId } from '@/lib/types/resume';
import { TemplatePreset } from '@/lib/templates/presets';

function formatDate(value?: string) {
  if (!value) return '';
  const [year, month] = value.split('-');
  if (!month) return year;
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function SectionHeading({
  children,
  preset,
}: {
  children: React.ReactNode;
  preset: TemplatePreset;
}) {
  const base = 'font-semibold tracking-wide';
  switch (preset.sectionHeadingStyle) {
    case 'uppercase-underline':
      return (
        <h2
          className={`${base} uppercase text-[1em] pb-1 mb-2 border-b-2`}
          style={{ borderColor: 'var(--accent)', letterSpacing: '0.06em' }}
        >
          {children}
        </h2>
      );
    case 'uppercase-accent':
      return (
        <h2
          className={`${base} uppercase text-[1em] mb-2`}
          style={{ color: 'var(--accent)', letterSpacing: '0.08em' }}
        >
          {children}
        </h2>
      );
    case 'small-caps-line':
      return (
        <h2 className={`${base} text-[0.95em] mb-2 flex items-center gap-2 text-neutral-500`}>
          <span style={{ letterSpacing: '0.1em' }}>{String(children).toUpperCase()}</span>
          <span className="flex-1 h-px bg-neutral-200" />
        </h2>
      );
    case 'bold-plain':
    default:
      return (
        <h2 className={`${base} text-[1.05em] mb-2`} style={{ color: 'var(--accent)' }}>
          {children}
        </h2>
      );
  }
}

export function SummarySection({ data }: { data: ResumeData }) {
  if (!data.summary?.trim()) return null;
  return <p className="leading-relaxed whitespace-pre-line">{data.summary}</p>;
}

export function ExperienceSection({ data }: { data: ResumeData }) {
  if (!data.experience.length) return null;
  return (
    <div className="space-y-4" style={{ rowGap: 'var(--entry-gap)' }}>
      {data.experience.map((exp) => (
        <div key={exp.id} className="break-inside-avoid">
          <div className="flex justify-between items-baseline gap-3 flex-wrap">
            <div>
              <span className="font-semibold">{exp.jobTitle}</span>
              {exp.company && <span> — {exp.company}</span>}
            </div>
            <span className="text-neutral-500 whitespace-nowrap text-[0.9em]">
              {formatDate(exp.startDate)} – {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
            </span>
          </div>
          {exp.location && <div className="text-neutral-500 text-[0.9em]">{exp.location}</div>}
          {exp.achievements.length > 0 ? (
            <ul className="list-disc ml-5 mt-1 space-y-0.5">
              {exp.achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          ) : exp.responsibilities ? (
            <p className="mt-1 whitespace-pre-line">{exp.responsibilities}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function EducationSection({ data }: { data: ResumeData }) {
  if (!data.education.length) return null;
  return (
    <div className="space-y-3">
      {data.education.map((ed) => (
        <div key={ed.id} className="break-inside-avoid">
          <div className="flex justify-between items-baseline gap-3 flex-wrap">
            <div>
              <span className="font-semibold">{ed.degree}</span>
              {ed.fieldOfStudy && <span>, {ed.fieldOfStudy}</span>}
            </div>
            <span className="text-neutral-500 whitespace-nowrap text-[0.9em]">
              {formatDate(ed.startDate)} – {formatDate(ed.endDate) || 'Present'}
            </span>
          </div>
          <div className="text-neutral-600">
            {ed.institution}
            {ed.grade ? ` · ${ed.grade}` : ''}
          </div>
          {ed.description && <p className="mt-1 whitespace-pre-line">{ed.description}</p>}
        </div>
      ))}
    </div>
  );
}

const SKILL_LABELS: Record<string, string> = {
  technical: 'Technical Skills',
  soft: 'Soft Skills',
  tools: 'Tools',
  languages: 'Languages',
};

export function SkillsSection({ data, compact = false }: { data: ResumeData; compact?: boolean }) {
  const populated = data.skills.filter((s) => s.items.length > 0);
  if (!populated.length) return null;
  return (
    <div className={compact ? 'space-y-3' : 'space-y-2'}>
      {populated.map((cat) => (
        <div key={cat.category}>
          {!compact && <div className="font-medium text-[0.92em] mb-0.5">{SKILL_LABELS[cat.category]}</div>}
          <div className={compact ? 'flex flex-col gap-1' : 'flex flex-wrap gap-x-1.5 gap-y-1'}>
            {compact ? (
              <>
                <div className="font-medium text-[0.85em] opacity-80">{SKILL_LABELS[cat.category]}</div>
                <div className="text-[0.9em]">{cat.items.join(', ')}</div>
              </>
            ) : (
              cat.items.map((item, i) => (
                <span key={item} className="text-[0.92em]">
                  {item}
                  {i < cat.items.length - 1 ? ' ·' : ''}
                </span>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectsSection({ data }: { data: ResumeData }) {
  if (!data.projects.length) return null;
  return (
    <div className="space-y-3">
      {data.projects.map((p) => (
        <div key={p.id} className="break-inside-avoid">
          <div className="flex justify-between items-baseline gap-3 flex-wrap">
            <span className="font-semibold">
              {p.name}
              {p.role ? ` — ${p.role}` : ''}
            </span>
            {p.url && (
              <span className="text-[0.85em]" style={{ color: 'var(--accent)' }}>
                {p.url.replace(/^https?:\/\//, '')}
              </span>
            )}
          </div>
          {p.description && <p className="mt-0.5 whitespace-pre-line">{p.description}</p>}
          {p.technologies.length > 0 && (
            <div className="text-[0.85em] text-neutral-500 mt-0.5">{p.technologies.join(' · ')}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function CertificationsSection({ data }: { data: ResumeData }) {
  if (!data.certifications.length) return null;
  return (
    <div className="space-y-1.5">
      {data.certifications.map((c) => (
        <div key={c.id} className="flex justify-between items-baseline gap-3 flex-wrap">
          <span>
            <span className="font-medium">{c.name}</span>
            {c.issuingOrganization && <span> — {c.issuingOrganization}</span>}
          </span>
          {c.issueDate && <span className="text-neutral-500 text-[0.88em]">{formatDate(c.issueDate)}</span>}
        </div>
      ))}
    </div>
  );
}

const PROFICIENCY_LABEL: Record<string, string> = {
  basic: 'Basic',
  conversational: 'Conversational',
  professional: 'Professional',
  fluent: 'Fluent',
  native: 'Native',
};

export function LanguagesSection({ data }: { data: ResumeData }) {
  if (!data.languages.length) return null;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {data.languages.map((l) => (
        <span key={l.id} className="text-[0.92em]">
          {l.language} <span className="text-neutral-500">({PROFICIENCY_LABEL[l.proficiency]})</span>
        </span>
      ))}
    </div>
  );
}

export function AchievementsSection({ data }: { data: ResumeData }) {
  if (!data.achievements.length) return null;
  return (
    <ul className="list-disc ml-5 space-y-1">
      {data.achievements.map((a) => (
        <li key={a.id}>
          <span className="font-medium">{a.title}</span>
          {a.description ? ` — ${a.description}` : ''}
          {a.date ? ` (${formatDate(a.date)})` : ''}
        </li>
      ))}
    </ul>
  );
}

export const SECTION_TITLES: Record<Exclude<ResumeSectionId, 'header'>, string> = {
  summary: 'Professional Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  achievements: 'Achievements',
};

export function renderSectionBody(id: ResumeSectionId, data: ResumeData, compactSkills = false) {
  switch (id) {
    case 'summary':
      return <SummarySection data={data} />;
    case 'experience':
      return <ExperienceSection data={data} />;
    case 'education':
      return <EducationSection data={data} />;
    case 'skills':
      return <SkillsSection data={data} compact={compactSkills} />;
    case 'projects':
      return <ProjectsSection data={data} />;
    case 'certifications':
      return <CertificationsSection data={data} />;
    case 'languages':
      return <LanguagesSection data={data} />;
    case 'achievements':
      return <AchievementsSection data={data} />;
    default:
      return null;
  }
}

export function isSectionEmpty(id: ResumeSectionId, data: ResumeData): boolean {
  switch (id) {
    case 'summary':
      return !data.summary?.trim();
    case 'experience':
      return data.experience.length === 0;
    case 'education':
      return data.education.length === 0;
    case 'skills':
      return data.skills.every((s) => s.items.length === 0);
    case 'projects':
      return data.projects.length === 0;
    case 'certifications':
      return data.certifications.length === 0;
    case 'languages':
      return data.languages.length === 0;
    case 'achievements':
      return data.achievements.length === 0;
    default:
      return false;
  }
}
