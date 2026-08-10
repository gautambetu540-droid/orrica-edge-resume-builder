import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Sparkles,
} from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { getResumeProgress } from '@/lib/resume-progress';
import { SignOutButton } from '@/components/dashboard/SignOutButton';

export default async function ActivityPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?returnTo=/activity');
  }

  const { data: resumes } = await supabase
    .from('resumes')
    .select(
      'id, title, template, updated_at, created_at, resume_data'
    )
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
  }).format(new Date());

  const { data: usage } = await supabase
    .from('resume_daily_usage')
    .select('resume_count')
    .eq('user_id', user.id)
    .eq('usage_date', today)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-7">
          <Link
            href="/dashboard"
            className="text-xl font-extrabold tracking-tight"
          >
            <span className="text-orange-500">Orrica</span>
            <span className="text-slate-900">Edge</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              Dashboard
            </Link>

            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-7 lg:py-10">
        {/* Page heading */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-orange-500">
              <Activity className="h-4 w-4" />
              Your workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Activity
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Pick up any resume exactly where you left off.
            </p>
          </div>

          <Link
            href="/resume/new"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Create Resume
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {/* Daily usage */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                <Clock3 className="h-5 w-5 text-orange-500" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                India time
              </span>
            </div>

            <p className="text-sm font-medium text-slate-500">
              Resumes created today
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {usage?.resume_count ?? 0}
              <span className="text-base font-medium text-slate-400">
                {' '}
                / 2
              </span>
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Daily limit
            </p>
          </div>

          {/* Total resumes */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>

            <p className="text-sm font-medium text-slate-500">
              Total resumes
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {resumes?.length ?? 0}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Saved to your account
            </p>
          </div>

          {/* Workspace status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>

            <p className="text-sm font-medium text-slate-500">
              Workspace status
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-600">
              Synced
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Your account keeps your work saved
            </p>
          </div>
        </div>

        {/* Recent activity */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
            <h2 className="text-lg font-bold text-slate-900">
              Recent activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Progress and last saved time for every resume.
            </p>
          </div>

          {resumes && resumes.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {resumes.map((resume) => {
                const progress = getResumeProgress(
                  resume.resume_data
                );

                return (
                  <Link
                    key={resume.id}
                    href={`/resume/${resume.id}`}
                    className="group block px-5 py-5 transition-colors hover:bg-slate-50 sm:px-7"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-semibold text-slate-900 transition-colors group-hover:text-orange-500">
                            {resume.title || 'Untitled Resume'}
                          </h3>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                              progress.status === 'Ready'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {progress.status}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          Next: {progress.next}
                          {' · '}
                          Last saved{' '}
                          {new Date(
                            resume.updated_at
                          ).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>

                        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500 transition-all"
                            style={{
                              width: `${progress.percent}%`,
                            }}
                          />
                        </div>

                        <p className="mt-1 text-right text-[11px] font-medium text-slate-400">
                          {progress.percent}%
                        </p>
                      </div>

                      <div className="hidden shrink-0 sm:block">
                        <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-500" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="px-5 py-16 text-center sm:px-7">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
                <FileText className="h-7 w-7 text-orange-500" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No activity yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first resume and your progress
                will appear here.
              </p>

              <Link
                href="/resume/new"
                className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Create my first resume
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
