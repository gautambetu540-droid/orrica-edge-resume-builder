import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  if (!tokenHash || type !== 'email') {
    return NextResponse.redirect(`${origin}/login?error=verification_failed`);
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'email',
    });

    if (error) {
      console.error('Supabase email verification error:', error);
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
