'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Download, FileText, FileUp, Loader2, Mail, Printer, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OrricaResumeWizard } from '@/components/wizard/OrricaResumeWizard';
import { ResumeDocument } from '@/components/templates/ResumeDocument';
import { useDraftResume } from '@/lib/hooks/useDraftResume';
import { DEFAULT_SETTINGS, ResumeData, ResumeSettings, TemplateId } from '@/lib/types/resume';
import { toast } from '@/components/ui/toaster';

const ORANGE = '#F97316';

type TemplateCard = { id: TemplateId; name: string; description: string; category: string; level: string; tag?: string };

const TEMPLATES: TemplateCard[] = [
  { id: 'modern-ats', name: 'Modern Professional', description: 'Clean ATS-first hierarchy with a modern professional finish.', category: 'Modern', level: 'All Levels', tag: 'MOST POPULAR' },
  { id: 'classic-professional', name: 'Classic Professional', description: 'Traditional structure with polished corporate spacing.', category: 'Classic', level: 'Experienced' },
  { id: 'minimal', name: 'Minimal Clean', description: 'Quiet typography, strong whitespace and effortless scanning.', category: 'Minimal', level: 'All Levels' },
  { id: 'executive', name: 'Executive Editorial', description: 'Premium hierarchy designed for senior professionals.', category: 'Professional', level: 'Experienced' },
  { id: 'modern-two-column', name: 'Modern Sidebar', description: 'Balanced two-column design for dense professional profiles.', category: 'Modern', level: 'Experienced' },
  { id: 'fresh-graduate', name: 'Graduate Focus', description: 'Education and skills-forward structure for early careers.', category: 'Entry Level', level: 'Entry Level' },
  { id: 'bold-header', name: 'Bold Executive', description: 'Strong nameplate and section hierarchy for leadership roles.', category: 'Professional', level: 'Experienced' },
  { id: 'elegant-serif', name: 'Elegant Serif', description: 'Refined editorial typography with a premium feel.', category: 'Classic', level: 'Experienced' },
  { id: 'compact-ats', name: 'Compact ATS', description: 'Space-efficient layout for detailed work histories.', category: 'ATS Friendly', level: 'Experienced' },
  { id: 'creative-sidebar', name: 'Creative Sidebar', description: 'Distinctive sidebar while keeping content recruiter-friendly.', category: 'Creative', level: 'All Levels' },
  { id: 'clean-corporate', name: 'Clean Corporate', description: 'Crisp modern corporate format with excellent readability.', category: 'Professional', level: 'All Levels' },
  { id: 'tech-modern', name: 'Tech Modern', description: 'Structured two-column layout for technology profiles.', category: 'Modern', level: 'Experienced' },
  { id: 'simple-chronological', name: 'Simple Chronological', description: 'Straightforward reverse-chronological experience flow.', category: 'ATS Friendly', level: 'All Levels' },
  { id: 'classic-two-column', name: 'Classic Two Column', description: 'Traditional two-column presentation for established careers.', category: 'Classic', level: 'Experienced' },
  { id: 'creative-modern', name: 'Creative Modern', description: 'Contemporary visual hierarchy for marketing and creative roles.', category: 'Creative', level: 'All Levels' },
  { id: 'dark-executive', name: 'Dark Executive', description: 'High-contrast executive layout with a strong sidebar.', category: 'Professional', level: 'Experienced' },
  { id: 'blue-accent', name: 'Blue Accent', description: 'Cool accent system with a clean recruiter-first structure.', category: 'Modern', level: 'All Levels' },
  { id: 'orange-accent', name: 'Orrica Signature', description: 'Orrica Edge orange with a polished modern hierarchy.', category: 'Orrica Edge', level: 'All Levels', tag: 'ORRICA PICK' },
  { id: 'editorial-clean', name: 'Editorial Clean', description: 'Magazine-inspired typography without sacrificing ATS clarity.', category: 'Creative', level: 'Experienced' },
  { id: 'timeline-pro', name: 'Timeline Pro', description: 'Structured progression-focused layout for career stories.', category: 'Modern', level: 'Experienced' },
  ...Array.from({ length: 10 }, (_, i) => ({ id: `fresher-${String(i + 1).padStart(2, '0')}` as TemplateId, name: `Fresher ${i + 1}`, description: 'Entry-level layout with education, skills and projects prioritized.', category: 'Fresher', level: 'Entry Level' })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `photo-${String(i + 1).padStart(2, '0')}` as TemplateId, name: `Photo Resume ${i + 1}`, description: 'Photo-enabled professional layout with balanced profile hierarchy.', category: 'Photo Resume', level: 'All Levels' })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `it-${String(i + 1).padStart(2, '0')}` as TemplateId, name: `IT / Technology ${i + 1}`, description: 'Clean technical layout designed for software, data, cloud and IT roles.', category: 'IT / Technology', level: 'All Levels' })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `bpo-${String(i + 1).padStart(2, '0')}` as TemplateId, name: `BPO / Customer Support ${i + 1}`, description: 'Recruiter-friendly layout for voice, chat and customer support roles.', category: 'BPO / Customer Support', level: 'All Levels' })),
];

