'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Paragraph2 } from '@/components/ui/typography/Paragraph';
import { createSupabaseBrowserClient } from '@/integrations/supabase/supabase-client';
import { paths } from '@/lib/paths';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const AuthCallbackClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const supabase = createSupabaseBrowserClient();
      const code = searchParams.get('code');
      const next = searchParams.get('next') ?? paths.auth.resetPassword;

      if (!code) {
        router.replace(
          `${paths.auth.forgotPassword}?error=auth-callback-error`,
        );
        return;
      }

      const {
        data: { session: existingSession },
      } = await supabase.auth.getSession();

      if (!existingSession) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          router.replace(
            `${paths.auth.forgotPassword}?error=auth-callback-error`,
          );
          return;
        }
      }

      router.replace(next.startsWith('/') ? next : paths.auth.resetPassword);
    };

    void run();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner />
        <Paragraph2 className="text-muted-foreground">
          Verifying your session...
        </Paragraph2>
      </div>
    </div>
  );
};
