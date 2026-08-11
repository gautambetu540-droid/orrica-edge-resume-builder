'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ShieldCheck, Sparkles, ArrowRight, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/components/ui/toaster';

type AuthMode = 'signin' | 'signup';

function safeReturnTo(value: string | null, fallback = '/dashboard') {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback;
  return value;
}

export function AuthForm({ mode = 'signin', returnTo: defaultReturnTo = '/dashboard' }: { mode?: AuthMode; returnTo?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = safeReturnTo(params.get('returnTo'), safeReturnTo(defaultReturnTo));
  const [currentMode, setCurrentMode] = useState<AuthMode>(mode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(returnTo);
      else setSessionChecked(true);
    });
  }, [returnTo, router]);

  async function handleGoogle() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}` },
    });
    if (error) {
      setLoading(false);
      toast({ title: 'Google sign-in failed', description: error.message, variant: 'error' });
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setEmailConfirmationSent(false);
    const supabase = createClient();
    try {
      if (currentMode === 'signup') {
        const name = fullName.trim();
        if (!name) throw new Error('Please enter your full name.');
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name, name },
            emailRedirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
          },
        });
        if (error) throw error;
        if (data.session) {
          toast({ title: `Welcome, ${name}`, description: 'Your resume workspace is ready.', variant: 'success' });
          router.push(returnTo);
          router.refresh();
        } else {
          setEmailConfirmationSent(true);
          toast({ title: 'Check your email', description: `We sent a confirmation link to ${email.trim()}.`, variant: 'success' });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        const name = data.user?.user_metadata?.full_name || data.user?.user_metadata?.name || data.user?.email?.split('@')[0] || '';
        toast({ title: name ? `Welcome back, ${name}` : 'Welcome back', description: 'Your resume workspace is ready.', variant: 'success' });
        router.push(returnTo);
        router.refresh();
      }
    } catch (error) {
      toast({ title: 'Authentication error', description: (error as Error).message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  if (!sessionChecked) return <div className="flex min-h-dvh items-center justify-center bg-neutral-950"><Loader2 className="h-7 w-7 animate-spin text-orange-400" /></div>;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-neutral-950 px-4 py-8 text-white sm:py-12">
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 animate-float rounded-full bg-orange-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 animate-float-slow rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
      <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <section className="hidden lg:block"><Link href="/" className="inline-flex"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-9 w-auto brightness-0 invert" /></Link><div className="mt-16 max-w-xl animate-fade-in-up"><div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-300"><Sparkles className="h-3.5 w-3.5 text-orange-400" /> Your resume workspace</div><h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">Build it once.<br /><span className="text-orange-400">Make every application count.</span></h1><p className="mt-6 max-w-lg text-base leading-7 text-neutral-400">Keep your resume, edits and polished PDF in one private workspace. Use AI when it helps and stay in control of every word.</p><div className="mt-8 grid max-w-lg grid-cols-3 gap-3">{['Live preview', 'ATS-ready layouts', 'PDF export'].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs font-semibold text-neutral-300">{item}</div>)}</div></div></section>
        <section className="animate-scale-in">
          <div className="mb-5 flex justify-center lg:hidden"><Link href="/"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-8 w-auto brightness-0 invert" /></Link></div>
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white text-neutral-950 shadow-[0_35px_100px_-45px_rgba(0,0,0,.8)]">
            <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-5 sm:px-7"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">Orrica Edge</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">{currentMode === 'signup' ? 'Create your account' : 'Welcome back'}</h2></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><ShieldCheck className="h-5 w-5" /></div></div><p className="mt-2 text-sm leading-6 text-neutral-500">{currentMode === 'signup' ? 'Save your resume, keep your name on your account and continue whenever you are ready.' : 'Sign in to continue to your personal resume workspace.'}</p></div>
            <div className="p-6 sm:p-7">
              {emailConfirmationSent && <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 animate-fade-in-up"><MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><div><strong>Check your inbox.</strong><p className="mt-1 text-xs leading-5 text-emerald-700">Confirm your email address to activate your account. Then sign in with the same email and password.</p></div></div>}
              <Button variant="outline" className="h-11 w-full rounded-xl border-neutral-200" onClick={handleGoogle} disabled={loading}><svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74-3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>Continue with Google</Button>
              <div className="my-5 flex items-center gap-3"><div className="h-px flex-1 bg-neutral-200" /><span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">or continue with email</span><div className="h-px flex-1 bg-neutral-200" /></div>
              <form onSubmit={handleSubmit} className="space-y-4">{currentMode === 'signup' && <div><Label htmlFor="fullName">Full name</Label><Input id="fullName" autoComplete="name" placeholder="Alex Morgan" required value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-1.5 h-11 rounded-xl" /></div>}<div><Label htmlFor="email">Email address</Label><Input id="email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 h-11 rounded-xl" /></div><div><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete={currentMode === 'signup' ? 'new-password' : 'current-password'} placeholder="At least 6 characters" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 h-11 rounded-xl" /></div><Button type="submit" className="h-11 w-full rounded-xl font-bold shadow-lg shadow-orange-500/15" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{currentMode === 'signup' ? 'Create my account' : 'Sign in'}<ArrowRight className="ml-1 h-4 w-4" /></>}</Button></form>
              <div className="mt-5 flex items-center justify-center gap-1 text-sm text-neutral-500">{currentMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}<Link href={currentMode === 'signup' ? '/login' : '/signup'} className="font-bold text-orange-600 hover:text-orange-700">{currentMode === 'signup' ? 'Sign in' : 'Create one'}</Link></div><div className="mt-6 flex items-start gap-2 rounded-xl bg-neutral-50 p-3 text-[10px] leading-5 text-neutral-500"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" /> Your name is saved with your account and can be used to personalize your dashboard and future resume experience.</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
