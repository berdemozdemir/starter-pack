import type { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';

type Paragraph1Props = {
  className?: string;
} & Omit<ComponentProps<'p'>, 'className'>;

export const Paragraph1: FC<Paragraph1Props> = ({ className, ...props }) => (
  <p className={cn(className, 'text-base')} {...props} />
);

type Paragraph2Props = {
  className?: string;
} & Omit<ComponentProps<'p'>, 'className'>;

export const Paragraph2: FC<Paragraph2Props> = ({ className, ...props }) => (
  <p className={cn(className, 'text-sm')} {...props} />
);
