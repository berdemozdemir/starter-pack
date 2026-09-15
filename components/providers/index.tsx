import { queryClient } from '@/integrations/tanstack-query/query';
import { QueryClientProvider } from '@tanstack/react-query';
import type { Messages } from '@lingui/core';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { LinguiClientProvider } from '@/lib/i18n-lingui/components/LinguiClientProvider';

export const Providers = (props: {
  children: React.ReactNode;
  locale: string;
  allMessages: Record<string, Messages>;
}) => {
  return (
    <LinguiClientProvider
      initialLocale={props.locale}
      allMessages={props.allMessages}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {props.children}

          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </LinguiClientProvider>
  );
};
