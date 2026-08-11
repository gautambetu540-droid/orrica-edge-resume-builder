import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateResumePdf } from '@/lib/pdf/generateVercel';

export const runtime = 'nodejs';
export const maxDuration = 60;

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be signed in to download your resume.' }, { status: 401 });
  }

  const { data: resume, error } = await supabase
    .from('resumes')
    .select('id, resume_data')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !resume) {
    return NextResponse.json({ error: 'Resume not found.' }, { status: 404 });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const pdfBuffer = await generateResumePdf({
      resumeId: params.id,
      baseUrl,
      cookieHeader: req.headers.get('cookie') || '',
    });

    const fullName = resume.resume_data?.personalInfo?.fullName || 'Resume';
    const safeName = sanitizeFileName(fullName) || 'Resume';

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}_Resume.pdf"`,
        'Cache-Control': 'private, no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'We could not generate your PDF right now. Please try again in a moment.' }, { status: 500 });
  }
}
