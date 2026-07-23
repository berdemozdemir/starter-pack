'use client';

import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

const Stepper = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ ...props }, ref) => <TabsPrimitive.Root ref={ref} {...props} />);
Stepper.displayName = 'Stepper';

const StepperList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('inline-flex items-center gap-2', className)}
    {...props}
  />
));
StepperList.displayName = TabsPrimitive.List.displayName;

const StepperSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('bg-border h-0.5 w-6', className)} {...props} />
));
StepperSeparator.displayName = 'StepperSeparator';

const StepperTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    isCompleted?: boolean;
  }
>(({ className, children, isCompleted, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'text-muted-foreground border-border inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 text-sm font-medium transition-colors duration-150',
      'hover:border-border-active hover:bg-background-hover',
      'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-background',
      isCompleted &&
        'bg-success-bg text-success-fg hover:text-foreground border-none',
      className,
    )}
    {...props}
  >
    {children}
  </TabsPrimitive.Trigger>
));
StepperTrigger.displayName = TabsPrimitive.Trigger.displayName;

const StepperDotTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    isCompleted?: boolean;
  }
>(({ className, isCompleted, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'text-muted-foreground inline-flex h-3 w-3 cursor-pointer items-center justify-center rounded-full border text-sm font-medium transition-all duration-150',
      'hover:border-border-active hover:bg-background-hover',
      'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:w-5',
      isCompleted &&
        'text-success-fg hover:text-foreground border-none bg-green-500',
      className,
    )}
    {...props}
  />
));
StepperDotTrigger.displayName = TabsPrimitive.Trigger.displayName;

const StepperContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'focus-visible:ring-ring mt-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
      className,
    )}
    {...props}
  />
));
StepperContent.displayName = TabsPrimitive.Content.displayName;

const StepperContentPersistent = ({
  currentValue,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
  currentValue: string;
}) => (
  <div
    style={{
      display: currentValue === props.value ? 'block' : 'none',
    }}
  >
    <StepperContent forceMount {...props} />
  </div>
);
StepperContentPersistent.displayName = TabsPrimitive.Content.displayName;

export {
  Stepper,
  StepperList,
  StepperSeparator,
  StepperTrigger,
  StepperDotTrigger,
  StepperContent,
  StepperContentPersistent,
};
