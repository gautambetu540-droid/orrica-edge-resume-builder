import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

export const runtime = 'nodejs';
export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ImportedResumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().default(''), professionalTitle: z.string().default(''), email: z.string().default(''), phone: z.string().default(''), city: z.string().default(''), country: z.string().default(''), linkedin: z.string().optional(), portfolio: z.string().optional(), github: z.string().optional(),
  }),
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

function id() { return Math.random().toString(36).slice(2, 10); }

function normalize(data: z.infer<typeof ImportedResumeSchema>) {
  const categories = new Map(data.skills.map((item) => [item.category, item.items]));
  return {
    personalInfo: data.personalInfo,
    summary: data.summary,
    experience: data.experience.map((item) => ({ ...item, id: id() })),
    education: data.education.map((item) => ({ ...item, id: id() })),
    skills: (['technical', 'soft', 'tools', 'languages'] as const).map((category) => ({ category, items: categories.get(category) ?? [] })),
    projects: data.projects.map((item) => ({ ...item, id: id() })),
    certifications: data.certifications.map((item) => ({ ...item, id: id() })),
    languages: data.languages.map((item) => ({ ...item, id: id() })),
    achievements: data.achievements.map((item) => ({ ...item, id: id() })),
    targetRole: data.targetRole,
  };
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'AI scanning is not configured. Add OPENAI_API_KEY to the server environment.' }, { status: 503 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Please upload a PDF resume.' }, { status: 400 });
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return NextResponse.json({ error: 'Only PDF resumes are supported right now.' }, { status: 400 });
    if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Please upload a PDF smaller than 8 MB.' }, { status: 400 });

    const { default: pdfParse } = await import('pdf-parse');
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);
    const text = parsed.text.trim();

    if (text.length < 80) return NextResponse.json({ error: 'This PDF looks like a scanned/image-only resume. Please upload a text-based PDF for automatic import, or export the scan as a searchable PDF first.' }, { status: 422 });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_RESUME_MODEL || 'gpt-4o-mini',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: `You extract resume information into the exact JSON shape requested by the user. Never invent facts, dates, employers, metrics, URLs, skills, degrees or certifications. If a value is missing, use an empty string, empty array, or omit the optional field. Preserve the candidate's wording where practical. Convert dates to YYYY-MM when the month is known; if only a year is known, use that year. Put measurable accomplishments in achievements. Return only valid JSON matching this shape: { personalInfo:{fullName,professionalTitle,email,phone,city,country,linkedin?,portfolio?,github?}, summary:string, experience:[{company,jobTitle,location?,startDate,endDate?,currentlyWorking,responsibilities,achievements:string[]}], education:[{institution,degree,fieldOfStudy,startDate,endDate?,grade?,description?}], skills:[{category:"technical"|"soft"|"tools"|"languages",items:string[]}], projects:[{name,role?,description,technologies:string[],url?}], certifications:[{name,issuingOrganization,issueDate?,credentialId?,credentialUrl?}], languages:[{language,proficiency:"basic"|"conversational"|"professional"|"fluent"|"native"}], achievements:[{type:"award"|"achievement"|"publication"|"volunteer"|"other",title,description?,date?}], targetRole? }.` },
        { role: 'user', content: `Scan this existing resume text and map it into the resume builder. Do not rewrite or improve it yet; this step is extraction only.\n\nRESUME TEXT:\n${text.slice(0, 50000)}` },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('The AI scanner returned no data.');
    return NextResponse.json({ data: normalize(ImportedResumeSchema.parse(JSON.parse(raw))), source: 'ai-pdf-scan' });
  } catch (error) {
    console.error('Resume scan error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not scan this resume.' }, { status: 500 });
  }
}
