import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const noStore = (body: unknown, status = 200) => NextResponse.json(body, {
  status,
  headers: {
    'Cache-Control': 'private, no-store, max-age=0',
  },
});

const ResumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().default(''), professionalTitle: z.string().default(''), email: z.string().default(''), phone: z.string().default(''), city: z.string().default(''), country: z.string().default(''),
    linkedin: z.string().optional(), portfolio: z.string().optional(), github: z.string().optional(),
  }).default({ fullName: '', professionalTitle: '', email: '', phone: '', city: '', country: '' }),
  summary: z.string().default(''),
  experience: z.array(z.object({ company: z.string().default(''), jobTitle: z.string().default(''), location: z.string().optional(), startDate: z.string().default(''), endDate: z.string().optional(), currentlyWorking: z.boolean().default(false), responsibilities: z.string().default(''), achievements: z.array(z.string()).default([]) })).default([]),
  education: z.array(z.object({ institution: z.string().default(''), degree: z.string().default(''), fieldOfStudy: z.string().default(''), startDate: z.string().default(''), endDate: z.string().optional(), grade: z.string().optional(), description: z.string().optional() })).default([]),
  skills: z.array(z.object({ category: z.enum(['technical', 'soft', 'tools', 'languages']), items: z.array(z.string()).default([]) })).default([]),
  projects: z.array(z.object({ name: z.string().default(''), role: z.string().optional(), description: z.string().default(''), technologies: z.array(z.string()).default([]), url: z.string().optional() })).default([]),
  certifications: z.array(z.object({ name: z.string().default(''), issuingOrganization: z.string().default(''), issueDate: z.string().optional(), credentialId: z.string().optional(), credentialUrl: z.string().optional() })).default([]),
  languages: z.array(z.object({ language: z.string(), proficiency: z.enum(['basic', 'conversational', 'professional', 'fluent', 'native']) })).default([]),
  achievements: z.array(z.object({ type: z.enum(['award', 'achievement', 'publication', 'volunteer', 'other']), title: z.string(), description: z.string().optional(), date: z.string().optional() })).default([]),
  targetRole: z.string().optional(),
});

const id = () => Math.random().toString(36).slice(2, 10);

function normalize(data: z.infer<typeof ResumeSchema>) {
  const skills = new Map(data.skills.map((item) => [item.category, item.items]));
  return {
    personalInfo: data.personalInfo,
    summary: data.summary,
    experience: data.experience.map((item) => ({ ...item, id: id() })),
    education: data.education.map((item) => ({ ...item, id: id() })),
    skills: (['technical', 'soft', 'tools', 'languages'] as const).map((category) => ({ category, items: skills.get(category) ?? [] })),
    projects: data.projects.map((item) => ({ ...item, id: id() })),
    certifications: data.certifications.map((item) => ({ ...item, id: id() })),
    languages: data.languages.map((item) => ({ ...item, id: id() })),
    achievements: data.achievements.map((item) => ({ ...item, id: id() })),
    targetRole: data.targetRole,
  };
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return noStore({ error: 'Please sign in before importing a resume.' }, 401);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return noStore({ error: 'Resume scanning is not configured yet.' }, 503);

  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey });

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return noStore({ error: 'Please select a PDF resume.' }, 400);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return noStore({ error: 'Only PDF resumes are supported.' }, 400);
    if (file.size > 8 * 1024 * 1024) return noStore({ error: 'Please upload a PDF smaller than 8 MB.' }, 400);

    // The uploaded PDF exists only in this request's memory. We parse it and send
    // extracted text to the AI service; the original file is never written to
    // Supabase Storage or the resume database.
    const buffer = Buffer.from(await file.arrayBuffer());
    const { default: pdfParse } = await import('pdf-parse');
    const parsed = await pdfParse(buffer);
    const text = parsed.text.trim();
    if (text.length < 80) return noStore({ error: 'This looks like an image-only PDF. Please upload a searchable/text PDF.' }, 422);

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_RESUME_MODEL || 'gpt-4o-mini',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Extract the supplied resume into JSON. Never invent facts. Preserve names, employers, dates, education, skills, URLs and achievements. Missing information must be empty. Return only valid JSON with keys personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements, targetRole. Skills categories must be technical, soft, tools or languages. Language proficiency must be basic, conversational, professional, fluent or native.' },
        { role: 'user', content: `Extract this resume into the requested structure. Do not rewrite it; extraction only.\n\n${text.slice(0, 50000)}` },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('The scanner returned no resume data.');
    const result = ResumeSchema.parse(JSON.parse(raw));
    return noStore({ data: normalize(result), source: 'ai-pdf-scan' });
  } catch (error) {
    console.error('Resume scan error:', error);
    return noStore({ error: error instanceof Error ? error.message : 'Could not scan this resume.' }, 500);
  }
}
