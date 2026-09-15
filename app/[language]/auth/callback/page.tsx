import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AuthCallbackClient } from '@/modules/auth/components/AuthCallbackClient';

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-4 py-16">
          <LoadingSpinner />
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
