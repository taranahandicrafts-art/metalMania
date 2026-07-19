export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pt-24 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="mb-4 h-8 w-48 rounded-md bg-muted" />
        <div className="mb-8 h-4 w-24 rounded bg-muted" />

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden space-y-4 lg:block">
            <div className="h-10 rounded-md bg-muted" />
            <div className="h-40 rounded-md bg-muted" />
            <div className="h-32 rounded-md bg-muted" />
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-9 w-40 rounded-md bg-muted" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square rounded-lg bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
