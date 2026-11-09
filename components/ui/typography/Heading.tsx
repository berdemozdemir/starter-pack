import type { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';

type Heading1Props = {
  className?: string;
} & Omit<ComponentProps<'h1'>, 'className'>;

export const Heading1: FC<Heading1Props> = ({ className, ...props }) => (
  <h1 className={cn(className, 'text-2xl')} {...props} />
);

type Heading2Props = {
  className?: string;
} & Omit<ComponentProps<'h2'>, 'className'>;

export const Heading2: FC<Heading2Props> = ({ className, ...props }) => (
  <h2 className={cn(className, 'text-xl')} {...props} />
);

type Heading3Props = {
  className?: string;
} & Omit<ComponentProps<'h3'>, 'className'>;

export const Heading3: FC<Heading3Props> = ({ className, ...props }) => (
  <h3 className={cn(className, 'text-lg')} {...props} />
);
