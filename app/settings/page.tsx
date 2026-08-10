import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SettingsForm } from '@/components/dashboard/SettingsForm';
import { IdleLogout } from '@/components/auth/IdleLogout';

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?returnTo=/settings');

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-dvh bg-secondary/30">
      <IdleLogout />

      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <Link href="/dashboard">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-orricaedge.png"
              alt="Orrica Edge"
              className="h-7 w-auto"
            />
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <SettingsForm
          initialName={profile?.name ?? ''}
          email={user.email ?? ''}
        />
      </div>
    </div>
  );
}
