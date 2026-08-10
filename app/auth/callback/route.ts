import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);

  const code = searchParams.get('code');

  // No code received
  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error`
    );
  }

  const supabase = await createClient();

  // Exchange Supabase auth code for session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  // Verification failed
  if (error) {
    console.error('Supabase auth callback error:', error);

    return NextResponse.redirect(
      `${origin}/auth/auth-code-error`
    );
  }

  // Email successfully verified
  return NextResponse.redirect(
    `${origin}/auth/verified`
  );
}
