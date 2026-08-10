import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Activity, ArrowRight, CheckCircle2, Clock3, FileText, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getResumeProgress } from '@/lib/resume-progress';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@/components/dashboard/SignOutButton';

export default async function ActivityPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?returnTo=/activity');

  const { data: resumes } = await supabase
    .from('resumes')
    .select('id, title, template, updated_at, created_at, resume_data')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
  const { data: usage } = await supabase
    .from('resume_daily_usage')
    .select('resume_count')
    .eq('user_id', user.id)
    .eq('usage_date', today)
    .maybeSingle();

  return (
    <div className="min-h-dvh bg-[#f7f8fc]">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-7 w-auto" /></Link>
          <div className="flex items-center gap-2"><Link href="/dashboard"><Button variant="ghost">Dashboard</Button></Link><SignOutButton /></div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div><p className="text-sm font-semibold text-primary mb-1">Your workspace</p><h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My Activity</h1><p className="text-muted-foreground mt-2">Pick up any resume exactly where you left off.</p></div>
          <Link href="/resume/new" className="hidden sm:block"><Button><Sparkles className="h-4 w-4" /> Create Resume</Button></Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-muted-foreground">Resumes created today</div><div className="text-3xl font-bold mt-1">{usage?.resume_count ?? 0}<span className="text-base text-muted-foreground font-medium"> / 2</span></div><div className="text-xs text-muted-foreground mt-1">India time · daily limit</div></div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-muted-foreground">Total resumes</div><div className="text-3xl font-bold mt-1">{resumes?.length ?? 0}</div><div className="text-xs text-muted-foreground mt-1">Saved to your account</div></div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-sm text-muted-foreground">Workspace status</div><div className="flex items-center gap-2 mt-2 text-emerald-600 font-semibold"><CheckCircle2 className="h-5 w-5" /> Synced</div><div className="text-xs text-muted-foreground mt-1">Your account keeps your work saved</div></div>
        </div>
        <section className="rounded-3xl border bg-white shadow-sm overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b flex items-center gap-3"><Activity className="h-5 w-5 text-primary" /><div><h2 className="font-semibold">Recent activity</h2><p className="text-xs text-muted-foreground">Progress and last saved time for every resume.</p></div></div>
          <div className="divide-y">
            {resumes?.map((resume) => { const progress = getResumeProgress(resume.resume_data); return <Link key={resume.id} href={`/resume/${resume.id}`} className="block px-5 sm:px-7 py-5 hover:bg-slate-50 transition-colors"><div className="flex flex-col sm:flex-row sm:items-center gap-4"><div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><FileText className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold truncate">{resume.title}</h3><span className={`text-[11px] px-2 py-0.5 rounded-full ${progress.status === 'Ready' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{progress.status}</span></div><p className="text-xs text-muted-foreground mt-1">Next: {progress.next} · Last saved {new Date(resume.updated_at).toLocaleString()}</p><div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500" style={{ width: `${progress.percent}%` }} /></div></div><div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0"><span className="text-sm font-bold">{progress.percent}%</span><ArrowRight className="h-4 w-4 text-muted-foreground" /></div></div></Link>; })}
            {!resumes?.length && <div className="py-16 text-center"><Clock3 className="h-8 w-8 mx-auto text-muted-foreground mb-3" /><h3 className="font-semibold">No activity yet</h3><p className="text-sm text-muted-foreground mt-1 mb-5">Create your first resume and your progress will appear here.</p><Link href="/resume/new"><Button>Create my first resume</Button></Link></div>}
          </div>
        </section>
      </main>
    </div>
  );
}
