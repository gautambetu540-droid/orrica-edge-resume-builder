import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const RESOURCES = {
  'resume-builder': {
    title: 'Resume Builder Guide: How to Create a Professional Resume',
    description: 'Learn how to build a professional resume with clear sections, strong content, ATS-friendly structure and a recruiter-ready layout.',
    intro: 'A strong resume makes your experience easier to understand. Use a clear structure, relevant keywords and concise achievement-focused content to create a document that is easy for recruiters to scan.',
    sections: ['Start with accurate contact and professional details', 'Write a focused resume summary for the role you want', 'Show experience with measurable responsibilities and achievements', 'Add relevant education, skills, projects and certifications', 'Review the final layout before downloading and applying'],
  },
  'resume-templates': {
    title: 'Resume Templates: How to Choose the Right Resume Format',
    description: 'Explore what makes a good resume template and how to choose an ATS-friendly format for your experience level and target role.',
    intro: 'The right resume template should support your content instead of distracting from it. Choose a clean layout with readable sections, consistent spacing and a clear visual hierarchy.',
    sections: ['Choose a layout that matches your experience level', 'Use readable headings and consistent spacing', 'Keep important resume sections easy to scan', 'Select typography that remains clear in PDF format', 'Customize the template around the job you are targeting'],
  },
  'ats-resume-guide': {
    title: 'ATS Resume Guide: How to Make a Resume ATS-Friendly',
    description: 'Learn ATS resume formatting, keyword placement, standard headings and practical ways to make your resume easier for applicant tracking systems to parse.',
    intro: 'Applicant tracking systems can help employers organize applications. A clean, text-first resume structure makes important information easier for both software and recruiters to identify.',
    sections: ['Use standard section headings such as Experience and Education', 'Match relevant job keywords naturally to your experience', 'Avoid unnecessary graphics, decorative text and confusing layouts', 'Keep dates, job titles and company information consistent', 'Proofread your resume before submitting an application'],
  },
  'resume-writing': {
    title: 'Resume Writing Guide: How to Write a Better Resume',
    description: 'Learn how to write a resume summary, work experience bullets, skills and achievements that communicate your value clearly.',
    intro: 'Good resume writing is specific, concise and relevant. Focus each section on evidence of what you did, how you contributed and which skills matter for your target role.',
    sections: ['Write a concise summary that matches your target role', 'Use action-oriented language for experience bullets', 'Prioritize achievements and outcomes over generic duties', 'Keep your skills section relevant to the role', 'Edit every section for clarity and consistency'],
  },
  'fresher-resume-guide': {
    title: 'Fresher Resume Guide: How to Make a Resume With No Experience',
    description: 'Learn how freshers can create a strong resume using education, projects, internships, skills, certifications and achievements.',
    intro: 'You do not need years of employment history to create a useful resume. Freshers can highlight education, academic projects, internships, practical skills and relevant achievements.',
    sections: ['Lead with education and relevant qualifications', 'Show academic, personal or portfolio projects', 'Highlight internships, training and practical exposure', 'Use a targeted skills section based on the role', 'Include certifications, achievements and relevant activities'],
  },
  'interview-preparation': {
    title: 'Interview Preparation Guide: How to Prepare for Job Interviews',
    description: 'Prepare for job interviews with practical guidance on common questions, resume-based questions, communication and structured answers.',
    intro: 'Interview preparation becomes easier when you understand your own resume. Review your experience, projects and skills so you can explain your contribution clearly and confidently.',
    sections: ['Review every point written on your resume', 'Prepare examples for common behavioral questions', 'Practice explaining projects and responsibilities clearly', 'Research the role and the skills it requires', 'Prepare concise questions to ask the interviewer'],
  },
  'job-search-guide': {
    title: 'Job Search Guide: How to Find and Apply for the Right Jobs',
    description: 'Learn practical job search strategies, resume tailoring and application tips to target relevant opportunities more effectively.',
    intro: 'A focused job search is more effective than sending the same application everywhere. Target roles that match your skills and tailor your resume to the requirements that matter.',
    sections: ['Define the roles, industries and locations you want to target', 'Tailor your resume summary and keywords to each role', 'Prioritize relevant experience and transferable skills', 'Keep track of applications and follow-ups', 'Review your results and improve your application strategy'],
  },
} as const;

type ResourceSlug = keyof typeof RESOURCES;

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return Object.keys(RESOURCES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resource = RESOURCES[params.slug as ResourceSlug];
  if (!resource) return { title: 'Career Advice | Orrica Edge Resume' };
  return {
    title: resource.title,
    description: resource.description,
    keywords: [resource.title.split(':')[0], 'Orrica Edge Resume', 'resume tips', 'career advice'],
    alternates: { canonical: `/career-advice/${params.slug}` },
    openGraph: { title: resource.title, description: resource.description, type: 'article' },
  };
}

export default function CareerResourcePage({ params }: PageProps) {
  const resource = RESOURCES[params.slug as ResourceSlug];
  if (!resource) return <main className="min-h-screen bg-white px-6 py-24 text-center"><h1 className="text-3xl font-bold text-neutral-950">Resource not found</h1><Link href="/" className="mt-6 inline-flex text-orange-600">Back to Orrica Edge Resume <ArrowRight className="ml-1 h-4 w-4" /></Link></main>;

  const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: resource.title, description: resource.description, publisher: { '@type': 'Organization', name: 'Orrica Edge Resume' }, mainEntityOfPage: `/career-advice/${params.slug}` };

  return (
    <main className="min-h-screen bg-[#fffaf6] text-neutral-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b border-orange-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="text-lg font-black tracking-tight"><span className="text-neutral-900">Orrica</span><span className="text-orange-600"> Edge Resume</span></Link>
          <Link href="/resume/new" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700">Create Resume</Link>
        </div>
      </header>
      <article className="mx-auto max-w-4xl px-5 py-14 sm:py-20 lg:px-8">
        <Link href="/" className="text-sm font-bold text-orange-600 hover:text-orange-700">← Orrica Edge Resume</Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-orange-600">Career Advice</p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.045em] sm:text-6xl">{resource.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-600">{resource.description}</p>
        <div className="mt-10 rounded-3xl border border-orange-100 bg-white p-7 shadow-[0_24px_60px_-40px_rgba(120,55,10,.25)] sm:p-9">
          <p className="text-base leading-8 text-neutral-700">{resource.intro}</p>
        </div>
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Key points to apply</h2>
          <div className="mt-6 space-y-4">
            {resource.sections.map((section) => <div key={section} className="flex gap-3 rounded-2xl border border-orange-100 bg-white p-5"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" /><p className="text-sm leading-7 text-neutral-700">{section}</p></div>)}
          </div>
        </section>
        <section className="mt-14 rounded-3xl bg-orange-600 p-8 text-white sm:p-10">
          <h2 className="text-2xl font-bold">Ready to improve your resume?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-orange-50">Use Orrica Edge Resume to build, customize and review a professional resume for your next application.</p>
          <Link href="/resume/new" className="mt-6 inline-flex items-center rounded-lg bg-white px-5 py-3 text-sm font-black text-orange-700 hover:bg-orange-50">Create my resume <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </section>
      </article>
    </main>
  );
}
