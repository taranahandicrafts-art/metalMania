export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pt-24 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-16 rounded bg-stone-200" />
          <div className="h-4 w-4 rounded bg-stone-200" />
          <div className="h-4 w-24 rounded bg-stone-200" />
          <div className="h-4 w-4 rounded bg-stone-200" />
          <div className="h-4 w-32 rounded bg-stone-200" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square rounded-xl bg-stone-200" />

          <div className="space-y-6">
            <div className="h-8 w-3/4 rounded bg-stone-200" />
            <div className="h-4 w-1/4 rounded bg-stone-200" />
            <div className="h-4 w-full rounded bg-stone-200" />
            <div className="h-4 w-5/6 rounded bg-stone-200" />
            <div className="h-10 w-32 rounded-md bg-stone-200" />
            <div className="flex gap-4">
              <div className="h-12 w-32 rounded-md bg-stone-200" />
              <div className="h-12 flex-1 rounded-md bg-stone-200" />
            </div>
            <div className="h-6 w-48 rounded bg-stone-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
