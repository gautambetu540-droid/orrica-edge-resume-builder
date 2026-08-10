'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { genId } from '@/lib/utils';
import { AchievementEntry, CertificationEntry, LanguageEntry, LanguageProficiency } from '@/lib/types/resume';
import { StepProps } from '../WizardShell';

const PROFICIENCIES: LanguageProficiency[] = ['basic', 'conversational', 'professional', 'fluent', 'native'];
const ACHIEVEMENT_TYPES: AchievementEntry['type'][] = ['award', 'achievement', 'publication', 'volunteer', 'other'];

export function MoreStep({ data, updateData }: StepProps) {
  // Certifications
  function addCert() {
    updateData((d) => ({
      ...d,
      certifications: [
        ...d.certifications,
        { id: genId(), name: '', issuingOrganization: '', issueDate: '', credentialId: '', credentialUrl: '' } as CertificationEntry,
      ],
    }));
  }
  function updateCert(id: string, patch: Partial<CertificationEntry>) {
    updateData((d) => ({ ...d, certifications: d.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  }
  function removeCert(id: string) {
    updateData((d) => ({ ...d, certifications: d.certifications.filter((c) => c.id !== id) }));
  }

  // Languages
  function addLang() {
    updateData((d) => ({
      ...d,
      languages: [...d.languages, { id: genId(), language: '', proficiency: 'professional' } as LanguageEntry],
    }));
  }
  function updateLang(id: string, patch: Partial<LanguageEntry>) {
    updateData((d) => ({ ...d, languages: d.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
  }
  function removeLang(id: string) {
    updateData((d) => ({ ...d, languages: d.languages.filter((l) => l.id !== id) }));
  }

  // Achievements
  function addAch() {
    updateData((d) => ({
      ...d,
      achievements: [...d.achievements, { id: genId(), type: 'achievement', title: '', description: '', date: '' } as AchievementEntry],
    }));
  }
  function updateAch(id: string, patch: Partial<AchievementEntry>) {
    updateData((d) => ({ ...d, achievements: d.achievements.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));
  }
  function removeAch(id: string) {
    updateData((d) => ({ ...d, achievements: d.achievements.filter((a) => a.id !== id) }));
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-semibold mb-3">Certifications</h2>
        <div className="space-y-3">
          {data.certifications.map((c) => (
            <div key={c.id} className="rounded-xl border bg-white p-4 grid sm:grid-cols-2 gap-3 relative">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeCert(c.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              <div>
                <Label>Certification Name</Label>
                <Input value={c.name} onChange={(e) => updateCert(c.id, { name: e.target.value })} />
              </div>
              <div>
                <Label>Issuing Organization</Label>
                <Input value={c.issuingOrganization} onChange={(e) => updateCert(c.id, { issuingOrganization: e.target.value })} />
              </div>
              <div>
                <Label>Issue Date</Label>
                <Input type="month" value={c.issueDate} onChange={(e) => updateCert(c.id, { issueDate: e.target.value })} />
              </div>
              <div>
                <Label>Credential ID</Label>
                <Input value={c.credentialId} onChange={(e) => updateCert(c.id, { credentialId: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Credential URL</Label>
                <Input value={c.credentialUrl} onChange={(e) => updateCert(c.id, { credentialUrl: e.target.value })} />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addCert} className="w-full border-dashed">
            <Plus className="h-4 w-4" /> Add Certification
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-3">Languages</h2>
        <div className="space-y-3">
          {data.languages.map((l) => (
            <div key={l.id} className="rounded-xl border bg-white p-4 flex gap-3 items-end">
              <div className="flex-1">
                <Label>Language</Label>
                <Input value={l.language} onChange={(e) => updateLang(l.id, { language: e.target.value })} placeholder="Spanish" />
              </div>
              <div className="w-44">
                <Label>Proficiency</Label>
                <Select value={l.proficiency} onValueChange={(v) => updateLang(l.id, { proficiency: v as LanguageProficiency })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p[0].toUpperCase() + p.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeLang(l.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addLang} className="w-full border-dashed">
            <Plus className="h-4 w-4" /> Add Language
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-3">Achievements, Publications & Volunteer Work</h2>
        <div className="space-y-3">
          {data.achievements.map((a) => (
            <div key={a.id} className="rounded-xl border bg-white p-4 space-y-3 relative">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeAch(a.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={a.type} onValueChange={(v) => updateAch(a.id, { type: v as AchievementEntry['type'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACHIEVEMENT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t[0].toUpperCase() + t.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="month" value={a.date} onChange={(e) => updateAch(a.id, { date: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Title</Label>
                <Input value={a.title} onChange={(e) => updateAch(a.id, { title: e.target.value })} />
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea rows={2} value={a.description} onChange={(e) => updateAch(a.id, { description: e.target.value })} />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addAch} className="w-full border-dashed">
            <Plus className="h-4 w-4" /> Add Achievement
          </Button>
        </div>
      </section>
    </div>
  );
}
