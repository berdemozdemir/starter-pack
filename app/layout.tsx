import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { resolveMetadataBase } from '@/lib/utils/resolve-metadata';
import { SITE_NAME } from '@/lib/constants/site';

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Next.js app starter with auth, oRPC, Drizzle, and Supabase.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-dvh antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
