export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pt-24 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-48 rounded-md bg-muted" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square rounded-lg bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
