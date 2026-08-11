import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const noStore = (body: unknown, status = 200) => NextResponse.json(body, {
  status,
  headers: { 'Cache-Control': 'private, no-store, max-age=0' },
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

const SYSTEM_PROMPT = `You are a resume data extraction engine. Read the supplied PDF directly and extract only facts explicitly present in it. Never invent, infer, improve, rewrite, or hallucinate facts. Preserve names, employers, dates, education, skills, URLs, certifications and achievements as accurately as possible. Missing values must be empty strings, empty arrays, or omitted optional fields. Return ONLY valid JSON.

Required top-level keys: personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements, targetRole.

personalInfo keys: fullName, professionalTitle, email, phone, city, country, linkedin, portfolio, github.
experience items: company, jobTitle, location, startDate, endDate, currentlyWorking, responsibilities, achievements.
education items: institution, degree, fieldOfStudy, startDate, endDate, grade, description.
skills categories must be exactly technical, soft, tools, or languages.
project items: name, role, description, technologies, url.
certification items: name, issuingOrganization, issueDate, credentialId, credentialUrl.
language proficiency must be exactly basic, conversational, professional, fluent, or native.
achievement type must be exactly award, achievement, publication, volunteer, or other.
Use empty strings/arrays for information that is not present. Do not create placeholder facts.

The PDF may be scanned, have unusual fonts, or contain a malformed cross-reference table. Do not reject it merely because its internal PDF structure is unusual; visually read the document and extract the resume content when possible.`;

function cleanApiKey(value: string | undefined) {
  return value?.trim().replace(/^['"]|['"]$/g, '');
}

function extractGeminiError(body: string) {
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string; status?: string; code?: number } };
    return parsed.error?.message || parsed.error?.status || '';
  } catch {
    return body.slice(0, 300).replace(/\s+/g, ' ');
  }
}

function publicGeminiError(status: number, detail: string) {
  const lower = detail.toLowerCase();
  if (status === 401 || status === 403) return 'Gemini API authentication failed. Please verify the GEMINI_API_KEY in Vercel and redeploy.';
  if (status === 404) return 'Gemini 2.5 Flash is not available to this API key/project. Please create/use the Gemini API key from the same Google AI Studio project where Gemini 2.5 Flash is available.';
  if (status === 429) return 'Gemini API quota/rate limit reached. Please try again later or check the AI Studio quota for this project.';
  if (status === 400) return `Gemini rejected the scan request. ${detail || 'Please try another PDF.'}`;
  if (status === 500 || status === 502 || status === 503 || lower.includes('overload')) return 'Gemini is temporarily unavailable. Please try again in a moment.';
  return `Gemini scan failed (${status}). ${detail || 'Please try again.'}`;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return noStore({ error: 'Please sign in before importing a resume.' }, 401);

  const apiKey = cleanApiKey(process.env.GEMINI_API_KEY);
  if (!apiKey) return noStore({ error: 'Resume scanning is not configured yet. Please contact support.' }, 503);

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return noStore({ error: 'Please select a PDF resume.' }, 400);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return noStore({ error: 'Only PDF resumes are supported.' }, 400);
    if (file.size > 8 * 1024 * 1024) return noStore({ error: 'Please upload a PDF smaller than 8 MB.' }, 400);

    // Keep the uploaded PDF transient. It is sent directly to Gemini as inline data
    // and is never written to Supabase Storage or the resume database.
    const pdfBase64 = Buffer.from(await file.arrayBuffer()).toString('base64');

    const configuredModel = (process.env.GEMINI_RESUME_MODEL || '').trim().replace(/^['"]|['"]$/g, '');
    // Always keep a known-good fallback. If an old/invalid environment variable is
    // still deployed, a 404 from that model automatically retries Gemini 2.5 Flash.
    const models = Array.from(new Set([configuredModel, 'gemini-2.5-flash'].filter(Boolean)));

    const body = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{
        role: 'user',
        parts: [
          { text: 'Extract this resume PDF into the requested structure. Extraction only; do not rewrite or invent information.' },
          { inline_data: { mime_type: 'application/pdf', data: pdfBase64 } },
        ],
      }],
      generationConfig: { temperature: 0, responseMimeType: 'application/json' },
    };

    let response: Response | undefined;
    let errorDetail = '';
    let selectedModel = '';

    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(50000),
        });

        if (response.ok) {
          selectedModel = model;
          break;
        }

        errorDetail = extractGeminiError(await response.text().catch(() => ''));

        // If this configured model does not exist for the project, immediately try
        // the stable fallback instead of returning the misleading model error.
        if (response.status === 404 && model !== 'gemini-2.5-flash') break;
        if (![500, 502, 503].includes(response.status) || attempt === 1) break;
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
      if (response?.ok) break;
    }

    if (!response?.ok) {
      console.error('Gemini resume scan error:', response?.status, errorDetail);
      return noStore({ error: publicGeminiError(response?.status || 502, errorDetail) }, response?.status === 429 ? 429 : 502);
    }

    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const raw = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
    if (!raw) throw new Error(`The scanner returned no resume data from ${selectedModel || 'Gemini'}.`);

    const result = ResumeSchema.parse(JSON.parse(raw));
    return noStore({ data: normalize(result), source: 'gemini-pdf-scan', model: selectedModel });
  } catch (error) {
    console.error('Resume scan error:', error);
    if (error instanceof DOMException && error.name === 'TimeoutError') return noStore({ error: 'Gemini took too long to process this resume. Please try again.' }, 504);
    return noStore({ error: error instanceof Error ? error.message : 'Could not scan this resume.' }, 500);
  }
}
