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
    return NextResponse.json(
      { success: false, error: 'AUTH_REQUIRED', message: 'You must be signed in to download your resume.' },
      { status: 401 }
    );
  }

  const { data: resume, error } = await supabase
    .from('resumes')
    .select('id, resume_data')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !resume) {
    return NextResponse.json(
      { success: false, error: 'RESUME_NOT_FOUND', message: 'Resume not found.' },
      { status: 404 }
    );
  }

  try {
    const pdfBuffer = await generateResumePdf({
      resumeId: params.id,
      baseUrl: req.nextUrl.origin,
      cookieHeader: req.headers.get('cookie') || '',
    });

    if (pdfBuffer.length === 0 || pdfBuffer.subarray(0, 4).toString() !== '%PDF') {
      throw new Error('Generated file is not a valid PDF.');
    }

    const fullName = resume.resume_data?.personalInfo?.fullName || 'Orrica_Edge_Resume';
    const safeName = sanitizeFileName(fullName) || 'Orrica_Edge_Resume';

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}_Resume.pdf"`,
        'Content-Length': String(pdfBuffer.length),
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'PDF_GENERATION_FAILED',
        message: 'We couldn\'t generate your PDF right now. Your resume is safe. Please try again.',
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
