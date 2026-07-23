import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

const pageLayoutVariants = cva('container pt-6 pb-24 w-full lg:px-5', {
  variants: {
    variant: {
      narrow: 'max-w-2xl',
      standard: 'max-w-5xl',
      wide: 'max-w-7xl',
      full: 'w-full max-w-full px-0',
    },
  },
  defaultVariants: {
    variant: 'standard',
  },
});

export type PageLayoutProps = ComponentProps<'div'> &
  VariantProps<typeof pageLayoutVariants>;

/**
 * Applies shared page width and vertical spacing.
 *
 * ```tsx
 * <PageLayout variant="standard">
 *   …
 * </PageLayout>
 * ```
 */
export function PageLayout({
  className,
  children,
  variant,
  ...props
}: PageLayoutProps) {
  return (
    <div {...props} className={cn(pageLayoutVariants({ variant }), className)}>
      {children}
    </div>
  );
}