const SAMPLE_RESUME_DATA: ResumeData = {
  personalInfo: { fullName: 'Alex Morgan', professionalTitle: 'Senior Marketing Specialist', email: 'alex.morgan@email.com', phone: '+1 555 014 2288', city: 'New York, NY', country: 'United States', linkedin: 'linkedin.com/in/alexmorgan', portfolio: 'alexmorgan.com' },
  summary: 'Results-driven marketing specialist with 6+ years of experience building digital campaigns, improving customer acquisition and translating market insights into measurable growth. Skilled in content strategy, lifecycle marketing and cross-functional execution.',
  experience: [], education: [], skills: [], projects: [], certifications: [], languages: [], achievements: [], targetRole: 'Senior Marketing Specialist',
};

const TEMPLATE_FONTS: Partial<Record<TemplateId, ResumeSettings['font']>> = {
  'modern-ats': 'arial', 'classic-professional': 'times-new-roman', minimal: 'proxima-nova', executive: 'merriweather',
  'modern-two-column': 'arial', 'fresh-graduate': 'proxima-nova', 'bold-header': 'proxima-nova', 'elegant-serif': 'times-new-roman',
  'compact-ats': 'ibm-plex-sans', 'creative-sidebar': 'arial', 'clean-corporate': 'inter', 'tech-modern': 'ibm-plex-sans',
  'simple-chronological': 'arial', 'classic-two-column': 'times-new-roman', 'creative-modern': 'proxima-nova', 'dark-executive': 'inter',
  'blue-accent': 'source-sans-3', 'orange-accent': 'proxima-nova', 'editorial-clean': 'georgia', 'timeline-pro': 'source-sans-3',
};

function MiniTemplate({ settings }: { settings: ResumeSettings }) {
  return <div className="oe-template-preview relative h-[270px] overflow-hidden rounded-[10px] bg-[#f4f5f7] sm:h-[285px]">
    <div className="absolute left-1/2 top-3 w-[794px] origin-top -translate-x-1/2 scale-[0.285] shadow-[0_20px_40px_-22px_rgba(15,23,42,.48)] transition-transform duration-500 group-hover:scale-[0.30]">
      <ResumeDocument data={SAMPLE_RESUME_DATA} settings={settings} />
    </div>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#f4f5f7] to-transparent" />
  </div>;
}

