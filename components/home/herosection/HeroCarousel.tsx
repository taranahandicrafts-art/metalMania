"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SLIDES } from "../data/showcase";
import { CarouselSlide } from "../types";
import { ChevronLeft, ChevronRight } from "./icons";

interface HeroCarouselProps {
  slides?: CarouselSlide[];
  autoPlayMs?: number;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides = SLIDES,
  autoPlayMs = 5000,
}) => {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = slides.length;

  const goTo = useCallback(
    (n: number) => setIndex((n + total) % total),
    [total],
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  const restart = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % total),
      autoPlayMs,
    );
  }, [autoPlayMs, total]);

  useEffect(() => {
    restart();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [restart]);

  const withRestart = (fn: () => void) => () => {
    fn();
    restart();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl">
      {/* Track */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={s.id} className="relative aspect-16/10 w-full flex-none">
            {s.image && (
              <img
                src={s.image}
                alt={s.subtitle}
                className="absolute inset-0 h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
              />
            )}
            {/* Left-to-right dark scrim for legibility */}
            <div className="absolute inset-0 bg-linear-to-r from-[#3c2a1c]/60 via-[#3c2a1c]/20 to-transparent" />
            <div className="absolute left-0 top-0 max-w-[62%] p-8 text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.25)] sm:p-12">
              <h2 className="font-serif text-xl lg:text-4xl font-normal leading-[0.98] tracking-wide">
                {s.titleLine1}
                {s.titleLine2 && (
                  <>
                    <br />
                    {s.titleLine2}{" "}
                  </>
                )}
                {!s.titleLine2 && <br />}
              </h2>
              <div className="hidden md:block mt-4 text-sm md:text-lg font-medium">
                {s.subtitle}
              </div>
              <span className="mt-3 inline-block rounded bg-[#3c2a1c]/70 px-4 py-2 text-xs md:text-lg font-semibold">
                {s.price}
              </span>
              {s.slug && (
                <div className="mt-4">
                  <Link
                    href={`/products/${s.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#f2c14e] px-5 py-2.5 text-xs md:text-sm font-semibold text-[#3c2a1c] transition-opacity hover:opacity-90"
                  >
                    Shop Now
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        aria-label="Previous slide"
        onClick={withRestart(prev)}
        className="absolute left-3.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-neutral-700 shadow-md transition hover:scale-105 hover:bg-white"
      >
        <ChevronLeft />
      </button>
      <button
        aria-label="Next slide"
        onClick={withRestart(next)}
        className="absolute right-3.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-neutral-700 shadow-md transition hover:scale-105 hover:bg-white"
      >
        <ChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={withRestart(() => goTo(i))}
            className={[
              "h-2.5 rounded-full transition-all",
              i === index
                ? "w-6 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/80",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
