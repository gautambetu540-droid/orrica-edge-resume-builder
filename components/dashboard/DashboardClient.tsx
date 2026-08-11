'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, Plus, FileText, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { ResumeCard, ResumeCardData } from './ResumeCard';

export function DashboardClient({ userName }: { userName: string }) {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeCardData[] | null>(null);
  const [quota, setQuota] = useState({ used: 0, remaining: 2, limit: 2 });
  const [creating, setCreating] = useState(false);

  async function load() {
    try {
      const response = await fetch('/api/resume', { cache: 'no-store' });
      const json = await response.json();
      setResumes(json.resumes ?? []);
      if (json.quota) setQuota(json.quota);
    } catch {
      setResumes([]);
    }
  }

  useEffect(() => { load(); }, []);

  async function createResume() {
    if (quota.remaining <= 0) {
      toast({ title: 'Daily limit reached', description: 'You can create up to 2 resumes per day. Your limit resets tomorrow (India time).', variant: 'error' });
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/resume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Untitled Resume' }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not create resume');
      if (json.quota) setQuota({ used: json.quota.used, remaining: json.quota.remaining, limit: 2 });
      router.push(`/resume/${json.resume.id}`);
    } catch (err) {
      toast({ title: 'Could not create resume', description: (err as Error).message, variant: 'error' });
      await load();
      setCreating(false);
    }
  }

  function handleDeleted(id: string) { setResumes((prev) => (prev ? prev.filter((r) => r.id !== id) : prev)); }

  return (
    <div className="mx-auto max-w-6xl px-4 py-7 sm:py-9">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-semibold text-primary">Welcome back, {userName}</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Resumes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your workspace remembers your name and keeps every resume attached to your account.</p>
        </div>
        <div className="flex items-center gap-2"><Link href="/activity"><Button variant="outline"><Activity className="h-4 w-4" /> <span className="hidden sm:inline">My Activity</span></Button></Link><Button onClick={createResume} disabled={creating || quota.remaining <= 0}>{creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}<span>{quota.remaining > 0 ? 'Create Resume' : 'Limit Reached'}</span></Button></div>
      </div>

      <div className="mb-7 flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-white shadow-sm"><Sparkles className="h-5 w-5" /></div>
        <div className="flex-1"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">Today’s resume limit</p><p className="mt-0.5 text-xs text-muted-foreground">Up to 2 new resumes per day · India time</p></div><span className="text-sm font-bold">{quota.used}/{quota.limit}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500 transition-all" style={{ width: `${(quota.used / quota.limit) * 100}%` }} /></div></div>
      </div>

      {resumes === null && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map((i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-secondary" />)}</div>}
      {resumes?.length === 0 && <div className="rounded-3xl border bg-white py-20 text-center shadow-sm"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><FileText className="h-6 w-6" /></div><h2 className="mb-1 text-lg font-semibold">Your workspace is ready, {userName}</h2><p className="mb-6 text-sm text-muted-foreground">Create your first resume. Your progress will be saved automatically.</p><Button onClick={createResume} disabled={creating}><Plus className="h-4 w-4" /> Create My Resume</Button></div>}
      {resumes && resumes.length > 0 && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{resumes.map((r) => <ResumeCard key={r.id} resume={r} onDeleted={handleDeleted} />)}</div>}
    </div>
  );
}
