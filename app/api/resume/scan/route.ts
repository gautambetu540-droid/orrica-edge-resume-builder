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

const ProficiencySchema = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return 'professional';
  const aliases: Record<string, string> = {
    beginner: 'basic',
    elementary: 'basic',
    intermediate: 'conversational',
    upperintermediate: 'professional',
    'upper-intermediate': 'professional',
    advanced: 'fluent',
    native: 'native',
  };
  return aliases[normalized] ?? normalized;
}, z.enum(['basic', 'conversational', 'professional', 'fluent', 'native']));

const ResponsibilitiesSchema = z.preprocess((value) => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string').join('\n');
  if (value == null) return '';
  return String(value);
}, z.string().default(''));

const SkillItemsSchema = z.preprocess((value) => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (value == null) return [];
  return [String(value)];
}, z.array(z.string()).default([]));

const SkillsSchema = z.preprocess((value) => {
  // Gemini may return skills either as the app's array format or as a
  // category-to-array object. Accept both and normalize to one shape.
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).map(([category, items]) => ({
      category: category.trim().toLowerCase(),
      items,
    }));
  }
  return [];
}, z.array(z.object({
  category: z.preprocess((value) => {
    if (typeof value !== 'string') return value;
    const normalized = value.trim().toLowerCase();
    const aliases: Record<string, string> = {
      technicalskills: 'technical',
      'technical skills': 'technical',
      hard: 'technical',
      hardskills: 'technical',
      'hard skills': 'technical',
      softskills: 'soft',
      'soft skills': 'soft',
      technologies: 'tools',
      technology: 'tools',
      software: 'tools',
      toolsandtechnologies: 'tools',
      'tools & technologies': 'tools',
      communication: 'soft',
      language: 'languages',
    };
    return aliases[normalized] ?? normalized;
  }, z.enum(['technical', 'soft', 'tools', 'languages'])),
  items: SkillItemsSchema,
})).default([]));

