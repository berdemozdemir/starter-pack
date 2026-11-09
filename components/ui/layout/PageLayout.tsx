import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';

const pageLayoutVariants = cva('flex w-full flex-col gap-10', {
  variants: {
    variant: {
      narrow: 'max-w-xl',
      standard: 'max-w-3xl',
      wide: 'max-w-7xl',
      full: 'w-full max-w-none',
    },
  },
  defaultVariants: {
    variant: 'standard',
  },
});

type PageLayoutProps = ComponentProps<'div'> &
  VariantProps<typeof pageLayoutVariants>;

export const PageLayout: FC<PageLayoutProps> = ({
  className,
  children,
  variant,
  ...props
}) => (
  <div {...props} className={cn(pageLayoutVariants({ variant }), className)}>
    {children}
  </div>
);