function Intro({ onNext }: { onNext: () => void }) {
  const items = [['1', 'Select', 'a template from our professional library.'], ['2', 'Choose', 'to upload an existing resume or start from scratch.'], ['3', 'Build', 'your resume step by step and download it when ready.']];
  return <div className="oe-flow min-h-dvh bg-white text-[#171717]"><header className="flex h-[68px] items-center justify-center border-b border-[#f0f0f0]"><a href="/" aria-label="Orrica Edge home"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-[30px] w-auto sm:h-[34px]" /></a></header><main className="mx-auto flex min-h-[calc(100dvh-68px)] max-w-6xl items-center px-5 py-8 sm:px-10 sm:py-12"><section className="grid w-full items-center gap-8 md:grid-cols-[1fr_1fr] md:gap-12 lg:px-10"><div className="text-center md:text-left"><div className="mb-5 inline-flex rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[.12em] text-orange-600">Orrica Edge Resume Builder</div><h1 className="text-[40px] font-bold leading-[1.06] tracking-[-.045em] sm:text-[46px] md:text-[57px]">Just three<br className="md:hidden" /> simple steps</h1><div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">{items.map(([n,bold,text]) => <div key={n} className="flex items-start gap-4 text-left"><span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[14px] font-semibold text-white shadow-[0_8px_18px_-12px_rgba(249,115,22,.8)]">{n}</span><p className="max-w-[500px] text-[14px] leading-6 text-[#334155] sm:text-[15px]"><strong className="font-semibold text-[#111827]">{bold}</strong> {text}</p></div>)}</div><button type="button" onClick={onNext} className="mt-8 h-[58px] w-full max-w-[330px] rounded-[7px] bg-orange-500 text-[17px] font-semibold text-white shadow-[0_14px_30px_-18px_rgba(249,115,22,.75)] transition hover:bg-orange-600">Next</button><p className="mt-4 max-w-[330px] text-[10px] leading-5 text-[#64748B]">By clicking “Next”, you agree to our <a href="/terms" className="font-semibold underline">Terms of Use</a> and <a href="/privacy" className="font-semibold underline">Privacy Policy</a>.</p></div><div className="oe-intro-visual hidden md:block" aria-label="Animated resume preview"><div className="oe-intro-scene"><div className="oe-intro-aura one"/><div className="oe-intro-aura two"/><div className="oe-intro-orbit one"/><div className="oe-intro-orbit two"/><div className="oe-intro-card-back"/><div className="oe-intro-resume-card"><div className="oe-intro-scan"/><div className="oe-intro-resume-page"><ResumeDocument data={SAMPLE_RESUME_DATA} settings={{ ...DEFAULT_SETTINGS, accentColor: ORANGE }} /></div></div><div className="oe-intro-action action-one"><Download className="h-4 w-4"/><span>Download</span></div><div className="oe-intro-action action-two"><Printer className="h-4 w-4"/><span>Print</span></div><div className="oe-intro-action action-three"><Mail className="h-4 w-4"/><span>Email</span></div><div className="oe-intro-badge"><span/> ATS-ready <i/> Live preview <i/> PDF export</div></div></div></section></main><style jsx global>{`@keyframes oeFloat{0%,100%{transform:translateY(0) rotateX(0) rotateY(0)}50%{transform:translateY(-9px) rotateX(.7deg) rotateY(-1deg)}}@keyframes oeSpin{to{transform:rotate(360deg)}}@keyframes oeSpinR{to{transform:rotate(-360deg)}}@keyframes oeScan{0%,18%{top:-8%;opacity:0}30%,70%{top:108%;opacity:1}82%,100%{top:108%;opacity:0}}@keyframes oeAction{0%,10%{opacity:0;transform:translateX(16px)}18%,82%{opacity:1;transform:translateX(0)}92%,100%{opacity:0;transform:translateX(16px)}}.oe-flow,.oe-flow *{font-family:"Proxima Nova",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}.oe-intro-visual{min-height:390px;display:flex;align-items:center;justify-content:center}.oe-intro-scene{position:relative;width:500px;height:430px}.oe-intro-aura{position:absolute;border-radius:999px;filter:blur(28px);background:rgba(249,115,22,.14);animation:oeFloat 7s ease-in-out infinite}.oe-intro-aura.one{right:42px;top:38px;width:270px;height:270px}.oe-intro-aura.two{right:125px;top:112px;width:170px;height:170px;opacity:.65;animation-delay:-2s}.oe-intro-orbit{position:absolute;border:1px solid rgba(249,115,22,.2);border-radius:999px}.oe-intro-orbit.one{right:22px;top:42px;width:340px;height:300px;animation:oeSpin 13s linear infinite}.oe-intro-orbit.two{right:78px;top:76px;width:250px;height:230px;border-color:rgba(234,88,12,.18);animation:oeSpinR 16s linear infinite}.oe-intro-card-back{position:absolute;right:47px;top:83px;width:344px;height:310px;border-radius:10px;background:linear-gradient(145deg,#fb923c,#ea580c);transform:translate(13px,13px);box-shadow:0 18px 40px -24px rgba(249,115,22,.65)}.oe-intro-resume-card{position:absolute;right:61px;top:69px;width:344px;height:310px;border:1px solid rgba(148,163,184,.55);border-radius:10px;background:#fff;overflow:hidden;z-index:2;box-shadow:0 28px 60px -34px rgba(15,23,42,.38);animation:oeFloat 6s ease-in-out infinite}.oe-intro-resume-page{position:absolute;left:50%;top:9px;width:794px;transform:translateX(-50%) scale(.385);transform-origin:top center}.oe-intro-scan{position:absolute;left:0;right:0;top:-10%;height:3px;background:linear-gradient(90deg,transparent,rgba(249,115,22,.9),rgba(234,88,12,.65),transparent);box-shadow:0 0 18px rgba(249,115,22,.5);z-index:5;animation:oeScan 5s ease-in-out infinite}.oe-intro-action{position:absolute;right:-1px;width:132px;height:42px;display:flex;align-items:center;justify-content:center;gap:... (truncated)

  const handleContinue = () => setStep((s) => Math.min(s + 1, 3));

  return (
    <div className="oe-flow">
      {step === 0 ? <Intro onNext={() => setStep(1)} /> : <div className="oe-builder-shell">{/* existing builder flow preserved below */}<OrricaResumeWizard initialTemplate={template} /></div>}
    </div>
  );
}