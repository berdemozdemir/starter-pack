'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { service_example } from '../client-queries';
import {
  createItemSchema,
  type CreateItemSchemaRequest,
} from '../schemas/create-item';

export function CreateItemForm() {
  const createMutation = useMutation(service_example.mutations.create());

  const form = useForm<CreateItemSchemaRequest>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      title: '',
      notes: '',
    },
  });

  const submit = form.handleSubmit(async (data) => {
    await createMutation.mutateAsync({
      title: data.title,
      notes: data.notes?.trim() ? data.notes : undefined,
    });

    form.reset();
    toast.success('Item created');
  });

  return (
    <Form {...form}>
      <form
        onSubmit={submit}
        className="border-border/60 bg-card space-y-4 rounded-2xl border p-6"
      >
        <div>
          <h2 className="text-base font-medium">New item</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Example form showing the oRPC + Zod + react-hook-form flow.
          </p>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. My first note" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A short description"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? <LoadingSpinner /> : 'Save'}
        </Button>
      </form>
    </Form>
  );
}
