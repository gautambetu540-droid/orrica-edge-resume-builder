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

const proficiencyValues = ['basic', 'conversational', 'professional', 'fluent', 'native'] as const;
const skillCategories = ['technical', 'soft', 'tools', 'languages'] as const;
const achievementTypes = ['award', 'achievement', 'publication', 'volunteer', 'other'] as const;

const stringValue = (value: unknown) => {
  if (typeof value === 'string') return value.trim();
  if (value == null) return '';
  if (Array.isArray(value)) return value.filter((item) => item != null).map((item) => String(item).trim()).filter(Boolean).join('; ');
  if (typeof value === 'object') return Object.values(value as Record<string, unknown>).filter((item) => item != null).map((item) => String(item).trim()).filter(Boolean).join('; ');
  return String(value).trim();
};

const stringArray = (value: unknown) => {
  if (Array.isArray(value)) return value.flatMap((item) => Array.isArray(item) ? item : [item]).map(stringValue).filter(Boolean);
  if (typeof value === 'string') return value.split(/\n|•|;(?=\s*[^;]+$)/).map((item) => item.trim()).filter(Boolean);
  if (value == null) return [];
  return [stringValue(value)].filter(Boolean);
};

const normalizeRaw = (input: unknown) => {
  const raw = input && typeof input === 'object' ? input as Record<string, unknown> : {};
  const personal = raw.personalInfo && typeof raw.personalInfo === 'object' ? raw.personalInfo as Record<string, unknown> : {};
  const rawExperience = Array.isArray(raw.experience) ? raw.experience : [];
  const rawEducation = Array.isArray(raw.education) ? raw.education : [];
  const rawSkills = Array.isArray(raw.skills) ? raw.skills : [];
  const rawProjects = Array.isArray(raw.projects) ? raw.projects : [];
  const rawCertifications = Array.isArray(raw.certifications) ? raw.certifications : [];
  const rawLanguages = Array.isArray(raw.languages) ? raw.languages : [];
  const rawAchievements = Array.isArray(raw.achievements) ? raw.achievements : [];

  const skills = rawSkills.map((item) => {
    const obj = item && typeof item === 'object' ? item as Record<string, unknown> : {};
    const category = stringValue(obj.category).toLowerCase();
    return { category: skillCategories.includes(category as typeof skillCategories[number]) ? category : 'technical', items: stringArray(obj.items ?? obj.skills ?? item) };
  });

  const languages = rawLanguages.map((item) => {
    const obj = item && typeof item === 'object' ? item as Record<string, unknown> : {};
    const proficiency = stringValue(obj.proficiency).toLowerCase();
    return {
      language: stringValue(obj.language ?? obj.name),
      proficiency: proficiencyValues.includes(proficiency as typeof proficiencyValues[number]) ? proficiency : 'professional',
    };
  });

  const achievements = rawAchievements.map((item) => {
    const obj = item && typeof item === 'object' ? item as Record<string, unknown> : {};
    const type = stringValue(obj.type).toLowerCase();
    return { ...obj, type: achievementTypes.includes(type as typeof achievementTypes[number]) ? type : 'achievement' };
  });

  return {
    personalInfo: {
      fullName: stringValue(personal.fullName ?? personal.full_name ?? raw.fullName ?? raw.name),
      professionalTitle: stringValue(personal.professionalTitle ?? personal.title ?? raw.professionalTitle),
      email: stringValue(personal.email ?? raw.email),
      phone: stringValue(personal.phone ?? personal.mobile ?? personal.mobileNumber ?? raw.phone ?? raw.mobile),
      city: stringValue(personal.city),
      country: stringValue(personal.country),
      linkedin: stringValue(personal.linkedin),
      portfolio: stringValue(personal.portfolio),
      github: stringValue(personal.github),
    },
    summary: stringValue(raw.summary ?? raw.profile ?? raw.objective),
    experience: rawExperience.map((item) => {
      const obj = item && typeof item === 'object' ? item as Record<string, unknown> : {};
      return {
        company: stringValue(obj.company ?? obj.employer ?? obj.organization),
        jobTitle: stringValue(obj.jobTitle ?? obj.title ?? obj.position ?? obj.role),
        location: stringValue(obj.location),
        startDate: stringValue(obj.startDate ?? obj.from ?? obj.start),
        endDate: stringValue(obj.endDate ?? obj.to ?? obj.end),
        currentlyWorking: Boolean(obj.currentlyWorking ?? obj.current ?? obj.present),
        responsibilities: stringArray(obj.responsibilities ?? obj.responsibility ?? obj.duties ?? obj.description),
        achievements: stringArray(obj.achievements ?? obj.accomplishments),
      };
    }),
    education: rawEducation.map((item) => {
      const obj = item && typeof item === 'object' ? item as Record<string, unknown> : {};
      return {
        institution: stringValue(obj.institution ?? obj.school ?? obj.university ?? obj.college),
        degree: stringValue(obj.degree ?? obj.qualification),
        fieldOfStudy: stringValue(obj.fieldOfStudy ?? obj.field ?? obj.specialization),
        startDate: stringValue(obj.startDate ?? obj.from ?? obj.start),
        endDate: stringValue(obj.endDate ?? obj.to ?? obj.end),
        grade: stringValue(obj.grade ?? obj.cgpa ?? obj.percentage),
        description: stringValue(obj.description),
      };
    }),
    skills,
    projects: rawProjects.map((item) => {
      const obj = item && typeof item === 'object' ? item as Record<string, unknown> : {};
      return { name: stringValue(obj.name ?? obj.title), role: stringValue(obj.role), description: stringValue(obj.description), technologies: stringArray(obj.technologies ?? obj.techStack ?? obj.tools), url: stringValue(obj.url ?? obj.link) };
    }),
    certifications: rawCertifications.map((item) => {
      const obj = item && typeof item === 'object' ? item as Record<string, unknown> : {};
      return { name: stringValue(obj.name ?? obj.title), issuingOrganization: stringValue(obj.issuingOrganization ?? obj.issuer ?? obj.organization), issueDate: stringValue(obj.issueDate ?? obj.date), credentialId: stringValue(obj.credentialId ?? obj.id), credentialUrl: stringValue(obj.credentialUrl ?? obj.url) };
    }),
    languages,
    achievements,
    targetRole: stringValue(raw.targetRole ?? raw.target_role),
  };
};

