import { queryClient } from '@/integrations/tanstack-query/query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class" // provide <html class="light"
        defaultTheme="dark"
        enableSystem // to reach user's system preference
        disableTransitionOnChange // to prevent flickering when switching themes
      >
        <Toaster />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};