const ResumeSchema = z.object({
  personalInfo: z.object({ fullName: z.string().default(''), professionalTitle: z.string().default(''), email: z.string().default(''), phone: z.string().default(''), city: z.string().default(''), country: z.string().default(''), linkedin: z.string().optional(), portfolio: z.string().optional(), github: z.string().optional() }).default({ fullName: '', professionalTitle: '', email: '', phone: '', city: '', country: '' }),
  summary: z.preprocess((value) => value == null ? '' : String(value), z.string().default('')),
  experience: z.array(z.object({ company: z.string().default(''), jobTitle: z.string().default(''), location: z.string().optional(), startDate: z.string().default(''), endDate: z.string().optional(), currentlyWorking: z.boolean().default(false), responsibilities: ResponsibilitiesSchema, achievements: z.array(z.string()).default([]) })).default([]),
  education: z.array(z.object({ institution: z.string().default(''), degree: z.string().default(''), fieldOfStudy: z.string().default(''), startDate: z.string().default(''), endDate: z.string().optional(), grade: z.string().optional(), description: z.string().optional() })).default([]),
  skills: SkillsSchema,
  projects: z.array(z.object({ name: z.string().default(''), role: z.string().optional(), description: z.string().default(''), technologies: z.array(z.string()).default([]), url: z.string().optional() })).default([]),
  certifications: z.array(z.object({ name: z.string().default(''), issuingOrganization: z.string().default(''), issueDate: z.string().optional(), credentialId: z.string().optional(), credentialUrl: z.string().optional() })).default([]),
  languages: z.array(z.object({ language: z.string().default(''), proficiency: ProficiencySchema })).default([]),
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

const SYSTEM_PROMPT = `You are a resume data extraction engine. Read the supplied PDF directly and extract only facts explicitly present in it. Never invent, infer, improve, rewrite, or hallucinate facts. Preserve names, employers, dates, education, skills, URLs, certifications and achievements as accurately as possible. Missing values must be empty strings, empty arrays, or omitted optional fields. Return ONLY valid JSON.\n\nRequired top-level keys: personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements, targetRole.\n\npersonalInfo keys: fullName, professionalTitle, email, phone, city, country, linkedin, portfolio, github.\nexperience items: company, jobTitle, location, startDate, endDate, currentlyWorking, responsibilities, achievements. responsibilities must be a single string; if the source contains multiple bullets, join them with newline characters.\neducation items: institution, degree, fieldOfStudy, startDate, endDate, grade, description.\nskills must be an array of objects with category and items. category must be exactly technical, soft, tools, or languages.\nproject items: name, role, description, technologies, url.\ncertification items: name, issuingOrganization, issueDate, credentialId, credentialUrl.\nlanguage proficiency must be exactly basic, conversational, professional, fluent, or native. If proficiency is not stated, use professional.\nachievement type must be exactly award, achievement, publication, volunteer, or other.\nUse empty strings/arrays for information that is not present. Do not create placeholder facts.`;

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
  if (status === 429) return 'Gemini API quota/rate limit reached. Please try again later or check the AI Studio quota for this project.';
  if (status === 400) return `Gemini rejected the scan request. ${detail || 'Please try another PDF.'}`;
  if (status === 500 || status === 502 || status === 503 || lower.includes('overload')) return 'Gemini is temporarily unavailable. Please try again in a moment.';
  return `Gemini scan failed (${status}). ${detail || 'Please try again.'}`;
}

type GeminiModel = { name?: string; supportedGenerationMethods?: string[] };

async function discoverAvailableModel(apiKey: string, configuredModel: string) {
  const configured = configuredModel.replace(/^models\//, '').trim();
  const preferred = [configured, 'gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash'].filter(Boolean);
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
    method: 'GET',
    headers: { 'x-goog-api-key': apiKey },
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error('Gemini API authentication failed while checking available models. Verify GEMINI_API_KEY and the Google AI Studio project.');
    return configured || 'gemini-3.6-flash';
  }
  const payload = await response.json() as { models?: GeminiModel[] };
  const available = (payload.models || []).filter((model) => model.name && model.supportedGenerationMethods?.includes('generateContent')).map((model) => model.name!.replace(/^models\//, ''));
  const exact = preferred.find((candidate) => available.includes(candidate));
  if (exact) return exact;
  const fallback = available.find((name) => /^gemini/i.test(name) && /(flash|pro)/i.test(name));
  if (fallback) return fallback;
  return configured || 'gemini-3.6-flash';
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

    const pdfBase64 = Buffer.from(await file.arrayBuffer()).toString('base64');
    const configuredModel = cleanApiKey(process.env.GEMINI_RESUME_MODEL) || 'gemini-3.6-flash';
    const model = await discoverAvailableModel(apiKey, configuredModel);
    const body = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [
        { text: 'Extract this resume PDF into the requested structure. Extraction only; do not rewrite or invent information.' },
        { inline_data: { mime_type: 'application/pdf', data: pdfBase64 } },
      ] }],
      generationConfig: { responseMimeType: 'application/json' },
    };

    let response: Response | undefined;
    let errorDetail = '';
    let selectedModel = model;
    const modelsToTry = [model, 'gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash'].filter((value, index, array) => array.indexOf(value) === index);
    for (const candidate of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(candidate)}:generateContent`;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey }, body: JSON.stringify(body), signal: AbortSignal.timeout(50000) });
        if (response.ok) { selectedModel = candidate; break; }
        errorDetail = extractGeminiError(await response.text().catch(() => ''));
        if (response.status === 404) break;
        if (![500, 502, 503].includes(response.status) || attempt === 1) break;
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
      if (response?.ok) break;
      if (response?.status && ![404, 500, 502, 503].includes(response.status)) break;
    }

    if (!response?.ok) {
      console.error('Gemini resume scan error:', response?.status, selectedModel, errorDetail);
      const detail = response?.status === 404 ? 'No Gemini model advertised by this API project supports generateContent. Check that the Gemini API is enabled for the same Google AI Studio project as GEMINI_API_KEY.' : publicGeminiError(response?.status || 502, errorDetail);
      return noStore({ error: detail }, response?.status === 429 ? 429 : 502);
    }

    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const raw = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
    if (!raw) throw new Error(`The scanner returned no resume data from ${selectedModel}.`);
    const result = ResumeSchema.parse(JSON.parse(raw));
    return noStore({ data: normalize(result), source: 'gemini-pdf-scan', model: selectedModel });
  } catch (error) {
    console.error('Resume scan error:', error);
    if (error instanceof DOMException && error.name === 'TimeoutError') return noStore({ error: 'Gemini took too long to process this resume. Please try again.' }, 504);
    return noStore({ error: error instanceof Error ? error.message : 'Could not scan this resume.' }, 500);
  }
}
