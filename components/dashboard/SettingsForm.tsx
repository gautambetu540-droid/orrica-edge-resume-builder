'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/toaster';
import { createClient } from '@/lib/supabase/client';
import { SignOutButton } from './SignOutButton';

export function SettingsForm({ initialName, email }: { initialName: string; email: string }) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not signed in');
      const { error } = await supabase.from('profiles').update({ name }).eq('id', user.id);
      if (error) throw error;
      toast({ title: 'Profile updated', variant: 'success' });
    } catch (err) {
      toast({ title: 'Could not save', description: (err as Error).message, variant: 'error' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-6 space-y-5">
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </div>
      <div>
        <Label>Email</Label>
        <Input value={email} disabled />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
        <SignOutButton />
      </div>
    </Card>
  );
}
