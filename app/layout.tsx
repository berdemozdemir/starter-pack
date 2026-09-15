import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { allMessages } from '@/integrations/lingui/get-messages';
import { SITE_NAME } from '@/lib/constants/site';
import { Locales } from '@/lib/i18n/config';
import { getRequestLocale } from '@/lib/i18n/get-request-locale';
import { resolveMetadataBase } from '@/lib/utils/resolve-metadata';

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Next.js app starter with auth, oRPC, Drizzle, and Supabase.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getRequestLocale();

  return (
    <html lang={Locales[language].code} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-dvh antialiased">
        <Providers locale={language} allMessages={allMessages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
