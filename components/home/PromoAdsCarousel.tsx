"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import PromoCard from "./PromoCard";
import { ChevronLeft, ChevronRight } from "./icons";
import { fetchPromoAds } from "@/app/api/promoAds/route";
import { PromoAd, PromoAdsResponse } from "./types";

export interface PromoAdsCarouselProps {
  fetcher?: (signal?: AbortSignal) => Promise<PromoAdsResponse>;
  heading?: string;
}

function useCardsPerView(): number {
  const [n, setN] = useState(1);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setN(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return n;
}

export const PromoAdsCarousel: React.FC<PromoAdsCarouselProps> = ({
  fetcher = fetchPromoAds,
  heading,
}) => {
  const [items, setItems] = useState<PromoAd[]>([]);
  const [title, setTitle] = useState<string | undefined>(heading);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );

  const perView = useCardsPerView();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const ac = new AbortController();
    setStatus("loading");
    fetcher(ac.signal)
      .then((res) => {
        setItems(res.items);
        if (res.title) setTitle(res.title);
        setStatus("ready");
      })
      .catch((e) => {
        if ((e as Error).name !== "AbortError") setStatus("error");
      });
    return () => ac.abort();
  }, [fetcher]);

  const maxIndex = Math.max(0, items.length - perView);
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(
    () => setIndex((i) => Math.min(maxIndex, i + 1)),
    [maxIndex],
  );

  const trackStyle = useMemo(
    () => ({ transform: `translateX(-${index * (100 / perView)}%)` }),
    [index, perView],
  );

  if (status === "error") {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8">
        <p className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
          Couldn't load deals right now. Please try again.
        </p>
      </section>
    );
  }

  const showControls = status === "ready" && items.length > perView;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      {title && (
        <h2 className="mb-6 text-center text-2xl font-bold text-neutral-900 sm:text-3xl">
          {title}
        </h2>
      )}

      <div className="relative">
        <div className="overflow-hidden">
          {status === "loading" ? (
            <div className="flex">
              {Array.from({ length: perView }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 grow-0 px-2"
                  style={{ flexBasis: `${100 / perView}%` }}
                >
                  <div className="h-56 animate-pulse rounded-2xl bg-neutral-200 sm:h-60 lg:h-64" />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={trackStyle}
            >
              {items.map((ad) => (
                <div
                  key={ad.id}
                  className="shrink-0 grow-0 px-2"
                  style={{ flexBasis: `${100 / perView}%` }}
                >
                  <PromoCard ad={ad} />
                </div>
              ))}
            </div>
          )}
        </div>

        {showControls && (
          <>
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              aria-label="Previous deals"
              className="absolute left-1 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-800 shadow-md ring-1 ring-black/5 backdrop-blur-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={index >= maxIndex}
              aria-label="Next deals"
              className="absolute right-1 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-800 shadow-md ring-1 ring-black/5 backdrop-blur-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {showControls && (
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-neutral-800" : "w-1.5 bg-neutral-300"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
