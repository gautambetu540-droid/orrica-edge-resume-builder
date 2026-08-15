import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Resume Templates & Resume Builder | Orrica Edge Resume',
  description: 'Choose an ATS-friendly Orrica Edge Resume template and build a professional resume in one streamlined experience.',
  alternates: { canonical: '/resume/new' },
};

export default function TemplatesPage() {
  redirect('/resume/new');
}
