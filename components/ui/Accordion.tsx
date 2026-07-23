'use client';

import * as React from 'react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('flex w-full flex-col', className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-border', className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  showDefaultChevron = true,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  showDefaultChevron?: boolean;
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'group/trigger text-foreground focus-visible:ring-ring/50 flex flex-1 cursor-pointer items-start justify-between gap-3 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg:last-child]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        {showDefaultChevron ? (
          <ChevronDownIcon
            aria-hidden
            className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
          />
        ) : null}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div
        className={cn(
          'text-muted-foreground pt-0 pb-4 leading-relaxed',
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
