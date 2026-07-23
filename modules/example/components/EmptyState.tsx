export function EmptyState() {
  return (
    <div className="border-border/60 bg-muted/30 rounded-2xl border border-dashed px-6 py-10 text-center">
      <h2 className="text-lg font-medium">No items yet</h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-relaxed">
        This is the starter-pack demo. Create your first record with the form
        below; after you add a real domain module you can delete the{' '}
        <code>modules/example</code> folder.
      </p>
    </div>
  );
}
