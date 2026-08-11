'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ArrowUpRight, Plus, FileText, Loader2, Sparkles, WandSparkles } from 'lucide-react';
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
  const progress = Math.min(100, (quota.used / Math.max(quota.limit, 1)) * 100);

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[70%] -translate-x-1/2 rounded-full bg-orange-400/[0.08] blur-3xl" />
      <div className="relative mb-8 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-stretch">
        <section className="premium-border glass-card animate-fade-in-up overflow-hidden rounded-[28px] p-6 sm:p-8">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-400/10 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div><div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-orange-700"><Sparkles className="h-3.5 w-3.5" /> Personal workspace</div><p className="mt-6 text-sm font-semibold text-orange-600">Welcome back, {userName}</p><h1 className="mt-1 text-3xl font-semibold tracking-[-0.045em] text-neutral-950 sm:text-5xl">Turn your experience into your next opportunity.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-500">Create a polished resume, keep your edits organized and export when it is ready. Your workspace is built to stay fast and focused.</p></div>
            <div className="flex flex-col gap-3 sm:flex-row"><Button onClick={createResume} disabled={creating || quota.remaining <= 0} className="magnetic-button h-11 rounded-xl px-5 font-bold shadow-lg shadow-orange-500/20">{creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} {quota.remaining > 0 ? 'Create new resume' : 'Daily limit reached'}</Button><Link href="/activity"><Button variant="outline" className="h-11 rounded-xl px-5 font-semibold"><Activity className="h-4 w-4" /> Activity <ArrowUpRight className="h-3.5 w-3.5" /></Button></Link></div>
          </div>
        </section>

        <section className="premium-surface animate-scale-in rounded-[28px] p-6 sm:p-7">
          <div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-neutral-400">Daily creation</p><h2 className="mt-1 text-lg font-bold text-neutral-950">Your resume runway</h2></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-violet-500 text-white shadow-lg shadow-orange-500/20"><WandSparkles className="h-5 w-5" /></div></div>
          <div className="mt-8 flex items-end justify-between"><div><span className="text-4xl font-black tracking-tight text-neutral-950">{quota.remaining}</span><span className="ml-2 text-xs font-semibold text-neutral-400">remaining today</span></div><span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold text-neutral-600">{quota.used}/{quota.limit} used</span></div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100"><div className="h-full rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-violet-500 transition-all duration-700" style={{ width: `${progress}%` }} /></div>
          <p className="mt-4 text-[11px] leading-5 text-neutral-400">Up to {quota.limit} new resumes per day · India time. Your progress updates automatically.</p>
        </section>
      </div>

      <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">Your library</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">My Resumes</h2></div><span className="hidden rounded-full border bg-white px-3 py-1.5 text-[10px] font-bold text-neutral-500 shadow-sm sm:inline-flex">Private workspace</span></div>

      {resumes === null && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map((i) => <div key={i} className="premium-surface aspect-[3/4] animate-pulse rounded-[22px] bg-neutral-50" />)}</div>}
      {resumes?.length === 0 && <div className="premium-surface animate-fade-in-up rounded-[30px] py-20 text-center"><div className="mx-auto mb-5 flex h-16 w-16 animate-pulse-glow items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><FileText className="h-7 w-7" /></div><h2 className="text-xl font-bold text-neutral-950">Your workspace is ready, {userName}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">Create your first resume and build it into a polished application with live preview and PDF export.</p><Button onClick={createResume} disabled={creating} className="magnetic-button mt-7 h-11 rounded-xl px-5 font-bold">{creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create my first resume</Button></div>}
      {resumes && resumes.length > 0 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{resumes.map((r, index) => <div key={r.id} className={`animate-fade-in-up reveal-${Math.min(index + 1, 6)} hover-lift`}><ResumeCard resume={r} onDeleted={handleDeleted} /></div>)}</div>}
    </main>
  );
}
