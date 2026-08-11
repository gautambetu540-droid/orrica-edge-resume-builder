import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const tokenHash = searchParams.get('token_hash');
  const code = searchParams.get('code');
  const type = searchParams.get('type');

  if (type !== 'email' || (!tokenHash && !code)) {
    return NextResponse.redirect(`${origin}/login?error=verification_failed`);
  }

  try {
    const supabase = await createClient();
    const result = tokenHash
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'email' })
      : await supabase.auth.exchangeCodeForSession(code!);

    if (result.error) {
      console.error('Supabase email verification error:', result.error);
      return NextResponse.redirect(`${origin}/login?error=verification_failed`);
    }

    // Do not leave the newly verified user signed in. The requested flow is:
    // verify email -> show success screen -> user returns to the site -> logs in manually.
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/auth/verified`);
  } catch (error) {
    console.error('Email confirmation callback error:', error);
    return NextResponse.redirect(`${origin}/login?error=verification_failed`);
  }
}
