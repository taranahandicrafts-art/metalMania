export default function CartLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pt-24 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="mb-8 h-8 w-48 rounded-md bg-stone-200" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 rounded-lg border p-4">
                <div className="h-24 w-24 flex-shrink-0 rounded-md bg-stone-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-stone-200" />
                  <div className="h-4 w-1/4 rounded bg-stone-200" />
                  <div className="flex justify-between">
                    <div className="h-10 w-28 rounded-md bg-stone-200" />
                    <div className="h-4 w-16 rounded bg-stone-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-64 rounded-lg border bg-stone-200 p-6" />
        </div>
      </div>
    </div>
  );
}
