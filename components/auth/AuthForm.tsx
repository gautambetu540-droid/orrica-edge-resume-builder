'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, ShieldCheck, Sparkles, ArrowRight, MailCheck } from 'lucide-react';
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
  const currentMode = mode;
  const returnTo = safeReturnTo(params.get('returnTo'), safeReturnTo(defaultReturnTo));
  const reason = params.get('reason');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        const normalizedEmail = email.trim();
        if (!name) throw new Error('Please enter your full name.');

        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: { full_name: name, name },
            emailRedirectTo: `${window.location.origin}/auth/confirm?type=email`,
          },
        });
        if (error) throw error;

        if (data.session) {
          toast({ title: `Welcome, ${name}`, description: 'Your resume workspace is ready.', variant: 'success' });
          router.push(returnTo);
          router.refresh();
        } else {
          setEmailConfirmationSent(true);
          toast({ title: 'Check your email', description: `We sent a confirmation link to ${normalizedEmail}.`, variant: 'success' });
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

  if (!sessionChecked) {
    return <div className="flex min-h-dvh items-center justify-center bg-[#111318]"><Loader2 className="h-7 w-7 animate-spin text-[#E87535]" /></div>;
  }

  const description = currentMode === 'signup'
    ? 'Save your resume, keep your name on your account and continue whenever you are ready.'
    : reason === 'save'
      ? 'Sign in to save your resume and continue building.'
      : 'Sign in to continue to your personal resume workspace.';

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#111318] px-4 py-6 text-white sm:py-10">
      <div className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-[#E87535]/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-[-8rem] h-[34rem] w-[34rem] rounded-full bg-[#D9A86C]/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.055]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.45) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#E87535]/[0.07] to-transparent" />

      <div className="relative mx-auto grid min-h-[calc(100dvh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_460px] lg:gap-14">
        <section className="hidden lg:block">
          <Link href="/" className="inline-flex rounded-lg px-1 py-1"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-9 w-auto brightness-0 invert" /></Link>
          <div className="mt-14 max-w-xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E87535]/25 bg-[#E87535]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#F0B07D]"><Sparkles className="h-3.5 w-3.5 text-[#E87535]" /> Your resume workspace</div>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-[#F8F5F0] sm:text-6xl">Build it once.<br /><span className="text-[#E87535]">Make every application count.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#A9ADB5]">Keep your resume, edits and polished PDF in one private workspace. Use AI when it helps and stay in control of every word.</p>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              {['Live preview', 'ATS-ready layouts', 'PDF export'].map((item) => <div key={item} className="rounded-2xl border border-white/[0.09] bg-white/[0.035] p-4 text-xs font-semibold text-[#D5D7DC] shadow-[inset_0_1px_0_rgba(255,255,255,.04)]">{item}</div>)}
            </div>
          </div>
        </section>

        <section className="animate-scale-in">
          <div className="mb-5 flex justify-center lg:hidden"><Link href="/"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-8 w-auto brightness-0 invert" /></Link></div>
          <div className="overflow-hidden rounded-[30px] border border-white/[0.12] bg-[#FCFBF8] text-[#17181B] shadow-[0_40px_120px_-48px_rgba(0,0,0,.9)]">
            <div className="border-b border-[#E9E4DC] bg-[#F7F4EF] px-6 py-6 sm:px-7">
              <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C85F2C]">Orrica Edge</p><h2 className="mt-1.5 text-[27px] font-semibold tracking-[-0.035em] text-[#17181B]">{currentMode === 'signup' ? 'Create your account' : 'Welcome back'}</h2></div><div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E8D8CA] bg-[#FFF1E8] text-[#C85F2C]"><ShieldCheck className="h-5 w-5" /></div></div>
              <p className="mt-2 text-sm leading-6 text-[#73716D]">{description}</p>
            </div>

            <div className="p-6 sm:p-7">
              {emailConfirmationSent && <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 animate-fade-in-up"><MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><div><strong>Check your inbox.</strong><p className="mt-1 text-xs leading-5 text-emerald-700">Confirm your email address to activate your account. Then sign in with the same email and password.</p></div></div>}

              <Button variant="outline" className="h-12 w-full rounded-xl border-[#DED9D1] bg-white text-[#25262A] shadow-none hover:border-[#C9C1B7] hover:bg-[#F8F6F2]" onClick={handleGoogle} disabled={loading}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>

              <div className="my-5 flex items-center gap-3"><div className="h-px flex-1 bg-[#E5E1DA]" /><span className="text-[10px] font-semibold uppercase tracking-widest text-[#AAA49B]">or continue with email</span><div className="h-px flex-1 bg-[#E5E1DA]" /></div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {currentMode === 'signup' && <div><Label htmlFor="fullName" className="text-[#343438]">Full name</Label><Input id="fullName" autoComplete="name" placeholder="Alex Morgan" required value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-1.5 h-12 rounded-xl border-[#DDD8D0] bg-white text-[#17181B] placeholder:text-[#AAA49B] focus-visible:border-[#C85F2C] focus-visible:ring-[#C85F2C]/15" /></div>}
                <div><Label htmlFor="email" className="text-[#343438]">Email address</Label><Input id="email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 h-12 rounded-xl border-[#DDD8D0] bg-white text-[#17181B] placeholder:text-[#AAA49B] focus-visible:border-[#C85F2C] focus-visible:ring-[#C85F2C]/15" /></div>
                <div>
                  <Label htmlFor="password" className="text-[#343438]">Password</Label>
                  <div className="relative mt-1.5">
                    <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete={currentMode === 'signup' ? 'new-password' : 'current-password'} placeholder="At least 6 characters" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 rounded-xl border-[#DDD8D0] bg-white pr-11 text-[#17181B] placeholder:text-[#AAA49B] focus-visible:border-[#C85F2C] focus-visible:ring-[#C85F2C]/15" />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-[#9A958D] transition-colors hover:bg-[#F4F1EC] hover:text-[#45413C]" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                </div>
                <Button type="submit" className="h-12 w-full rounded-xl bg-[#E87535] font-bold text-white shadow-[0_12px_25px_-12px_rgba(232,117,53,.75)] hover:bg-[#D9682B]" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{currentMode === 'signup' ? 'Create my account' : 'Sign in'}<ArrowRight className="ml-1 h-4 w-4" /></>}</Button>
              </form>

              <div className="mt-5 flex items-center justify-center gap-1 text-sm text-[#77736D]">{currentMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}<Link href={currentMode === 'signup' ? '/login' : '/signup'} className="font-bold text-[#C85F2C] hover:text-[#A94D22]">{currentMode === 'signup' ? 'Sign in' : 'Create one'}</Link></div>
              <div className="mt-6 flex items-start gap-2 rounded-xl border border-[#E8E2D9] bg-[#F7F4EF] p-3 text-[10px] leading-5 text-[#77736D]"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C85F2C]" /> Your name is saved with your account and can be used to personalize your dashboard and future resume experience.</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
