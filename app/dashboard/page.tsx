import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Activity } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { SignOutButton } from '@/components/dashboard/SignOutButton';
import { IdleLogout } from '@/components/auth/IdleLogout';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?returnTo=/dashboard');

  return (
    <div className="min-h-dvh bg-secondary/30">
      <IdleLogout />
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/activity" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"><Activity className="h-4 w-4" /> My Activity</Link>
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <DashboardClient />
    </div>
  );
}