const ResumeSchema = z.object({
  personalInfo: z.object({ fullName: z.string().default(''), professionalTitle: z.string().default(''), email: z.string().default(''), phone: z.string().default(''), city: z.string().default(''), country: z.string().default(''), linkedin: z.string().optional(), portfolio: z.string().optional(), github: z.string().optional() }).default({ fullName: '', professionalTitle: '', email: '', phone: '', city: '', country: '' }),
  summary: z.string().default(''),
  experience: z.array(z.object({ company: z.string().default(''), jobTitle: z.string().default(''), location: z.string().optional(), startDate: z.string().default(''), endDate: z.string().optional(), currentlyWorking: z.boolean().default(false), responsibilities: z.string().default(''), achievements: z.array(z.string()).default([]) })).default([]),
  education: z.array(z.object({ institution: z.string().default(''), degree: z.string().default(''), fieldOfStudy: z.string().default(''), startDate: z.string().default(''), endDate: z.string().optional(), grade: z.string().optional(), description: z.string().optional() })).default([]),
  skills: z.array(z.object({ category: z.enum(skillCategories), items: z.array(z.string()).default([]) })).default([]),
  projects: z.array(z.object({ name: z.string().default(''), role: z.string().optional(), description: z.string().default(''), technologies: z.array(z.string()).default([]), url: z.string().optional() })).default([]),
  certifications: z.array(z.object({ name: z.string().default(''), issuingOrganization: z.string().default(''), issueDate: z.string().optional(), credentialId: z.string().optional(), credentialUrl: z.string().optional() })).default([]),
  languages: z.array(z.object({ language: z.string(), proficiency: z.enum(proficiencyValues) })).default([]),
  achievements: z.array(z.object({ type: z.enum(achievementTypes), title: z.string(), description: z.string().optional(), date: z.string().optional() })).default([]),
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
    skills: skillCategories.map((category) => ({ category, items: skills.get(category) ?? [] })),
    projects: data.projects.map((item) => ({ ...item, id: id() })),
    certifications: data.certifications.map((item) => ({ ...item, id: id() })),
    languages: data.languages.map((item) => ({ ...item, id: id() })),
    achievements: data.achievements.map((item) => ({ ...item, id: id() })),
    targetRole: data.targetRole,
  };
}

const SYSTEM_PROMPT = `You are a resume data extraction engine. Read the supplied PDF directly and extract only facts explicitly present in it. Never invent, infer, improve, rewrite, or hallucinate facts. Preserve the exact full name, email address, mobile/phone number, employer names, job titles, dates, education, skills, URLs, certifications and achievements. The first/most recent employment entry must represent the latest/current experience. The first/most recent education entry must represent the latest education.\n\nFor responsibilities, return a plain string, NOT an array. If there are multiple responsibilities, join them into one readable string separated by newline characters.\nFor language proficiency, use only basic, conversational, professional, fluent, or native. If the resume names a language but gives no proficiency, use professional rather than an empty value.\nMissing values must be empty strings, empty arrays, or omitted optional fields. Return ONLY valid JSON.\n\nRequired top-level keys: personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements, targetRole.\n\npersonalInfo keys: fullName, professionalTitle, email, phone, city, country, linkedin, portfolio, github.\nexperience items: company, jobTitle, location, startDate, endDate, currentlyWorking, responsibilities, achievements.\neducation items: institution, degree, fieldOfStudy, startDate, endDate, grade, description.\nskills categories must be exactly technical, soft, tools, or languages.\nproject items: name, role, description, technologies, url.\ncertification items: name, issuingOrganization, issueDate, credentialId, credentialUrl.\nlanguage proficiency must be exactly basic, conversational, professional, fluent, or native.\nachievement type must be exactly award, achievement, publication, volunteer, or other.\nUse empty strings/arrays for information that is not present. Do not create placeholder facts.`;

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
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', { method: 'GET', headers: { 'x-goog-api-key': apiKey }, cache: 'no-store', signal: AbortSignal.timeout(10000) });
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
    const body = { systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }, contents: [{ role: 'user', parts: [{ text: 'Extract this resume PDF into the requested structure. Extraction only; do not rewrite or invent information.' }, { inline_data: { mime_type: 'application/pdf', data: pdfBase64 } }] }], generationConfig: { temperature: 0, responseMimeType: 'application/json' } };

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

    // Normalize Gemini's flexible JSON BEFORE Zod validation. This prevents one
    // malformed field from discarding the entire resume and guarantees the UI
    // receives full name, email, phone, latest education and latest experience.
    const normalizedRaw = normalizeRaw(JSON.parse(raw));
    const result = ResumeSchema.parse(normalizedRaw);
    return noStore({ data: normalize(result), source: 'gemini-pdf-scan', model: selectedModel });
  } catch (error) {
    console.error('Resume scan error:', error);
    if (error instanceof DOMException && error.name === 'TimeoutError') return noStore({ error: 'Gemini took too long to process this resume. Please try again.' }, 504);
    return noStore({ error: error instanceof Error ? error.message : 'Could not scan this resume.' }, 500);
  }
}
