import { Heading3 } from '@/components/ui/typography/Heading';
import { Paragraph2 } from '@/components/ui/typography/Paragraph';

export function EmptyState() {
  return (
    <div className="border-border/60 bg-muted/30 rounded-2xl border border-dashed px-6 py-10 text-center">
      <Heading3 className="font-semibold">No items yet</Heading3>
      <Paragraph2 className="text-muted-foreground mx-auto mt-2 max-w-md leading-relaxed">
        This is the starter-pack demo. Create your first record with the form
        below; after you add a real domain module you can delete the{' '}
        <code>modules/example</code> folder.
      </Paragraph2>
    </div>
  );
}
