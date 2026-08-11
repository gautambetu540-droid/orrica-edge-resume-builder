import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Activity } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { SignOutButton } from '@/components/dashboard/SignOutButton';
import { IdleLogout } from '@/components/auth/IdleLogout';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?returnTo=/dashboard');

  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-dvh bg-secondary/30">
      <IdleLogout />

      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" aria-label="Orrica Edge home">
            <img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-7 w-auto" />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/activity" className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground sm:flex">
              <Activity className="h-4 w-4" />
              My Activity
            </Link>
            <span className="hidden text-sm font-semibold text-neutral-700 sm:inline">{userName}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <DashboardClient userName={userName} />
    </div>
  );
}
