import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: 'Create Your Account',
  description: 'Create your free Orrica Edge account, save your name and build a professional ATS-ready resume.',
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
