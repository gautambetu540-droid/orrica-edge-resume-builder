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

const SYSTEM_PROMPT = `You are a resume data extraction engine. Extract only facts explicitly present in the supplied resume. Never invent, infer, improve, rewrite, or hallucinate facts. Preserve names, employers, dates, education, skills, URLs, certifications and achievements as accurately as possible. Missing values must be empty strings, empty arrays, or omitted optional fields. Return ONLY valid JSON.

Required top-level keys: personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements, targetRole.

personalInfo keys: fullName, professionalTitle, email, phone, city, country, linkedin, portfolio, github.
experience items: company, jobTitle, location, startDate, endDate, currentlyWorking, responsibilities, achievements.
education items: institution, degree, fieldOfStudy, startDate, endDate, grade, description.
skills categories must be exactly technical, soft, tools, or languages.
project items: name, role, description, technologies, url.
certification items: name, issuingOrganization, issueDate, credentialId, credentialUrl.
language proficiency must be exactly basic, conversational, professional, fluent, or native.
achievement type must be exactly award, achievement, publication, volunteer, or other.
Use empty strings/arrays for information that is not present. Do not create placeholder facts.`;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return noStore({ error: 'Please sign in before importing a resume.' }, 401);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return noStore({ error: 'Resume scanning is not configured yet. Please contact support.' }, 503);

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return noStore({ error: 'Please select a PDF resume.' }, 400);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return noStore({ error: 'Only PDF resumes are supported.' }, 400);
    if (file.size > 8 * 1024 * 1024) return noStore({ error: 'Please upload a PDF smaller than 8 MB.' }, 400);

    // The uploaded PDF exists only in this request's memory. It is never written
    // to Supabase Storage or the resume database.
    const buffer = Buffer.from(await file.arrayBuffer());

    // pdf-parse 1.1.x ships a debug harness in its package entry point that tries
    // to open ./test/data/05-versions-space.pdf. Import its parser implementation
    // directly so production/Vercel never executes that debug harness.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore The package does not publish a declaration for this internal entry.
    const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse');
    const parsed = await pdfParse(buffer);
    const text = parsed.text.trim();
    if (text.length < 80) return noStore({ error: 'This looks like an image-only PDF. Please upload a searchable/text PDF.' }, 422);

    const model = process.env.GEMINI_RESUME_MODEL || 'gemini-2.5-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [{
          role: 'user',
          parts: [{ text: `Extract this resume into the requested structure. Do not rewrite it; extraction only.\n\n${text.slice(0, 50000)}` }],
        }],
        generationConfig: {
          temperature: 0,
          responseMimeType: 'application/json',
        },
      }),
      signal: AbortSignal.timeout(50000),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error('Gemini resume scan error:', response.status, errorBody);
      if (response.status === 401 || response.status === 403) {
        return noStore({ error: 'Resume scanning is temporarily unavailable. Please check the AI configuration.' }, 503);
      }
      if (response.status === 429) {
        return noStore({ error: 'AI scan limit reached. Please try again later.' }, 429);
      }
      return noStore({ error: 'The AI scanner is temporarily unavailable. Please try again.' }, 502);
    }

    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const raw = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
    if (!raw) throw new Error('The scanner returned no resume data.');

    const result = ResumeSchema.parse(JSON.parse(raw));
    return noStore({ data: normalize(result), source: 'gemini-pdf-scan' });
  } catch (error) {
    console.error('Resume scan error:', error);
    return noStore({ error: error instanceof Error ? error.message : 'Could not scan this resume.' }, 500);
  }
}
