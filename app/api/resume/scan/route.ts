import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { extractPdfText } from '@/lib/pdf-text';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const noStore = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store, max-age=0' } });
const proficiency = ['basic', 'conversational', 'professional', 'fluent', 'native'] as const;
const categories = ['technical', 'soft', 'tools', 'languages'] as const;
const achievementTypes = ['award', 'achievement', 'publication', 'volunteer', 'other'] as const;

const text = (v: unknown): string => {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  if (Array.isArray(v)) return v.flat(Infinity).map(text).filter(Boolean).join('\n');
  if (typeof v === 'object') return Object.values(v as Record<string, unknown>).map(text).filter(Boolean).join('\n');
  return String(v).trim();
};
const list = (v: unknown): string[] => Array.isArray(v) ? v.flat(Infinity).map(text).filter(Boolean) : typeof v === 'string' ? v.split(/\n|•|\r/).map(x => x.trim()).filter(Boolean) : v == null ? [] : [text(v)].filter(Boolean);
const enumValue = (v: unknown, allowed: readonly string[], fallback: string) => {
  const s = text(v).toLowerCase().replace(/[\s_-]/g, '');
  const aliases: Record<string, string> = { beginner: 'basic', elementary: 'basic', intermediate: 'conversational', upperintermediate: 'professional', advanced: 'fluent' };
  return allowed.find(x => x.replace(/_/g, '') === s) || aliases[s] || fallback;
};

function normalizeRaw(input: unknown) {
  const raw = input && typeof input === 'object' ? input as Record<string, unknown> : {};
  const p = raw.personalInfo && typeof raw.personalInfo === 'object' ? raw.personalInfo as Record<string, unknown> : {};
  const arr = (v: unknown) => Array.isArray(v) ? v : [];
  const rawSkills = raw.skills;
  const skills = Array.isArray(rawSkills)
    ? rawSkills.map(x => { const o = x && typeof x === 'object' ? x as Record<string, unknown> : {}; return { category: text(o.category).toLowerCase(), items: list(o.items ?? o.skills ?? x) }; })
    : rawSkills && typeof rawSkills === 'object'
      ? Object.entries(rawSkills as Record<string, unknown>).map(([category, value]) => ({ category: category.toLowerCase(), items: list(value) }))
      : [];

  return {
    personalInfo: {
      fullName: text(p.fullName ?? p.full_name ?? raw.fullName ?? raw.name), professionalTitle: text(p.professionalTitle ?? p.title ?? raw.professionalTitle ?? raw.title),
      email: text(p.email ?? raw.email), phone: text(p.phone ?? p.mobile ?? p.mobileNumber ?? raw.phone ?? raw.mobile ?? raw.mobileNumber),
      city: text(p.city ?? raw.city), country: text(p.country ?? raw.country), linkedin: text(p.linkedin ?? raw.linkedin), portfolio: text(p.portfolio ?? raw.portfolio), github: text(p.github ?? raw.github),
    },
    summary: text(raw.summary ?? raw.profile ?? raw.objective),
    experience: arr(raw.experience).map(x => { const o = x && typeof x === 'object' ? x as Record<string, unknown> : {}; return {
      company: text(o.company ?? o.employer ?? o.organization), jobTitle: text(o.jobTitle ?? o.title ?? o.position ?? o.role), location: text(o.location), startDate: text(o.startDate ?? o.from ?? o.start), endDate: text(o.endDate ?? o.to ?? o.end),
      currentlyWorking: Boolean(o.currentlyWorking ?? o.current ?? o.present), responsibilities: text(o.responsibilities ?? o.responsibility ?? o.duties ?? o.description), achievements: list(o.achievements ?? o.accomplishments),
    }; }),
    education: arr(raw.education).map(x => { const o = x && typeof x === 'object' ? x as Record<string, unknown> : {}; return {
      institution: text(o.institution ?? o.school ?? o.university ?? o.college), degree: text(o.degree ?? o.qualification), fieldOfStudy: text(o.fieldOfStudy ?? o.field ?? o.specialization), startDate: text(o.startDate ?? o.from ?? o.start), endDate: text(o.endDate ?? o.to ?? o.end), grade: text(o.grade ?? o.cgpa ?? o.percentage), description: text(o.description),
    }; }),
    skills: skills.map(x => ({ category: categories.includes(x.category as typeof categories[number]) ? x.category : 'technical', items: x.items })),
    projects: arr(raw.projects).map(x => { const o = x && typeof x === 'object' ? x as Record<string, unknown> : {}; return { name: text(o.name ?? o.title), role: text(o.role), description: text(o.description), technologies: list(o.technologies ?? o.techStack ?? o.tools), url: text(o.url ?? o.link) }; }),
    certifications: arr(raw.certifications).map(x => { const o = x && typeof x === 'object' ? x as Record<string, unknown> : {}; return { name: text(o.name ?? o.title), issuingOrganization: text(o.issuingOrganization ?? o.issuer ?? o.organization), issueDate: text(o.issueDate ?? o.date), credentialId: text(o.credentialId ?? o.id), credentialUrl: text(o.credentialUrl ?? o.url) }; }),
    languages: arr(raw.languages).map(x => { const o = x && typeof x === 'object' ? x as Record<string, unknown> : {}; return { language: text(o.language ?? o.name), proficiency: enumValue(o.proficiency, proficiency, 'professional') }; }),
    achievements: arr(raw.achievements).map(x => { const o = x && typeof x === 'object' ? x as Record<string, unknown> : {}; return { type: enumValue(o.type, achievementTypes, 'achievement'), title: text(o.title ?? o.name), description: text(o.description), date: text(o.date) }; }),
    targetRole: text(raw.targetRole ?? raw.target_role),
  };
}

