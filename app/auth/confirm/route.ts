import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function safeReturnTo(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/dashboard';
  return value;
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = safeReturnTo(searchParams.get('next'));

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

    return NextResponse.redirect(`${origin}${next}`);
  } catch (error) {
    console.error('Email confirmation callback error:', error);
    return NextResponse.redirect(`${origin}/login?error=verification_failed`);
  }
}
