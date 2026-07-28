"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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

export function HeaderSearch({ textLight, className }: HeaderSearchProps) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse>({
    categories: [],
    products: [],
  });
  const [activeIdx, setActiveIdx] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  // Flatten for keyboard navigation (categories first, then products).
  const flat: FlatItem[] = [
    ...results.categories.map((c) => ({ kind: "category" as const, data: c })),
    ...results.products.map((p) => ({ kind: "product" as const, data: p })),
  ];

  // Debounced fetch.
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
          setResults(data);
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

  // Close on outside click.
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

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

  const onSubmit = (e: React.FormEvent) => {
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

  const showPanel = open && q.trim().length >= 2;

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <form onSubmit={onSubmit}>
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
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search products & categories…"
            aria-label="Search products and categories"
            className="w-40 bg-transparent text-sm outline-none placeholder:opacity-60 focus:w-56 lg:w-52 lg:focus:w-72 transition-[width] duration-300"
          />
        </div>
      </form>

      {showPanel && (
        <div className="absolute right-0 top-12 z-50 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-lux-sand/70 bg-lux-soft text-lux-ink shadow-2xl">
          {loading && (
            <p className="px-4 py-3 text-sm text-lux-graphite">Searching…</p>
          )}

          {!loading && flat.length === 0 && (
            <p className="px-4 py-3 text-sm text-lux-graphite">
              No matches for “{q.trim()}”. Press Enter to search all products.
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
                    {p.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="h-10 w-10 shrink-0 rounded-md object-cover"
                      />
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
      )}
    </div>
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
