import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ForgotPasswordForm } from '@/modules/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <Suspense
        fallback={
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
