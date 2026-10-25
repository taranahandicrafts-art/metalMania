"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type {
  SearchResponse,
  SearchProduct,
  SearchCategory,
} from "@/app/api/search/route";

interface HeaderSearchProps {
  textLight?: boolean;
  className?: string;
}

type FlatItem =
  | { kind: "category"; data: SearchCategory }
  | { kind: "product"; data: SearchProduct };

function useSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse>({
    categories: [],
    products: [],
  });
  const [activeIdx, setActiveIdx] = useState(-1);

  const flat: FlatItem[] = [
    ...(results.categories ?? []).map((c) => ({ kind: "category" as const, data: c })),
    ...(results.products ?? []).map((p) => ({ kind: "product" as const, data: p })),
  ];

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults({ categories: [], products: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    const ac = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ac.signal })
        .then((r) => r.json())
        .then((data: SearchResponse) => {
          setResults({
            categories: Array.isArray(data?.categories) ? data.categories : [],
            products: Array.isArray(data?.products) ? data.products : [],
          });
          setActiveIdx(-1);
        })
        .catch((e) => {
          if ((e as Error).name !== "AbortError")
            setResults({ categories: [], products: [] });
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      clearTimeout(t);
      ac.abort();
    };
  }, [q]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      setQ("");
      router.push(href);
    },
    [router],
  );

  const hrefFor = (item: FlatItem) =>
    item.kind === "category"
      ? `/products?category=${item.data.id}`
      : `/products/${item.data.slug}`;

  const onSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (activeIdx >= 0 && flat[activeIdx]) return go(hrefFor(flat[activeIdx]));
    const term = q.trim();
    if (term) go(`/products?q=${encodeURIComponent(term)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || flat.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return {
    q, setQ, open, setOpen, loading, results, flat, activeIdx,
    go, hrefFor, onSubmit, onKeyDown,
  };
}

function ResultsPanel({
  q, loading, results, flat, activeIdx, go,
}: {
  q: string;
  loading: boolean;
  results: SearchResponse;
  flat: FlatItem[];
  activeIdx: number;
  go: (href: string) => void;
}) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-lux-sand/70 bg-lux-soft text-lux-ink shadow-2xl">
      {loading && (
        <p className="px-4 py-3 text-sm text-lux-graphite">Searching…</p>
      )}
      {!loading && flat.length === 0 && (
        <p className="px-4 py-3 text-sm text-lux-graphite">
          No matches for &ldquo;{q.trim()}&rdquo;. Press Enter to search all products.
        </p>
      )}
      {!loading && results.categories.length > 0 && (
        <div className="border-b border-lux-sand/60">
          <p className="px-4 pt-3 pb-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-lux-graphite">
            Categories
          </p>
          {results.categories.map((c) => {
            const idx = flat.findIndex(
              (f) => f.kind === "category" && f.data.id === c.id,
            );
            return (
              <Link
                key={c.id}
                href={`/products?category=${c.id}`}
                onClick={() => go(`/products?category=${c.id}`)}
                className={cn(
                  "block px-4 py-2 text-sm hover:bg-lux-sand/40",
                  idx === activeIdx && "bg-lux-sand/50",
                )}
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      )}
      {!loading && results.products.length > 0 && (
        <div>
          <p className="px-4 pt-3 pb-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-lux-graphite">
            Products
          </p>
          {results.products.map((p) => {
            const idx = flat.findIndex(
              (f) => f.kind === "product" && f.data.id === p.id,
            );
            return (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                onClick={() => go(`/products/${p.slug}`)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 hover:bg-lux-sand/40",
                  idx === activeIdx && "bg-lux-sand/50",
                )}
              >
                {p.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="h-10 w-10 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-lux-sand/40 text-neutral-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m3 16 4-4 3 3 5-5 6 6"/></svg>
                  </span>
                )}
                <span className="flex-1 text-sm">{p.title}</span>
                {typeof p.final_price === "number" && (
                  <span className="text-sm font-medium">
                    ₹{p.final_price.toLocaleString("en-IN")}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Mobile: icon button that opens a full-width overlay search bar
function MobileSearch({ textLight }: { textLight?: boolean }) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const search = useSearch();

  useEffect(() => {
    if (overlayOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [overlayOpen]);

  // Close overlay on route change
  useEffect(() => {
    setOverlayOpen(false);
  }, [pathname]);

  const close = () => {
    setOverlayOpen(false);
    search.setQ("");
    search.setOpen(false);
  };

  const showPanel = search.open && search.q.trim().length >= 2;

  return (
    <>
      <button
        onClick={() => setOverlayOpen(true)}
        aria-label="Open search"
        className={cn(
          "flex h-9 w-9 items-center justify-center transition-colors duration-300",
          textLight ? "text-lux-soft" : "text-lux-ink",
        )}
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      {overlayOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-lux-soft">
          {/* Search bar row */}
          <div className="flex items-center gap-2 border-b border-lux-sand/70 px-4 py-3">
            <SearchIcon className="h-5 w-5 shrink-0 text-lux-graphite" />
            <form onSubmit={search.onSubmit} className="flex-1">
              <input
                ref={inputRef}
                type="search"
                value={search.q}
                onChange={(e) => {
                  search.setQ(e.target.value);
                  search.setOpen(true);
                }}
                onKeyDown={search.onKeyDown}
                placeholder="Search products & categories…"
                aria-label="Search products and categories"
                className="w-full bg-transparent text-sm text-lux-ink outline-none placeholder:text-lux-graphite/60"
              />
            </form>
            <button
              onClick={close}
              aria-label="Close search"
              className="text-lux-graphite hover:text-lux-ink"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-4">
            {showPanel && (
              <ResultsPanel
                q={search.q}
                loading={search.loading}
                results={search.results}
                flat={search.flat}
                activeIdx={search.activeIdx}
                go={(href) => { search.go(href); close(); }}
              />
            )}
            {!showPanel && (
              <p className="mt-8 text-center text-sm text-lux-graphite/60">
                Type at least 2 characters to search
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Desktop: inline rounded input with dropdown results
function DesktopSearch({ textLight, className }: HeaderSearchProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const search = useSearch();

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        search.setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [search]);

  const showPanel = search.open && search.q.trim().length >= 2;

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <form onSubmit={search.onSubmit}>
        <div
          className={cn(
            "flex h-10 items-center gap-2 rounded-full border px-4 transition-colors duration-300",
            textLight
              ? "border-lux-soft/40 bg-lux-ink/20 text-lux-soft focus-within:border-lux-gold"
              : "border-lux-ink/25 bg-lux-soft/60 text-lux-ink focus-within:border-lux-ink",
          )}
        >
          <SearchIcon className="h-4 w-4 shrink-0 opacity-70" />
          <input
            type="search"
            value={search.q}
            onChange={(e) => {
              search.setQ(e.target.value);
              search.setOpen(true);
            }}
            onFocus={() => search.setOpen(true)}
            onKeyDown={search.onKeyDown}
            placeholder="Search products & categories…"
            aria-label="Search products and categories"
            className="w-40 bg-transparent text-sm outline-none placeholder:opacity-60 focus:w-56 lg:w-52 lg:focus:w-72 transition-[width] duration-300"
          />
        </div>
      </form>

      {showPanel && (
        <div className="absolute right-0 top-12 z-50 w-[22rem] max-w-[calc(100vw-2rem)]">
          <ResultsPanel
            q={search.q}
            loading={search.loading}
            results={search.results}
            flat={search.flat}
            activeIdx={search.activeIdx}
            go={search.go}
          />
        </div>
      )}
    </div>
  );
}

export function HeaderSearch({ textLight, className }: HeaderSearchProps) {
  return (
    <>
      {/* Mobile/tablet: icon + overlay */}
      <span className="lg:hidden">
        <MobileSearch textLight={textLight} />
      </span>
      {/* Desktop: inline input */}
      <DesktopSearch textLight={textLight} className={cn("hidden lg:block", className)} />
    </>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
