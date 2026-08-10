import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);

  const code = searchParams.get('code');
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=verification_failed`
    );
  }

  try {
    const supabase = await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Supabase auth callback error:', error);

      return NextResponse.redirect(
        `${origin}/login?error=verification_failed`
      );
    }

    return NextResponse.redirect(
      `${origin}${returnTo}`
    );
  } catch (error) {
    console.error('Auth callback error:', error);

    return NextResponse.redirect(
      `${origin}/login?error=verification_failed`
    );
  }
}