const Schema = z.object({
  personalInfo: z.object({ fullName: z.string(), professionalTitle: z.string(), email: z.string(), phone: z.string(), city: z.string(), country: z.string(), linkedin: z.string(), portfolio: z.string(), github: z.string() }), summary: z.string(),
  experience: z.array(z.object({ company: z.string(), jobTitle: z.string(), location: z.string(), startDate: z.string(), endDate: z.string(), currentlyWorking: z.boolean(), responsibilities: z.string(), achievements: z.array(z.string()) })),
  education: z.array(z.object({ institution: z.string(), degree: z.string(), fieldOfStudy: z.string(), startDate: z.string(), endDate: z.string(), grade: z.string(), description: z.string() })),
  skills: z.array(z.object({ category: z.enum(categories), items: z.array(z.string()) })), projects: z.array(z.object({ name: z.string(), role: z.string(), description: z.string(), technologies: z.array(z.string()), url: z.string() })),
  certifications: z.array(z.object({ name: z.string(), issuingOrganization: z.string(), issueDate: z.string(), credentialId: z.string(), credentialUrl: z.string() })), languages: z.array(z.object({ language: z.string(), proficiency: z.enum(proficiency) })),
  achievements: z.array(z.object({ type: z.enum(achievementTypes), title: z.string(), description: z.string(), date: z.string() })), targetRole: z.string(),
});

function addIds(data: z.infer<typeof Schema>) {
  const id = () => Math.random().toString(36).slice(2, 10); const map = new Map(data.skills.map(s => [s.category, s.items]));
  return { ...data, experience: data.experience.map(x => ({ ...x, id: id() })), education: data.education.map(x => ({ ...x, id: id() })), skills: categories.map(c => ({ category: c, items: map.get(c) || [] })), projects: data.projects.map(x => ({ ...x, id: id() })), certifications: data.certifications.map(x => ({ ...x, id: id() })), languages: data.languages.map(x => ({ ...x, id: id() })), achievements: data.achievements.map(x => ({ ...x, id: id() })) };
}

const SYSTEM = `You are a resume extraction engine. Extract ONLY facts present in the supplied resume text or PDF. Never invent or infer facts. Preserve exact full name, email, phone, employers, titles, dates, education and URLs. Put newest/current experience first and newest education first when supported. responsibilities MUST be a string, never an array. Language proficiency MUST be one of basic, conversational, professional, fluent, native; if absent use professional. Return ONLY JSON with personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements, targetRole. Missing values are empty strings/arrays. personalInfo fields: fullName, professionalTitle, email, phone, city, country, linkedin, portfolio, github.`;

function parseJson(s: string) { const c = s.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim(); try { return JSON.parse(c); } catch { const a = c.indexOf('{'), b = c.lastIndexOf('}'); if (a >= 0 && b > a) return JSON.parse(c.slice(a, b + 1)); throw new Error('Gemini returned invalid JSON.'); } }

async function runGemini(apiKey: string, resumeText: string, pdfBase64?: string) {
  const configured = (process.env.GEMINI_RESUME_MODEL || 'gemini-3.6-flash').replace(/^models\//, '').trim();
  const models = [configured, 'gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash'].filter((x, i, a) => x && a.indexOf(x) === i);
  for (const model of models) {
    const parts = pdfBase64
      ? [{ text: 'Extract this resume PDF exactly. Read all visible text, including scanned/image pages, and return the required JSON.' }, { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } }]
      : [{ text: `Extract this resume:\n\n${resumeText}` }];
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey }, body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents: [{ role: 'user', parts }], generationConfig: { responseMimeType: 'application/json' } }), signal: AbortSignal.timeout(50000) });
    if (response.ok) { const payload = await response.json(); const out = payload.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join(''); if (out) return { data: parseJson(out), model }; }
    if (![404, 500, 502, 503].includes(response.status)) { const body = await response.text().catch(() => ''); throw new Error(body.slice(0, 500) || `Gemini error ${response.status}`); }
  }
  throw new Error('No configured Gemini model could process the resume.');
}

export async function POST(request: NextRequest) {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) return noStore({ error: 'Please sign in before importing a resume.' }, 401);
  const apiKey = process.env.GEMINI_API_KEY?.trim(); if (!apiKey) return noStore({ error: 'GEMINI_API_KEY is not configured.' }, 503);
  try {
    const fd = await request.formData(); const file = fd.get('file');
    if (!(file instanceof File)) return noStore({ error: 'Please select a PDF resume.' }, 400);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return noStore({ error: 'Only PDF resumes are supported.' }, 400);
    if (file.size > 8 * 1024 * 1024) return noStore({ error: 'Please upload a PDF smaller than 8 MB.' }, 400);
    const buffer = Buffer.from(await file.arrayBuffer());
    let resumeText = '';
    try { resumeText = (await extractPdfText(buffer)).text; } catch (e) { console.warn('PDF text extraction failed', e); }
    const hasText = resumeText.replace(/\s/g, '').length >= 100;
    const result = hasText
      ? await runGemini(apiKey, resumeText.slice(0, 120000))
      : await runGemini(apiKey, '', buffer.toString('base64'));
    const parsed = Schema.parse(normalizeRaw(result.data));
    return noStore({ data: addIds(parsed), source: hasText ? 'pdf-text' : 'gemini-pdf', model: result.model });
  } catch (e) { console.error('Resume scan error:', e); return noStore({ error: e instanceof Error ? e.message : 'Could not scan this resume.' }, 500); }
}
